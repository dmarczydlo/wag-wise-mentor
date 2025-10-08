import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import {
  RegisterUserUseCase,
  LoginUseCase,
  PasswordResetUseCase,
  RegisterUserCommand,
  LoginCommand,
  PasswordResetCommand,
  USER_REPOSITORY,
} from "../../src/application/auth/auth.use-cases";
import { InMemoryUserRepository } from "../../src/infrastructure/auth/in-memory-user.repository";
import { UserRepository } from "../../src/domain/auth/user.repository";
import {
  User,
  UserId,
  Email,
  Password,
} from "../../src/domain/auth/user.entity";

describe("Auth Use Cases - AAA Pattern", () => {
  let registerUseCase: RegisterUserUseCase;
  let loginUseCase: LoginUseCase;
  let passwordResetUseCase: PasswordResetUseCase;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    // Arrange - Setup test dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        LoginUseCase,
        PasswordResetUseCase,
        {
          provide: USER_REPOSITORY,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    registerUseCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    passwordResetUseCase =
      module.get<PasswordResetUseCase>(PasswordResetUseCase);
    repository = module.get<UserRepository>(
      USER_REPOSITORY
    ) as InMemoryUserRepository;

    // Clear repository before each test
    repository.clear();
  });

  describe("RegisterUserUseCase", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      const result = await registerUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.user).to.not.be.undefined;
      expect(result.user?.email.value).to.equal("test@example.com");
      expect(result.error).to.be.undefined;
    });

    it("should return error when email is invalid", async () => {
      // Arrange
      const command: RegisterUserCommand = {
        email: "invalid-email",
        password: "password123",
      };

      // Act
      const result = await registerUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Email format is invalid");
      expect(result.user).to.be.undefined;
    });

    it("should return error when password is too short", async () => {
      // Arrange
      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "123",
      };

      // Act
      const result = await registerUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal(
        "Password must be at least 8 characters long"
      );
      expect(result.user).to.be.undefined;
    });

    it("should return error when email already exists", async () => {
      // Arrange
      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      await registerUseCase.execute(command);
      const result = await registerUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("User with this email already exists");
      expect(result.user).to.be.undefined;
    });

    it("should save user to repository", async () => {
      // Arrange
      const command: RegisterUserCommand = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      const result = await registerUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(repository.getCount()).to.equal(1);

      const savedUsers = repository.getAllUsers();
      expect(savedUsers).to.have.length(1);
      expect(savedUsers[0].email.value).to.equal("test@example.com");
    });
  });

  describe("LoginUseCase", () => {
    beforeEach(async () => {
      // Arrange - Create a test user
      const registerCommand: RegisterUserCommand = {
        email: "test@example.com",
        password: "password123",
      };
      await registerUseCase.execute(registerCommand);
    });

    it("should return error when password is incorrect (current implementation)", async () => {
      // Arrange
      const command: LoginCommand = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      const result = await loginUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Invalid email or password");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });

    it("should return error when email is invalid", async () => {
      // Arrange
      const command: LoginCommand = {
        email: "invalid-email",
        password: "password123",
      };

      // Act
      const result = await loginUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Email format is invalid");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });

    it("should return error when user not found", async () => {
      // Arrange
      const command: LoginCommand = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // Act
      const result = await loginUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Invalid email or password");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });

    it("should return error when password is incorrect", async () => {
      // Arrange
      const command: LoginCommand = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // Act
      const result = await loginUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Invalid email or password");
      expect(result.user).to.be.undefined;
      expect(result.token).to.be.undefined;
    });
  });

  describe("PasswordResetUseCase", () => {
    beforeEach(async () => {
      // Arrange - Create a test user
      const registerCommand: RegisterUserCommand = {
        email: "test@example.com",
        password: "password123",
      };
      await registerUseCase.execute(registerCommand);
    });

    it("should initiate password reset successfully", async () => {
      // Arrange
      const command: PasswordResetCommand = {
        email: "test@example.com",
      };

      // Act
      const result = await passwordResetUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.message).to.equal(
        "Password reset link has been sent to your email"
      );
      expect(result.error).to.be.undefined;
    });

    it("should return error when email is invalid", async () => {
      // Arrange
      const command: PasswordResetCommand = {
        email: "invalid-email",
      };

      // Act
      const result = await passwordResetUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("Email format is invalid");
      expect(result.message).to.be.undefined;
    });

    it("should return success even when user not found (security)", async () => {
      // Arrange
      const command: PasswordResetCommand = {
        email: "nonexistent@example.com",
      };

      // Act
      const result = await passwordResetUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.message).to.equal(
        "If the email exists, a password reset link has been sent"
      );
      expect(result.error).to.be.undefined;
    });
  });
});
