import { test, expect } from '@playwright/test';

const THEME_NAMES = [
  'Domain-Driven Design',
  'Test-Driven Development',
  'SOLID Principles',
  'Design Patterns',
  'Clean Architecture',
  'CI/CD',
  'Microservices',
  'Refactoring',
];

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the app title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tech Quiz App' })).toBeVisible();
    await expect(
      page.getByText('Test your knowledge of software engineering best practices'),
    ).toBeVisible();
  });

  test('displays the Start Quiz call-to-action link', async ({ page }) => {
    const cta = page.getByRole('link', { name: 'Start Quiz' });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /quiz\/setup/);
  });

  test('renders all 8 theme cards with correct names', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Available Themes' })).toBeVisible();

    for (const themeName of THEME_NAMES) {
      await expect(page.getByRole('heading', { name: themeName })).toBeVisible();
    }
  });

  test('theme cards link to quiz setup', async ({ page }) => {
    const themeLinks = page.locator('.theme-card');
    await expect(themeLinks).toHaveCount(8);

    // Each card should link to /quiz/setup
    for (let i = 0; i < 8; i++) {
      await expect(themeLinks.nth(i)).toHaveAttribute('href', /quiz\/setup/);
    }
  });

  test('clicking Start Quiz navigates to quiz setup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Start Quiz' }).click();
    await expect(page).toHaveURL(/quiz\/setup/);
    await expect(page.getByRole('heading', { name: 'Set Up Your Quiz' })).toBeVisible();
  });
});
