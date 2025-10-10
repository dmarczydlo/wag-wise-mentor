import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import {
  GetUserUseCase,
  CreateUserProfileUseCase,
  UpdateUserProfileUseCase,
  DeleteUserProfileUseCase,
  GetUserCommand,
  CreateUserProfileCommand,
  UpdateUserProfileCommand,
  DeleteUserProfileCommand,
  USER_REPOSITORY,
} from "../../src/application/auth/auth.use-cases";
import { InMemoryUserRepository } from "../../src/infrastructure/auth/in-memory-user.repository";
import { UserRepository } from "../../src/domain/auth/user.repository";
import {
  User,
  UserId,
  Email,
  UserRole,
  UserRoleType,
} from "../../src/domain/auth/user.entity";

describe("Auth Use Cases - AAA Pattern", () => {
  let getUserUseCase: GetUserUseCase;
  let createUserProfileUseCase: CreateUserProfileUseCase;
  let updateUserProfileUseCase: UpdateUserProfileUseCase;
  let deleteUserProfileUseCase: DeleteUserProfileUseCase;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        CreateUserProfileUseCase,
        UpdateUserProfileUseCase,
        DeleteUserProfileUseCase,
        {
          provide: USER_REPOSITORY,
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    getUserUseCase = module.get<GetUserUseCase>(GetUserUseCase);
    createUserProfileUseCase = module.get<CreateUserProfileUseCase>(
      CreateUserProfileUseCase
    );
    updateUserProfileUseCase = module.get<UpdateUserProfileUseCase>(
      UpdateUserProfileUseCase
    );
    deleteUserProfileUseCase = module.get<DeleteUserProfileUseCase>(
      DeleteUserProfileUseCase
    );
    repository = module.get<UserRepository>(
      USER_REPOSITORY
    ) as InMemoryUserRepository;

    repository.clear();
  });

  describe("GetUserUseCase", () => {
    it("should get user by ID successfully", async () => {
      // Arrange
      const userId = new UserId("test-user-id");
      const email = new Email("test@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user);

      const command: GetUserCommand = {
        userId: "test-user-id",
      };

      // Act
      const result = await getUserUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.user).to.not.be.undefined;
      expect(result.user?.id.value).to.equal("test-user-id");
      expect(result.user?.email.value).to.equal("test@example.com");
    });

    it("should return error when user not found", async () => {
      // Arrange
      const command: GetUserCommand = {
        userId: "non-existent-user",
      };

      // Act
      const result = await getUserUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("User not found");
    });
  });

  describe("CreateUserProfileUseCase", () => {
    it("should create user profile successfully", async () => {
      // Arrange
      const command: CreateUserProfileCommand = {
        userId: "supabase-user-id",
        email: "newuser@example.com",
        role: UserRoleType.USER,
      };

      // Act
      const result = await createUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.user).to.not.be.undefined;
      expect(result.user?.id.value).to.equal("supabase-user-id");
      expect(result.user?.email.value).to.equal("newuser@example.com");
      expect(result.user?.role.value).to.equal(UserRoleType.USER);
    });

    it("should return error when profile already exists", async () => {
      // Arrange
      const userId = new UserId("existing-user");
      const email = new Email("existing@example.com");
      const role = new UserRole(UserRoleType.USER);
      const existingUser = User.create(userId, email, role);
      await repository.save(existingUser);

      const command: CreateUserProfileCommand = {
        userId: "existing-user",
        email: "existing@example.com",
      };

      // Act
      const result = await createUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("User profile already exists");
    });

    it("should create profile with default USER role when not specified", async () => {
      // Arrange
      const command: CreateUserProfileCommand = {
        userId: "new-user",
        email: "user@example.com",
      };

      // Act
      const result = await createUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.user?.role.value).to.equal(UserRoleType.USER);
    });

    it("should return error when email is invalid", async () => {
      // Arrange
      const command: CreateUserProfileCommand = {
        userId: "user-id",
        email: "invalid-email",
      };

      // Act
      const result = await createUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.include("Email");
    });
  });

  describe("UpdateUserProfileUseCase", () => {
    it("should update user role successfully", async () => {
      // Arrange
      const userId = new UserId("user-to-update");
      const email = new Email("user@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user);

      const command: UpdateUserProfileCommand = {
        userId: "user-to-update",
        role: UserRoleType.ADMIN,
      };

      // Act
      const result = await updateUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.user?.role.value).to.equal(UserRoleType.ADMIN);
    });

    it("should update user active status successfully", async () => {
      // Arrange
      const userId = new UserId("user-to-deactivate");
      const email = new Email("user@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user);

      const command: UpdateUserProfileCommand = {
        userId: "user-to-deactivate",
        isActive: false,
      };

      // Act
      const result = await updateUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.user?.isActive).to.be.false;
    });

    it("should return error when user not found", async () => {
      // Arrange
      const command: UpdateUserProfileCommand = {
        userId: "non-existent-user",
        role: UserRoleType.ADMIN,
      };

      // Act
      const result = await updateUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("User not found");
    });
  });

  describe("DeleteUserProfileUseCase", () => {
    it("should delete user profile successfully", async () => {
      // Arrange
      const userId = new UserId("user-to-delete");
      const email = new Email("delete@example.com");
      const role = new UserRole(UserRoleType.USER);
      const user = User.create(userId, email, role);
      await repository.save(user);

      const command: DeleteUserProfileCommand = {
        userId: "user-to-delete",
      };

      // Act
      const result = await deleteUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.message).to.equal("User profile deleted successfully");

      const deletedUser = await repository.findById(
        new UserId("user-to-delete")
      );
      expect(deletedUser).to.be.null;
    });

    it("should return error when user not found", async () => {
      // Arrange
      const command: DeleteUserProfileCommand = {
        userId: "non-existent-user",
      };

      // Act
      const result = await deleteUserProfileUseCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.error).to.equal("User not found");
    });
  });
});
