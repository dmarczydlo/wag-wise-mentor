import { describe, it, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { PuppyController } from "../../src/infrastructure/puppy/puppy.controller";
import { PuppyModule } from "../../src/infrastructure/puppy/puppy.module";
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

describe("PuppyController Integration Tests - AAA Pattern", () => {
  let app: TestingModule;
  let controller: PuppyController;
  let repository: InMemoryPuppyRepository;

  beforeEach(async () => {
    // Arrange
    app = await Test.createTestingModule({
      imports: [PuppyModule],
    }).compile();

    controller = app.get<PuppyController>(PuppyController);
    repository = app.get<InMemoryPuppyRepository>("PuppyRepository");
    repository.clear(); // Clean state for each test
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /puppies", () => {
    it("should create a puppy successfully", async () => {
      // Arrange
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        currentWeight: 10,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-1",
      };

      // Act
      const result = await controller.createPuppy(createPuppyDto);

      // Assert
      expect(result.success).to.be.true;
      expect(result.data).to.not.be.undefined;
      expect(result.data!.name.value).to.equal("Buddy");
      expect(result.data!.breed.value).to.equal("Golden Retriever");
      expect(result.data!.currentWeight.value).to.equal(10);
      expect(result.data!.ownerId).to.equal("owner-1");
    });

    it("should return 400 when name is empty", async () => {
      // Arrange
      const createPuppyDto = {
        name: "",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        currentWeight: 10,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-1",
      };

      // Act & Assert
      try {
        await controller.createPuppy(createPuppyDto);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Name cannot be empty");
      }
    });

    it("should return 400 when breed is empty", async () => {
      // Arrange
      const createPuppyDto = {
        name: "Buddy",
        breed: "",
        birthDate: new Date("2023-01-01"),
        currentWeight: 10,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-1",
      };

      // Act & Assert
      try {
        await controller.createPuppy(createPuppyDto);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Breed cannot be empty");
      }
    });

    it("should return 400 when weight is negative", async () => {
      // Arrange
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        currentWeight: -5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-1",
      };

      // Act & Assert
      try {
        await controller.createPuppy(createPuppyDto);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Weight must be positive");
      }
    });

    it("should return 400 when birth date is in the future", async () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: futureDate,
        currentWeight: 10,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-1",
      };

      // Act & Assert
      try {
        await controller.createPuppy(createPuppyDto);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("BirthDate cannot be in the future");
      }
    });

    it("should return 400 when owner ID is empty", async () => {
      // Arrange
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        currentWeight: 10,
        weightUnit: WeightUnit.KG,
        ownerId: "",
      };

      // Act & Assert
      try {
        await controller.createPuppy(createPuppyDto);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("OwnerId cannot be empty");
      }
    });
  });

  describe("GET /puppies/:id", () => {
    it("should return puppy by id", async () => {
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

      // Act
      const result = await controller.getPuppyById("test-puppy-1");

      // Assert
      expect(result.success).to.be.true;
      expect(result.data).to.deep.equal(puppy);
    });

    it("should return 404 when puppy not found", async () => {
      // Arrange
      const nonExistentId = "non-existent";

      // Act & Assert
      try {
        await controller.getPuppyById(nonExistentId);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Puppy not found");
      }
    });
  });

  describe("GET /puppies/owner/:ownerId", () => {
    it("should return puppies by owner", async () => {
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
      const result = await controller.getPuppiesByOwner(ownerId);

      // Assert
      expect(result.success).to.be.true;
      expect(result.data).to.have.length(2);
      expect(result.data).to.deep.include(puppy1);
      expect(result.data).to.deep.include(puppy2);
    });

    it("should return empty array when owner has no puppies", async () => {
      // Arrange
      const ownerId = "owner-with-no-puppies";

      // Act
      const result = await controller.getPuppiesByOwner(ownerId);

      // Assert
      expect(result.success).to.be.true;
      expect(result.data).to.be.an("array").that.is.empty;
    });
  });

  describe("PUT /puppies/:id/weight", () => {
    it("should update puppy weight successfully", async () => {
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
      const updateWeightDto = {
        newWeight: 12,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const result = await controller.updatePuppyWeight(
        puppyId,
        updateWeightDto
      );

      // Assert
      expect(result.success).to.be.true;
      expect(result.data).to.not.be.undefined;
      expect(result.data!.currentWeight.value).to.equal(12);
      expect(result.data!.currentWeight.unit).to.equal(WeightUnit.KG);
    });

    it("should return 404 when puppy not found", async () => {
      // Arrange
      const nonExistentId = "non-existent";
      const updateWeightDto = {
        newWeight: 12,
        weightUnit: WeightUnit.KG,
      };

      // Act & Assert
      try {
        await controller.updatePuppyWeight(nonExistentId, updateWeightDto);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Puppy not found");
      }
    });

    it("should return 400 when weight is negative", async () => {
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
      const updateWeightDto = {
        newWeight: -5,
        weightUnit: WeightUnit.KG,
      };

      // Act & Assert
      try {
        await controller.updatePuppyWeight(puppyId, updateWeightDto);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("Weight must be positive");
      }
    });

    it("should handle weight unit conversion", async () => {
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
      const updateWeightDto = {
        newWeight: 22,
        weightUnit: WeightUnit.LBS,
      };

      // Act
      const result = await controller.updatePuppyWeight(
        puppyId,
        updateWeightDto
      );

      // Assert
      expect(result.success).to.be.true;
      expect(result.data).to.not.be.undefined;
      expect(result.data!.currentWeight.value).to.equal(22);
      expect(result.data!.currentWeight.unit).to.equal(WeightUnit.LBS);
    });
  });
});
