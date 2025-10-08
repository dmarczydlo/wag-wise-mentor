import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { InMemoryUserRepository } from "../../src/infrastructure/auth/in-memory-user.repository";
import {
  User,
  UserId,
  Email,
  Password,
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
      const user = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );

      // Act
      const result = await repository.save(user);

      // Assert
      expect(result).to.deep.equal(user);
      expect(repository.getCount()).to.equal(1);
    });

    it("should update existing user when saving with same ID", async () => {
      // Arrange
      const user = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      await repository.save(user);

      const updatedUser = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );

      // Act
      const result = await repository.save(updatedUser);

      // Assert
      expect(result).to.deep.equal(updatedUser);
      expect(repository.getCount()).to.equal(1);
      expect(result.email.value).to.equal("test@example.com");
    });
  });

  describe("findById", () => {
    it("should return user when found", async () => {
      // Arrange
      const user = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      await repository.save(user);

      // Act
      const result = await repository.findById(new UserId("user-1"));

      // Assert
      expect(result).to.deep.equal(user);
    });

    it("should return null when user not found", async () => {
      // Arrange
      const nonExistentId = new UserId("non-existent");

      // Act
      const result = await repository.findById(nonExistentId);

      // Assert
      expect(result).to.be.null;
    });
  });

  describe("findByEmail", () => {
    it("should return user when found by email", async () => {
      // Arrange
      const user = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      await repository.save(user);

      // Act
      const result = await repository.findByEmail("test@example.com");

      // Assert
      expect(result).to.deep.equal(user);
    });

    it("should return null when user not found by email", async () => {
      // Arrange
      const nonExistentEmail = "nonexistent@example.com";

      // Act
      const result = await repository.findByEmail(nonExistentEmail);

      // Assert
      expect(result).to.be.null;
    });

    it("should return correct user when multiple users exist", async () => {
      // Arrange
      const user1 = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2 = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      await repository.save(user1);
      await repository.save(user2);

      // Act
      const result = await repository.findByEmail("test2@example.com");

      // Assert
      expect(result).to.deep.equal(user2);
    });
  });

  describe("update", () => {
    it("should update existing user", async () => {
      // Arrange
      const user = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      await repository.save(user);

      const updatedUser = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );

      // Act
      const result = await repository.update(updatedUser);

      // Assert
      expect(result).to.deep.equal(updatedUser);
      expect(result.email.value).to.equal("test@example.com");
    });
  });

  describe("delete", () => {
    it("should delete existing user", async () => {
      // Arrange
      const user = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      await repository.save(user);

      // Act
      await repository.delete(new UserId("user-1"));

      // Assert
      expect(repository.getCount()).to.equal(0);
      const result = await repository.findById(new UserId("user-1"));
      expect(result).to.be.null;
    });

    it("should handle deletion of non-existent user gracefully", async () => {
      // Arrange
      const nonExistentId = new UserId("non-existent");

      // Act & Assert
      await repository.delete(nonExistentId);
      expect(true).to.be.true; // If we get here, no error was thrown
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      // Arrange
      const user1 = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2 = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      await repository.save(user1);
      await repository.save(user2);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).to.have.length(2);
      expect(result).to.deep.include(user1);
      expect(result).to.deep.include(user2);
    });

    it("should return empty array when no users exist", async () => {
      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });
  });

  describe("test helper methods", () => {
    it("should clear all users", () => {
      // Arrange
      const user = User.create(
        new UserId("user-1"),
        new Email("test@example.com")
      );
      repository.save(user);

      // Act
      repository.clear();

      // Assert
      expect(repository.getCount()).to.equal(0);
    });

    it("should return correct count", () => {
      // Arrange
      const user1 = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2 = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      repository.save(user1);
      repository.save(user2);

      // Act
      const count = repository.getCount();

      // Assert
      expect(count).to.equal(2);
    });

    it("should return all users via getAllUsers", () => {
      // Arrange
      const user1 = User.create(
        new UserId("user-1"),
        new Email("test1@example.com")
      );
      const user2 = User.create(
        new UserId("user-2"),
        new Email("test2@example.com")
      );
      repository.save(user1);
      repository.save(user2);

      // Act
      const users = repository.getAllUsers();

      // Assert
      expect(users).to.have.length(2);
      expect(users).to.deep.include(user1);
      expect(users).to.deep.include(user2);
    });
  });
});
