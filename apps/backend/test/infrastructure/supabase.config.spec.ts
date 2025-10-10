import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import supabaseConfig from "../../src/infrastructure/config/supabase.config";

describe("SupabaseConfig - AAA Pattern", () => {
  beforeEach(() => {
    // Arrange - Clear environment variables before each test
    delete process.env.SUPABASE_URL;
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  });

  it("should return configuration with all environment variables set", () => {
    // Arrange
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";

    // Act
    const config = supabaseConfig();

    // Assert
    expect(config.url).to.equal("https://test.supabase.co");
    expect(config.serviceRoleKey).to.equal("test-service-role-key");
    expect(config.anonKey).to.equal("test-publishable-key");
  });

  it("should use VITE_SUPABASE_URL as fallback when SUPABASE_URL is not set", () => {
    // Arrange
    process.env.VITE_SUPABASE_URL = "https://vite-test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    // Act
    const config = supabaseConfig();

    // Assert
    expect(config.url).to.equal("https://vite-test.supabase.co");
  });

  it("should return undefined for url when neither variable is set", () => {
    // Arrange
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    // Act
    const config = supabaseConfig();

    // Assert
    expect(config.url).to.be.undefined;
  });

  it("should return undefined for serviceRoleKey when not set", () => {
    // Arrange
    process.env.SUPABASE_URL = "https://test.supabase.co";

    // Act
    const config = supabaseConfig();

    // Assert
    expect(config.serviceRoleKey).to.be.undefined;
  });

  it("should return undefined for anonKey when not set", () => {
    // Arrange
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    // Act
    const config = supabaseConfig();

    // Assert
    expect(config.anonKey).to.be.undefined;
  });

  it("should prioritize SUPABASE_URL over VITE_SUPABASE_URL", () => {
    // Arrange
    process.env.SUPABASE_URL = "https://priority.supabase.co";
    process.env.VITE_SUPABASE_URL = "https://vite.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    // Act
    const config = supabaseConfig();

    // Assert
    expect(config.url).to.equal("https://priority.supabase.co");
  });

  it("should have correct config key", () => {
    // Arrange & Act
    const config = supabaseConfig();

    // Assert
    expect(config).to.have.property("url");
    expect(config).to.have.property("serviceRoleKey");
    expect(config).to.have.property("anonKey");
  });
});

