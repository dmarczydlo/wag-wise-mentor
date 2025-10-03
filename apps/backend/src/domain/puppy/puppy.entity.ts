import { Entity } from "../shared/base.entity";
import { ValueObject } from "../shared/base.entity";

export class PuppyId extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error("PuppyId cannot be empty");
    }
  }
}

export class PuppyName extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error("PuppyName cannot be empty");
    }
    if (value.length > 100) {
      throw new Error("PuppyName cannot exceed 100 characters");
    }
  }
}

export class Breed extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error("Breed cannot be empty");
    }
  }
}

export class Weight extends ValueObject {
  constructor(
    public readonly value: number,
    public readonly unit: WeightUnit
  ) {
    super();
    if (value <= 0) {
      throw new Error("Weight must be positive");
    }
  }

  public convertTo(targetUnit: WeightUnit): Weight {
    if (this.unit === targetUnit) {
      return this;
    }

    let kgValue: number;
    if (this.unit === WeightUnit.KG) {
      kgValue = this.value;
    } else if (this.unit === WeightUnit.LBS) {
      kgValue = this.value * 0.453592;
    } else {
      throw new Error(`Unsupported weight unit: ${this.unit}`);
    }

    let targetValue: number;
    if (targetUnit === WeightUnit.KG) {
      targetValue = kgValue;
    } else if (targetUnit === WeightUnit.LBS) {
      targetValue = kgValue / 0.453592;
    } else {
      throw new Error(`Unsupported target weight unit: ${targetUnit}`);
    }

    return new Weight(targetValue, targetUnit);
  }
}

export enum WeightUnit {
  KG = "kg",
  LBS = "lbs",
}

export class BirthDate extends ValueObject {
  constructor(public readonly value: Date) {
    super();
    if (!value) {
      throw new Error("BirthDate cannot be null");
    }
    if (value > new Date()) {
      throw new Error("BirthDate cannot be in the future");
    }
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
  ): Puppy {
    if (!ownerId || ownerId.trim().length === 0) {
      throw new Error("OwnerId cannot be empty");
    }

    return new Puppy(id, name, breed, birthDate, currentWeight, ownerId);
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
