import { defineConfig, devices } from '@playwright/test';
import { type EnvOptions } from './src/tests/playwright/env-options'
import { prodBaseUrl } from './src/lib/shared/constants/constants'
import { prodProfileId, prodListingId } from './src/tests/playwright/data';
import path from 'node:path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const baseUrl = process.env.BASE_URL || prodBaseUrl;

const envOptions: EnvOptions = {
  listingId: prodListingId, profileId: prodProfileId, emailTeacher: "", emailStudent: "",
}

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

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: baseUrl,
    reuseExistingServer: !!process.env.CI,
  },
});
