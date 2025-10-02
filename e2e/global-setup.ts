import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🚀 Starting E2E test setup...");

  // Start browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the frontend to be ready with retries
    const baseURL = config.projects[0].use?.baseURL || "http://localhost:5173";
    console.log(`📡 Checking frontend availability at ${baseURL}`);

    let retries = 10;
    while (retries > 0) {
      try {
        await page.goto(baseURL, {
          waitUntil: "domcontentloaded",
          timeout: 5000,
        });
        console.log("✅ Frontend is ready for testing");
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        console.log(`⏳ Waiting for frontend... (${retries} retries left)`);
        await page.waitForTimeout(2000);
      }
    }
  } catch (error) {
    console.error("❌ Frontend setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log("✅ E2E test setup completed");
}

export default globalSetup;
