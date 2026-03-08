import { test, expect, type Page } from '@playwright/test';

async function answerCurrentQuestion(page: Page): Promise<void> {
  const options = page.getByTestId('answer-option');
  await expect(options.first()).toBeVisible();
  await options.first().click();

  const confirmBtn = page.getByTestId('confirm-btn');
  await expect(confirmBtn).toBeEnabled();
  await confirmBtn.click();

  const feedback = page.getByTestId('answer-feedback');
  await expect(feedback).toBeVisible();
}

async function goToNext(page: Page, isLastQuestion = false): Promise<void> {
  if (isLastQuestion) {
    await page.waitForURL(/quiz\/results/);
  } else {
    const nextBtn = page.getByTestId('next-btn');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
  }
}

test.describe('Quiz Performance Statistics', () => {
  test('saves quiz history and displays statistics', async ({ page }) => {
    // Navigate to setup
    await page.goto('/quiz/setup');

    // Select 'SOLID Principles' theme and start quiz
    await page.getByRole('button', { name: /solid/i }).click();
    await page.getByRole('button', { name: /start quiz/i }).click();

    // Answer questions
    for (let q = 1; q <= 10; q++) {
      await answerCurrentQuestion(page);
      await goToNext(page, q === 10);
    }

    // Now we should be on the results page
    await expect(page).toHaveURL(/quiz\/results/);

    // Navigate to History page
    await page.getByRole('link', { name: /history/i }).click();

    // Verify we are on the statistics page
    await expect(page.locator('h1')).toContainText('Performance Statistics');

    // Verify stats are visible
    await expect(page.locator('.theme-stat-card').first()).toContainText(
      /solid/i,
    );
    await expect(page.locator('.theme-stat-card').first()).toContainText(
      '10 answers',
    );

    // Test the inline stats on setup page
    await page.getByRole('link', { name: /quiz/i }).click();
    await expect(
      page
        .locator('.theme-selector__card', { hasText: /solid/i })
        .locator('.theme-selector__stat'),
    ).toContainText(/correct/i);
  });
});
