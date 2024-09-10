import { expect } from '@playwright/test';
import { test } from '../env-options';

test('fetch listing', async ({ page, listingId }) => {
  await page.goto(`${process.env.BASE_URL ?? ""}/listing/${listingId}`);
  await expect(page.getByRole('heading', { name: 'SEK' })).toBeVisible();
});