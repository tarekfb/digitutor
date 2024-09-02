import { test, expect } from '@playwright/test';

test('fetched profile', async ({ page }) => {
  await page.goto('/profile/550e8400-e29b-41d4-a716-446655440010');
  await expect(page.getByRole('heading', { name: 'Annonser' })).toBeVisible();
});