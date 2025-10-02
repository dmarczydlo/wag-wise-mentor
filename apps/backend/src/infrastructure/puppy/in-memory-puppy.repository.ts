import { Injectable } from "@nestjs/common";
import { Puppy, PuppyId } from "../../domain/puppy/puppy.entity";
import { PuppyRepository } from "../../domain/puppy/puppy.repository";

// In-Memory Implementation (Adapter) - Perfect for testing
@Injectable()
export class InMemoryPuppyRepository implements PuppyRepository {
  private puppies: Map<string, Puppy> = new Map();

  async findById(id: PuppyId): Promise<Puppy | null> {
    return this.puppies.get(id.value) || null;
  }

  async findByOwnerId(ownerId: string): Promise<Puppy[]> {
    return Array.from(this.puppies.values()).filter(
      (puppy) => puppy.ownerId === ownerId
    );
  }

  async findAll(): Promise<Puppy[]> {
    return Array.from(this.puppies.values());
  }

  async save(puppy: Puppy): Promise<Puppy> {
    this.puppies.set(puppy.id.value, puppy);
    return puppy;
  }

  async update(puppy: Puppy): Promise<Puppy> {
    if (!this.puppies.has(puppy.id.value)) {
      throw new Error("Puppy not found");
    }
    this.puppies.set(puppy.id.value, puppy);
    return puppy;
  }

  async delete(id: PuppyId): Promise<void> {
    this.puppies.delete(id.value);
  }

  // Test helper methods
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
