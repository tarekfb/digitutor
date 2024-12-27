

import { expect } from '@playwright/test';
import { test } from '../env-options';

let baseUrl: string;

test.beforeEach(async () => {
    baseUrl = process.env.BASE_URL || "";
})

test('successful login', async ({ emailTeacher, context }) => {
    const password = process.env.PASSWORD_TEACHER as string;
    const email = emailTeacher || process.env.EMAIL_TEACHER as string;
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();

    const page = await context.newPage();

    await page.goto(`${baseUrl}/sign-in/`, { waitUntil: 'networkidle' })
    await page.getByPlaceholder('E-postadress').click();
    await page.getByPlaceholder('E-postadress').fill(email);
    await page.getByPlaceholder('Lösenord').click();
    await page.getByPlaceholder('Lösenord').fill(password);
    await page.locator('form').getByRole('button', { name: 'Logga in' }).click();
    await page.waitForURL(/account$/);
    expect(page.url()).toMatch(/account$/);
});

test('unsuccessful login', async ({ context }) => {
    const password = "fake";
    const email = "fake@example.com";
    const page = await context.newPage();

    await page.goto(`${baseUrl}/sign-in/`, { waitUntil: 'networkidle' })
    await page.getByPlaceholder('E-postadress').click();
    await page.getByPlaceholder('E-postadress').fill(email);
    await page.getByPlaceholder('Lösenord').click();
    await page.getByPlaceholder('Lösenord').fill(password);
    await page.locator('form').getByRole('button', { name: 'Logga in' }).click();
    await expect(page.getByRole('heading', { name: 'Ogiltiga inloggingsuppgifter' })).toBeVisible();
});

// not working atm [2024-09-27]
// test('logout via navbar', async ({ emailStudent, context }) => {
//     const password = process.env.PASSWORD_STUDENT as string;
//     const email = emailStudent || process.env.EMAIL_STUDENT as string;
//     expect(email).toBeTruthy();
//     expect(password).toBeTruthy();

//     const page = await context.newPage();

//     await page.goto(`${baseUrl}/sign-in/`);
//     await page.getByPlaceholder('E-postadress').fill(email);
//     await page.getByPlaceholder('Lösenord').fill(password);
//     await page.locator('form').getByRole('button', { name: 'Logga in' }).click();

//     await expect(page).toHaveURL(/account$/);

//     await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
//     await page.getByTestId("avatar").click();
//     await page.getByRole('menuitem', { name: 'Logga ut' }).click();

//     await page.waitForURL(/sign-(up|in)$/);
//     await expect(page).toHaveURL(/sign-(up|in)$/);
//     expect(page.url()).not.toMatch(/account$/);
// });


test('signup with query param teacher selects teacher', async ({ context }) => {
    const page = await context.newPage();

    await page.goto(`${baseUrl}/sign-up?role=teacher`)
    await expect(page.getByText('som lärare')).toBeVisible();
});

test('signup with query param student selects student', async ({ context }) => {
    const page = await context.newPage();

    await page.goto(`${baseUrl}/sign-up?role=student`)
    await expect(page.getByText('som student')).toBeVisible();
});