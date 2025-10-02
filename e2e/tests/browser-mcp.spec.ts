import { test, expect } from "@playwright/test";
import { BrowserMCP } from "../helpers/BrowserMCP";

test.describe("Browser MCP Integration Tests", () => {
  let browserMCP: BrowserMCP;

  test.beforeEach(async ({ page }) => {
    // Arrange
    browserMCP = new BrowserMCP(page);

    // Setup browser with MCP configuration
    await browserMCP.setup({
      viewport: { width: 1920, height: 1080 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      locale: "en-US",
      timezone: "America/New_York",
    });
  });

  test("should navigate and interact using MCP", async ({ page }) => {
    // Arrange
    const baseURL = "http://localhost:5173";

    // Act
    await browserMCP.navigate(baseURL);

    // Assert
    const title = await page.title();
    expect(title).toContain("Puppy Mentor");

    // Take MCP screenshot
    await browserMCP.screenshot("mcp-navigation-test");
  });

  test("should execute user flow simulation", async ({ page }) => {
    // Arrange
    const baseURL = "http://localhost:5173";

    // Act - Simulate user flow
    await browserMCP.simulateUserFlow([
      {
        action: "navigate",
        url: baseURL,
      },
      {
        action: "wait",
        selector: "body",
        timeout: 5000,
      },
      {
        action: "assert",
        assertion: async () => {
          const title = await page.title();
          expect(title).toContain("Puppy Mentor");
        },
      },
    ]);

    // Assert
    const html = await page.locator("html");
    expect(await html.count()).toBe(1);
  });

  test("should get element information using MCP", async ({ page }) => {
    // Arrange
    await browserMCP.navigate("http://localhost:5173");

    // Act
    const elementInfo = await browserMCP.getElementInfo("body");

    // Assert
    expect(elementInfo).toBeDefined();
    expect(elementInfo.attributes).toBeDefined();
    expect(elementInfo.boundingBox).toBeDefined();
  });

  test("should get performance metrics", async ({ page }) => {
    // Arrange
    await browserMCP.navigate("http://localhost:5173");

    // Act
    const metrics = await browserMCP.getPerformanceMetrics();

    // Assert
    expect(metrics).toBeDefined();
    expect(metrics.loadTime).toBeGreaterThanOrEqual(0);
    expect(metrics.domContentLoaded).toBeGreaterThanOrEqual(0);
  });

  test("should execute custom JavaScript", async ({ page }) => {
    // Arrange
    await browserMCP.navigate("http://localhost:5173");

    // Act
    const result = await browserMCP.executeScript(`
      ({
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        url: window.location.href
      })
    `);

    // Assert
    expect(result).toBeDefined();
    expect(result.userAgent).toContain("Mozilla");
    expect(result.viewport.width).toBe(1920);
    expect(result.viewport.height).toBe(1080);
    expect(result.url).toBe("http://localhost:5173/");
  });

  test("should handle different viewport sizes", async ({ page }) => {
    // Arrange
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      // Act
      await browserMCP.setup({ viewport });
      await browserMCP.navigate("http://localhost:5173");

      // Assert
      const result = await browserMCP.executeScript(`
        ({
          width: window.innerWidth,
          height: window.innerHeight
        })
      `);

      expect(result.width).toBe(viewport.width);
      expect(result.height).toBe(viewport.height);

      // Take screenshot for each viewport
      await browserMCP.screenshot(
        `viewport-${viewport.width}x${viewport.height}`
      );
    }
  });
});
