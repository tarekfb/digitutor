/*
import { expect } from '@playwright/test';
import { test } from '../env-options';

test('search', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL || "/"}`, { waitUntil: 'networkidle' })
    await page.getByPlaceholder('Namn, titel, beskrivning,').click();
    await page.getByPlaceholder('Namn, titel, beskrivning,').fill('tarek');
    await page.getByRole('button', { name: 'Sök' }).click()
    await expect(page.getByRole('listitem').getByLabel('Gå till annons').first()).toBeVisible();
});
*/
