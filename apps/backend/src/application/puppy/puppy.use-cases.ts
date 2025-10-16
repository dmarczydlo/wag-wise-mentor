import { Injectable, Inject } from "@nestjs/common";
import {
  Puppy,
  PuppyId,
  PuppyName,
  Breed,
  BirthDate,
  Weight,
  type WeightUnit,
} from "../../domain/puppy/puppy.entity";
import { PuppyRepository } from "../../domain/puppy/puppy.repository";
import {
  type DomainResult,
  DomainError,
  Result,
} from "../../common/result/result";

export const PUPPY_REPOSITORY = Symbol("PuppyRepository");

export interface CreatePuppyCommand {
  name: string;
  breed: string;
  birthDate: Date;
  currentWeight: number;
  weightUnit: WeightUnit;
  ownerId: string;
}

export interface UpdatePuppyWeightCommand {
  puppyId: string;
  newWeight: number;
  weightUnit: WeightUnit;
}

@Injectable()
export class CreatePuppyUseCase {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  async execute(command: CreatePuppyCommand): Promise<DomainResult<Puppy>> {
    // Create all value objects
    const puppyIdResult = PuppyId.create(this.generateId());
    const nameResult = PuppyName.create(command.name);
    const breedResult = Breed.create(command.breed);
    const birthDateResult = BirthDate.create(command.birthDate);
    const weightResult = Weight.create(
      command.currentWeight,
      command.weightUnit
    );

    // Check if any creation failed
    if (puppyIdResult.isFailure())
      return Result.failure(puppyIdResult.getError());
    if (nameResult.isFailure()) return Result.failure(nameResult.getError());
    if (breedResult.isFailure()) return Result.failure(breedResult.getError());
    if (birthDateResult.isFailure())
      return Result.failure(birthDateResult.getError());
    if (weightResult.isFailure())
      return Result.failure(weightResult.getError());

    // Create the puppy
    const puppyResult = Puppy.create(
      puppyIdResult.getValue(),
      nameResult.getValue(),
      breedResult.getValue(),
      birthDateResult.getValue(),
      weightResult.getValue(),
      command.ownerId
    );

    if (puppyResult.isFailure()) {
      return puppyResult;
    }

    // Save the puppy
    return await this.puppyRepository.save(puppyResult.getValue());
  }

  private generateId(): string {
    return `puppy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

@Injectable()
export class GetPuppyByIdUseCase {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  async execute(id: string): Promise<DomainResult<Puppy | null>> {
    const puppyIdResult = PuppyId.create(id);
    if (puppyIdResult.isFailure()) {
      return Result.failure(puppyIdResult.getError());
    }
    return await this.puppyRepository.findById(puppyIdResult.getValue());
  }
}

@Injectable()
export class GetPuppiesByOwnerUseCase {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  async execute(ownerId: string): Promise<DomainResult<Puppy[]>> {
    return await this.puppyRepository.findByOwnerId(ownerId);
  }
}

@Injectable()
export class UpdatePuppyWeightUseCase {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  async execute(
    command: UpdatePuppyWeightCommand
  ): Promise<DomainResult<Puppy>> {
    const puppyIdResult = PuppyId.create(command.puppyId);
    if (puppyIdResult.isFailure()) {
      return Result.failure(puppyIdResult.getError());
    }

    const puppyResult = await this.puppyRepository.findById(
      puppyIdResult.getValue()
    );
    if (puppyResult.isFailure()) {
      return puppyResult;
    }

    const puppy = puppyResult.getValue();
    if (!puppy) {
      return Result.failure(DomainError.notFound("Puppy", command.puppyId));
    }

    const weightResult = Weight.create(command.newWeight, command.weightUnit);
    if (weightResult.isFailure()) {
      return Result.failure(weightResult.getError());
    }

    const updatedPuppy = puppy.updateWeight(weightResult.getValue());
    return await this.puppyRepository.update(updatedPuppy);
  }
}
