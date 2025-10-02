import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import * as request from "supertest";
import { PuppyModule } from "../../src/infrastructure/puppy/puppy.module";
import { WeightUnit } from "../../src/domain/puppy/puppy.entity";

describe("PuppyController Integration Tests", () => {
  let app: INestApplication;

  beforeEach(async () => {
    // Arrange - Setup test application
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PuppyModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("POST /puppies", () => {
    it("should create a puppy successfully", async () => {
      // Arrange
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: "2024-01-01T00:00:00.000Z",
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const response = await request(app.getHttpServer())
        .post("/puppies")
        .send(createPuppyDto);

      // Assert
      expect(response.status).to.equal(HttpStatus.CREATED);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.not.be.undefined;
      expect(response.body.data.name.value).to.equal("Buddy");
      expect(response.body.data.breed.value).to.equal("Golden Retriever");
      expect(response.body.data.currentWeight.value).to.equal(5.5);
      expect(response.body.data.ownerId).to.equal("owner-123");
    });

    it("should return 400 when name is empty", async () => {
      // Arrange
      const createPuppyDto = {
        name: "",
        breed: "Golden Retriever",
        birthDate: "2024-01-01T00:00:00.000Z",
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const response = await request(app.getHttpServer())
        .post("/puppies")
        .send(createPuppyDto);

      // Assert
      expect(response.status).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.body.message).to.equal("PuppyName cannot be empty");
    });

    it("should return 400 when weight is negative", async () => {
      // Arrange
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: "2024-01-01T00:00:00.000Z",
        currentWeight: -1,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      // Act
      const response = await request(app.getHttpServer())
        .post("/puppies")
        .send(createPuppyDto);

      // Assert
      expect(response.status).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.body.message).to.equal("Weight must be positive");
    });
  });

  describe("GET /puppies/:id", () => {
    it("should return puppy by id", async () => {
      // Arrange - First create a puppy
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: "2024-01-01T00:00:00.000Z",
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      const createResponse = await request(app.getHttpServer())
        .post("/puppies")
        .send(createPuppyDto);

      const puppyId = createResponse.body.data._id.value;

      // Act
      const response = await request(app.getHttpServer()).get(
        `/puppies/${puppyId}`
      );

      // Assert
      expect(response.status).to.equal(HttpStatus.OK);
      expect(response.body.success).to.be.true;
      expect(response.body.data.name.value).to.equal("Buddy");
      expect(response.body.data.breed.value).to.equal("Golden Retriever");
    });

    it("should return 404 when puppy not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";

      // Act
      const response = await request(app.getHttpServer()).get(
        `/puppies/${nonExistentId}`
      );

      // Assert
      expect(response.status).to.equal(HttpStatus.NOT_FOUND);
      expect(response.body.message).to.equal("Puppy not found");
    });
  });

  describe("GET /puppies/owner/:ownerId", () => {
    it("should return puppies by owner", async () => {
      // Arrange - Create multiple puppies for same owner
      const ownerId = "owner-123";

      const puppy1Dto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: "2024-01-01T00:00:00.000Z",
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId,
      };

      const puppy2Dto = {
        name: "Max",
        breed: "Labrador",
        birthDate: "2024-02-01T00:00:00.000Z",
        currentWeight: 6.0,
        weightUnit: WeightUnit.KG,
        ownerId,
      };

      await request(app.getHttpServer()).post("/puppies").send(puppy1Dto);

      await request(app.getHttpServer()).post("/puppies").send(puppy2Dto);

      // Act
      const response = await request(app.getHttpServer()).get(
        `/puppies/owner/${ownerId}`
      );

      // Assert
      expect(response.status).to.equal(HttpStatus.OK);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.length(2);
      expect(response.body.data[0].ownerId).to.equal(ownerId);
      expect(response.body.data[1].ownerId).to.equal(ownerId);
    });

    it("should return empty array when owner has no puppies", async () => {
      // Arrange
      const ownerId = "owner-with-no-puppies";

      // Act
      const response = await request(app.getHttpServer()).get(
        `/puppies/owner/${ownerId}`
      );

      // Assert
      expect(response.status).to.equal(HttpStatus.OK);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.length(0);
    });
  });

  describe("PUT /puppies/:id/weight", () => {
    it("should update puppy weight successfully", async () => {
      // Arrange - First create a puppy
      const createPuppyDto = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: "2024-01-01T00:00:00.000Z",
        currentWeight: 5.5,
        weightUnit: WeightUnit.KG,
        ownerId: "owner-123",
      };

      const createResponse = await request(app.getHttpServer())
        .post("/puppies")
        .send(createPuppyDto);

      const puppyId = createResponse.body.data._id.value;

      const updateWeightDto = {
        newWeight: 6.0,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const response = await request(app.getHttpServer())
        .put(`/puppies/${puppyId}/weight`)
        .send(updateWeightDto);

      // Assert
      expect(response.status).to.equal(HttpStatus.OK);
      expect(response.body.success).to.be.true;
      expect(response.body.data.currentWeight.value).to.equal(6.0);
      expect(response.body.data.currentWeight.unit).to.equal(WeightUnit.KG);
    });

    it("should return 404 when puppy not found", async () => {
      // Arrange
      const nonExistentId = "non-existent-id";
      const updateWeightDto = {
        newWeight: 6.0,
        weightUnit: WeightUnit.KG,
      };

      // Act
      const response = await request(app.getHttpServer())
        .put(`/puppies/${nonExistentId}/weight`)
        .send(updateWeightDto);

      // Assert
      expect(response.status).to.equal(HttpStatus.BAD_REQUEST);
      expect(response.body.message).to.equal("Puppy not found");
    });
  });
});
