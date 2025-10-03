import { Injectable, Inject } from "@nestjs/common";
import {
  Puppy,
  PuppyId,
  PuppyName,
  Breed,
  BirthDate,
  Weight,
  WeightUnit,
} from "../../domain/puppy/puppy.entity";
import { PuppyRepository } from "../../domain/puppy/puppy.repository";

export const PUPPY_REPOSITORY = Symbol("PuppyRepository");

export interface CreatePuppyCommand {
  name: string;
  breed: string;
  birthDate: Date;
  currentWeight: number;
  weightUnit: WeightUnit;
  ownerId: string;
}

export interface CreatePuppyResult {
  success: boolean;
  puppy?: Puppy;
  error?: string;
}

@Injectable()
export class CreatePuppyUseCase {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  async execute(command: CreatePuppyCommand): Promise<CreatePuppyResult> {
    try {
      const puppyId = new PuppyId(this.generateId());
      const name = new PuppyName(command.name);
      const breed = new Breed(command.breed);
      const birthDate = new BirthDate(command.birthDate);
      const currentWeight = new Weight(
        command.currentWeight,
        command.weightUnit
      );

      const puppy = Puppy.create(
        puppyId,
        name,
        breed,
        birthDate,
        currentWeight,
        command.ownerId
      );

      const savedPuppy = await this.puppyRepository.save(puppy);

      return {
        success: true,
        puppy: savedPuppy,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
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

  async execute(id: string): Promise<Puppy | null> {
    const puppyId = new PuppyId(id);
    return await this.puppyRepository.findById(puppyId);
  }
}

@Injectable()
export class GetPuppiesByOwnerUseCase {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  async execute(ownerId: string): Promise<Puppy[]> {
    return await this.puppyRepository.findByOwnerId(ownerId);
  }
}

export interface UpdatePuppyWeightCommand {
  puppyId: string;
  newWeight: number;
  weightUnit: WeightUnit;
}

@Injectable()
export class UpdatePuppyWeightUseCase {
  constructor(
    @Inject(PUPPY_REPOSITORY) private readonly puppyRepository: PuppyRepository
  ) {}

  async execute(command: UpdatePuppyWeightCommand): Promise<CreatePuppyResult> {
    try {
      const puppyId = new PuppyId(command.puppyId);
      const puppy = await this.puppyRepository.findById(puppyId);

      if (!puppy) {
        return {
          success: false,
          error: "Puppy not found",
        };
      }

      const newWeight = new Weight(command.newWeight, command.weightUnit);
      const updatedPuppy = puppy.updateWeight(newWeight);

      const savedPuppy = await this.puppyRepository.update(updatedPuppy);

      return {
        success: true,
        puppy: savedPuppy,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
