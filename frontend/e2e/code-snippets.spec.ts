import { test, expect } from '@playwright/test';

test.describe('Code Snippet Questions', () => {
  test('code snippet questions render syntax-highlighted code blocks', async ({ page }) => {
    // Use DDD or TDD at beginner - they have code-snippet type questions
    await page.goto('/quiz/setup');
    await page.getByRole('button', { name: /Domain-Driven Design/ }).click();
    await page.getByRole('button', { name: /Test-Driven Development/ }).click();
    await page.getByRole('button', { name: /Start Quiz/ }).click();
    await expect(page).toHaveURL(/quiz\/play/);

    // Go through questions until we find a code snippet
    let foundCodeSnippet = false;

    for (let q = 1; q <= 10; q++) {
      const codeBlock = page.locator('.code-snippet');
      if (await codeBlock.isVisible().catch(() => false)) {
        foundCodeSnippet = true;

        // Should contain a <pre> with a <code> element
        const preElement = codeBlock.locator('pre');
        await expect(preElement).toBeVisible();

        const codeElement = codeBlock.locator('code');
        await expect(codeElement).toBeVisible();

        // Code should have content
        const codeText = await codeElement.textContent();
        expect(codeText?.length).toBeGreaterThan(5);

        // Prism.js adds language-* class for syntax highlighting
        const codeClass = await codeElement.getAttribute('class');
        expect(codeClass).toMatch(/language-/);

        break;
      }

      // Answer the question to move on
      const options = page.getByTestId('answer-option');
      await expect(options.first()).toBeVisible();
      await options.first().click();
      await page.getByTestId('confirm-btn').click();
      await expect(page.getByTestId('answer-feedback')).toBeVisible();
      if (q === 10) {
        await page.waitForURL(/quiz\/results/);
      } else {
        await page.getByTestId('next-btn').click();
      }
    }

    expect(foundCodeSnippet).toBe(true);
  });

  test('bonus facts are displayed for questions that have them', async ({ page }) => {
    await page.goto('/quiz/setup');
    await page.getByRole('button', { name: /Domain-Driven Design/ }).click();
    await page.getByRole('button', { name: /Test-Driven Development/ }).click();
    await page.getByRole('button', { name: /Start Quiz/ }).click();
    await expect(page).toHaveURL(/quiz\/play/);

    let foundBonusFact = false;

    for (let q = 1; q <= 10; q++) {
      const options = page.getByTestId('answer-option');
      await expect(options.first()).toBeVisible();
      await options.first().click();
      await page.getByTestId('confirm-btn').click();
      await expect(page.getByTestId('answer-feedback')).toBeVisible();

      const bonusFact = page.getByTestId('bonus-fact');
      if (await bonusFact.isVisible().catch(() => false)) {
        foundBonusFact = true;

        // Bonus fact should have text content
        const bonusText = await bonusFact.textContent();
        expect(bonusText?.length).toBeGreaterThan(10);
      }

      if (q === 10) {
        await page.waitForURL(/quiz\/results/);
      } else {
        await page.getByTestId('next-btn').click();
      }
    }

    // DDD+TDD beginner questions should have bonus facts
    expect(foundBonusFact).toBe(true);
  });
});
