import { Entity } from "../shared/base.entity";
import { ValueObject } from "../shared/base.entity";
import { Result, DomainError, DomainResult } from "../../common/result/result";

export class PuppyId extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<PuppyId> {
    if (!value || value.trim().length === 0) {
      return Result.failure(DomainError.validation("PuppyId cannot be empty"));
    }
    return Result.success(new PuppyId(value));
  }
}

export class PuppyName extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<PuppyName> {
    if (!value || value.trim().length === 0) {
      return Result.failure(
        DomainError.validation("PuppyName cannot be empty")
      );
    }
    if (value.length > 100) {
      return Result.failure(
        DomainError.validation("PuppyName cannot exceed 100 characters")
      );
    }
    return Result.success(new PuppyName(value));
  }
}

export class Breed extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<Breed> {
    if (!value || value.trim().length === 0) {
      return Result.failure(DomainError.validation("Breed cannot be empty"));
    }
    return Result.success(new Breed(value));
  }
}

export class Weight extends ValueObject {
  constructor(
    public readonly value: number,
    public readonly unit: WeightUnit
  ) {
    super();
  }

  static create(value: number, unit: WeightUnit): DomainResult<Weight> {
    if (value <= 0) {
      return Result.failure(DomainError.validation("Weight must be positive"));
    }
    return Result.success(new Weight(value, unit));
  }

  public convertTo(targetUnit: WeightUnit): DomainResult<Weight> {
    if (this.unit === targetUnit) {
      return Result.success(this);
    }

    let kgValue: number;
    if (this.unit === WeightUnit.KG) {
      kgValue = this.value;
    } else if (this.unit === WeightUnit.LBS) {
      kgValue = this.value * 0.453592;
    } else {
      return Result.failure(
        DomainError.validation(`Unsupported weight unit: ${this.unit}`)
      );
    }

    let targetValue: number;
    if (targetUnit === WeightUnit.KG) {
      targetValue = kgValue;
    } else if (targetUnit === WeightUnit.LBS) {
      targetValue = kgValue / 0.453592;
    } else {
      return Result.failure(
        DomainError.validation(`Unsupported target weight unit: ${targetUnit}`)
      );
    }

    return Result.success(new Weight(targetValue, targetUnit));
  }
}

export enum WeightUnit {
  KG = "kg",
  LBS = "lbs",
}

export class BirthDate extends ValueObject {
  constructor(public readonly value: Date) {
    super();
  }

  static create(value: Date): DomainResult<BirthDate> {
    if (!value) {
      return Result.failure(DomainError.validation("BirthDate cannot be null"));
    }
    if (value > new Date()) {
      return Result.failure(
        DomainError.validation("BirthDate cannot be in the future")
      );
    }
    return Result.success(new BirthDate(value));
  }

  public getAgeInDays(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.value.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  public getAgeInWeeks(): number {
    return Math.floor(this.getAgeInDays() / 7);
  }

  public getAgeInMonths(): number {
    const now = new Date();
    const birthYear = this.value.getFullYear();
    const birthMonth = this.value.getMonth();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return (currentYear - birthYear) * 12 + (currentMonth - birthMonth);
  }
}

export class Puppy extends Entity<PuppyId> {
  private constructor(
    id: PuppyId,
    public readonly name: PuppyName,
    public readonly breed: Breed,
    public readonly birthDate: BirthDate,
    public readonly currentWeight: Weight,
    public readonly ownerId: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: PuppyId,
    name: PuppyName,
    breed: Breed,
    birthDate: BirthDate,
    currentWeight: Weight,
    ownerId: string
  ): DomainResult<Puppy> {
    if (!ownerId || ownerId.trim().length === 0) {
      return Result.failure(DomainError.validation("OwnerId cannot be empty"));
    }

    return Result.success(
      new Puppy(id, name, breed, birthDate, currentWeight, ownerId)
    );
  }

  public updateWeight(newWeight: Weight): Puppy {
    return new Puppy(
      this.id,
      this.name,
      this.breed,
      this.birthDate,
      newWeight,
      this.ownerId,
      this.createdAt,
      new Date()
    );
  }

  public isAdult(): boolean {
    return this.birthDate.getAgeInMonths() >= 12;
  }

  public getFeedingFrequency(): number {
    const ageInMonths = this.birthDate.getAgeInMonths();

    if (ageInMonths < 3) {
      return 4; // 4 times per day for puppies under 3 months
    } else if (ageInMonths < 6) {
      return 3; // 3 times per day for puppies 3-6 months
    } else if (ageInMonths < 12) {
      return 2; // 2 times per day for puppies 6-12 months
    } else {
      return 2; // 2 times per day for adult dogs
    }
  }
}
