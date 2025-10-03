import { describe, it, beforeEach, afterEach } from "mocha";
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

/**
 * TestDataBuilder provides a fluent interface for creating test data objects.
 * This follows the Builder pattern to make test setup more readable and maintainable.
 */
export class PuppyTestDataBuilder {
  private puppyId: PuppyId = new PuppyId("test-puppy-1");
  private name: PuppyName = new PuppyName("Buddy");
  private breed: Breed = new Breed("Golden Retriever");
  private birthDate: BirthDate = new BirthDate(new Date("2023-01-01"));
  private currentWeight: Weight = new Weight(10, WeightUnit.KG);
  private ownerId: string = "owner-1";

  static create(): PuppyTestDataBuilder {
    return new PuppyTestDataBuilder();
  }

  withId(id: string): PuppyTestDataBuilder {
    this.puppyId = new PuppyId(id);
    return this;
  }

  withName(name: string): PuppyTestDataBuilder {
    this.name = new PuppyName(name);
    return this;
  }

  withBreed(breed: string): PuppyTestDataBuilder {
    this.breed = new Breed(breed);
    return this;
  }

  withBirthDate(date: Date): PuppyTestDataBuilder {
    this.birthDate = new BirthDate(date);
    return this;
  }

  withWeight(value: number, unit: WeightUnit = WeightUnit.KG): PuppyTestDataBuilder {
    this.currentWeight = new Weight(value, unit);
    return this;
  }

  withOwnerId(ownerId: string): PuppyTestDataBuilder {
    this.ownerId = ownerId;
    return this;
  }

  build(): Puppy {
    return Puppy.create(
      this.puppyId,
      this.name,
      this.breed,
      this.birthDate,
      this.currentWeight,
      this.ownerId
    );
  }

  // Convenience methods for common test scenarios
  static puppy(): PuppyTestDataBuilder {
    return PuppyTestDataBuilder.create();
  }

  static adultPuppy(): PuppyTestDataBuilder {
    const adultDate = new Date();
    adultDate.setFullYear(adultDate.getFullYear() - 2); // 2 years old
    return PuppyTestDataBuilder.create().withBirthDate(adultDate);
  }

  static youngPuppy(): PuppyTestDataBuilder {
    const youngDate = new Date();
    youngDate.setMonth(youngDate.getMonth() - 2); // 2 months old
    return PuppyTestDataBuilder.create().withBirthDate(youngDate);
  }

  static heavyPuppy(): PuppyTestDataBuilder {
    return PuppyTestDataBuilder.create().withWeight(25, WeightUnit.KG);
  }

  static lightPuppy(): PuppyTestDataBuilder {
    return PuppyTestDataBuilder.create().withWeight(2, WeightUnit.KG);
  }
}

/**
 * RepositoryTestHelper provides common operations for testing repositories.
 * It encapsulates common setup, teardown, and assertion patterns.
 */
export class RepositoryTestHelper {
  private repository: InMemoryPuppyRepository;

  constructor(repository: InMemoryPuppyRepository) {
    this.repository = repository;
  }

  /**
   * Setup method to run before each test
   */
  setup(): void {
    this.repository.clear();
  }

  /**
   * Teardown method to run after each test
   */
  teardown(): void {
    this.repository.clear();
  }

  /**
   * Create and save a puppy with default values
   */
  async createPuppy(
    overrides: Partial<{
      id: string;
      name: string;
      breed: string;
      birthDate: Date;
      weight: number;
      weightUnit: WeightUnit;
      ownerId: string;
    }> = {}
  ): Promise<Puppy> {
    const builder = PuppyTestDataBuilder.create();

    if (overrides.id) builder.withId(overrides.id);
    if (overrides.name) builder.withName(overrides.name);
    if (overrides.breed) builder.withBreed(overrides.breed);
    if (overrides.birthDate) builder.withBirthDate(overrides.birthDate);
    if (overrides.weight !== undefined) {
      builder.withWeight(overrides.weight, overrides.weightUnit || WeightUnit.KG);
    }
    if (overrides.ownerId) builder.withOwnerId(overrides.ownerId);

    const puppy = builder.build();
    return await this.repository.save(puppy);
  }

  /**
   * Create multiple puppies for testing
   */
  async createMultiplePuppies(
    count: number,
    ownerId: string = "owner-1"
  ): Promise<Puppy[]> {
    const puppies: Puppy[] = [];
    for (let i = 0; i < count; i++) {
      const puppy = await this.createPuppy({
        id: `puppy-${i + 1}`,
        name: `Puppy ${i + 1}`,
        ownerId,
      });
      puppies.push(puppy);
    }
    return puppies;
  }

  /**
   * Assert that repository contains expected number of puppies
   */
  assertPuppyCount(expectedCount: number): void {
    expect(this.repository.getCount()).to.equal(expectedCount);
  }

  /**
   * Assert that repository is empty
   */
  assertEmpty(): void {
    this.assertPuppyCount(0);
  }

  /**
   * Assert that puppy exists in repository
   */
  async assertPuppyExists(puppyId: string): Promise<void> {
    const puppy = await this.repository.findById(new PuppyId(puppyId));
    expect(puppy).to.not.be.null;
  }

  /**
   * Assert that puppy does not exist in repository
   */
  async assertPuppyNotExists(puppyId: string): Promise<void> {
    const puppy = await this.repository.findById(new PuppyId(puppyId));
    expect(puppy).to.be.null;
  }

  /**
   * Assert that owner has expected number of puppies
   */
  async assertOwnerPuppyCount(
    ownerId: string,
    expectedCount: number
  ): Promise<void> {
    const puppies = await this.repository.findByOwnerId(ownerId);
    expect(puppies).to.have.length(expectedCount);
  }
}

/**
 * UseCaseTestHelper provides common operations for testing use cases.
 * It encapsulates common setup, teardown, and assertion patterns.
 */
export class UseCaseTestHelper {
  private repository: InMemoryPuppyRepository;
  private repositoryHelper: RepositoryTestHelper;

  constructor(repository: InMemoryPuppyRepository) {
    this.repository = repository;
    this.repositoryHelper = new RepositoryTestHelper(repository);
  }

  /**
   * Setup method to run before each test
   */
  setup(): void {
    this.repositoryHelper.setup();
  }

  /**
   * Teardown method to run after each test
   */
  teardown(): void {
    this.repositoryHelper.teardown();
  }

  /**
   * Get the repository helper for direct repository operations
   */
  getRepositoryHelper(): RepositoryTestHelper {
    return this.repositoryHelper;
  }

  /**
   * Assert successful use case result
   */
  assertSuccess<T>(
    result: { success: boolean; error?: string },
    expectedData?: T
  ): void {
    expect(result.success).to.be.true;
    expect(result.error).to.be.undefined;
    if (expectedData !== undefined) {
      expect(result).to.deep.include({ success: true });
    }
  }

  /**
   * Assert failed use case result
   */
  assertFailure(
    result: { success: boolean; error?: string },
    expectedError?: string
  ): void {
    expect(result.success).to.be.false;
    expect(result.error).to.not.be.undefined;
    if (expectedError) {
      expect(result.error).to.include(expectedError);
    }
  }

  /**
   * Assert validation error
   */
  assertValidationError(
    result: { success: boolean; error?: string },
    field: string
  ): void {
    this.assertFailure(result);
    expect(result.error).to.include(field);
  }
}

/**
 * IntegrationTestHelper provides common operations for integration tests.
 * It encapsulates common setup, teardown, and assertion patterns for API tests.
 */
export class IntegrationTestHelper {
  private repository: InMemoryPuppyRepository;
  private repositoryHelper: RepositoryTestHelper;

  constructor(repository: InMemoryPuppyRepository) {
    this.repository = repository;
    this.repositoryHelper = new RepositoryTestHelper(repository);
  }

  /**
   * Setup method to run before each test
   */
  setup(): void {
    this.repositoryHelper.setup();
  }

  /**
   * Teardown method to run after each test
   */
  teardown(): void {
    this.repositoryHelper.teardown();
  }

  /**
   * Get the repository helper for direct repository operations
   */
  getRepositoryHelper(): RepositoryTestHelper {
    return this.repositoryHelper;
  }

  /**
   * Assert successful API response
   */
  assertSuccessResponse<T>(
    response: { success: boolean; error?: string },
    expectedData?: T
  ): void {
    expect(response.success).to.be.true;
    expect(response.error).to.be.undefined;
    if (expectedData !== undefined) {
      expect(response).to.deep.include({ success: true });
    }
  }

  /**
   * Assert failed API response
   */
  assertErrorResponse(
    response: { success: boolean; error?: string },
    expectedError?: string
  ): void {
    expect(response.success).to.be.false;
    expect(response.error).to.not.be.undefined;
    if (expectedError) {
      expect(response.error).to.include(expectedError);
    }
  }

  /**
   * Assert validation error response
   */
  assertValidationErrorResponse(
    response: { success: boolean; error?: string },
    field: string
  ): void {
    this.assertErrorResponse(response);
    expect(response.error).to.include(field);
  }

  /**
   * Assert not found error response
   */
  assertNotFoundResponse(response: { success: boolean; error?: string }): void {
    this.assertErrorResponse(response, "not found");
  }
}

/**
 * Test data factory for creating common test scenarios
 */
export class TestDataFactory {
  /**
   * Create a valid puppy for testing
   */
  static createValidPuppy(
    overrides: Partial<{
      id: string;
      name: string;
      breed: string;
      birthDate: Date;
      weight: number;
      weightUnit: WeightUnit;
      ownerId: string;
    }> = {}
  ): Puppy {
    return PuppyTestDataBuilder.create()
      .withId(overrides.id || "test-puppy-1")
      .withName(overrides.name || "Buddy")
      .withBreed(overrides.breed || "Golden Retriever")
      .withBirthDate(overrides.birthDate || new Date("2023-01-01"))
      .withWeight(overrides.weight || 10, overrides.weightUnit || WeightUnit.KG)
      .withOwnerId(overrides.ownerId || "owner-1")
      .build();
  }

  /**
   * Create an adult puppy (over 12 months)
   */
  static createAdultPuppy(): Puppy {
    return PuppyTestDataBuilder.adultPuppy().build();
  }

  /**
   * Create a young puppy (under 3 months)
   */
  static createYoungPuppy(): Puppy {
    return PuppyTestDataBuilder.youngPuppy().build();
  }

  /**
   * Create a heavy puppy
   */
  static createHeavyPuppy(): Puppy {
    return PuppyTestDataBuilder.heavyPuppy().build();
  }

  /**
   * Create a light puppy
   */
  static createLightPuppy(): Puppy {
    return PuppyTestDataBuilder.lightPuppy().build();
  }

  /**
   * Create multiple puppies for the same owner
   */
  static createMultiplePuppiesForOwner(
    ownerId: string,
    count: number
  ): Puppy[] {
    const puppies: Puppy[] = [];
    for (let i = 0; i < count; i++) {
      puppies.push(
        PuppyTestDataBuilder.create()
          .withId(`puppy-${i + 1}`)
          .withName(`Puppy ${i + 1}`)
          .withOwnerId(ownerId)
          .build()
      );
    }
    return puppies;
  }

  /**
   * Create puppies for different owners
   */
  static createPuppiesForDifferentOwners(ownerIds: string[]): Puppy[] {
    return ownerIds.map((ownerId, index) =>
      PuppyTestDataBuilder.create()
        .withId(`puppy-${index + 1}`)
        .withName(`Puppy ${index + 1}`)
        .withOwnerId(ownerId)
        .build()
    );
  }
}

/**
 * Common test patterns and utilities
 */
export class TestPatterns {
  /**
   * Run a test with repository setup and teardown
   */
  static withRepository<T>(
    repository: InMemoryPuppyRepository,
    testFn: (helper: RepositoryTestHelper) => T
  ): T {
    const helper = new RepositoryTestHelper(repository);
    helper.setup();
    try {
      return testFn(helper);
    } finally {
      helper.teardown();
    }
  }

  /**
   * Run a test with use case setup and teardown
   */
  static withUseCase<T>(
    repository: InMemoryPuppyRepository,
    testFn: (helper: UseCaseTestHelper) => T
  ): T {
    const helper = new UseCaseTestHelper(repository);
    helper.setup();
    try {
      return testFn(helper);
    } finally {
      helper.teardown();
    }
  }

  /**
   * Run a test with integration setup and teardown
   */
  static withIntegration<T>(
    repository: InMemoryPuppyRepository,
    testFn: (helper: IntegrationTestHelper) => T
  ): T {
    const helper = new IntegrationTestHelper(repository);
    helper.setup();
    try {
      return testFn(helper);
    } finally {
      helper.teardown();
    }
  }
}

// Example usage in tests:
describe("TestDataBuilder Example", () => {
  let repository: InMemoryPuppyRepository;

  beforeEach(() => {
    repository = new InMemoryPuppyRepository();
  });

  it("should create puppy with builder pattern", async () => {
    // Arrange
    const puppy = PuppyTestDataBuilder.create()
      .withName("Max")
      .withBreed("Labrador")
      .withWeight(15, WeightUnit.KG)
      .build();

    // Act
    const savedPuppy = await repository.save(puppy);

    // Assert
    expect(savedPuppy.name.value).to.equal("Max");
    expect(savedPuppy.breed.value).to.equal("Labrador");
    expect(savedPuppy.currentWeight.value).to.equal(15);
  });

  it("should use repository helper", async () => {
    // Arrange
    const helper = new RepositoryTestHelper(repository);
    helper.setup();

    // Act
    await helper.createPuppy({ name: "Buddy", ownerId: "owner-1" });

    // Assert
    helper.assertPuppyCount(1);
    await helper.assertPuppyExists("test-puppy-1");
  });
});
