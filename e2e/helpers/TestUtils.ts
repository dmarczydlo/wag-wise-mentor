import { Page, expect } from "@playwright/test";

/**
 * E2E test utilities following AAA pattern
 * Provides common test helper functions
 */
export class TestUtils {
  /**
   * Wait for navigation to complete
   */
  static async waitForNavigation(page: Page, url: string): Promise<void> {
    await page.waitForURL(`**${url}**`);
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: `test-results/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  /**
   * Check if element contains text
   */
  static async expectElementToContainText(
    page: Page,
    selector: string,
    text: string
  ): Promise<void> {
    await expect(page.locator(selector)).toContainText(text);
  }

  /**
   * Check if element is visible
   */
  static async expectElementToBeVisible(
    page: Page,
    selector: string
  ): Promise<void> {
    await expect(page.locator(selector)).toBeVisible();
  }

  /**
   * Check if element is hidden
   */
  static async expectElementToBeHidden(
    page: Page,
    selector: string
  ): Promise<void> {
    await expect(page.locator(selector)).toBeHidden();
  }

  /**
   * Check if button is enabled
   */
  static async expectButtonToBeEnabled(
    page: Page,
    selector: string
  ): Promise<void> {
    await expect(page.locator(selector)).toBeEnabled();
  }

  /**
   * Check if button is disabled
   */
  static async expectButtonToBeDisabled(
    page: Page,
    selector: string
  ): Promise<void> {
    await expect(page.locator(selector)).toBeDisabled();
  }

  /**
   * Check if input has correct value
   */
  static async expectInputToHaveValue(
    page: Page,
    selector: string,
    value: string
  ): Promise<void> {
    await expect(page.locator(selector)).toHaveValue(value);
  }

  /**
   * Check if page has correct title
   */
  static async expectPageToHaveTitle(page: Page, title: string): Promise<void> {
    await expect(page).toHaveTitle(title);
  }

  /**
   * Check if page has correct URL
   */
  static async expectPageToHaveURL(page: Page, url: string): Promise<void> {
    await expect(page).toHaveURL(url);
  }

  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForElementToBeVisible(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForSelector(selector, { state: "visible", timeout });
  }

  /**
   * Wait for element to be hidden
   */
  static async waitForElementToBeHidden(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForSelector(selector, { state: "hidden", timeout });
  }

  /**
   * Fill form field safely
   */
  static async fillFormField(
    page: Page,
    selector: string,
    value: string
  ): Promise<void> {
    await page.waitForSelector(selector);
    await page.fill(selector, "");
    await page.fill(selector, value);
  }

  /**
   * Click element and wait for navigation
   */
  static async clickAndWaitForNavigation(
    page: Page,
    selector: string,
    url: string
  ): Promise<void> {
    await Promise.all([page.waitForURL(`**${url}**`), page.click(selector)]);
  }

  /**
   * Check if element has correct CSS class
   */
  static async expectElementToHaveClass(
    page: Page,
    selector: string,
    className: string
  ): Promise<void> {
    await expect(page.locator(selector)).toHaveClass(new RegExp(className));
  }

  /**
   * Check if element has correct attribute
   */
  static async expectElementToHaveAttribute(
    page: Page,
    selector: string,
    attribute: string,
    value: string
  ): Promise<void> {
    await expect(page.locator(selector)).toHaveAttribute(attribute, value);
  }
}
