import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { InMemoryUserRepository } from "../../src/infrastructure/auth/in-memory-user.repository";
import {
  User,
  UserId,
  Email,
  Password as _Password,
} from "../../src/domain/auth/user.entity";

describe("InMemoryUserRepository - AAA Pattern", () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    // Arrange - Setup test dependencies
    repository = new InMemoryUserRepository();
    repository.clear(); // Clean state for each test
  });

  describe("save", () => {
    it("should save user successfully", async () => {
      // Arrange
      const userResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(userResult.isSuccess()).to.be.true;
      const user = userResult.getValue();

      // Act
      const result = await repository.save(user);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(user);
      expect(repository.getCount()).to.equal(1);
    });

    it("should update existing user when saving with same ID", async () => {
      // Arrange
      const userResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(userResult.isSuccess()).to.be.true;
      const user = userResult.getValue();
      await repository.save(user);

      const updatedUserResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(updatedUserResult.isSuccess()).to.be.true;
      const updatedUser = updatedUserResult.getValue();

      // Act
      const result = await repository.save(updatedUser);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(updatedUser);
      expect(repository.getCount()).to.equal(1);
      expect(result.getValue().email.value).to.equal("test@example.com");
    });
  });

  describe("findById", () => {
    it("should return user when found", async () => {
      // Arrange
      const userResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(userResult.isSuccess()).to.be.true;
      const user = userResult.getValue();
      await repository.save(user);

      // Act
      const result = await repository.findById(new UserId("user-1"));

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(user);
    });

    it("should return null when user not found", async () => {
      // Arrange
      const nonExistentId = new UserId("non-existent");

      // Act
      const result = await repository.findById(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.null;
    });
  });

  describe("findByEmail", () => {
    it("should return user when found by email", async () => {
      // Arrange
      const userResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(userResult.isSuccess()).to.be.true;
      const user = userResult.getValue();
      await repository.save(user);

      // Act
      const result = await repository.findByEmail("test@example.com");

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(user);
    });

    it("should return null when user not found by email", async () => {
      // Arrange
      const nonExistentEmail = "nonexistent@example.com";

      // Act
      const result = await repository.findByEmail(nonExistentEmail);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.null;
    });

    it("should return correct user when multiple users exist", async () => {
      // Arrange
      const user1Result = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2Result = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      expect(user1Result.isSuccess()).to.be.true;
      expect(user2Result.isSuccess()).to.be.true;
      const user1 = user1Result.getValue();
      const user2 = user2Result.getValue();
      await repository.save(user1);
      await repository.save(user2);

      // Act
      const result = await repository.findByEmail("test2@example.com");

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(user2);
    });
  });

  describe("update", () => {
    it("should update existing user", async () => {
      // Arrange
      const userResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(userResult.isSuccess()).to.be.true;
      const user = userResult.getValue();
      await repository.save(user);

      const updatedUserResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(updatedUserResult.isSuccess()).to.be.true;
      const updatedUser = updatedUserResult.getValue();

      // Act
      const result = await repository.update(updatedUser);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(updatedUser);
      expect(result.getValue().email.value).to.equal("test@example.com");
    });
  });

  describe("delete", () => {
    it("should delete existing user", async () => {
      // Arrange
      const userResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(userResult.isSuccess()).to.be.true;
      const user = userResult.getValue();
      await repository.save(user);

      // Act
      const result = await repository.delete(new UserId("user-1"));

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(repository.getCount()).to.equal(0);
      const foundResult = await repository.findById(new UserId("user-1"));
      expect(foundResult.isSuccess()).to.be.true;
      expect(foundResult.getValue()).to.be.null;
    });

    it("should handle deletion of non-existent user gracefully", async () => {
      // Arrange
      const nonExistentId = new UserId("non-existent");

      // Act
      const result = await repository.delete(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      // Arrange
      const user1Result = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2Result = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      expect(user1Result.isSuccess()).to.be.true;
      expect(user2Result.isSuccess()).to.be.true;
      const user1 = user1Result.getValue();
      const user2 = user2Result.getValue();
      await repository.save(user1);
      await repository.save(user2);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result.isSuccess()).to.be.true;
      const users = result.getValue();
      expect(users).to.have.length(2);
      expect(users).to.deep.include(user1);
      expect(users).to.deep.include(user2);
    });

    it("should return empty array when no users exist", async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.an("array").that.is.empty;
    });
  });

  describe("test helper methods", () => {
    it("should clear all users", async () => {
      // Arrange
      const userResult = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      expect(userResult.isSuccess()).to.be.true;
      const user = userResult.getValue();
      await repository.save(user);

      // Act
      repository.clear();

      // Assert
      expect(repository.getCount()).to.equal(0);
    });

    it("should return correct count", async () => {
      // Arrange
      const user1Result = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2Result = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      expect(user1Result.isSuccess()).to.be.true;
      expect(user2Result.isSuccess()).to.be.true;
      const user1 = user1Result.getValue();
      const user2 = user2Result.getValue();
      await repository.save(user1);
      await repository.save(user2);

      // Act
      const count = repository.getCount();

      // Assert
      expect(count).to.equal(2);
    });

    it("should return all users via getAllUsers", async () => {
      // Arrange
      const user1Result = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2Result = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      expect(user1Result.isSuccess()).to.be.true;
      expect(user2Result.isSuccess()).to.be.true;
      const user1 = user1Result.getValue();
      const user2 = user2Result.getValue();
      await repository.save(user1);
      await repository.save(user2);

      // Act
      const users = repository.getAllUsers();

      // Assert
      expect(users).to.have.length(2);
      expect(users).to.deep.include(user1);
      expect(users).to.deep.include(user2);
    });
  });
});
