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
      expect(result.isSuccess()).to.be.true;
      const session = result.getValue();
      expect(session.puppyId).to.equal(puppyId);
      expect(session.sessionType).to.equal(sessionType);
      expect(session.duration).to.equal(duration);
      expect(session.notes).to.equal(notes);
    });

    it("should save training session to repository", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const sessionType = "obedience";
      const duration = 30;
      const notes = "Good progress";

      // Act
      const createResult = await useCases.createTrainingSession(
        puppyId,
        sessionType,
        duration,
        notes
      );
      expect(createResult.isSuccess()).to.be.true;

      // Assert
      const sessionsResult = await repository.findByPuppyId(puppyId);
      expect(sessionsResult.isSuccess()).to.be.true;
      const sessions = sessionsResult.getValue();
      expect(sessions).to.have.length(1);
      expect(sessions[0].puppyId).to.equal(puppyId);
    });
  });

  describe("getTrainingSession", () => {
    it("should return training session when found", async () => {
      // Arrange
      const createResult = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Good progress"
      );
      expect(createResult.isSuccess()).to.be.true;
      const session = createResult.getValue();

      // Act
      const result = await useCases.getTrainingSession(session.id);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const foundSession = result.getValue();
      expect(foundSession.id).to.equal(session.id);
      expect(foundSession.puppyId).to.equal("puppy-123");
    });

    it("should return failure when session not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await useCases.getTrainingSession(nonExistentId);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("getPuppyTrainingSessions", () => {
    it("should return all training sessions for a puppy", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const result1 = await useCases.createTrainingSession(
        puppyId,
        "obedience",
        30,
        "Session 1"
      );
      const result2 = await useCases.createTrainingSession(
        puppyId,
        "agility",
        45,
        "Session 2"
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getPuppyTrainingSessions(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const sessions = result.getValue();
      expect(sessions).to.have.length(2);
      expect(sessions[0].puppyId).to.equal(puppyId);
      expect(sessions[1].puppyId).to.equal(puppyId);
    });

    it("should return empty array when puppy has no sessions", async () => {
      // Arrange
      const puppyId = "puppy-with-no-sessions";

      // Act
      const result = await useCases.getPuppyTrainingSessions(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const sessions = result.getValue();
      expect(sessions).to.be.an("array").that.is.empty;
    });

    it("should only return sessions for specified puppy", async () => {
      // Arrange
      const puppy1 = "puppy-1";
      const puppy2 = "puppy-2";
      const result1 = await useCases.createTrainingSession(
        puppy1,
        "obedience",
        30,
        "Puppy 1 session"
      );
      const result2 = await useCases.createTrainingSession(
        puppy2,
        "agility",
        45,
        "Puppy 2 session"
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getPuppyTrainingSessions(puppy1);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const sessions = result.getValue();
      expect(sessions).to.have.length(1);
      expect(sessions[0].puppyId).to.equal(puppy1);
    });
  });

  describe("updateTrainingNotes", () => {
    it("should update training session notes successfully", async () => {
      // Arrange
      const createResult = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Original notes"
      );
      expect(createResult.isSuccess()).to.be.true;
      const session = createResult.getValue();
      const newNotes = "Updated notes with more detail";

      // Act
      const result = await useCases.updateTrainingNotes(session.id, newNotes);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const updatedSession = result.getValue();
      expect(updatedSession.notes).to.equal(newNotes);
      expect(updatedSession.id).to.equal(session.id);
      expect(updatedSession.puppyId).to.equal(session.puppyId);
    });

    it("should return failure when updating non-existent session", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const newNotes = "New notes";

      // Act
      const result = await useCases.updateTrainingNotes(
        nonExistentId,
        newNotes
      );

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("deleteTrainingSession", () => {
    it("should delete training session successfully", async () => {
      // Arrange
      const createResult = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Session to delete"
      );
      expect(createResult.isSuccess()).to.be.true;
      const session = createResult.getValue();

      // Act
      const deleteResult = await useCases.deleteTrainingSession(session.id);

      // Assert
      expect(deleteResult.isSuccess()).to.be.true;
      const getResult = await useCases.getTrainingSession(session.id);
      expect(getResult.isFailure()).to.be.true;
      expect(getResult.getError().code).to.equal("NOT_FOUND");
    });

    it("should handle deletion of non-existent session gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await useCases.deleteTrainingSession(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
    });
  });
});
