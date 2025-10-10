import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { TrainingController } from "../../src/infrastructure/training/training.controller";
import { TrainingUseCases } from "../../src/application/training/training.use-cases";
import { InMemoryTrainingRepository } from "../../src/infrastructure/training/in-memory-training.repository";
import { NotFoundException } from "@nestjs/common";

describe("TrainingController Integration Tests - AAA Pattern", () => {
  let controller: TrainingController;
  let useCases: TrainingUseCases;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingController],
      providers: [
        TrainingUseCases,
        {
          provide: "TrainingRepository",
          useClass: InMemoryTrainingRepository,
        },
      ],
    }).compile();

    controller = module.get<TrainingController>(TrainingController);
    useCases = module.get<TrainingUseCases>(TrainingUseCases);
  });

  describe("POST /training", () => {
    it("should create a new training session successfully", async () => {
      // Arrange
      const body = {
        puppyId: "puppy-123",
        sessionType: "obedience",
        duration: 30,
        notes: "Good progress on sit command",
      };

      // Act
      const result = await controller.createSession(body);

      // Assert
      expect(result).to.not.be.null;
      expect(result.puppyId).to.equal(body.puppyId);
      expect(result.sessionType).to.equal(body.sessionType);
      expect(result.duration).to.equal(body.duration);
      expect(result.notes).to.equal(body.notes);
    });

    it("should return valid session with ID", async () => {
      // Arrange
      const body = {
        puppyId: "puppy-123",
        sessionType: "agility",
        duration: 45,
        notes: "First agility session",
      };

      // Act
      const result = await controller.createSession(body);

      // Assert
      expect(result.id).to.not.be.undefined;
      expect(result.completedAt).to.be.instanceOf(Date);
    });
  });

  describe("GET /training/:id", () => {
    it("should return training session by id", async () => {
      // Arrange
      const session = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Good progress"
      );

      // Act
      const result = await controller.getSession(session.id);

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
        await controller.getSession(nonExistentId);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
      }
    });
  });

  describe("GET /training/puppy/:puppyId", () => {
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
      const result = await controller.getPuppySessions(puppyId);

      // Assert
      expect(result).to.have.length(2);
      expect(result[0].puppyId).to.equal(puppyId);
      expect(result[1].puppyId).to.equal(puppyId);
    });

    it("should return empty array when puppy has no sessions", async () => {
      // Arrange
      const puppyId = "puppy-with-no-sessions";

      // Act
      const result = await controller.getPuppySessions(puppyId);

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });
  });

  describe("PUT /training/:id/notes", () => {
    it("should update training session notes successfully", async () => {
      // Arrange
      const session = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Original notes"
      );
      const body = { notes: "Updated notes with more detail" };

      // Act
      const result = await controller.updateNotes(session.id, body);

      // Assert
      expect(result.notes).to.equal(body.notes);
      expect(result.id).to.equal(session.id);
    });

    it("should throw NotFoundException when updating non-existent session", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const body = { notes: "New notes" };

      // Act & Assert
      try {
        await controller.updateNotes(nonExistentId, body);
        expect.fail("Should have thrown NotFoundException");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundException);
      }
    });
  });

  describe("DELETE /training/:id", () => {
    it("should delete training session successfully", async () => {
      // Arrange
      const session = await useCases.createTrainingSession(
        "puppy-123",
        "obedience",
        30,
        "Session to delete"
      );

      // Act
      const result = await controller.deleteSession(session.id);

      // Assert
      expect(result.message).to.equal("Training session deleted successfully");
    });

    it("should handle deletion of non-existent session gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await controller.deleteSession(nonExistentId);

      // Assert
      expect(result.message).to.equal("Training session deleted successfully");
    });
  });
});
