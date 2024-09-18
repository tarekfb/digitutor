import { expect } from '@playwright/test';
import { test } from '../env-options';

test('fetch listing', async ({ page, listingId }) => {
  await page.goto(`${process.env.BASE_URL || ""}/listing/${listingId}`);
  await expect(page.getByRole('heading', { name: 'SEK' })).toBeVisible();
});

test('create, edit and delete listing', async ({ page, listingId, emailTeacher }) => {
  const password = process.env.PASSWORD_TEACHER as string;
  const email = emailTeacher || process.env.EMAIL_TEACHER as string;
  expect(email).toBeTruthy();
  expect(password).toBeTruthy();
  const baseUrl = process.env.BASE_URL || "";

  await page.goto(`${baseUrl}/listing/${listingId}`);
  await expect(page.getByRole('heading', { name: 'SEK' })).toBeVisible();

  await page.goto(`${baseUrl}/sign-in/`, { waitUntil: 'networkidle' })
  await page.getByPlaceholder('E-postadress').click();
  await page.getByPlaceholder('E-postadress').fill(email);
  await page.getByPlaceholder('Lösenord').click();
  await page.getByPlaceholder('Lösenord').fill(password);
  await page.locator('form').getByRole('button', { name: 'Logga in' }).click();
  await page.waitForURL(/account$/);
  expect(page.url()).toMatch(/account$/);

  await page.getByLabel('Skapa annons').click();
  await page.getByPlaceholder('Rubrik').fill('Test annons');
  await page.getByPlaceholder('Rubrik').press('Enter');
  await page.getByRole('button', { name: 'Ändra' }).click();
  await page.getByPlaceholder('Rubrik').click();
  await page.getByPlaceholder('Rubrik').fill('Test annons redigerad');
  await page.getByPlaceholder('Rubrik').press('Enter');
  await page.getByPlaceholder('Skriv några ord om din annons').click();
  await page.getByPlaceholder('Skriv några ord om din annons').fill('En test annons.');

  const editableSubjects = await page.getByTestId("editable-subjects").getByRole('checkbox').all();
  editableSubjects.slice(0, 3).forEach(async (subject) => await subject.click())
  await page.getByRole('button', { name: 'Spara' }).click();
  await page.getByRole('button', { name: 'Ändra' }).click();
  await page.getByLabel('Delete listing').click();
  await page.getByRole('button', { name: 'Ta bort' }).click();

  await page.waitForURL(/account$/);
  expect(page.url()).toMatch(/account$/);
});

