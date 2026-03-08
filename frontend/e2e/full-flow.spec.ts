import { test, expect } from '@playwright/test';

/**
 * Full end-to-end flow: Home -> Setup -> Play through all 10 questions -> Results -> New Quiz
 */
test.describe('Full Quiz Flow (E2E)', () => {
  test('complete flow: home -> setup -> play -> results -> new quiz', async ({ page }) => {
    // 1. Start at Home
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Tech Quiz App' })).toBeVisible();

    // 2. Navigate to Setup
    await page.getByRole('link', { name: 'Start Quiz' }).click();
    await expect(page).toHaveURL(/quiz\/setup/);

    // 3. Configure quiz: Intermediate difficulty, SOLID Principles
    await page.getByRole('radio', { name: /Intermediate/ }).click();
    await page.getByRole('button', { name: /SOLID Principles/ }).click();
    await expect(
      page.getByRole('button', { name: /Start Quiz.*1 theme/ }),
    ).toBeEnabled();

    // 4. Start the quiz
    await page.getByRole('button', { name: /Start Quiz/ }).click();
    await expect(page).toHaveURL(/quiz\/play/);

    // 5. Play through all 10 questions
    let correctCount = 0;
    for (let q = 1; q <= 10; q++) {
      // Verify progress — "Question" and "X / 10" are in separate spans
      await expect(
        page.locator('.quiz-progress__numbers'),
      ).toHaveText(`${String(q)} / 10`);

      // Select first answer and confirm
      await page.getByTestId('answer-option').first().click();
      await page.getByTestId('confirm-btn').click();

      // Wait for feedback
      await expect(page.getByTestId('answer-feedback')).toBeVisible();
      if ((await page.getByTestId('feedback-correct').count()) > 0) {
        correctCount++;
      }

      // On Q10, the watcher auto-navigates to results after submitAnswer
      // sets isComplete = true. Don't try to click next-btn.
      if (q === 10) {
        await page.waitForURL(/quiz\/results/);
      } else {
        await page.getByTestId('next-btn').click();
      }
    }

    // 6. Verify results page
    await expect(page).toHaveURL(/quiz\/results/);
    await expect(page.getByRole('heading', { name: 'Quiz Complete!' })).toBeVisible();

    // Score
    const pct = Math.round((correctCount / 10) * 100);
    await expect(page.locator('.results-summary__score-pct')).toHaveText(`${String(pct)}%`);

    // Metadata
    await expect(page.locator('.results-summary__difficulty')).toHaveText(/intermediate/i);
    await expect(page.locator('.results-summary__theme-tag')).toHaveText('SOLID Principles');

    // Breakdown has 10 items
    const items = page.locator('.results-breakdown__list > .results-breakdown__item');
    await expect(items).toHaveCount(10);

    // 7. Start a new quiz
    await page.getByRole('link', { name: 'New Quiz' }).click();
    await expect(page).toHaveURL(/quiz\/setup/);
    await expect(page.getByRole('heading', { name: 'Set Up Your Quiz' })).toBeVisible();
  });

  test('multiple themes quiz uses questions from different themes', async ({ page }) => {
    await page.goto('/quiz/setup');

    // Select two themes
    await page.getByRole('button', { name: /CI\/CD/ }).click();
    await page.getByRole('button', { name: /Microservices/ }).click();
    await expect(
      page.getByRole('button', { name: /Start Quiz.*2 themes/ }),
    ).toBeEnabled();

    await page.getByRole('button', { name: /Start Quiz/ }).click();
    await expect(page).toHaveURL(/quiz\/play/);

    // Answer all 10 questions
    for (let q = 1; q <= 10; q++) {
      await page.getByTestId('answer-option').first().click();
      await page.getByTestId('confirm-btn').click();
      await expect(page.getByTestId('answer-feedback')).toBeVisible();
      if (q === 10) {
        await page.waitForURL(/quiz\/results/);
      } else {
        await page.getByTestId('next-btn').click();
      }
    }

    // Results should show both theme tags
    await expect(page).toHaveURL(/quiz\/results/);
    const themeTags = page.locator('.results-summary__theme-tag');
    await expect(themeTags).toHaveCount(2);
    await expect(themeTags.filter({ hasText: 'CI/CD' })).toBeVisible();
    await expect(themeTags.filter({ hasText: 'Microservices' })).toBeVisible();
  });

  test('advanced difficulty quiz works end to end', async ({ page }) => {
    await page.goto('/quiz/setup');

    await page.getByRole('radio', { name: /Advanced/ }).click();
    await page.getByRole('button', { name: /Refactoring/ }).click();
    await page.getByRole('button', { name: /Start Quiz/ }).click();
    await expect(page).toHaveURL(/quiz\/play/);

    // Answer all 10 questions
    for (let q = 1; q <= 10; q++) {
      await page.getByTestId('answer-option').first().click();
      await page.getByTestId('confirm-btn').click();
      await expect(page.getByTestId('answer-feedback')).toBeVisible();
      if (q === 10) {
        await page.waitForURL(/quiz\/results/);
      } else {
        await page.getByTestId('next-btn').click();
      }
    }

    await expect(page).toHaveURL(/quiz\/results/);
    await expect(page.locator('.results-summary__difficulty')).toHaveText(/advanced/i);
    await expect(page.locator('.results-summary__theme-tag')).toHaveText('Refactoring');
  });
});
