import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import {
  UpdatePuppyWeightUseCase,
  UpdatePuppyWeightCommand,
} from "../../src/application/puppy/puppy.use-cases";
import { InMemoryPuppyRepository } from "../../src/infrastructure/puppy/in-memory-puppy.repository";
import {
  Puppy,
  PuppyId,
  PuppyName,
  Breed,
  BirthDate,
  Weight,
  WeightUnit,
} from "../../src/domain/puppy/puppy.entity";
import { Result } from "../../src/common/result/result";

describe("UpdatePuppyWeightUseCase - AAA Pattern", () => {
  let useCase: UpdatePuppyWeightUseCase;
  let repository: InMemoryPuppyRepository;

  beforeEach(() => {
    // Arrange
    repository = new InMemoryPuppyRepository();
    useCase = new UpdatePuppyWeightUseCase(repository);
  });

  describe("execute", () => {
    it("should update puppy weight successfully", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppyResult = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      expect(originalPuppyResult.isSuccess()).to.be.true;
      const originalPuppy = originalPuppyResult.getValue();
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 12,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const updatedPuppy = result.getValue();
      expect(updatedPuppy.currentWeight.value).to.equal(12);
      expect(updatedPuppy.currentWeight.unit).to.equal(WeightUnit.KG);
    });

    it("should return error when puppy not found", async () => {
      // Arrange
      const nonExistentId = "non-existent";
      const command: UpdatePuppyWeightCommand = {
        puppyId: nonExistentId,
        newWeight: 12,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal(
        "Puppy with id non-existent not found"
      );
    });

    it("should handle negative weight values", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppyResult = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      expect(originalPuppyResult.isSuccess()).to.be.true;
      const originalPuppy = originalPuppyResult.getValue();
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: -5,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.include("Weight must be positive");
    });

    it("should handle zero weight values", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppyResult = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      expect(originalPuppyResult.isSuccess()).to.be.true;
      const originalPuppy = originalPuppyResult.getValue();
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 0,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.include("Weight must be positive");
    });

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 12,
        weightUnit: WeightUnit.KG,
      };
      const repositoryError = {
        code: "INTERNAL_ERROR",
        message: "Database connection failed",
      };
      repository.findById = async () => {
        return Result.failure(repositoryError);
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal("Database connection failed");
    });

    it("should preserve other puppy properties when updating weight", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppyResult = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      expect(originalPuppyResult.isSuccess()).to.be.true;
      const originalPuppy = originalPuppyResult.getValue();
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 15,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const updatedPuppy = result.getValue();
      expect(updatedPuppy.name.value).to.equal("Buddy");
      expect(updatedPuppy.breed.value).to.equal("Golden Retriever");
      expect(updatedPuppy.ownerId).to.equal("owner-1");
      expect(updatedPuppy.currentWeight.value).to.equal(15);
    });

    it("should handle weight unit conversion", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppyResult = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      expect(originalPuppyResult.isSuccess()).to.be.true;
      const originalPuppy = originalPuppyResult.getValue();
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 22,
        weightUnit: WeightUnit.LBS,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const updatedPuppy = result.getValue();
      expect(updatedPuppy.currentWeight.value).to.equal(22);
      expect(updatedPuppy.currentWeight.unit).to.equal(WeightUnit.LBS);
    });
  });
});
