import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: complete a full quiz to land on the results page.
 * Returns a count of correct answers observed during the quiz.
 */
async function completeQuiz(
  page: Page,
  theme = 'SOLID Principles',
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner',
): Promise<number> {
  await page.goto('/quiz/setup');

  if (difficulty !== 'Beginner') {
    await page.getByRole('radio', { name: new RegExp(difficulty) }).click();
  }

  await page.getByRole('button', { name: new RegExp(theme) }).click();
  await page.getByRole('button', { name: /Start Quiz/ }).click();
  await expect(page).toHaveURL(/quiz\/play/);

  let correctCount = 0;

  for (let q = 1; q <= 10; q++) {
    const options = page.getByTestId('answer-option');
    await expect(options.first()).toBeVisible();

    // Click the first option
    await options.first().click();
    await page.getByTestId('confirm-btn').click();

    // Wait for feedback
    await expect(page.getByTestId('answer-feedback')).toBeVisible();

    if ((await page.getByTestId('feedback-correct').count()) > 0) {
      correctCount++;
    }

    // Advance to next question (on Q10, the watcher auto-navigates to results)
    if (q === 10) {
      await page.waitForURL(/quiz\/results/);
    } else {
      await page.getByTestId('next-btn').click();
    }
  }

  await expect(page).toHaveURL(/quiz\/results/);
  return correctCount;
}

test.describe('Results Page', () => {
  test('displays Quiz Complete heading and score', async ({ page }) => {
    const correctCount = await completeQuiz(page);

    await expect(page.getByRole('heading', { name: 'Quiz Complete!' })).toBeVisible();

    // Score should show correctCount / 10
    await expect(page.locator('.results-summary__score-correct')).toHaveText(String(correctCount));
    await expect(page.locator('.results-summary__score-total')).toHaveText('10');

    // Percentage should be shown
    const pct = Math.round((correctCount / 10) * 100);
    await expect(page.locator('.results-summary__score-pct')).toHaveText(`${String(pct)}%`);
  });

  test('displays difficulty and theme tags', async ({ page }) => {
    await completeQuiz(page, 'Design Patterns', 'Intermediate');

    // Difficulty should be shown (capitalized via CSS text-transform)
    await expect(page.locator('.results-summary__difficulty')).toBeVisible();
    await expect(page.locator('.results-summary__difficulty')).toHaveText(/intermediate/i);

    // Theme tag should be shown
    await expect(page.locator('.results-summary__theme-tag')).toHaveText('Design Patterns');
  });

  test('displays question breakdown with 10 items', async ({ page }) => {
    await completeQuiz(page);

    await expect(page.getByRole('heading', { name: 'Question Breakdown' })).toBeVisible();

    // Should have 10 list items in the breakdown
    const items = page.locator('.results-breakdown__list > .results-breakdown__item');
    await expect(items).toHaveCount(10);

    // Each should show Q1, Q2, ..., Q10
    for (let i = 1; i <= 10; i++) {
      await expect(page.getByText(`Q${String(i)}`, { exact: true })).toBeVisible();
    }
  });

  test('breakdown shows correct/incorrect indicators', async ({ page }) => {
    await completeQuiz(page);

    // Should have at least some correct or incorrect indicators
    const correctIndicators = page.getByTestId('result-correct');
    const incorrectIndicators = page.getByTestId('result-incorrect');

    const totalIndicators =
      (await correctIndicators.count()) + (await incorrectIndicators.count());
    expect(totalIndicators).toBe(10);
  });

  test('incorrect answers show "Your answer" and "Correct answer"', async ({ page }) => {
    await completeQuiz(page);

    const incorrectCount = await page.getByTestId('result-incorrect').count();

    if (incorrectCount > 0) {
      // Should show "Your answer:" and "Correct answer:" labels for incorrect items
      await expect(page.getByText('Your answer:').first()).toBeVisible();
      await expect(page.getByText('Correct answer:').first()).toBeVisible();
    }
  });

  test('can expand question explanations', async ({ page }) => {
    await completeQuiz(page);

    // Use a stable CSS locator — aria-label changes between Expand/Collapse
    const expandBtn = page.locator('.results-breakdown__expand-btn').first();
    await expect(expandBtn).toBeVisible();
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to expand
    await expandBtn.click();
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');

    // Explanation text should be visible
    const explanation = page.locator('.results-breakdown__explanation').first();
    await expect(explanation).toBeVisible();

    // Click again to collapse
    await expandBtn.click();
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('New Quiz button navigates back to setup', async ({ page }) => {
    await completeQuiz(page);

    const newQuizLink = page.getByRole('link', { name: 'New Quiz' });
    await expect(newQuizLink).toBeVisible();

    await newQuizLink.click();
    await expect(page).toHaveURL(/quiz\/setup/);
    await expect(page.getByRole('heading', { name: 'Set Up Your Quiz' })).toBeVisible();
  });
});
