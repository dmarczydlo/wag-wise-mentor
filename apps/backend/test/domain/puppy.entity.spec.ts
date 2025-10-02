import { describe, it } from "mocha";
import { expect } from "chai";
import {
  Puppy,
  PuppyId,
  PuppyName,
  Breed,
  BirthDate,
  Weight,
  WeightUnit,
} from "../../src/domain/puppy/puppy.entity";

describe("Puppy Entity - DDD Tests", () => {
  describe("create", () => {
    it("should create a puppy with valid data", () => {
      // Arrange
      const id = new PuppyId("puppy-123");
      const name = new PuppyName("Buddy");
      const breed = new Breed("Golden Retriever");
      const birthDate = new BirthDate(new Date("2024-01-01"));
      const weight = new Weight(5.5, WeightUnit.KG);
      const ownerId = "owner-123";

      // Act
      const puppy = Puppy.create(id, name, breed, birthDate, weight, ownerId);

      // Assert
      expect(puppy.id).to.equal(id);
      expect(puppy.name).to.equal(name);
      expect(puppy.breed).to.equal(breed);
      expect(puppy.birthDate).to.equal(birthDate);
      expect(puppy.currentWeight).to.equal(weight);
      expect(puppy.ownerId).to.equal(ownerId);
    });

    it("should throw error when owner ID is empty", () => {
      // Arrange
      const id = new PuppyId("puppy-123");
      const name = new PuppyName("Buddy");
      const breed = new Breed("Golden Retriever");
      const birthDate = new BirthDate(new Date("2024-01-01"));
      const weight = new Weight(5.5, WeightUnit.KG);
      const ownerId = "";

      // Act & Assert
      expect(() => {
        Puppy.create(id, name, breed, birthDate, weight, ownerId);
      }).to.throw("OwnerId cannot be empty");
    });
  });

  describe("isAdult", () => {
    it("should return true for puppy older than 12 months", () => {
      // Arrange
      const id = new PuppyId("puppy-123");
      const name = new PuppyName("Buddy");
      const breed = new Breed("Golden Retriever");
      const birthDate = new BirthDate(new Date("2023-01-01")); // 12+ months old
      const weight = new Weight(25.0, WeightUnit.KG);
      const ownerId = "owner-123";

      const puppy = Puppy.create(id, name, breed, birthDate, weight, ownerId);

      // Act
      const isAdult = puppy.isAdult();

      // Assert
      expect(isAdult).to.be.true;
    });

    it("should return false for puppy younger than 12 months", () => {
      // Arrange
      const id = new PuppyId("puppy-123");
      const name = new PuppyName("Buddy");
      const breed = new Breed("Golden Retriever");
      const birthDate = new BirthDate(new Date("2024-11-01")); // Less than 12 months old
      const weight = new Weight(5.5, WeightUnit.KG);
      const ownerId = "owner-123";

      const puppy = Puppy.create(id, name, breed, birthDate, weight, ownerId);

      // Act
      const isAdult = puppy.isAdult();

      // Assert
      expect(isAdult).to.be.false;
    });
  });

  describe("getFeedingFrequency", () => {
    it("should return 4 for puppies under 3 months", () => {
      // Arrange
      const id = new PuppyId("puppy-123");
      const name = new PuppyName("Buddy");
      const breed = new Breed("Golden Retriever");
      const birthDate = new BirthDate(new Date("2025-08-01")); // Less than 3 months old
      const weight = new Weight(2.0, WeightUnit.KG);
      const ownerId = "owner-123";

      const puppy = Puppy.create(id, name, breed, birthDate, weight, ownerId);

      // Act
      const frequency = puppy.getFeedingFrequency();

      // Assert
      expect(frequency).to.equal(4);
    });

    it("should return 2 for adult dogs", () => {
      // Arrange
      const id = new PuppyId("puppy-123");
      const name = new PuppyName("Buddy");
      const breed = new Breed("Golden Retriever");
      const birthDate = new BirthDate(new Date("2023-01-01")); // Adult
      const weight = new Weight(25.0, WeightUnit.KG);
      const ownerId = "owner-123";

      const puppy = Puppy.create(id, name, breed, birthDate, weight, ownerId);

      // Act
      const frequency = puppy.getFeedingFrequency();

      // Assert
      expect(frequency).to.equal(2);
    });
  });
});

describe("Weight Value Object", () => {
  describe("convertTo", () => {
    it("should convert from kg to lbs", () => {
      // Arrange
      const weightInKg = new Weight(10, WeightUnit.KG);

      // Act
      const weightInLbs = weightInKg.convertTo(WeightUnit.LBS);

      // Assert
      expect(weightInLbs.unit).to.equal(WeightUnit.LBS);
      expect(weightInLbs.value).to.be.closeTo(22.046, 0.1);
    });

    it("should convert from lbs to kg", () => {
      // Arrange
      const weightInLbs = new Weight(22.046, WeightUnit.LBS);

      // Act
      const weightInKg = weightInLbs.convertTo(WeightUnit.KG);

      // Assert
      expect(weightInKg.unit).to.equal(WeightUnit.KG);
      expect(weightInKg.value).to.be.closeTo(10, 0.1);
    });

    it("should return same weight when converting to same unit", () => {
      // Arrange
      const weight = new Weight(10, WeightUnit.KG);

      // Act
      const convertedWeight = weight.convertTo(WeightUnit.KG);

      // Assert
      expect(convertedWeight).to.equal(weight);
    });
  });
});
