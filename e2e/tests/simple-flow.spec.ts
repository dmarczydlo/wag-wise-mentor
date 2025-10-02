import { test, expect } from "@playwright/test";

test.describe("Simple E2E Flow Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should load the index page", async ({ page }) => {
    // Assert
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Your Puppy's Journey");
  });

  test("should navigate to auth page when Get Started is clicked", async ({ page }) => {
    // Act
    await page.click('button:has-text("Get Started Free")');

    // Assert
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.locator("h3")).toBeVisible();
    await expect(page.locator("h3")).toContainText("Welcome Back");
  });

  test("should navigate to auth page when Sign In is clicked", async ({ page }) => {
    // Act
    await page.click('button:has-text("Sign In")');

    // Assert
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.locator("h3")).toBeVisible();
    await expect(page.locator("h3")).toContainText("Welcome Back");
  });

  test("should show auth form elements", async ({ page }) => {
    // Act
    await page.click('button:has-text("Get Started Free")');
    await page.waitForURL(/.*\/auth/);

    // Assert
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should toggle between sign in and sign up", async ({ page }) => {
    // Act
    await page.click('button:has-text("Get Started Free")');
    await page.waitForURL(/.*\/auth/);

    // Assert - should show sign up form initially
    await expect(page.locator("h3")).toContainText("Get Started");

    // Act - toggle to sign in
    await page.click('button:has-text("Sign In")');

    // Assert - should show sign in form
    await expect(page.locator("h3")).toContainText("Welcome Back");
  });
});
