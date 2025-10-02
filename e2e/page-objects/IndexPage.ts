import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Index page object following AAA pattern
 * Encapsulates all interactions with the home page
 */
export class IndexPage extends BasePage {
  // Selectors
  private readonly selectors = {
    heroHeading: "h1",
    heroDescription: "p",
    getStartedButton: 'button:has-text("Get Started Free")',
    signInButton: 'button:has-text("Sign In")',
    createAccountButton: 'button:has-text("Create Free Account")',
    featuresSection: 'h2:has-text("Everything Your Puppy Needs")',
    languageSection: 'h2:has-text("Available in Your Language")',
    footer: "footer",
    heroImage: 'img[alt*="golden retriever puppy"]',
    featureCards: '[class*="card"]',
    languageFlags: "text=🇬🇧, text=🇵🇱",
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the index page
   */
  async goto(): Promise<void> {
    await super.goto("/");
    await this.waitForLoad();
  }

  /**
   * Get hero heading text
   */
  async getHeroHeading(): Promise<string> {
    return await this.getText(this.selectors.heroHeading);
  }

  /**
   * Get hero description text
   */
  async getHeroDescription(): Promise<string> {
    return await this.getText(this.selectors.heroDescription);
  }

  /**
   * Click Get Started button
   */
  async clickGetStarted(): Promise<void> {
    await this.clickElement(this.selectors.getStartedButton);
  }

  /**
   * Click Sign In button
   */
  async clickSignIn(): Promise<void> {
    await this.clickElement(this.selectors.signInButton);
  }

  /**
   * Click Create Account button
   */
  async clickCreateAccount(): Promise<void> {
    await this.clickElement(this.selectors.createAccountButton);
  }

  /**
   * Check if hero image is visible
   */
  async isHeroImageVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.heroImage);
  }

  /**
   * Check if features section is visible
   */
  async isFeaturesSectionVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.featuresSection);
  }

  /**
   * Check if language section is visible
   */
  async isLanguageSectionVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.languageSection);
  }

  /**
   * Check if footer is visible
   */
  async isFooterVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.footer);
  }

  /**
   * Get number of feature cards
   */
  async getFeatureCardsCount(): Promise<number> {
    const cards = await this.page.locator(this.selectors.featureCards).all();
    return cards.length;
  }

  /**
   * Check if language flags are visible
   */
  async areLanguageFlagsVisible(): Promise<boolean> {
    const ukFlag = await this.isVisible("text=🇬🇧");
    const plFlag = await this.isVisible("text=🇵🇱");
    return ukFlag && plFlag;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for the main content to be visible instead of specific elements
    await this.waitForElement("h1", 5000);
    await this.waitForElement('button:has-text("Get Started Free")', 5000);
  }
}
