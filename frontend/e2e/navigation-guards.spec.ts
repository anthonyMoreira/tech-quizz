import { test, expect } from '@playwright/test';

test.describe('Navigation Guards', () => {
  test('accessing /quiz/play directly redirects to setup', async ({ page }) => {
    await page.goto('/quiz/play');

    // Should redirect to /quiz/setup since there is no active session
    await expect(page).toHaveURL(/quiz\/setup/);
    await expect(
      page.getByRole('heading', { name: 'Set Up Your Quiz' }),
    ).toBeVisible();
  });

  test('accessing /quiz/results directly redirects to home', async ({
    page,
  }) => {
    await page.goto('/quiz/results');

    // Should redirect to / since there is no completed quiz
    await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/$/);
    await expect(
      page.getByRole('heading', { name: 'Tech Quiz App' }),
    ).toBeVisible();
  });

  test('unknown routes redirect to home', async ({ page }) => {
    await page.goto('/nonexistent-page');

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole('heading', { name: 'Tech Quiz App' }),
    ).toBeVisible();
  });

  test('/themes redirects to home', async ({ page }) => {
    await page.goto('/themes');

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole('heading', { name: 'Tech Quiz App' }),
    ).toBeVisible();
  });

  test('/history redirects to home', async ({ page }) => {
    await page.goto('/history');

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole('heading', { name: 'Tech Quiz App' }),
    ).toBeVisible();
  });
});
