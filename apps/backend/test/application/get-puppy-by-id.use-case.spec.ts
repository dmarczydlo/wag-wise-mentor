import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { GetPuppyByIdUseCase } from "../../src/application/puppy/puppy.use-cases";
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

describe("GetPuppyByIdUseCase - AAA Pattern", () => {
  let useCase: GetPuppyByIdUseCase;
  let repository: InMemoryPuppyRepository;

  beforeEach(() => {
    // Arrange
    repository = new InMemoryPuppyRepository();
    useCase = new GetPuppyByIdUseCase(repository);
  });

  describe("execute", () => {
    it("should return puppy when found", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const puppy = Puppy.create(
        new PuppyId(puppyId),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(puppy);

      // Act
      const result = await useCase.execute(puppyId);

      // Assert
      expect(result).to.deep.equal(puppy);
    });

    it("should return null when puppy not found", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act
      const result = await useCase.execute(nonExistentId);

      // Assert
      expect(result).to.be.null;
    });

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const puppyId = "test-puppy-1";
      const repositoryError = new Error("Database connection failed");
      repository.findById = async () => {
        throw repositoryError;
      };

      // Act & Assert
      try {
        await useCase.execute(puppyId);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database connection failed");
      }
    });
  });
});
