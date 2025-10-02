import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e/tests",
  testMatch: process.env.CI
    ? ["**/simple-flow.spec.ts", "**/index-simple.spec.ts", "**/basic.spec.ts"]
    : ["**/*.spec.ts"],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Take screenshot on failure */
    screenshot: "only-on-failure",

    /* Record video on failure */
    video: "retain-on-failure",

    /* Collect coverage */
    ...(process.env.COLLECT_COVERAGE === "true" && {
      launchOptions: {
        args: ["--enable-coverage", "--coverage-dir=coverage/e2e"],
      },
    }),
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Only run additional browsers locally, not in CI for faster execution
    ...(process.env.CI
      ? []
      : [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
          },
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
          },
          {
            name: "Mobile Chrome",
            use: { ...devices["Pixel 5"] },
          },
          {
            name: "Mobile Safari",
            use: { ...devices["iPhone 12"] },
          },
        ]),
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "cd apps/frontend && bun run dev --host",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      NODE_ENV: "test",
      VITE_API_URL: process.env.E2E_BACKEND_URL || "http://localhost:3001",
    },
  },

  /* Global setup and teardown */
  globalSetup: require.resolve("./e2e/global-setup.ts"),
  globalTeardown: require.resolve("./e2e/global-teardown.ts"),
});
