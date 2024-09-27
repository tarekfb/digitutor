import { defineConfig, devices } from '@playwright/test';
import { type EnvOptions } from './src/tests/playwright/env-options'
import { testBaseUrl } from './src/lib/shared/constants/constants'
import { testProfileId, testListingId } from './src/tests/playwright/data';
import path from 'node:path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const baseUrl = process.env.BASE_URL || testBaseUrl;

const envOptions: EnvOptions = {
  listingId: testListingId, profileId: testProfileId, emailStudent: '', emailTeacher: '',
}


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<EnvOptions>({
  testDir: './src/tests/playwright/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], ...envOptions },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], ...envOptions },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], ...envOptions },
    },
  ],
  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: baseUrl,
    reuseExistingServer: !!process.env.CI,
  },
});
