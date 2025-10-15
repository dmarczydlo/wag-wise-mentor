import { Injectable } from "@nestjs/common";
import { User, UserId, Email } from "../../domain/auth/user.entity";
import { UserRepository } from "../../domain/auth/user.repository";
import { DomainResult, Result } from "../../common/result/result";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<DomainResult<User>> {
    try {
      this.users.set(user.id.value, user);
      return Result.success(user);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async findById(id: UserId): Promise<DomainResult<User | null>> {
    try {
      const user = this.users.get(id.value) || null;
      return Result.success(user);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async findByEmail(email: string): Promise<DomainResult<User | null>> {
    try {
      for (const user of this.users.values()) {
        if (user.email.value === email) {
          return Result.success(user);
        }
      }
      return Result.success(null);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async update(user: User): Promise<DomainResult<User>> {
    try {
      this.users.set(user.id.value, user);
      return Result.success(user);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async delete(id: UserId): Promise<DomainResult<void>> {
    try {
      this.users.delete(id.value);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async findAll(): Promise<DomainResult<User[]>> {
    try {
      const users = Array.from(this.users.values());
      return Result.success(users);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  // Test helper methods
  clear(): void {
    this.users.clear();
  }

  getCount(): number {
    return this.users.size;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}
