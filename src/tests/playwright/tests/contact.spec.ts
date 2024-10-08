

// import { expect } from '@playwright/test';
// import { test } from '../env-options';


// let baseUrl: string;

// test.beforeEach(async () => {
//     baseUrl = process.env.BASE_URL ?? "";
// })

// test('login and contact teacher', async ({ page, emailTeacher, profileId }) => {
//     const password = process.env.USER_PASSWORD as string;
//     const email = emailTeacher ?? process.env.EMAIL_TEACHER;
//     expect(email).toBeTruthy();
//     expect(password).toBeTruthy();

//     await page.goto(`${baseUrl}/sign-in`, { waitUntil: 'networkidle' })
//     await page.getByPlaceholder('E-postadress').click();
//     await page.getByPlaceholder('E-postadress').fill(email);
//     await page.getByPlaceholder('Lösenord').click();
//     await page.getByPlaceholder('Lösenord').fill(password);
//     await page.locator('form').getByRole('button', { name: 'Logga in' }).click();
//     await page.waitForURL(/account$/);
    
//     await page.goto(`${process.env.BASE_URL ?? ""}/profile/${profileId}`, { waitUntil: 'networkidle' })
//     await page.waitForTimeout(2000) 
//     await page.getByRole('button', { name: 'Kontakta Tarek' }).click();
//     await page.waitForLoadState('networkidle')
//     await page.waitForURL(/conversation\/[a-zA-Z0-9\-]+$/);
//     expect(page.url()).toMatch(/conversation\/[a-zA-Z0-9\-]+$/);
// });

// continue on this test when URL referral is implemented on signin