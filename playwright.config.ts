import { defineConfig, devices } from '@playwright/test';
import { localBaseUrl as baseUrl } from './src/lib/shared/constants/constants'
import { EnvOptions } from './src/tests/playwright/env-options';
import { localListingId, localProfileId } from './src/tests/playwright/data';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });


const envOptions: EnvOptions = {
  listingId: localListingId, profileId: localProfileId
}


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests/playwright',
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
    reuseExistingServer: !process.env.CI,
  },
});
