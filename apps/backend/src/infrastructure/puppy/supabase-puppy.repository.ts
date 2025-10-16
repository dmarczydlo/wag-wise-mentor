import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../config/supabase.service";
import { PuppyRepository } from "../../domain/puppy/puppy.repository";
import {
  Puppy,
  PuppyId,
  PuppyName,
  Breed,
  BirthDate,
  Weight,
  WeightUnit,
} from "../../domain/puppy/puppy.entity";
import {
  Result,
  DomainError,
  type DomainResult,
} from "../../common/result/result";

interface PuppyRow {
  id: string;
  owner_id: string;
  name: string;
  breed: string;
  birthday: string;
  current_weight: number;
  target_weight?: number;
  activity_level: string;
  photo_url?: string;
  characteristics: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class SupabasePuppyRepository extends PuppyRepository {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async findById(id: PuppyId): Promise<DomainResult<Puppy | null>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("puppies")
        .select("*")
        .eq("id", id.value)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Result.success(null);
        }
        return Result.failure(
          DomainError.internal(`Failed to find puppy: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToPuppy(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding puppy: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByOwnerId(ownerId: string): Promise<DomainResult<Puppy[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("puppies")
        .select("*")
        .eq("owner_id", ownerId);

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find puppies by owner: ${error.message}`
          )
        );
      }

      const puppies = data.map(row => this.mapRowToPuppy(row));
      return Result.success(puppies);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding puppies by owner: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findAll(): Promise<DomainResult<Puppy[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("puppies")
        .select("*");

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to find all puppies: ${error.message}`)
        );
      }

      const puppies = data.map(row => this.mapRowToPuppy(row));
      return Result.success(puppies);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding all puppies: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async save(puppy: Puppy): Promise<DomainResult<Puppy>> {
    try {
      const puppyData = {
        id: puppy.id.value,
        owner_id: puppy.ownerId,
        name: puppy.name.value,
        breed: puppy.breed.value,
        birthday: puppy.birthDate.value.toISOString().split("T")[0],
        current_weight: puppy.currentWeight.value,
        target_weight: null,
        activity_level: "moderate",
        photo_url: null,
        characteristics: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("puppies")
        .insert(puppyData)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to save puppy: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToPuppy(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error saving puppy: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async update(puppy: Puppy): Promise<DomainResult<Puppy>> {
    try {
      const puppyData = {
        name: puppy.name.value,
        breed: puppy.breed.value,
        birthday: puppy.birthDate.value.toISOString().split("T")[0],
        current_weight: puppy.currentWeight.value,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("puppies")
        .update(puppyData)
        .eq("id", puppy.id.value)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to update puppy: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToPuppy(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error updating puppy: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async delete(id: PuppyId): Promise<DomainResult<void>> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from("puppies")
        .delete()
        .eq("id", id.value);

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to delete puppy: ${error.message}`)
        );
      }

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error deleting puppy: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  private mapRowToPuppy(row: PuppyRow): Puppy {
    const puppyIdResult = PuppyId.create(row.id);
    const nameResult = PuppyName.create(row.name);
    const breedResult = Breed.create(row.breed);
    const birthDateResult = BirthDate.create(new Date(row.birthday));
    const weightResult = Weight.create(row.current_weight, WeightUnit.KG);

    if (puppyIdResult.isFailure()) {
      throw new Error(`Invalid puppy ID: ${puppyIdResult.getError().message}`);
    }
    if (nameResult.isFailure()) {
      throw new Error(`Invalid puppy name: ${nameResult.getError().message}`);
    }
    if (breedResult.isFailure()) {
      throw new Error(`Invalid breed: ${breedResult.getError().message}`);
    }
    if (birthDateResult.isFailure()) {
      throw new Error(
        `Invalid birth date: ${birthDateResult.getError().message}`
      );
    }
    if (weightResult.isFailure()) {
      throw new Error(`Invalid weight: ${weightResult.getError().message}`);
    }

    const puppyResult = Puppy.create(
      puppyIdResult.getValue(),
      nameResult.getValue(),
      breedResult.getValue(),
      birthDateResult.getValue(),
      weightResult.getValue(),
      row.owner_id
    );

    if (puppyResult.isFailure()) {
      throw new Error(
        `Failed to create puppy: ${puppyResult.getError().message}`
      );
    }

    return puppyResult.getValue();
  }
}
