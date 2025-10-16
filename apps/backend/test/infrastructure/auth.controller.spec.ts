import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, type TestingModule } from "@nestjs/testing";
import { AuthController } from "../../src/infrastructure/auth/auth.controller";
import {
  GetUserUseCase,
  CreateUserProfileUseCase,
  UpdateUserProfileUseCase,
  DeleteUserProfileUseCase,
  USER_REPOSITORY,
} from "../../src/application/auth/auth.use-cases";
import { InMemoryUserRepository } from "../../src/infrastructure/auth/in-memory-user.repository";
import type { UserRepository } from "../../src/domain/auth/user.repository";
import {
  User,
  UserId,
  Email,
  UserRole,
  UserRoleType,
} from "../../src/domain/auth/user.entity";
import { SupabaseService } from "../../src/infrastructure/config/supabase.service";

class MockSupabaseService {
  getClient() {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    };
  }
}

describe("AuthController Integration Tests - AAA Pattern", () => {
  let controller: AuthController;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        GetUserUseCase,
        CreateUserProfileUseCase,
        UpdateUserProfileUseCase,
        DeleteUserProfileUseCase,
        {
          provide: USER_REPOSITORY,
          useClass: InMemoryUserRepository,
        },
        {
          provide: SupabaseService,
          useClass: MockSupabaseService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    repository = module.get<UserRepository>(
      USER_REPOSITORY
    ) as InMemoryUserRepository;

    repository.clear();
  });

  describe("GET /users/me", () => {
    it("should return current user profile", async () => {
      // Arrange
      const userId = new UserId("current-user");
      const email = new Email("current@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user.getValue());

      const mockRequest = {
        user: { id: "current-user", email: "current@example.com" },
      };

      // Act
      const result = await controller.getCurrentUser(mockRequest);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue().id.value).to.equal("current-user");
    });
  });

  describe("GET /users/:id", () => {
    it("should return user profile by ID", async () => {
      // Arrange
      const userId = new UserId("test-user");
      const email = new Email("test@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user.getValue());

      // Act
      const result = await controller.getUserById("test-user");

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue().id.value).to.equal("test-user");
    });

    it("should return error when user not found", async () => {
      // Arrange
      const userId = "non-existent-user";

      // Act
      const result = await controller.getUserById(userId);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal(
        "User with id non-existent-user not found"
      );
    });
  });

  describe("POST /users/profile", () => {
    it("should create user profile successfully", async () => {
      // Arrange
      const mockRequest = {
        user: { id: "new-user-id", email: "new@example.com" },
      };
      const command = {
        role: UserRoleType.USER,
      };

      // Act
      const result = await controller.createUserProfile(mockRequest, command);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue().id.value).to.equal("new-user-id");
      expect(result.getValue().email.value).to.equal("new@example.com");
    });

    it("should return error when profile already exists", async () => {
      // Arrange
      const userId = new UserId("existing-user");
      const email = new Email("existing@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user.getValue());

      const mockRequest = {
        user: { id: "existing-user", email: "existing@example.com" },
      };
      const command = {
        role: UserRoleType.USER,
      };

      // Act
      const result = await controller.createUserProfile(mockRequest, command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal("User profile already exists");
    });
  });

  describe("PUT /users/:id", () => {
    it("should update user profile successfully", async () => {
      // Arrange
      const userId = new UserId("user-to-update");
      const email = new Email("update@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user.getValue());

      const command = {
        role: UserRoleType.ADMIN,
      };

      // Act
      const result = await controller.updateUserProfile(
        "user-to-update",
        command
      );

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue().role.value).to.equal(UserRoleType.ADMIN);
    });

    it("should return error when user not found", async () => {
      // Arrange
      const command = {
        role: UserRoleType.ADMIN,
      };

      // Act
      const result = await controller.updateUserProfile(
        "non-existent-user",
        command
      );

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal(
        "User with id non-existent-user not found"
      );
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete user profile successfully", async () => {
      // Arrange
      const userId = new UserId("user-to-delete");
      const email = new Email("delete@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user.getValue());

      // Act
      const result = await controller.deleteUserProfile("user-to-delete");

      // Assert
      expect(result.isSuccess()).to.be.true;
    });

    it("should return error when user not found", async () => {
      // Arrange
      const userId = "non-existent-user";

      // Act
      const result = await controller.deleteUserProfile(userId);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal(
        "User with id non-existent-user not found"
      );
    });
  });
});
