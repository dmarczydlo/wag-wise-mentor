import { Page, expect } from "@playwright/test";

/**
 * Browser MCP Integration Utility
 * Provides advanced browser automation capabilities
 * Following the testing strategy requirements for MCP integration
 */
export class BrowserMCP {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Setup browser with custom configuration
   */
  async setup(config: {
    viewport?: { width: number; height: number };
    userAgent?: string;
    locale?: string;
    timezone?: string;
  }): Promise<void> {
    if (config.viewport) {
      await this.page.setViewportSize(config.viewport);
    }

    if (config.userAgent) {
      await this.page.setExtraHTTPHeaders({
        "User-Agent": config.userAgent,
      });
    }

    if (config.locale) {
      await this.page.setExtraHTTPHeaders({
        "Accept-Language": config.locale,
      });
    }

    if (config.timezone) {
      await this.page.addInitScript((timezone) => {
        // Mock timezone for consistent testing
        const originalDate = Date;
        (global as any).Date = class extends originalDate {
          constructor(...args: any[]) {
            if (args.length === 0) {
              super();
            } else {
              super(...args);
            }
          }

          static now() {
            return originalDate.now();
          }
        };
      }, config.timezone);
    }
  }

  /**
   * Navigate to URL with MCP-specific handling
   */
  async navigate(
    url: string,
    options?: {
      waitUntil?: "load" | "domcontentloaded" | "networkidle";
      timeout?: number;
    }
  ): Promise<void> {
    await this.page.goto(url, {
      waitUntil: options?.waitUntil || "domcontentloaded",
      timeout: options?.timeout || 30000,
    });
  }

  /**
   * Interact with element using MCP automation
   */
  async interact(
    selector: string,
    action: "click" | "fill" | "hover" | "focus",
    value?: string
  ): Promise<void> {
    const element = this.page.locator(selector);

    switch (action) {
      case "click":
        await element.click();
        break;
      case "fill":
        if (!value) throw new Error("Value required for fill action");
        await element.fill(value);
        break;
      case "hover":
        await element.hover();
        break;
      case "focus":
        await element.focus();
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Wait for element with MCP-specific conditions
   */
  async waitForElement(
    selector: string,
    options?: {
      state?: "visible" | "hidden" | "attached" | "detached";
      timeout?: number;
    }
  ): Promise<void> {
    await this.page.waitForSelector(selector, {
      state: options?.state || "attached", // Changed from 'visible' to 'attached'
      timeout: options?.timeout || 10000,
    });
  }

  /**
   * Take screenshot with MCP metadata
   */
  async screenshot(
    name: string,
    options?: {
      fullPage?: boolean;
      clip?: { x: number; y: number; width: number; height: number };
    }
  ): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await this.page.screenshot({
      path: `test-results/mcp-${name}-${timestamp}.png`,
      fullPage: options?.fullPage || true,
      clip: options?.clip,
    });
  }

  /**
   * Execute JavaScript with MCP context
   */
  async executeScript(script: string, ...args: any[]): Promise<any> {
    return await this.page.evaluate(
      (script, ...args) => {
        return eval(script);
      },
      script,
      ...args
    );
  }

  /**
   * Get element information for MCP analysis
   */
  async getElementInfo(selector: string): Promise<{
    text: string;
    attributes: Record<string, string>;
    boundingBox: any;
    isVisible: boolean;
  }> {
    const element = this.page.locator(selector);

    return {
      text: (await element.textContent()) || "",
      attributes: await element.evaluate((el) => {
        const attrs: Record<string, string> = {};
        for (const attr of el.attributes) {
          attrs[attr.name] = attr.value;
        }
        return attrs;
      }),
      boundingBox: await element.boundingBox(),
      isVisible: await element.isVisible(),
    };
  }

  /**
   * Simulate user interactions with MCP precision
   */
  async simulateUserFlow(
    steps: Array<{
      action: "navigate" | "click" | "fill" | "wait" | "assert";
      selector?: string;
      value?: string;
      url?: string;
      assertion?: () => Promise<void>;
      timeout?: number;
    }>
  ): Promise<void> {
    for (const step of steps) {
      switch (step.action) {
        case "navigate":
          if (!step.url) throw new Error("URL required for navigate action");
          await this.navigate(step.url);
          break;
        case "click":
          if (!step.selector)
            throw new Error("Selector required for click action");
          await this.interact(step.selector, "click");
          break;
        case "fill":
          if (!step.selector || !step.value) {
            throw new Error("Selector and value required for fill action");
          }
          await this.interact(step.selector, "fill", step.value);
          break;
        case "wait":
          if (!step.selector)
            throw new Error("Selector required for wait action");
          await this.waitForElement(step.selector, { timeout: step.timeout });
          break;
        case "assert":
          if (!step.assertion)
            throw new Error("Assertion function required for assert action");
          await step.assertion();
          break;
      }
    }
  }

  /**
   * Get page performance metrics for MCP analysis
   */
  async getPerformanceMetrics(): Promise<{
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
  }> {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");

      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        firstPaint: paint.find((p) => p.name === "first-paint")?.startTime || 0,
        firstContentfulPaint:
          paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
          0,
      };
    });

    return metrics;
  }
}
