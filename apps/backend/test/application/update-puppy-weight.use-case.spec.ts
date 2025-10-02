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
      const originalPuppy = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 12,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.puppy).to.not.be.undefined;
      expect(result.puppy!.currentWeight.value).to.equal(12);
      expect(result.puppy!.currentWeight.unit).to.equal(WeightUnit.KG);
      expect(result.error).to.be.undefined;
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
      expect(result.success).to.be.false;
      expect(result.puppy).to.be.undefined;
      expect(result.error).to.equal("Puppy not found");
    });

    it("should handle negative weight values", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppy = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: -5,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.puppy).to.be.undefined;
      expect(result.error).to.include("Weight must be positive");
    });

    it("should handle zero weight values", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppy = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 0,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.puppy).to.be.undefined;
      expect(result.error).to.include("Weight must be positive");
    });

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 12,
        weightUnit: WeightUnit.KG,
      };
      const repositoryError = new Error("Database connection failed");
      repository.findById = async () => {
        throw repositoryError;
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.success).to.be.false;
      expect(result.puppy).to.be.undefined;
      expect(result.error).to.equal("Database connection failed");
    });

    it("should preserve other puppy properties when updating weight", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppy = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 15,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.puppy!.name.value).to.equal("Buddy");
      expect(result.puppy!.breed.value).to.equal("Golden Retriever");
      expect(result.puppy!.ownerId).to.equal("owner-1");
      expect(result.puppy!.currentWeight.value).to.equal(15);
    });

    it("should handle weight unit conversion", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const originalPuppy = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(originalPuppy);
      const command: UpdatePuppyWeightCommand = {
        puppyId,
        newWeight: 22,
        weightUnit: WeightUnit.LBS,
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.success).to.be.true;
      expect(result.puppy!.currentWeight.value).to.equal(22);
      expect(result.puppy!.currentWeight.unit).to.equal(WeightUnit.LBS);
    });
  });
});
