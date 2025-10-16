import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, type TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { SupabaseService } from "../../src/infrastructure/config/supabase.service";
import supabaseConfig from "../../src/infrastructure/config/supabase.config";

describe("SupabaseService - AAA Pattern", () => {
  let service: SupabaseService;

  describe("with valid configuration", () => {
    beforeEach(async () => {
      // Arrange
      process.env.SUPABASE_URL = "https://test.supabase.co";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: [supabaseConfig],
          }),
        ],
        providers: [SupabaseService],
      }).compile();

      service = module.get<SupabaseService>(SupabaseService);
    });

    it("should be defined", () => {
      // Assert
      expect(service).to.not.be.undefined;
    });

    it("should return Supabase client", () => {
      // Act
      const client = service.getClient();

      // Assert
      expect(client).to.not.be.undefined;
      expect(client).to.have.property("auth");
      expect(client).to.have.property("from");
    });

    it("should throw error when query fails", async () => {
      // Arrange
      const failingQuery = async () => ({
        data: null,
        error: { message: "Query failed" },
      });

      // Act & Assert
      try {
        await service.executeQuery(failingQuery);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Supabase query failed");
        expect(error.message).to.include("Query failed");
      }
    });

    it("should throw error when query returns no data", async () => {
      // Arrange
      const noDataQuery = async () => ({
        data: null,
        error: null,
      });

      // Act & Assert
      try {
        await service.executeQuery(noDataQuery);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("No data returned from Supabase");
      }
    });

    it("should successfully execute query with data", async () => {
      // Arrange
      const testData = { id: "1", name: "Test" };
      const successQuery = async () => ({
        data: testData,
        error: null,
      });

      // Act
      const result = await service.executeQuery(successQuery);

      // Assert
      expect(result).to.deep.equal(testData);
    });

    it("should throw error when command fails", async () => {
      // Arrange
      const failingCommand = async () => ({
        error: { message: "Command failed" },
      });

      // Act & Assert
      try {
        await service.executeCommand(failingCommand);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Supabase command failed");
        expect(error.message).to.include("Command failed");
      }
    });

    it("should successfully execute command", async () => {
      // Arrange
      const successCommand = async () => ({
        error: null,
      });

      // Act & Assert
      await service.executeCommand(successCommand);
    });
  });

  describe("with missing configuration", () => {
    it("should throw error when SUPABASE_URL is missing", async () => {
      // Arrange
      delete process.env.SUPABASE_URL;
      delete process.env.VITE_SUPABASE_URL;
      process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

      // Act & Assert
      try {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              load: [supabaseConfig],
            }),
          ],
          providers: [SupabaseService],
        }).compile();

        module.get<SupabaseService>(SupabaseService);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Supabase URL is required");
      }
    });

    it("should throw error when SUPABASE_SERVICE_ROLE_KEY is missing", async () => {
      // Arrange
      process.env.SUPABASE_URL = "https://test.supabase.co";
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;

      // Act & Assert
      try {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              load: [supabaseConfig],
            }),
          ],
          providers: [SupabaseService],
        }).compile();

        module.get<SupabaseService>(SupabaseService);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include(
          "Supabase service role key is required"
        );
      }
    });
  });

  describe("configuration fallback", () => {
    it("should use VITE_SUPABASE_URL as fallback", async () => {
      // Arrange
      delete process.env.SUPABASE_URL;
      process.env.VITE_SUPABASE_URL = "https://vite-test.supabase.co";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

      // Act
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: [supabaseConfig],
          }),
        ],
        providers: [SupabaseService],
      }).compile();

      const testService = module.get<SupabaseService>(SupabaseService);

      // Assert
      expect(testService).to.not.be.undefined;
      expect(testService.getClient()).to.not.be.undefined;
    });
  });
});
