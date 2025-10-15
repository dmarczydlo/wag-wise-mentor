import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { AIUseCases } from "../../src/application/ai/ai.use-cases";
import { InMemoryAIRepository } from "../../src/infrastructure/ai/in-memory-ai.repository";
import { NotFoundException } from "@nestjs/common";

describe("AI Use Cases - AAA Pattern", () => {
  let useCases: AIUseCases;
  let repository: InMemoryAIRepository;

  beforeEach(async () => {
    // Arrange
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIUseCases,
        {
          provide: "AIRepository",
          useClass: InMemoryAIRepository,
        },
      ],
    }).compile();

    useCases = module.get<AIUseCases>(AIUseCases);
    repository = module.get<InMemoryAIRepository>("AIRepository");
  });

  describe("generateRecommendation", () => {
    it("should generate a new AI recommendation successfully", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const category = "training";
      const recommendation = "Focus on basic commands";
      const confidence = 0.85;
      const metadata = { age: 3, breed: "Golden Retriever" };

      // Act
      const result = await useCases.generateRecommendation(
        puppyId,
        category,
        recommendation,
        confidence,
        metadata
      );

      // Assert
      expect(result.isSuccess()).to.be.true;
      const aiRecommendation = result.getValue();
      expect(aiRecommendation.puppyId).to.equal(puppyId);
      expect(aiRecommendation.category).to.equal(category);
      expect(aiRecommendation.recommendation).to.equal(recommendation);
      expect(aiRecommendation.confidence).to.equal(confidence);
      expect(aiRecommendation.metadata).to.deep.equal(metadata);
    });

    it("should save AI recommendation to repository", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const category = "health";
      const recommendation = "Schedule vet checkup";
      const confidence = 0.9;

      // Act
      const result = await useCases.generateRecommendation(
        puppyId,
        category,
        recommendation,
        confidence
      );

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = await repository.findByPuppyId(puppyId);
      expect(recommendations.isSuccess()).to.be.true;
      const recommendationsList = recommendations.getValue();
      expect(recommendationsList).to.have.length(1);
      expect(recommendationsList[0].puppyId).to.equal(puppyId);
    });

    it("should handle empty metadata", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const category = "training";
      const recommendation = "Basic obedience";
      const confidence = 0.75;

      // Act
      const result = await useCases.generateRecommendation(
        puppyId,
        category,
        recommendation,
        confidence
      );

      // Assert
      expect(result.isSuccess()).to.be.true;
      const aiRecommendation = result.getValue();
      expect(aiRecommendation.metadata).to.deep.equal({});
    });
  });

  describe("getRecommendation", () => {
    it("should return AI recommendation when found", async () => {
      // Arrange
      const createResult = await useCases.generateRecommendation(
        "puppy-123",
        "training",
        "Focus on socialization",
        0.88
      );
      expect(createResult.isSuccess()).to.be.true;
      const recommendation = createResult.getValue();

      // Act
      const result = await useCases.getRecommendation(recommendation.id);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const foundRecommendation = result.getValue();
      expect(foundRecommendation.id).to.equal(recommendation.id);
      expect(foundRecommendation.puppyId).to.equal("puppy-123");
    });

    it("should return failure when recommendation not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await useCases.getRecommendation(nonExistentId);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("getPuppyRecommendations", () => {
    it("should return all AI recommendations for a puppy", async () => {
      // Arrange
      const puppyId = "puppy-123";
      const result1 = await useCases.generateRecommendation(
        puppyId,
        "training",
        "Recommendation 1",
        0.85
      );
      const result2 = await useCases.generateRecommendation(
        puppyId,
        "health",
        "Recommendation 2",
        0.9
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getPuppyRecommendations(puppyId);

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
      const result = await useCases.getPuppyRecommendations(puppyId);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.be.an("array").that.is.empty;
    });

    it("should only return recommendations for specified puppy", async () => {
      // Arrange
      const puppy1 = "puppy-1";
      const puppy2 = "puppy-2";
      const result1 = await useCases.generateRecommendation(
        puppy1,
        "training",
        "Puppy 1 rec",
        0.85
      );
      const result2 = await useCases.generateRecommendation(
        puppy2,
        "health",
        "Puppy 2 rec",
        0.9
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getPuppyRecommendations(puppy1);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.have.length(1);
      expect(recommendations[0].puppyId).to.equal(puppy1);
    });
  });

  describe("getRecommendationsByCategory", () => {
    it("should return all recommendations for a category", async () => {
      // Arrange
      const category = "training";
      const result1 = await useCases.generateRecommendation(
        "puppy-1",
        category,
        "Recommendation 1",
        0.85
      );
      const result2 = await useCases.generateRecommendation(
        "puppy-2",
        category,
        "Recommendation 2",
        0.9
      );
      const result3 = await useCases.generateRecommendation(
        "puppy-3",
        "health",
        "Different category",
        0.8
      );
      expect(result1.isSuccess()).to.be.true;
      expect(result2.isSuccess()).to.be.true;
      expect(result3.isSuccess()).to.be.true;

      // Act
      const result = await useCases.getRecommendationsByCategory(category);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.have.length(2);
      expect(recommendations[0].category).to.equal(category);
      expect(recommendations[1].category).to.equal(category);
    });

    it("should return empty array when no recommendations in category", async () => {
      // Arrange
      const category = "non-existent-category";

      // Act
      const result = await useCases.getRecommendationsByCategory(category);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const recommendations = result.getValue();
      expect(recommendations).to.be.an("array").that.is.empty;
    });
  });

  describe("updateConfidence", () => {
    it("should update recommendation confidence successfully", async () => {
      // Arrange
      const createResult = await useCases.generateRecommendation(
        "puppy-123",
        "training",
        "Focus on commands",
        0.75
      );
      expect(createResult.isSuccess()).to.be.true;
      const recommendation = createResult.getValue();
      const newConfidence = 0.95;

      // Act
      const result = await useCases.updateConfidence(
        recommendation.id,
        newConfidence
      );

      // Assert
      expect(result.isSuccess()).to.be.true;
      const updatedRecommendation = result.getValue();
      expect(updatedRecommendation.confidence).to.equal(newConfidence);
      expect(updatedRecommendation.id).to.equal(recommendation.id);
      expect(updatedRecommendation.recommendation).to.equal(
        recommendation.recommendation
      );
    });

    it("should return failure when updating non-existent recommendation", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const newConfidence = 0.95;

      // Act
      const result = await useCases.updateConfidence(
        nonExistentId,
        newConfidence
      );

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().code).to.equal("NOT_FOUND");
    });
  });

  describe("deleteRecommendation", () => {
    it("should delete AI recommendation successfully", async () => {
      // Arrange
      const createResult = await useCases.generateRecommendation(
        "puppy-123",
        "training",
        "Recommendation to delete",
        0.85
      );
      expect(createResult.isSuccess()).to.be.true;
      const recommendation = createResult.getValue();

      // Act
      const deleteResult = await useCases.deleteRecommendation(
        recommendation.id
      );

      // Assert
      expect(deleteResult.isSuccess()).to.be.true;
      const getResult = await useCases.getRecommendation(recommendation.id);
      expect(getResult.isFailure()).to.be.true;
      expect(getResult.getError().code).to.equal("NOT_FOUND");
    });

    it("should handle deletion of non-existent recommendation gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const result = await useCases.deleteRecommendation(nonExistentId);

      // Assert
      expect(result.isSuccess()).to.be.true;
    });
  });
});
