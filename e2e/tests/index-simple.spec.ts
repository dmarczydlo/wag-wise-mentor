import { test, expect } from "@playwright/test";

test.describe("Index Page E2E Tests - Simplified", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  test("should load the index page", async ({ page }) => {
    // Assert
    await expect(page).toHaveTitle(/Puppy Mentor/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should render main heading", async ({ page }) => {
    // Assert
    await expect(page.locator("h1")).toContainText("Your Puppy's Journey");
  });

  test("should render CTA buttons", async ({ page }) => {
    // Assert
    await expect(page.locator('button:has-text("Get Started Free")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test("should navigate to auth when Get Started is clicked", async ({ page }) => {
    // Act
    await page.click('button:has-text("Get Started Free")');

    // Assert
    await expect(page).toHaveURL(/.*\/auth/);
  });

  test("should render features section", async ({ page }) => {
    // Assert
    await expect(page.locator('h2:has-text("Everything Your Puppy Needs")')).toBeVisible();
  });

  test("should render footer", async ({ page }) => {
    // Assert
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer")).toContainText("© 2025 Puppy Mentor");
  });

  test("should work on mobile viewport", async ({ page }) => {
    // Arrange
    await page.setViewportSize({ width: 375, height: 667 });

    // Assert
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('button:has-text("Get Started Free")')).toBeVisible();
  });
});
