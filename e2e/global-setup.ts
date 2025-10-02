import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🚀 Starting E2E test setup...");

  try {
    // Start browser for setup
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      // Wait for the frontend to be ready with retries
      const baseURL =
        config.projects[0].use?.baseURL || "http://localhost:5173";
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
    } finally {
      await browser.close();
    }
  } catch (error) {
    // If browser launch fails (e.g., browsers not installed),
    // just check if the frontend is available via HTTP
    console.log("⚠️ Browser not available, checking frontend via HTTP...");

    const baseURL = config.projects[0].use?.baseURL || "http://localhost:5173";
    console.log(`📡 Checking frontend availability at ${baseURL}`);

    try {
      const response = await fetch(baseURL);
      if (response.ok) {
        console.log("✅ Frontend is ready for testing");
      } else {
        throw new Error(`Frontend returned status ${response.status}`);
      }
    } catch (fetchError) {
      console.error("❌ Frontend setup failed:", fetchError);
      throw fetchError;
    }
  }

  console.log("✅ E2E test setup completed");
}

export default globalSetup;
