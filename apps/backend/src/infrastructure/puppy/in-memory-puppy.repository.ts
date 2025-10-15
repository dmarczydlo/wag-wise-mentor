import { Injectable } from "@nestjs/common";
import { Puppy, PuppyId } from "../../domain/puppy/puppy.entity";
import { PuppyRepository } from "../../domain/puppy/puppy.repository";
import { DomainResult, Result } from "../../common/result/result";

@Injectable()
export class InMemoryPuppyRepository implements PuppyRepository {
  private puppies: Map<string, Puppy> = new Map();

  async findById(id: PuppyId): Promise<DomainResult<Puppy | null>> {
    try {
      const puppy = this.puppies.get(id.value) || null;
      return Result.success(puppy);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to find puppy",
      });
    }
  }

  async findByOwnerId(ownerId: string): Promise<DomainResult<Puppy[]>> {
    try {
      const puppies = Array.from(this.puppies.values()).filter(
        (puppy) => puppy.ownerId === ownerId
      );
      return Result.success(puppies);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to find puppies by owner",
      });
    }
  }

  async findAll(): Promise<DomainResult<Puppy[]>> {
    try {
      const puppies = Array.from(this.puppies.values());
      return Result.success(puppies);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to find all puppies",
      });
    }
  }

  async save(puppy: Puppy): Promise<DomainResult<Puppy>> {
    try {
      this.puppies.set(puppy.id.value, puppy);
      return Result.success(puppy);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to save puppy",
      });
    }
  }

  async update(puppy: Puppy): Promise<DomainResult<Puppy>> {
    try {
      if (!this.puppies.has(puppy.id.value)) {
        return Result.failure({
          code: "NOT_FOUND",
          message: "Puppy not found",
        });
      }
      this.puppies.set(puppy.id.value, puppy);
      return Result.success(puppy);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to update puppy",
      });
    }
  }

  async delete(id: PuppyId): Promise<DomainResult<void>> {
    try {
      this.puppies.delete(id.value);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure({
        code: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to delete puppy",
      });
    }
  }

  clear(): void {
    this.puppies.clear();
  }

  getCount(): number {
    return this.puppies.size;
  }

  getAllPuppies(): Puppy[] {
    return Array.from(this.puppies.values());
  }
}
