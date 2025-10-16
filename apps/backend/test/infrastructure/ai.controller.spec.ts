import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, type TestingModule } from "@nestjs/testing";
import { AIController } from "../../src/infrastructure/ai/ai.controller";
import { AIUseCases } from "../../src/application/ai/ai.use-cases";
import { InMemoryAIRepository } from "../../src/infrastructure/ai/in-memory-ai.repository";
import { NotFoundException as _NotFoundException } from "@nestjs/common";

describe("AIController Integration Tests - AAA Pattern", () => {
  let controller: AIController;
  let useCases: AIUseCases;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AIController],
      providers: [
        AIUseCases,
        {
          provide: "AIRepository",
          useClass: InMemoryAIRepository,
        },
      ],
    }).compile();

    controller = module.get<AIController>(AIController);
    useCases = module.get<AIUseCases>(AIUseCases);
  });

  describe("POST /ai/recommendations", () => {
    it("should generate a new AI recommendation successfully", async () => {
      // Arrange
      const body = {
        puppyId: "puppy-123",
        category: "training",
        recommendation: "Focus on basic commands",
        confidence: 0.85,
        metadata: { age: 3, breed: "Golden Retriever" },
      };

      // Act
      const result = await controller.generateRecommendation(body);

      // Assert
      expect(result).to.not.be.null;
      expect(result.getValue().puppyId).to.equal(body.puppyId);
      expect(result.getValue().category).to.equal(body.category);
      expect(result.getValue().recommendation).to.equal(body.recommendation);
      expect(result.getValue().confidence).to.equal(body.confidence);
      expect(result.getValue().metadata).to.deep.equal(body.metadata);
    });

    it("should return valid recommendation with ID", async () => {
      // Arrange
      const body = {
        puppyId: "puppy-123",
        category: "health",
        recommendation: "Schedule vet checkup",
        confidence: 0.9,
      };

      // Act
      const result = await controller.generateRecommendation(body);

      // Assert
      expect(result.getValue().id).to.not.be.undefined;
    });
  });

  describe("GET /ai/recommendations/:id", () => {
    it("should return AI recommendation by id", async () => {
      // Arrange
      const recommendation = await useCases.generateRecommendation(
        "puppy-123",
        "training",
        "Focus on socialization",
        0.88
      );

      // Act
      const result = await controller.getRecommendation(
        recommendation.getValue().id
      );

      // Assert
      expect(result).to.not.be.null;
      expect(result.getValue().id).to.equal(recommendation.getValue().id);
      expect(result.getValue().puppyId).to.equal("puppy-123");
    });

    it("should throw NotFoundException when recommendation not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act & Assert
      const result = await controller.getRecommendation(nonExistentId);
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("GET /ai/recommendations/puppy/:puppyId", () => {
    it("should return all AI recommendations for a puppy", async () => {
      // Arrange
      const puppyId = "puppy-123";
      await useCases.generateRecommendation(
        puppyId,
        "training",
        "Recommendation 1",
        0.85
      );
      await useCases.generateRecommendation(
        puppyId,
        "health",
        "Recommendation 2",
        0.9
      );

      // Act
      const result = await controller.getPuppyRecommendations(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.have.length(2);
      expect(recommendations[0].puppyId).to.equal(puppyId);
      expect(recommendations[1].puppyId).to.equal(puppyId);
    });

    it("should return empty array when puppy has no recommendations", async () => {
      // Arrange
      const puppyId = "puppy-with-no-recommendations";

      // Act
      const result = await controller.getPuppyRecommendations(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.be.an("array").that.is.empty;
    });
  });

  describe("GET /ai/recommendations?category=", () => {
    it("should return recommendations by category", async () => {
      // Arrange
      const category = "training";
      await useCases.generateRecommendation(
        "puppy-1",
        category,
        "Recommendation 1",
        0.85
      );
      await useCases.generateRecommendation(
        "puppy-2",
        category,
        "Recommendation 2",
        0.9
      );

      // Act
      const result = await controller.getRecommendationsByCategory(category);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.have.length(2);
      expect(recommendations[0].category).to.equal(category);
      expect(recommendations[1].category).to.equal(category);
    });

    it("should return empty array when category not provided", async () => {
      // Arrange & Act
      const result = await controller.getRecommendationsByCategory("");

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.be.an("array").that.is.empty;
    });
  });

  describe("PUT /ai/recommendations/:id/confidence", () => {
    it("should update recommendation confidence successfully", async () => {
      // Arrange
      const recommendation = await useCases.generateRecommendation(
        "puppy-123",
        "training",
        "Focus on commands",
        0.75
      );
      const body = { confidence: 0.95 };

      // Act
      const result = await controller.updateConfidence(
        recommendation.getValue().id,
        body
      );

      // Assert
      expect(result.getValue().confidence).to.equal(body.confidence);
      expect(result.getValue().id).to.equal(recommendation.getValue().id);
    });

    it("should throw NotFoundException when updating non-existent recommendation", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const body = { confidence: 0.95 };

      // Act & Assert
      const result = await controller.updateConfidence(nonExistentId, body);
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("DELETE /ai/recommendations/:id", () => {
    it("should delete AI recommendation successfully", async () => {
      // Arrange
      const recommendation = await useCases.generateRecommendation(
        "puppy-123",
        "training",
        "Recommendation to delete",
        0.85
      );

      // Act
      const result = await controller.deleteRecommendation(
        recommendation.getValue().id
      );

      // Assert
      expect(result.message).to.equal("AI recommendation deleted successfully");
    });

    it("should handle deletion of non-existent recommendation gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await controller.deleteRecommendation(nonExistentId);

      // Assert
      expect(result.message).to.equal("AI recommendation deleted successfully");
    });
  });
});
