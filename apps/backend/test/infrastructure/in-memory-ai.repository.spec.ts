import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { InMemoryAIRepository } from "../../src/infrastructure/ai/in-memory-ai.repository";
import { AIRecommendation } from "../../src/domain/ai/ai-recommendation.entity";

describe("InMemoryAIRepository - AAA Pattern", () => {
  let repository: InMemoryAIRepository;

  beforeEach(() => {
    // Arrange
    repository = new InMemoryAIRepository();
  });

  describe("save", () => {
    it("should save AI recommendation successfully", async () => {
      // Arrange
      const recommendation = AIRecommendation.create(
        "rec-1",
        "puppy-1",
        "training",
        "Focus on basic commands",
        0.85,
        { age: 3 }
      );

      // Act
      const savedRecommendation = await repository.save(recommendation);

      // Assert
      expect(savedRecommendation).to.deep.equal(recommendation);
    });

    it("should update existing recommendation when saving with same ID", async () => {
      // Arrange
      const recId = "rec-1";
      const originalRec = AIRecommendation.create(
        recId,
        "puppy-1",
        "training",
        "Original recommendation",
        0.75
      );
      await repository.save(originalRec);

      const updatedRec = originalRec.updateConfidence(0.95);

      // Act
      const savedRec = await repository.save(updatedRec);

      // Assert
      expect(savedRec.confidence).to.equal(0.95);
      const foundRec = await repository.findById(recId);
      expect(foundRec!.confidence).to.equal(0.95);
    });
  });

  describe("findById", () => {
    it("should return AI recommendation when found", async () => {
      // Arrange
      const recommendation = AIRecommendation.create(
        "rec-1",
        "puppy-1",
        "training",
        "Focus on socialization",
        0.88
      );
      await repository.save(recommendation);

      // Act
      const foundRec = await repository.findById("rec-1");

      // Assert
      expect(foundRec).to.not.be.null;
      expect(foundRec!.id).to.equal("rec-1");
    });

    it("should return null when recommendation not found", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act
      const foundRec = await repository.findById(nonExistentId);

      // Assert
      expect(foundRec).to.be.null;
    });
  });

  describe("findByPuppyId", () => {
    it("should return all AI recommendations for a puppy", async () => {
      // Arrange
      const puppyId = "puppy-1";
      const rec1 = AIRecommendation.create(
        "rec-1",
        puppyId,
        "training",
        "Recommendation 1",
        0.85
      );
      const rec2 = AIRecommendation.create(
        "rec-2",
        puppyId,
        "health",
        "Recommendation 2",
        0.9
      );
      await repository.save(rec1);
      await repository.save(rec2);

      // Act
      const recommendations = await repository.findByPuppyId(puppyId);

      // Assert
      expect(recommendations).to.have.length(2);
      expect(recommendations).to.deep.include(rec1);
      expect(recommendations).to.deep.include(rec2);
    });

    it("should return empty array when puppy has no recommendations", async () => {
      // Arrange
      const puppyId = "puppy-with-no-recs";

      // Act
      const recommendations = await repository.findByPuppyId(puppyId);

      // Assert
      expect(recommendations).to.be.an("array").that.is.empty;
    });

    it("should only return recommendations for specified puppy", async () => {
      // Arrange
      const puppy1 = "puppy-1";
      const puppy2 = "puppy-2";
      const rec1 = AIRecommendation.create(
        "rec-1",
        puppy1,
        "training",
        "Recommendation 1",
        0.85
      );
      const rec2 = AIRecommendation.create(
        "rec-2",
        puppy2,
        "health",
        "Recommendation 2",
        0.9
      );
      await repository.save(rec1);
      await repository.save(rec2);

      // Act
      const recommendations = await repository.findByPuppyId(puppy1);

      // Assert
      expect(recommendations).to.have.length(1);
      expect(recommendations[0]).to.deep.equal(rec1);
    });
  });

  describe("findByCategory", () => {
    it("should return all recommendations for a category", async () => {
      // Arrange
      const category = "training";
      const rec1 = AIRecommendation.create(
        "rec-1",
        "puppy-1",
        category,
        "Recommendation 1",
        0.85
      );
      const rec2 = AIRecommendation.create(
        "rec-2",
        "puppy-2",
        category,
        "Recommendation 2",
        0.9
      );
      const rec3 = AIRecommendation.create(
        "rec-3",
        "puppy-3",
        "health",
        "Different category",
        0.8
      );
      await repository.save(rec1);
      await repository.save(rec2);
      await repository.save(rec3);

      // Act
      const recommendations = await repository.findByCategory(category);

      // Assert
      expect(recommendations).to.have.length(2);
      expect(recommendations).to.deep.include(rec1);
      expect(recommendations).to.deep.include(rec2);
    });

    it("should return empty array when no recommendations in category", async () => {
      // Arrange
      const category = "non-existent-category";

      // Act
      const recommendations = await repository.findByCategory(category);

      // Assert
      expect(recommendations).to.be.an("array").that.is.empty;
    });
  });

  describe("delete", () => {
    it("should delete existing AI recommendation", async () => {
      // Arrange
      const recommendation = AIRecommendation.create(
        "rec-1",
        "puppy-1",
        "training",
        "Recommendation to delete",
        0.85
      );
      await repository.save(recommendation);

      // Act
      await repository.delete("rec-1");

      // Assert
      const foundRec = await repository.findById("rec-1");
      expect(foundRec).to.be.null;
    });

    it("should handle deletion of non-existent recommendation gracefully", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act & Assert
      await repository.delete(nonExistentId);
    });
  });
});
