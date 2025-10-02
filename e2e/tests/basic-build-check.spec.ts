import { test, expect } from "@playwright/test";

test.describe("Basic Build Check", () => {
  test("should load the frontend application", async ({ page }) => {
    // Navigate to the frontend
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the page loads without errors
    await expect(page).toHaveTitle(/Wag Wise Mentor|Puppy Mentor/);

    // Check that the page has some content
    const body = await page.locator("body");
    await expect(body).toBeVisible();
  });

  test("should have basic page structure", async ({ page }) => {
    // Navigate to the frontend
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check for basic HTML structure
    await expect(page.locator("html")).toBeVisible();
    await expect(page.locator("head")).toBeVisible();
    await expect(page.locator("body")).toBeVisible();

    // Check that there's some content in the body
    const bodyContent = await page.locator("body").textContent();
    expect(bodyContent).toBeTruthy();
    expect(bodyContent!.length).toBeGreaterThan(0);
  });

  test("should handle 404 routes gracefully", async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto("/non-existent-route");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the page loads (should show 404 page)
    const body = await page.locator("body");
    await expect(body).toBeVisible();

    // Check that there's some content (404 page content)
    const bodyContent = await page.locator("body").textContent();
    expect(bodyContent).toBeTruthy();
  });

  test("should load without JavaScript errors", async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Navigate to the frontend
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that there are no critical JavaScript errors
    // (Allow for some non-critical errors like React Router warnings)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("React Router Future Flag Warning") &&
        !error.includes("v7_startTransition") &&
        !error.includes("v7_relativeSplatPath")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should have proper meta tags", async ({ page }) => {
    // Navigate to the frontend
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check for basic meta tags
    const viewport = await page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", /width=device-width/);

    // Check for charset
    const charset = await page.locator("meta[charset]");
    await expect(charset).toHaveAttribute("charset", "utf-8");
  });

  test("should load CSS and JavaScript assets", async ({ page }) => {
    // Navigate to the frontend
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that CSS is loaded (body should have some styling)
    const body = await page.locator("body");
    const computedStyle = await body.evaluate((el) => {
      return window.getComputedStyle(el);
    });

    // Basic check that some CSS is applied
    expect(computedStyle.margin).toBeDefined();
    expect(computedStyle.padding).toBeDefined();
  });
});
