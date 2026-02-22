import { test, expect } from '@playwright/test';

test('driver detail navigation from leaderboard', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  const firstRow = page.locator('table tbody tr').first();
  await expect(firstRow).toBeVisible();

  const driverName = await firstRow.locator('td').first().innerText();
  await firstRow.click();

  await expect(page).toHaveURL(/\/driver\//);
  await expect(page.getByRole('heading', { name: driverName })).toBeVisible();
});
