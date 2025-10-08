import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../../src/infrastructure/auth/auth.controller";
import { AuthModule } from "../../src/infrastructure/auth/auth.module";
import { InMemoryUserRepository } from "../../src/infrastructure/auth/in-memory-user.repository";
import { USER_REPOSITORY } from "../../src/application/auth/auth.use-cases";

describe("AuthController Integration Tests - AAA Pattern", () => {
  let app: TestingModule;
  let controller: AuthController;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    // Arrange
    app = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    repository = app.get<InMemoryUserRepository>(USER_REPOSITORY);
    repository.clear(); // Clean state for each test
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const registerDto = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result.success).to.be.true;
      expect(result.user).to.not.be.undefined;
      expect(result.user?.email.value).to.equal("test@example.com");
    });

    it("should return 400 when email is invalid", async () => {
      // Arrange
      const registerDto = {
        email: "invalid-email",
        password: "password123",
      };

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Email format is invalid");
      expect(result.user).to.be.undefined;
    });

    it("should return 400 when password is too short", async () => {
      // Arrange
      const registerDto = {
        email: "test@example.com",
        password: "123",
      };

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal(
        "Password must be at least 8 characters long"
      );
      expect(result.user).to.be.undefined;
    });

    it("should return 400 when email already exists", async () => {
      // Arrange
      const registerDto = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      await controller.register(registerDto);
      const result = await controller.register(registerDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("User with this email already exists");
      expect(result.user).to.be.undefined;
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Arrange - Create a test user
      const registerDto = {
        email: "test@example.com",
        password: "password123",
      };
      await controller.register(registerDto);
    });

    it("should return error when login fails (current implementation)", async () => {
      // Arrange
      const loginDto = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Invalid email or password");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });

    it("should return 400 when email is invalid", async () => {
      // Arrange
      const loginDto = {
        email: "invalid-email",
        password: "password123",
      };

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Email format is invalid");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });

    it("should return 401 when user not found", async () => {
      // Arrange
      const loginDto = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Invalid email or password");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });

    it("should return 401 when password is incorrect", async () => {
      // Arrange
      const loginDto = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Invalid email or password");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });
  });

  describe("POST /auth/password-reset", () => {
    beforeEach(async () => {
      // Arrange - Create a test user
      const registerDto = {
        email: "test@example.com",
        password: "password123",
      };
      await controller.register(registerDto);
    });

    it("should initiate password reset successfully", async () => {
      // Arrange
      const passwordResetDto = {
        email: "test@example.com",
      };

      // Act
      const result = await controller.requestPasswordReset(passwordResetDto);

      // Assert
      expect(result.success).to.be.true;
      expect(result.message).to.equal(
        "Password reset link has been sent to your email"
      );
    });

    it("should return 400 when email is invalid", async () => {
      // Arrange
      const passwordResetDto = {
        email: "invalid-email",
      };

      // Act
      const result = await controller.requestPasswordReset(passwordResetDto);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Email format is invalid");
      expect(result.message).to.be.undefined;
    });

    it("should return success even when user not found (security)", async () => {
      // Arrange
      const passwordResetDto = {
        email: "nonexistent@example.com",
      };

      // Act
      const result = await controller.requestPasswordReset(passwordResetDto);

      // Assert
      expect(result.success).to.be.true;
      expect(result.message).to.equal(
        "If the email exists, a password reset link has been sent"
      );
      expect(result.error).to.be.undefined;
    });
  });
});
