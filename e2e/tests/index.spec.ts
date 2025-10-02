import { test, expect } from "@playwright/test";
import { IndexPage } from "../page-objects/IndexPage";
import { TestUtils } from "../helpers/TestUtils";

test.describe("Index Page E2E Tests", () => {
  let indexPage: IndexPage;

  test.beforeEach(async ({ page }) => {
    // Arrange
    indexPage = new IndexPage(page);
    await indexPage.goto();
    await indexPage.waitForPageLoad();
  });

  test.describe("Hero Section Requirements", () => {
    test("should render main heading with correct content", async ({
      page,
    }) => {
      // Arrange
      const expectedHeadingText = "Your Puppy's Journey";
      const expectedSubHeadingText = "Perfectly Guided";

      // Act
      const headingText = await indexPage.getHeroHeading();

      // Assert
      expect(headingText).toContain(expectedHeadingText);
      expect(headingText).toContain(expectedSubHeadingText);
      await TestUtils.expectElementToBeVisible(page, "h1");
    });

    test("should render hero description with key value propositions", async ({
      page,
    }) => {
      // Arrange
      const expectedDescriptionTexts = [
        "Never miss a milestone",
        "AI-powered care plans",
      ];

      // Act
      const descriptionText = await indexPage.getHeroDescription();

      // Assert
      expectedDescriptionTexts.forEach((text) => {
        expect(descriptionText).toContain(text);
      });
    });

    test("should render hero image with proper accessibility", async ({
      page,
    }) => {
      // Arrange & Act
      const isImageVisible = await indexPage.isHeroImageVisible();

      // Assert
      expect(isImageVisible).toBe(true);
      await TestUtils.expectElementToHaveAttribute(
        page,
        'img[alt*="golden retriever puppy"]',
        "alt",
        "Happy golden retriever puppy"
      );
    });
  });

  test.describe("Call-to-Action Requirements", () => {
    test("should render primary and secondary CTA buttons", async ({
      page,
    }) => {
      // Arrange & Act
      const getStartedVisible = await page.isVisible(
        'button:has-text("Get Started Free")'
      );
      const signInVisible = await page.isVisible('button:has-text("Sign In")');

      // Assert
      expect(getStartedVisible).toBe(true);
      expect(signInVisible).toBe(true);
      await TestUtils.expectButtonToBeEnabled(
        page,
        'button:has-text("Get Started Free")'
      );
      await TestUtils.expectButtonToBeEnabled(
        page,
        'button:has-text("Sign In")'
      );
    });

    test("should navigate to auth page when CTA buttons are clicked", async ({
      page,
    }) => {
      // Arrange
      const authURL = "/auth";

      // Act & Assert - Get Started button
      await TestUtils.clickAndWaitForNavigation(
        page,
        'button:has-text("Get Started Free")',
        authURL
      );
      await TestUtils.expectPageToHaveURL(page, authURL);

      // Navigate back for second test
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Act & Assert - Sign In button
      await TestUtils.clickAndWaitForNavigation(
        page,
        'button:has-text("Sign In")',
        authURL
      );
      await TestUtils.expectPageToHaveURL(page, authURL);
    });

    test("should render final CTA section with proper messaging", async ({
      page,
    }) => {
      // Arrange & Act
      const createAccountVisible = await page.isVisible(
        'button:has-text("Create Free Account")'
      );

      // Assert
      expect(createAccountVisible).toBe(true);
      await TestUtils.expectElementToContainText(
        page,
        "h2",
        "Start Your Puppy's Journey Today"
      );
      await TestUtils.expectButtonToBeEnabled(
        page,
        'button:has-text("Create Free Account")'
      );
    });

    test("should navigate to auth when final CTA is clicked", async ({
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
    });
  });

  test.describe("Features Section Requirements", () => {
    test("should render features section heading and description", async ({
      page,
    }) => {
      // Arrange & Act
      const featuresVisible = await indexPage.isFeaturesSectionVisible();

      // Assert
      expect(featuresVisible).toBe(true);
      await TestUtils.expectElementToContainText(
        page,
        "h2",
        "Everything Your Puppy Needs"
      );
      await TestUtils.expectElementToContainText(
        page,
        "p",
        "Comprehensive care management"
      );
    });

    test("should render all six feature cards with correct content", async ({
      page,
    }) => {
      // Arrange
      const expectedFeatures = [
        "Smart Calendar",
        "Weight-Based Feeding",
        "Training Library",
        "Smart Reminders",
        "Family Sharing",
        "AI Care Plans",
      ];

      // Act
      const featureCardsCount = await indexPage.getFeatureCardsCount();

      // Assert
      expect(featureCardsCount).toBeGreaterThanOrEqual(6);

      for (const feature of expectedFeatures) {
        await TestUtils.expectElementToContainText(
          page,
          '[class*="card"]',
          feature
        );
      }
    });

    test("should render feature descriptions with value propositions", async ({
      page,
    }) => {
      // Arrange
      const expectedDescriptions = [
        "automated scheduling for vet visits",
        "precise portion calculations",
        "age-appropriate exercises",
        "never miss feeding times",
        "coordinate care with household",
        "personalized recommendations",
      ];

      // Act & Assert
      for (const description of expectedDescriptions) {
        await TestUtils.expectElementToContainText(page, "body", description);
      }
    });
  });

  test.describe("Language Support Requirements", () => {
    test("should render language support section with correct information", async ({
      page,
    }) => {
      // Arrange & Act
      const languageVisible = await indexPage.isLanguageSectionVisible();

      // Assert
      expect(languageVisible).toBe(true);
      await TestUtils.expectElementToContainText(
        page,
        "h2",
        "Available in Your Language"
      );
      await TestUtils.expectElementToContainText(
        page,
        "p",
        "Currently supporting English and Polish"
      );
    });

    test("should display language flags correctly", async ({ page }) => {
      // Arrange & Act
      const flagsVisible = await indexPage.areLanguageFlagsVisible();

      // Assert
      expect(flagsVisible).toBe(true);
      await TestUtils.expectElementToBeVisible(page, "text=🇬🇧");
      await TestUtils.expectElementToBeVisible(page, "text=🇵🇱");
    });
  });

  test.describe("Footer Requirements", () => {
    test("should render footer with copyright information", async ({
      page,
    }) => {
      // Arrange & Act
      const footerVisible = await indexPage.isFooterVisible();

      // Assert
      expect(footerVisible).toBe(true);
      await TestUtils.expectElementToContainText(
        page,
        "footer",
        "© 2025 Puppy Mentor"
      );
      await TestUtils.expectElementToContainText(
        page,
        "footer",
        "Helping puppies thrive"
      );
    });
  });

  test.describe("Page Structure Requirements", () => {
    test("should render complete page structure without errors", async ({
      page,
    }) => {
      // Arrange & Act
      const heroVisible = await page.isVisible("h1");
      const featuresVisible = await indexPage.isFeaturesSectionVisible();
      const languageVisible = await indexPage.isLanguageSectionVisible();
      const footerVisible = await indexPage.isFooterVisible();

      // Assert
      expect(heroVisible).toBe(true);
      expect(featuresVisible).toBe(true);
      expect(languageVisible).toBe(true);
      expect(footerVisible).toBe(true);

      // Check for proper semantic structure
      await TestUtils.expectElementToBeVisible(page, "h1");
      await TestUtils.expectElementToBeVisible(page, "h2");
    });

    test("should have proper semantic structure with headings", async ({
      page,
    }) => {
      // Arrange & Act
      const headings = await page.locator("h1, h2, h3").all();

      // Assert
      expect(headings.length).toBeGreaterThan(0);
      await TestUtils.expectElementToBeVisible(page, "h1");

      // Check for main heading
      const mainHeading = await page.locator("h1").first();
      await expect(mainHeading).toBeVisible();
    });
  });

  test.describe("Responsive Design Requirements", () => {
    test("should work on mobile viewport", async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 375, height: 667 });

      // Act
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

    test("should work on tablet viewport", async ({ page }) => {
      // Arrange
      await page.setViewportSize({ width: 768, height: 1024 });

      // Act
      await indexPage.goto();
      await indexPage.waitForPageLoad();

      // Assert
      await TestUtils.expectElementToBeVisible(page, "h1");
      await TestUtils.expectElementToBeVisible(page, "h2");
      await TestUtils.expectElementToBeVisible(page, "footer");
    });
  });
});
