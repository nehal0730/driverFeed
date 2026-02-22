import { test, expect } from '@playwright/test';

test('submit feedback flow', async ({ page }) => {
  await page.goto('/feedback');

  await expect(
    page.getByRole('heading', { name: 'Share Your Feedback' })
  ).toBeVisible();

  await expect(page.getByTestId('feedback-section-driver')).toBeVisible();
  await expect(page.getByTestId('feedback-section-trip')).toBeVisible();
  await expect(page.getByTestId('feedback-section-app')).toHaveCount(0);
  await expect(page.getByTestId('feedback-section-marshal')).toHaveCount(0);

  const driverSection = page.getByTestId('feedback-section-driver');
  await driverSection.getByRole('radio', { name: '4 stars' }).click();
  await driverSection.locator('textarea').fill('Smooth ride and polite driver.');

  await page.getByTestId('submit-feedback').click();

  await expect(
    page.getByText('Feedback submitted successfully!')
  ).toBeVisible();
});
