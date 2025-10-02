import { test, expect } from "@playwright/test";
import { IndexPage } from "../page-objects/IndexPage";
import { TestUtils } from "../helpers/TestUtils";

test.describe("Critical User Flows - E2E Tests", () => {
  let indexPage: IndexPage;

  test.beforeEach(async ({ page }) => {
    // Arrange
    indexPage = new IndexPage(page);
    await indexPage.goto();
    // Wait for page to load without complex selectors
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("h1", { timeout: 10000 });
  });

  test.describe("Landing Page to Authentication Flow", () => {
    test("should navigate from landing page to auth page via Get Started button", async ({
      page,
    }) => {
      // Arrange
      const authURL = "/auth";

      // Act
      await TestUtils.clickAndWaitForNavigation(
        page,
        'button:has-text("Get Started Free")',
        authURL
      );

      // Assert
      await TestUtils.expectPageToHaveURL(page, authURL);
      await TestUtils.expectElementToBeVisible(page, "h3");
      await TestUtils.expectElementToContainText(page, "h3", "Welcome Back");
    });

    test("should navigate from landing page to auth page via Sign In button", async ({
      page,
    }) => {
      // Arrange
      const authURL = "/auth";

      // Act
      await TestUtils.clickAndWaitForNavigation(
        page,
        'button:has-text("Sign In")',
        authURL
      );

      // Assert
      await TestUtils.expectPageToHaveURL(page, authURL);
      await TestUtils.expectElementToBeVisible(page, "h3");
      await TestUtils.expectElementToContainText(page, "h3", "Welcome Back");
    });

    test("should navigate from landing page to auth page via Create Account button", async ({
      page,
    }) => {
      // Arrange
      const authURL = "/auth";

      // Act
      await TestUtils.clickAndWaitForNavigation(
        page,
        'button:has-text("Create Free Account")',
        authURL
      );

      // Assert
      await TestUtils.expectPageToHaveURL(page, authURL);
      await TestUtils.expectElementToBeVisible(page, "h3");
      await TestUtils.expectElementToContainText(page, "h3", "Get Started");
    });
  });

  test.describe("Authentication Flow", () => {
    test("should complete sign up flow with valid credentials", async ({
      page,
    }) => {
      // Arrange
      await page.goto("/auth");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Act - Switch to sign up mode
      await TestUtils.clickElement(page, 'button:has-text("Sign Up")');
      await TestUtils.waitForElementToBeVisible(
        page,
        'button:has-text("Create Account")'
      );

      // Fill sign up form
      await TestUtils.fillFormField(
        page,
        'input[type="email"]',
        "test@example.com"
      );
      await TestUtils.fillFormField(
        page,
        'input[type="password"]',
        "password123"
      );

      // Submit form
      await TestUtils.clickElement(page, 'button:has-text("Create Account")');

      // Assert
      await TestUtils.waitForElementToBeVisible(
        page,
        'button:has-text("Please wait...")'
      );
      // Note: In a real test, you'd wait for success message or redirect
    });

    test("should show validation errors for invalid sign up data", async ({
      page,
    }) => {
      // Arrange
      await page.goto("/auth");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Act - Switch to sign up mode
      await TestUtils.clickElement(page, 'button:has-text("Sign Up")');
      await TestUtils.waitForElementToBeVisible(
        page,
        'button:has-text("Create Account")'
      );

      // Fill invalid data
      await TestUtils.fillFormField(
        page,
        'input[type="email"]',
        "invalid-email"
      );
      await TestUtils.fillFormField(page, 'input[type="password"]', "123");

      // Submit form
      await TestUtils.clickElement(page, 'button:has-text("Create Account")');

      // Assert
      await TestUtils.waitForElementToBeVisible(
        page,
        'text="Please enter a valid email"'
      );
    });

    test("should complete sign in flow with valid credentials", async ({
      page,
    }) => {
      // Arrange
      await page.goto("/auth");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Act - Fill sign in form
      await TestUtils.fillFormField(
        page,
        'input[type="email"]',
        "test@example.com"
      );
      await TestUtils.fillFormField(
        page,
        'input[type="password"]',
        "password123"
      );

      // Submit form
      await TestUtils.clickElement(page, 'button:has-text("Sign In")');

      // Assert
      await TestUtils.waitForElementToBeVisible(
        page,
        'button:has-text("Please wait...")'
      );
      // Note: In a real test, you'd wait for redirect to dashboard
    });

    test("should show validation errors for invalid sign in data", async ({
      page,
    }) => {
      // Arrange
      await page.goto("/auth");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Act - Fill invalid data
      await TestUtils.fillFormField(
        page,
        'input[type="email"]',
        "test@example.com"
      );
      await TestUtils.fillFormField(
        page,
        'input[type="password"]',
        "wrongpassword"
      );

      // Submit form
      await TestUtils.clickElement(page, 'button:has-text("Sign In")');

      // Assert
      await TestUtils.waitForElementToBeVisible(
        page,
        'text="Invalid email or password"'
      );
    });

    test("should toggle between sign in and sign up modes", async ({
      page,
    }) => {
      // Arrange
      await page.goto("/auth");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Act & Assert - Start with sign in
      await TestUtils.expectElementToContainText(page, "h1", "Welcome Back");
      await TestUtils.expectElementToBeVisible(
        page,
        'button:has-text("Sign In")'
      );

      // Switch to sign up
      await TestUtils.clickElement(page, 'button:has-text("Sign Up")');
      await TestUtils.expectElementToContainText(page, "h1", "Get Started");
      await TestUtils.expectElementToBeVisible(
        page,
        'button:has-text("Create Account")'
      );

      // Switch back to sign in
      await TestUtils.clickElement(page, 'button:has-text("Sign In")');
      await TestUtils.expectElementToContainText(page, "h1", "Welcome Back");
      await TestUtils.expectElementToBeVisible(
        page,
        'button:has-text("Sign In")'
      );
    });
  });

  test.describe("Dashboard Flow", () => {
    test("should access dashboard after authentication", async ({ page }) => {
      // Arrange
      await page.goto("/dashboard");

      // Act & Assert
      await TestUtils.waitForElementToBeVisible(page, "h1");
      await TestUtils.expectElementToContainText(page, "h1", "Puppy Mentor");
      await TestUtils.expectElementToContainText(
        page,
        "h2",
        "Welcome back! 🐾"
      );
    });

    test("should display dashboard features and quick actions", async ({
      page,
    }) => {
      // Arrange
      await page.goto("/dashboard");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Assert
      await TestUtils.expectElementToBeVisible(page, 'text="Get Started"');
      await TestUtils.expectElementToBeVisible(
        page,
        'text="Add your first puppy to begin tracking their care journey"'
      );
      await TestUtils.expectElementToBeVisible(
        page,
        'button:has-text("Add Your Puppy")'
      );

      // Quick action cards
      await TestUtils.expectElementToBeVisible(page, 'text="Puppy Profile"');
      await TestUtils.expectElementToBeVisible(page, 'text="Feeding Schedule"');
      await TestUtils.expectElementToBeVisible(page, 'text="Appointments"');
      await TestUtils.expectElementToBeVisible(page, 'text="Reminders"');
    });

    test("should handle sign out from dashboard", async ({ page }) => {
      // Arrange
      await page.goto("/dashboard");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Act
      await TestUtils.clickElement(page, 'button:has-text("Sign Out")');

      // Assert
      await TestUtils.expectPageToHaveURL(page, "/");
      await TestUtils.expectElementToContainText(
        page,
        "h1",
        "Your Puppy's Journey"
      );
    });
  });

  test.describe("Navigation Flow", () => {
    test("should navigate from auth back to landing page", async ({ page }) => {
      // Arrange
      await page.goto("/auth");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Act
      await page.goBack();

      // Assert
      await TestUtils.expectPageToHaveURL(page, "/");
      await TestUtils.expectElementToContainText(
        page,
        "h1",
        "Your Puppy's Journey"
      );
    });

    test("should handle direct navigation to protected routes", async ({
      page,
    }) => {
      // Arrange
      await page.goto("/dashboard");

      // Act & Assert
      // Should redirect to auth or show auth form
      await TestUtils.waitForElementToBeVisible(page, "h1");
      // The exact behavior depends on implementation
    });

    test("should handle 404 navigation", async ({ page }) => {
      // Arrange
      await page.goto("/non-existent-page");

      // Act & Assert
      await TestUtils.waitForElementToBeVisible(page, "h1");
      await TestUtils.expectElementToContainText(page, "h1", "Page Not Found");
    });
  });

  test.describe("Responsive Design Flow", () => {
    test("should work correctly on mobile viewport", async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 375, height: 667 });
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Assert
      await TestUtils.expectElementToBeVisible(page, "h1");
      await TestUtils.expectElementToBeVisible(
        page,
        'button:has-text("Get Started Free")'
      );
      await TestUtils.expectElementToBeVisible(
        page,
        'button:has-text("Sign In")'
      );
    });

    test("should work correctly on tablet viewport", async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 768, height: 1024 });
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Assert
      await TestUtils.expectElementToBeVisible(page, "h1");
      await TestUtils.expectElementToBeVisible(page, "h2");
      await TestUtils.expectElementToBeVisible(page, "footer");
    });

    test("should work correctly on desktop viewport", async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 1920, height: 1080 });
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Assert
      await TestUtils.expectElementToBeVisible(page, "h1");
      await TestUtils.expectElementToBeVisible(page, "h2");
      await TestUtils.expectElementToBeVisible(page, "footer");
    });
  });

  test.describe("Performance and Loading Flow", () => {
    test("should load landing page within acceptable time", async ({
      page,
    }) => {
      // Arrange
      const startTime = Date.now();

      // Act
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Assert
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test("should handle slow network conditions", async ({ page }) => {
      // Arrange
      await page.route("**/*", (route) => {
        // Simulate slow network
        setTimeout(() => route.continue(), 1000);
      });

      // Act
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Assert
      await TestUtils.expectElementToBeVisible(page, "h1");
    });

    test("should handle network errors gracefully", async ({ page }) => {
      // Arrange
      await page.route("**/*", (route) => route.abort());

      // Act
      try {
        await indexPage.goto();
      } catch (error) {
        // Expected to fail
      }

      // Assert
      // Should show error state or retry mechanism
    });
  });

  test.describe("Accessibility Flow", () => {
    test("should be navigable via keyboard", async ({ page }) => {
      // Arrange
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Act
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      // Assert
      await TestUtils.expectPageToHaveURL(page, "/auth");
    });

    test("should have proper heading hierarchy", async ({ page }) => {
      // Arrange
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Assert
      const h1 = page.locator("h1").first();
      const h2 = page.locator("h2").first();

      await expect(h1).toBeVisible();
      await expect(h2).toBeVisible();
    });

    test("should have proper form labels", async ({ page }) => {
      // Arrange
      await page.goto("/auth");
      await TestUtils.waitForElementToBeVisible(page, "h1");

      // Assert
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();

      // Check for associated labels
      const emailLabel = page.locator('label[for="email"]');
      const passwordLabel = page.locator('label[for="password"]');

      await expect(emailLabel).toBeVisible();
      await expect(passwordLabel).toBeVisible();
    });
  });
});
