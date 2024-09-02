import { test, expect } from '@playwright/test';

test('fetched listing', async ({ page }) => {
  await page.goto('/listing/550e8400-e29b-41d4-a716-446655440090');
  await expect(page.getByRole('heading', { name: 'SEK' })).toBeVisible();
});