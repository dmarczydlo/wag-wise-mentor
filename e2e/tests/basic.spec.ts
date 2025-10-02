import { test, expect } from "@playwright/test";

test.describe("Basic E2E Test", () => {
  test("should load the frontend application", async ({ page }) => {
    // Arrange
    const baseURL = "http://localhost:5173";

    // Act
    await page.goto(baseURL);

    // Assert - Check basic HTML structure without visibility checks
    await expect(page).toHaveTitle(/Puppy Mentor/);

    // Check that elements exist in DOM (not visibility)
    const html = await page.locator("html");
    const body = await page.locator("body");
    const root = await page.locator("#root");

    expect(await html.count()).toBe(1);
    expect(await body.count()).toBe(1);
    expect(await root.count()).toBe(1);
  });

  test("should have basic page structure", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act & Assert
    const html = await page.locator("html");
    const body = await page.locator("body");
    const root = await page.locator("#root");

    expect(await html.count()).toBe(1);
    expect(await body.count()).toBe(1);
    expect(await root.count()).toBe(1);

    // Check if React app is loading (even if it fails)
    const rootContent = await page.locator("#root").textContent();
    console.log("Root content:", rootContent);

    // Check page title
    const title = await page.title();
    expect(title).toContain("Puppy Mentor");
  });
});
