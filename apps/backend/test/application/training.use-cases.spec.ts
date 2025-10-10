import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { TrainingUseCases } from "../../src/application/training/training.use-cases";
import { InMemoryTrainingRepository } from "../../src/infrastructure/training/in-memory-training.repository";
import { NotFoundException } from "@nestjs/common";

describe("Training Use Cases - AAA Pattern", () => {
  let useCases: TrainingUseCases;
  let repository: InMemoryTrainingRepository;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingUseCases,
        {
          provide: "TrainingRepository",
          useClass: InMemoryTrainingRepository,
        },
      ],
    }).compile();

    useCases = module.get<TrainingUseCases>(TrainingUseCases);
    repository = module.get<InMemoryTrainingRepository>("TrainingRepository");
  });

  describe("createTrainingSession", () => {
    it("should create a new training session successfully", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const sessionType = "obedience";
      const duration = 30;
      const notes = "Good progress on sit command";

      // Act
      const result = await useCases.createTrainingSession(
        puppyId,
        sessionType,
        duration,
        notes
      );

      // Assert
      expect(result).to.not.be.null;
      expect(result.puppyId).to.equal(puppyId);
      expect(result.sessionType).to.equal(sessionType);
      expect(result.duration).to.equal(duration);
      expect(result.notes).to.equal(notes);
    });

    it("should save training session to repository", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const sessionType = "obedience";
      const duration = 30;
      const notes = "Good progress";

      // Act
      await useCases.createTrainingSession(
        puppyId,
        sessionType,
        duration,
        notes
      );

      // Assert
      const sessions = await repository.findByPuppyId(puppyId);
      expect(sessions).to.have.length(1);
      expect(sessions[0].puppyId).to.equal(puppyId);
    });
  });

  describe("getTrainingSession", () => {
    it("should return training session when found", async () => {
      // Arrange
      const session = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Good progress"
      );

      // Act
      const result = await useCases.getTrainingSession(session.id);

      // Assert
      expect(result).to.not.be.null;
      expect(result.id).to.equal(session.id);
      expect(result.puppyId).to.equal("puppy-123");
    });

    it("should throw NotFoundException when session not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act & Assert
      try {
        await useCases.getTrainingSession(nonExistentId);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
        expect(error.message).to.include(nonExistentId);
      }
    });
  });

  describe("getPuppyTrainingSessions", () => {
    it("should return all training sessions for a puppy", async () => {
      // Arrange
      const puppyId = "puppy-123";
      await useCases.createTrainingSession(
        puppyId,
        "obedience",
        30,
        "Session 1"
      );
      await useCases.createTrainingSession(puppyId, "agility", 45, "Session 2");

      // Act
      const result = await useCases.getPuppyTrainingSessions(puppyId);

      // Assert
      expect(result).to.have.length(2);
      expect(result[0].puppyId).to.equal(puppyId);
      expect(result[1].puppyId).to.equal(puppyId);
    });

    it("should return empty array when puppy has no sessions", async () => {
      // Arrange
      const puppyId = "puppy-with-no-sessions";

      // Act
      const result = await useCases.getPuppyTrainingSessions(puppyId);

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });

    it("should only return sessions for specified puppy", async () => {
      // Arrange
      const puppy1 = "puppy-1";
      const puppy2 = "puppy-2";
      await useCases.createTrainingSession(
        puppy1,
        "obedience",
        30,
        "Puppy 1 session"
      );
      await useCases.createTrainingSession(
        puppy2,
        "agility",
        45,
        "Puppy 2 session"
      );

      // Act
      const result = await useCases.getPuppyTrainingSessions(puppy1);

      // Assert
      expect(result).to.have.length(1);
      expect(result[0].puppyId).to.equal(puppy1);
    });
  });

  describe("updateTrainingNotes", () => {
    it("should update training session notes successfully", async () => {
      // Arrange
      const session = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Original notes"
      );
      const newNotes = "Updated notes with more detail";

      // Act
      const result = await useCases.updateTrainingNotes(session.id, newNotes);

      // Assert
      expect(result.notes).to.equal(newNotes);
      expect(result.id).to.equal(session.id);
      expect(result.puppyId).to.equal(session.puppyId);
    });

    it("should throw NotFoundException when updating non-existent session", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const newNotes = "New notes";

      // Act & Assert
      try {
        await useCases.updateTrainingNotes(nonExistentId, newNotes);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
      }
    });
  });

  describe("deleteTrainingSession", () => {
    it("should delete training session successfully", async () => {
      // Arrange
      const session = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Session to delete"
      );

      // Act
      await useCases.deleteTrainingSession(session.id);

      // Assert
      try {
        await useCases.getTrainingSession(session.id);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
      }
    });

    it("should handle deletion of non-existent session gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act & Assert
      await useCases.deleteTrainingSession(nonExistentId);
    });
  });
});
