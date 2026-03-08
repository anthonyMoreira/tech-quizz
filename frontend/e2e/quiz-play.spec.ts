import { test, expect, type Page } from '@playwright/test';

/**
 * Helper: start a quiz with the given theme and difficulty, navigating
 * from the setup page into the play page.
 */
async function startQuiz(
  page: Page,
  theme: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner',
): Promise<void> {
  await page.goto('/quiz/setup');

  // Select difficulty if not beginner (beginner is default)
  if (difficulty !== 'Beginner') {
    await page.getByRole('radio', { name: new RegExp(difficulty) }).click();
  }

  // Select theme
  await page.getByRole('button', { name: new RegExp(theme) }).click();

  // Start quiz
  await page.getByRole('button', { name: /Start Quiz/ }).click();
  await expect(page).toHaveURL(/quiz\/play/);
}

/**
 * Helper: answer the current question by clicking the first answer option,
 * confirming, and then clicking next.
 * Returns whether the answer was correct.
 */
async function answerCurrentQuestion(page: Page): Promise<boolean> {
  // Wait for a question to be visible
  const options = page.getByTestId('answer-option');
  await expect(options.first()).toBeVisible();

  // Click the first answer option
  await options.first().click();

  // Confirm the answer
  const confirmBtn = page.getByTestId('confirm-btn');
  await expect(confirmBtn).toBeEnabled();
  await confirmBtn.click();

  // Wait for feedback to appear
  const feedback = page.getByTestId('answer-feedback');
  await expect(feedback).toBeVisible();

  // Check if correct or incorrect
  const isCorrect = (await page.getByTestId('feedback-correct').count()) > 0;

  return isCorrect;
}

/**
 * Helper: advance to the next question after answering.
 *
 * On the last question (Q10) the `watch(isComplete)` watcher in
 * QuizPlayView already navigates to results as soon as `submitAnswer`
 * sets `isComplete = true`.  By the time the test reaches this helper
 * the page may have already navigated, so we simply wait for the URL
 * to change rather than clicking the (potentially detached) button.
 */
async function goToNext(page: Page, isLastQuestion = false): Promise<void> {
  if (isLastQuestion) {
    await page.waitForURL(/quiz\/results/);
  } else {
    const nextBtn = page.getByTestId('next-btn');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
  }
}

test.describe('Quiz Play', () => {
  test('shows progress bar with question count', async ({ page }) => {
    await startQuiz(page, 'Domain-Driven Design');

    // "Question" and "1 / 10" are in separate <span> elements
    await expect(page.locator('.quiz-progress__text')).toHaveText('Question');
    await expect(page.locator('.quiz-progress__numbers')).toHaveText('1 / 10');
  });

  test('displays question prompt and 4 answer options', async ({ page }) => {
    await startQuiz(page, 'SOLID Principles');

    // Should have a question prompt (any text in the prompt area)
    const prompt = page.locator('.quiz-question__prompt');
    await expect(prompt).toBeVisible();
    const promptText = await prompt.textContent();
    expect(promptText?.length).toBeGreaterThan(10);

    // Should have 4 answer options
    const options = page.getByTestId('answer-option');
    await expect(options).toHaveCount(4);
  });

  test('confirm button is disabled until an answer is selected', async ({
    page,
  }) => {
    await startQuiz(page, 'Design Patterns');

    const confirmBtn = page.getByTestId('confirm-btn');
    await expect(confirmBtn).toBeDisabled();

    // Select an option
    await page.getByTestId('answer-option').first().click();
    await expect(confirmBtn).toBeEnabled();
  });

  test('shows feedback after confirming an answer', async ({ page }) => {
    await startQuiz(page, 'Clean Architecture');

    // Select and confirm
    await page.getByTestId('answer-option').first().click();
    await page.getByTestId('confirm-btn').click();

    // Feedback should appear
    const feedback = page.getByTestId('answer-feedback');
    await expect(feedback).toBeVisible();

    // Should show either "Correct!" or "Not quite"
    const feedbackText = await feedback.textContent();
    expect(feedbackText).toMatch(/Correct!|Not quite/);

    // Should show explanation text
    const explanation = feedback.locator('.answer-feedback__explanation');
    await expect(explanation).toBeVisible();
    const explanationText = await explanation.textContent();
    expect(explanationText?.length).toBeGreaterThan(10);
  });

  test('options are disabled after confirming', async ({ page }) => {
    await startQuiz(page, 'CI/CD');

    // Select and confirm
    await page.getByTestId('answer-option').first().click();
    await page.getByTestId('confirm-btn').click();

    // All options should now be disabled
    const options = page.getByTestId('answer-option');
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      await expect(options.nth(i)).toBeDisabled();
    }

    // Confirm button should be gone (replaced by feedback)
    await expect(page.getByTestId('confirm-btn')).not.toBeVisible();
  });

  test('Next Question button advances to next question', async ({ page }) => {
    await startQuiz(page, 'Microservices');

    // Answer first question
    await answerCurrentQuestion(page);

    // Click next
    await goToNext(page);

    // Progress should update to question 2
    await expect(page.locator('.quiz-progress__numbers')).toHaveText('2 / 10');
  });

  test('progress updates through the quiz', async ({ page }) => {
    await startQuiz(page, 'Refactoring');

    // Answer questions 1-3 and verify progress
    for (let q = 1; q <= 3; q++) {
      await expect(page.locator('.quiz-progress__numbers')).toHaveText(
        `${String(q)} / 10`,
      );
      await answerCurrentQuestion(page);
      await goToNext(page);
    }

    // Should be on question 4
    await expect(page.locator('.quiz-progress__numbers')).toHaveText('4 / 10');
  });

  test('last question shows "See Results" instead of "Next Question"', async ({
    page,
  }) => {
    await startQuiz(page, 'Test-Driven Development');

    // Answer questions 1-9
    for (let q = 1; q <= 9; q++) {
      await answerCurrentQuestion(page);
      await goToNext(page);
    }

    // On question 10, answer it
    await expect(page.locator('.quiz-progress__numbers')).toHaveText('10 / 10');
    await answerCurrentQuestion(page);

    // Should show "See Results" button
    const nextBtn = page.getByTestId('next-btn');
    await expect(nextBtn).toContainText('See Results');
  });

  test('completing all 10 questions navigates to results page', async ({
    page,
  }) => {
    await startQuiz(page, 'Domain-Driven Design');

    // Answer all 10 questions
    for (let q = 1; q <= 10; q++) {
      await answerCurrentQuestion(page);
      await goToNext(page, q === 10);
    }

    // Should be on the results page
    await expect(page).toHaveURL(/quiz\/results/);
    await expect(
      page.getByRole('heading', { name: 'Quiz Complete!' }),
    ).toBeVisible();
  });
});
