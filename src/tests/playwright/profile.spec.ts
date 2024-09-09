

import { expect } from '@playwright/test';
import { test } from './env-options';

test('fetched profile', async ({ page, profileId }) => {
    await page.goto(`/profile/${profileId}`);
    await expect(page.getByRole('heading', { name: 'Annonser' })).toBeVisible();
});