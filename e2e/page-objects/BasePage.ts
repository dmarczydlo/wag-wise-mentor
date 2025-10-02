import { Page, expect } from "@playwright/test";

/**
 * Base page object class following AAA pattern
 * Provides common functionality for all page objects
 */
export abstract class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page, baseURL: string = "http://localhost:5173") {
    this.page = page;
    this.baseURL = baseURL;
  }

  /**
   * Navigate to the page
   */
  async goto(path: string = ""): Promise<void> {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  /**
   * Wait for page to be loaded
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Take screenshot for debugging
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return await this.page.isVisible(selector);
    } catch {
      return false;
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Click element safely
   */
  async clickElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
  }

  /**
   * Fill input field safely
   */
  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.waitForSelector(selector);
    await this.page.fill(selector, value);
  }

  /**
   * Get text content safely
   */
  async getText(selector: string): Promise<string> {
    await this.page.waitForSelector(selector);
    return (await this.page.textContent(selector)) || "";
  }
}
