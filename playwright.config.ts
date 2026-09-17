import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  /* Configure projects for major browsers - Not needed for API testing but kept for structure */
  projects: [
    {
      name: "api",
      testDir: "./tests",
      // Exclude frontend tests from the API suite
      testIgnore: "**/frontend/**",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "frontend-ui",
      testDir: "./tests/frontend",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3013",
        launchOptions: {
          args: ["--autoplay-policy=no-user-gesture-required"],
        },
      },
    },
  ],
  webServer: {
    command: "cd ../Web/Frontend/beeplyer-frontend && NEXT_PUBLIC_API_URL=http://localhost:4301 npm run dev",
    url: "http://localhost:3013",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
