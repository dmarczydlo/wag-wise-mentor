import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
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

describe("InMemoryPuppyRepository - AAA Pattern", () => {
  let repository: InMemoryPuppyRepository;

  beforeEach(() => {
    // Arrange
    repository = new InMemoryPuppyRepository();
  });

  describe("save", () => {
    it("should save puppy successfully", async () => {
      // Arrange
      const puppy = Puppy.create(
        new PuppyId("test-puppy-1"),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );

      // Act
      const savedPuppy = await repository.save(puppy);

      // Assert
      expect(savedPuppy).to.deep.equal(puppy);
      expect(repository.getCount()).to.equal(1);
    });

    it("should update existing puppy when saving with same ID", async () => {
      // Arrange
      const puppyId = new PuppyId("test-puppy-1");
      const originalPuppy = Puppy.create(
        puppyId,
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(originalPuppy);

      const updatedPuppy = originalPuppy.updateWeight(
        new Weight(12, WeightUnit.KG)
      );

      // Act
      const savedPuppy = await repository.save(updatedPuppy);

      // Assert
      expect(savedPuppy).to.deep.equal(updatedPuppy);
      expect(repository.getCount()).to.equal(1);
      expect(savedPuppy.currentWeight.value).to.equal(12);
    });
  });

  describe("findById", () => {
    it("should return puppy when found", async () => {
      // Arrange
      const puppyId = new PuppyId("test-puppy-1");
      const puppy = Puppy.create(
        puppyId,
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(puppy);

      // Act
      const foundPuppy = await repository.findById(puppyId);

      // Assert
      expect(foundPuppy).to.deep.equal(puppy);
    });

    it("should return null when puppy not found", async () => {
      // Arrange
      const nonExistentId = new PuppyId("non-existent");

      // Act
      const foundPuppy = await repository.findById(nonExistentId);

      // Assert
      expect(foundPuppy).to.be.null;
    });
  });

  describe("findByOwnerId", () => {
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
      const puppies = await repository.findByOwnerId(ownerId);

      // Assert
      expect(puppies).to.have.length(2);
      expect(puppies).to.deep.include(puppy1);
      expect(puppies).to.deep.include(puppy2);
    });

    it("should return empty array when owner has no puppies", async () => {
      // Arrange
      const ownerId = "owner-with-no-puppies";

      // Act
      const puppies = await repository.findByOwnerId(ownerId);

      // Assert
      expect(puppies).to.be.an("array").that.is.empty;
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
      const puppies = await repository.findByOwnerId(owner1);

      // Assert
      expect(puppies).to.have.length(1);
      expect(puppies[0]).to.deep.equal(puppy1);
    });
  });

  describe("findAll", () => {
    it("should return all puppies", async () => {
      // Arrange
      const puppy1 = Puppy.create(
        new PuppyId("puppy-1"),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      const puppy2 = Puppy.create(
        new PuppyId("puppy-2"),
        new PuppyName("Max"),
        new Breed("Labrador"),
        new BirthDate(new Date("2023-02-01")),
        new Weight(12, WeightUnit.KG),
        "owner-2"
      );
      await repository.save(puppy1);
      await repository.save(puppy2);

      // Act
      const allPuppies = await repository.findAll();

      // Assert
      expect(allPuppies).to.have.length(2);
      expect(allPuppies).to.deep.include(puppy1);
      expect(allPuppies).to.deep.include(puppy2);
    });

    it("should return empty array when no puppies exist", async () => {
      // Act
      const allPuppies = await repository.findAll();

      // Assert
      expect(allPuppies).to.be.an("array").that.is.empty;
    });
  });

  describe("update", () => {
    it("should update existing puppy", async () => {
      // Arrange
      const puppyId = new PuppyId("test-puppy-1");
      const originalPuppy = Puppy.create(
        puppyId,
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(originalPuppy);
      const updatedPuppy = originalPuppy.updateWeight(
        new Weight(12, WeightUnit.KG)
      );

      // Act
      const result = await repository.update(updatedPuppy);

      // Assert
      expect(result).to.deep.equal(updatedPuppy);
      const foundPuppy = await repository.findById(puppyId);
      expect(foundPuppy!.currentWeight.value).to.equal(12);
    });

    it("should throw error when updating non-existent puppy", async () => {
      // Arrange
      const puppyId = new PuppyId("non-existent");
      const puppy = Puppy.create(
        puppyId,
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );

      // Act & Assert
      try {
        await repository.update(puppy);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Puppy not found");
      }
    });
  });

  describe("delete", () => {
    it("should delete existing puppy", async () => {
      // Arrange
      const puppyId = new PuppyId("test-puppy-1");
      const puppy = Puppy.create(
        puppyId,
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(puppy);
      expect(repository.getCount()).to.equal(1);

      // Act
      await repository.delete(puppyId);

      // Assert
      expect(repository.getCount()).to.equal(0);
      const foundPuppy = await repository.findById(puppyId);
      expect(foundPuppy).to.be.null;
    });

    it("should handle deletion of non-existent puppy gracefully", async () => {
      // Arrange
      const nonExistentId = new PuppyId("non-existent");

      // Act & Assert
      await repository.delete(nonExistentId);
      expect(repository.getCount()).to.equal(0);
    });
  });

  describe("test helper methods", () => {
    it("should clear all puppies", async () => {
      // Arrange
      const puppy = Puppy.create(
        new PuppyId("test-puppy-1"),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(puppy);
      expect(repository.getCount()).to.equal(1);

      // Act
      repository.clear();

      // Assert
      expect(repository.getCount()).to.equal(0);
    });

    it("should return correct count", async () => {
      // Arrange
      expect(repository.getCount()).to.equal(0);

      // Act
      const puppy1 = Puppy.create(
        new PuppyId("puppy-1"),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      await repository.save(puppy1);
      expect(repository.getCount()).to.equal(1);

      const puppy2 = Puppy.create(
        new PuppyId("puppy-2"),
        new PuppyName("Max"),
        new Breed("Labrador"),
        new BirthDate(new Date("2023-02-01")),
        new Weight(12, WeightUnit.KG),
        "owner-2"
      );
      await repository.save(puppy2);

      // Assert
      expect(repository.getCount()).to.equal(2);
    });

    it("should return all puppies via getAllPuppies", async () => {
      // Arrange
      const puppy1 = Puppy.create(
        new PuppyId("puppy-1"),
        new PuppyName("Buddy"),
        new Breed("Golden Retriever"),
        new BirthDate(new Date("2023-01-01")),
        new Weight(10, WeightUnit.KG),
        "owner-1"
      );
      const puppy2 = Puppy.create(
        new PuppyId("puppy-2"),
        new PuppyName("Max"),
        new Breed("Labrador"),
        new BirthDate(new Date("2023-02-01")),
        new Weight(12, WeightUnit.KG),
        "owner-2"
      );
      await repository.save(puppy1);
      await repository.save(puppy2);

      // Act
      const allPuppies = repository.getAllPuppies();

      // Assert
      expect(allPuppies).to.have.length(2);
      expect(allPuppies).to.deep.include(puppy1);
      expect(allPuppies).to.deep.include(puppy2);
    });
  });
});
