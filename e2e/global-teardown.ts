import { FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
  console.log("🧹 Starting E2E test teardown...");

  try {
    // Clean up any test data
    // Close any remaining connections
    // Clean up temporary files

    console.log("✅ E2E test teardown completed");
  } catch (error) {
    console.error("❌ E2E test teardown failed:", error);
    throw error;
  }
}

export default globalTeardown;
