import { test, expect } from '@playwright/test';

test.describe('Quiz Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz/setup');
  });

  test('displays setup page with title and sections', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Set Up Your Quiz' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Difficulty' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Themes' })).toBeVisible();
  });

  test('difficulty selector defaults to Beginner', async ({ page }) => {
    const beginnerBtn = page.getByRole('radio', { name: /Beginner/ });
    await expect(beginnerBtn).toHaveAttribute('aria-checked', 'true');
  });

  test('can switch difficulty levels', async ({ page }) => {
    const intermediate = page.getByRole('radio', { name: /Intermediate/ });
    const advanced = page.getByRole('radio', { name: /Advanced/ });
    const beginner = page.getByRole('radio', { name: /Beginner/ });

    await intermediate.click();
    await expect(intermediate).toHaveAttribute('aria-checked', 'true');
    await expect(beginner).toHaveAttribute('aria-checked', 'false');

    await advanced.click();
    await expect(advanced).toHaveAttribute('aria-checked', 'true');
    await expect(intermediate).toHaveAttribute('aria-checked', 'false');
  });

  test('Start Quiz button is disabled when no themes selected', async ({
    page,
  }) => {
    const startBtn = page.getByRole('button', { name: /Start Quiz/ });
    await expect(startBtn).toBeDisabled();
  });

  test('can select and deselect themes', async ({ page }) => {
    const dddButton = page.getByRole('button', {
      name: /Domain-Driven Design/,
    });
    const tddButton = page.getByRole('button', {
      name: /Test-Driven Development/,
    });

    // Select DDD
    await dddButton.click();
    await expect(dddButton).toHaveAttribute('aria-pressed', 'true');

    // Select TDD
    await tddButton.click();
    await expect(tddButton).toHaveAttribute('aria-pressed', 'true');

    // Start button should now show theme count and be enabled
    const startBtn = page.getByRole('button', { name: /Start Quiz/ });
    await expect(startBtn).toBeEnabled();
    await expect(startBtn).toContainText('2 themes');

    // Deselect DDD
    await dddButton.click();
    await expect(dddButton).toHaveAttribute('aria-pressed', 'false');
    await expect(startBtn).toContainText('1 theme');
  });

  test('clicking Start Quiz with themes selected navigates to quiz play', async ({
    page,
  }) => {
    // Select a theme
    await page.getByRole('button', { name: /SOLID Principles/ }).click();

    // Click start
    await page.getByRole('button', { name: /Start Quiz/ }).click();

    // Should navigate to play page
    await expect(page).toHaveURL(/quiz\/play/);
  });

  test('all 8 themes are available at beginner difficulty', async ({
    page,
  }) => {
    const themeGroup = page.getByRole('group', { name: /Select quiz themes/ });
    const themeButtons = themeGroup.getByRole('button');
    await expect(themeButtons).toHaveCount(8);

    // None should be disabled at beginner (all themes have beginner questions)
    for (let i = 0; i < 8; i++) {
      await expect(themeButtons.nth(i)).toBeEnabled();
    }
  });
});
