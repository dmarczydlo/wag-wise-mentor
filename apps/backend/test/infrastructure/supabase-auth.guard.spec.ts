import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { UnauthorizedException } from "@nestjs/common";
import { SupabaseAuthGuard } from "../../src/infrastructure/auth/supabase-auth.guard";
import { SupabaseService } from "../../src/infrastructure/config/supabase.service";

class MockSupabaseService {
  private mockGetUser: any;

  constructor(mockGetUser?: any) {
    this.mockGetUser = mockGetUser;
  }

  getClient() {
    return {
      auth: {
        getUser: this.mockGetUser || (async () => ({ data: { user: null }, error: null })),
      },
    };
  }
}

describe("SupabaseAuthGuard - AAA Pattern", () => {
  let guard: SupabaseAuthGuard;
  let mockSupabaseService: MockSupabaseService;
  let mockExecutionContext: any;

  beforeEach(() => {
    // Arrange
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };
  });

  describe("Valid Authentication", () => {
    it("should allow access with valid token", async () => {
      // Arrange
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
      };
      
      mockSupabaseService = new MockSupabaseService(async (token: string) => ({
        data: { user: mockUser },
        error: null,
      }));
      
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer valid-token-123",
          },
        }),
      });

      // Act
      const result = await guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).to.be.true;
    });

    it("should attach user to request object", async () => {
      // Arrange
      const mockUser = {
        id: "user-456",
        email: "john@example.com",
      };
      
      mockSupabaseService = new MockSupabaseService(async (token: string) => ({
        data: { user: mockUser },
        error: null,
      }));
      
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      const mockRequest = {
        headers: {
          authorization: "Bearer valid-token",
        },
      };
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => mockRequest,
      });

      // Act
      await guard.canActivate(mockExecutionContext);

      // Assert
      expect(mockRequest).to.have.property("user");
      expect((mockRequest as any).user).to.deep.equal(mockUser);
    });
  });

  describe("Missing Authorization Header", () => {
    it("should throw UnauthorizedException when no authorization header", async () => {
      // Arrange
      mockSupabaseService = new MockSupabaseService();
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {},
        }),
      });

      // Act & Assert
      try {
        await guard.canActivate(mockExecutionContext);
        expect.fail("Should have thrown UnauthorizedException");
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedException);
        expect((error as UnauthorizedException).message).to.equal(
          "No authentication token provided"
        );
      }
    });

    it("should throw UnauthorizedException when authorization header is empty", async () => {
      // Arrange
      mockSupabaseService = new MockSupabaseService();
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: "",
          },
        }),
      });

      // Act & Assert
      try {
        await guard.canActivate(mockExecutionContext);
        expect.fail("Should have thrown UnauthorizedException");
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedException);
      }
    });
  });

  describe("Invalid Token Format", () => {
    it("should throw UnauthorizedException when authorization header doesn't start with Bearer", async () => {
      // Arrange
      mockSupabaseService = new MockSupabaseService();
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: "Basic some-token",
          },
        }),
      });

      // Act & Assert
      try {
        await guard.canActivate(mockExecutionContext);
        expect.fail("Should have thrown UnauthorizedException");
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedException);
        expect((error as UnauthorizedException).message).to.equal(
          "No authentication token provided"
        );
      }
    });

    it("should throw UnauthorizedException with just 'Bearer' and no token", async () => {
      // Arrange
      mockSupabaseService = new MockSupabaseService();
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer ",
          },
        }),
      });

      // Act & Assert
      try {
        await guard.canActivate(mockExecutionContext);
        expect.fail("Should have thrown UnauthorizedException");
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedException);
        expect((error as UnauthorizedException).message).to.equal(
          "Invalid authentication token"
        );
      }
    });
  });

  describe("Invalid Token", () => {
    it("should throw UnauthorizedException when Supabase returns error", async () => {
      // Arrange
      mockSupabaseService = new MockSupabaseService(async (token: string) => ({
        data: { user: null },
        error: { message: "Invalid JWT" },
      }));
      
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer invalid-token",
          },
        }),
      });

      // Act & Assert
      try {
        await guard.canActivate(mockExecutionContext);
        expect.fail("Should have thrown UnauthorizedException");
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedException);
        expect((error as UnauthorizedException).message).to.equal(
          "Invalid authentication token"
        );
      }
    });

    it("should throw UnauthorizedException when user is null", async () => {
      // Arrange
      mockSupabaseService = new MockSupabaseService(async (token: string) => ({
        data: { user: null },
        error: null,
      }));
      
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer expired-token",
          },
        }),
      });

      // Act & Assert
      try {
        await guard.canActivate(mockExecutionContext);
        expect.fail("Should have thrown UnauthorizedException");
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedException);
      }
    });

    it("should throw UnauthorizedException when Supabase throws exception", async () => {
      // Arrange
      mockSupabaseService = new MockSupabaseService(async (token: string) => {
        throw new Error("Network error");
      });
      
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: "Bearer some-token",
          },
        }),
      });

      // Act & Assert
      try {
        await guard.canActivate(mockExecutionContext);
        expect.fail("Should have thrown UnauthorizedException");
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedException);
        expect((error as UnauthorizedException).message).to.equal(
          "Invalid authentication token"
        );
      }
    });
  });

  describe("Token Extraction", () => {
    it("should extract token correctly from Bearer header", async () => {
      // Arrange
      let extractedToken: string = "";
      
      mockSupabaseService = new MockSupabaseService(async (token: string) => {
        extractedToken = token;
        return {
          data: {
            user: { id: "123", email: "test@example.com" },
          },
          error: null,
        };
      });
      
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: `Bearer ${testToken}`,
          },
        }),
      });

      // Act
      await guard.canActivate(mockExecutionContext);

      // Assert
      expect(extractedToken).to.equal(testToken);
    });

    it("should handle Bearer token with extra spaces", async () => {
      // Arrange
      let extractedToken: string = "";
      
      mockSupabaseService = new MockSupabaseService(async (token: string) => {
        extractedToken = token;
        return {
          data: {
            user: { id: "123", email: "test@example.com" },
          },
          error: null,
        };
      });
      
      guard = new SupabaseAuthGuard(mockSupabaseService as any);
      
      const testToken = "token-with-spaces";
      
      mockExecutionContext.switchToHttp = () => ({
        getRequest: () => ({
          headers: {
            authorization: `Bearer  ${testToken}`, // Extra space
          },
        }),
      });

      // Act
      await guard.canActivate(mockExecutionContext);

      // Assert
      // Note: substring(7) extracts from position 7, so extra space will be included
      expect(extractedToken).to.equal(` ${testToken}`);
    });
  });
});

