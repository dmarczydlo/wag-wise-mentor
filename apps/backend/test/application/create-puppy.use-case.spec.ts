import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, type TestingModule } from "@nestjs/testing";
import {
  CreatePuppyUseCase,
  type CreatePuppyCommand,
  PUPPY_REPOSITORY,
} from "../../src/application/puppy/puppy.use-cases";
import { InMemoryPuppyRepository } from "../../src/infrastructure/puppy/in-memory-puppy.repository";
import type { PuppyRepository } from "../../src/domain/puppy/puppy.repository";
import { WeightUnit } from "../../src/domain/puppy/puppy.entity";

describe("CreatePuppyUseCase - AAA Pattern", () => {
  let useCase: CreatePuppyUseCase;
  let repository: InMemoryPuppyRepository;

  beforeEach(async () => {
    // Arrange - Setup test dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePuppyUseCase,
        {
          provide: PUPPY_REPOSITORY,
          useClass: InMemoryPuppyRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreatePuppyUseCase>(CreatePuppyUseCase);
    repository = module.get<PuppyRepository>(
      PUPPY_REPOSITORY
    ) as InMemoryPuppyRepository;

    // Clear repository before each test
    repository.clear();
  });

  describe("execute", () => {
    it("should create a puppy successfully with valid data", async () => {
      // Arrange
      const command: CreatePuppyCommand = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2024-01-01"),
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const _puppy = result.getValue();
      expect(_puppy.name.value).to.equal("Buddy");
      expect(_puppy.breed.value).to.equal("Golden Retriever");
      expect(_puppy.currentWeight.value).to.equal(5.5);
      expect(_puppy.currentWeight.unit).to.equal(WeightUnit.KG);
      expect(_puppy.ownerId).to.equal("owner-123");
    });

    it("should return error when puppy name is empty", async () => {
      // Arrange
      const command: CreatePuppyCommand = {
        name: "",
        breed: "Golden Retriever",
        birthDate: new Date("2024-01-01"),
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal("PuppyName cannot be empty");
    });

    it("should return error when breed is empty", async () => {
      // Arrange
      const command: CreatePuppyCommand = {
        name: "Buddy",
        breed: "",
        birthDate: new Date("2024-01-01"),
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal("Breed cannot be empty");
    });

    it("should return error when weight is negative", async () => {
      // Arrange
      const command: CreatePuppyCommand = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2024-01-01"),
        currentWeight: -1,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal("Weight must be positive");
    });

    it("should return error when birth date is in the future", async () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const command: CreatePuppyCommand = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: futureDate,
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal(
        "BirthDate cannot be in the future"
      );
    });

    it("should return error when owner ID is empty", async () => {
      // Arrange
      const command: CreatePuppyCommand = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2024-01-01"),
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "",
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isFailure()).to.be.true;
      expect(result.getError().message).to.equal("OwnerId cannot be empty");
    });

    it("should save puppy to repository", async () => {
      // Arrange
      const command: CreatePuppyCommand = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2024-01-01"),
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result.isSuccess()).to.be.true;
      const _puppy = result.getValue();
      expect(repository.getCount()).to.equal(1);

      const savedPuppies = repository.getAllPuppies();
      expect(savedPuppies).to.have.length(1);
      expect(savedPuppies[0].name.value).to.equal("Buddy");
    });
  });
});
