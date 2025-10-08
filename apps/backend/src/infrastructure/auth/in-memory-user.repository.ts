import { Injectable } from "@nestjs/common";
import { User, UserId, Email } from "../../domain/auth/user.entity";
import { UserRepository } from "../../domain/auth/user.repository";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id.value, user);
    return user;
  }

  async findById(id: UserId): Promise<User | null> {
    return this.users.get(id.value) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.value === email) {
        return user;
      }
    }
    return null;
  }

  async update(user: User): Promise<User> {
    this.users.set(user.id.value, user);
    return user;
  }

  async delete(id: UserId): Promise<void> {
    this.users.delete(id.value);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
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
