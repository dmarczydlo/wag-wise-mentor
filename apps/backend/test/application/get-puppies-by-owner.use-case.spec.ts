import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { GetPuppiesByOwnerUseCase } from "../../src/application/puppy/puppy.use-cases";
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

describe("GetPuppiesByOwnerUseCase - AAA Pattern", () => {
  let useCase: GetPuppiesByOwnerUseCase;
  let repository: InMemoryPuppyRepository;

  beforeEach(() => {
    // Arrange
    repository = new InMemoryPuppyRepository();
    useCase = new GetPuppiesByOwnerUseCase(repository);
  });

  describe("execute", () => {
    it("should return all puppies for owner", async () => {
      // Arrange
      const ownerId = "owner-1";
      const puppy1 = Puppy.create(
        new PuppyId("puppy-1"),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        ownerId
      );
      const puppy2 = Puppy.create(
        new PuppyId("puppy-2"),
        new PuppyName("Max"),
        new Breed("Labrador"),
        new BirthDate(new Date("2023-02-01")),
        new Weight(12, WeightUnit.KG),
        ownerId
      );
      await repository.save(puppy1);
      await repository.save(puppy2);

      // Act
      const result = await useCase.execute(ownerId);

      // Assert
      expect(result).to.have.length(2);
      expect(result).to.deep.include(puppy1);
      expect(result).to.deep.include(puppy2);
    });

    it("should return empty array when owner has no puppies", async () => {
      // Arrange
      const ownerId = "owner-with-no-puppies";

      // Act
      const result = await useCase.execute(ownerId);

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });

    it("should only return puppies for specified owner", async () => {
      // Arrange
      const owner1 = "owner-1";
      const owner2 = "owner-2";
      const puppy1 = Puppy.create(
        new PuppyId("puppy-1"),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        owner1
      );
      const puppy2 = Puppy.create(
        new PuppyId("puppy-2"),
        new PuppyName("Max"),
        new Breed("Labrador"),
        new BirthDate(new Date("2023-02-01")),
        new Weight(12, WeightUnit.KG),
        owner2
      );
      await repository.save(puppy1);
      await repository.save(puppy2);

      // Act
      const result = await useCase.execute(owner1);

      // Assert
      expect(result).to.have.length(1);
      expect(result[0]).to.deep.equal(puppy1);
    });

    it("should handle repository errors gracefully", async () => {
      // Arrange
      const ownerId = "owner-1";
      const repositoryError = new Error("Database connection failed");
      repository.findByOwnerId = async () => {
        throw repositoryError;
      };

      // Act & Assert
      try {
        await useCase.execute(ownerId);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Database connection failed");
      }
    });

    it("should handle empty owner ID", async () => {
      // Arrange
      const emptyOwnerId = "";

      // Act
      const result = await useCase.execute(emptyOwnerId);

      // Assert
      expect(result).to.be.an("array").that.is.empty;
    });
  });
});
