import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { InMemoryTrainingRepository } from "../../src/infrastructure/training/in-memory-training.repository";
import { TrainingSession } from "../../src/domain/training/training-session.entity";

describe("InMemoryTrainingRepository - AAA Pattern", () => {
  let repository: InMemoryTrainingRepository;

  beforeEach(() => {
    // Arrange
    repository = new InMemoryTrainingRepository();
  });

  describe("save", () => {
    it("should save training session successfully", async () => {
      // Arrange
      const session = TrainingSession.create(
        "session-1",
        "puppy-1",
        "obedience",
        30,
        "Good progress",
        new Date()
      );

      // Act
      const result = await repository.save(session);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(session);
    });

    it("should update existing session when saving with same ID", async () => {
      // Arrange
      const sessionId = "session-1";
      const originalSession = TrainingSession.create(
        sessionId,
        "puppy-1",
        "obedience",
        30,
        "Original notes",
        new Date()
      );
      await repository.save(originalSession);

      const updatedSession = originalSession.updateNotes("Updated notes");

      // Act
      const result = await repository.save(updatedSession);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.deep.equal(updatedSession);
      expect(result.getValue().notes).to.equal("Updated notes");
      const foundResult = await repository.findById(sessionId);
      expect(foundResult.isSuccess()).to.be.true;
      expect(foundResult.getValue().notes).to.equal("Updated notes");
    });
  });

  describe("findById", () => {
    it("should return training session when found", async () => {
      // Arrange
      const session = TrainingSession.create(
        "session-1",
        "puppy-1",
        "obedience",
        30,
        "Good progress",
        new Date()
      );
      await repository.save(session);

      // Act
      const result = await repository.findById("session-1");

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.not.be.null;
      expect(result.getValue()!.id).to.equal("session-1");
    });

    it("should return null when session not found", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act
      const result = await repository.findById(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      expect(result.getValue()).to.be.null;
    });
  });

  describe("findByPuppyId", () => {
    it("should return all training sessions for a puppy", async () => {
      // Arrange
      const puppyId = "puppy-1";
      const session1 = TrainingSession.create(
        "session-1",
        puppyId,
        "obedience",
        30,
        "Session 1",
        new Date()
      );
      const session2 = TrainingSession.create(
        "session-2",
        puppyId,
        "agility",
        45,
        "Session 2",
        new Date()
      );
      await repository.save(session1);
      await repository.save(session2);

      // Act
      const result = await repository.findByPuppyId(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const sessions = result.getValue();
      expect(sessions).to.have.length(2);
      expect(sessions).to.deep.include(session1);
      expect(sessions).to.deep.include(session2);
    });

    it("should return empty array when puppy has no sessions", async () => {
      // Arrange
      const puppyId = "puppy-with-no-sessions";

      // Act
      const result = await repository.findByPuppyId(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const sessions = result.getValue();
      expect(sessions).to.be.an("array").that.is.empty;
    });

    it("should only return sessions for specified puppy", async () => {
      // Arrange
      const puppy1 = "puppy-1";
      const puppy2 = "puppy-2";
      const session1 = TrainingSession.create(
        "session-1",
        puppy1,
        "obedience",
        30,
        "Session 1",
        new Date()
      );
      const session2 = TrainingSession.create(
        "session-2",
        puppy2,
        "agility",
        45,
        "Session 2",
        new Date()
      );
      await repository.save(session1);
      await repository.save(session2);

      // Act
      const result = await repository.findByPuppyId(puppy1);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const sessions = result.getValue();
      expect(sessions).to.have.length(1);
      expect(sessions[0]).to.deep.equal(session1);
    });
  });

  describe("delete", () => {
    it("should delete existing training session", async () => {
      // Arrange
      const session = TrainingSession.create(
        "session-1",
        "puppy-1",
        "obedience",
        30,
        "Session to delete",
        new Date()
      );
      await repository.save(session);

      // Act
      const result = await repository.delete("session-1");

      // Assert
      expect(result.isSuccess()).to.be.true;
      const foundResult = await repository.findById("session-1");
      expect(foundResult.isSuccess()).to.be.true;
      expect(foundResult.getValue()).to.be.null;
    });

    it("should handle deletion of non-existent session gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act
      const result = await repository.delete(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
    });
  });
});
