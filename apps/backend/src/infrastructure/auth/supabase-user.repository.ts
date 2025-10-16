import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../config/supabase.service";
import { UserRepository } from "../../domain/auth/user.repository";
import {
  User,
  UserId,
  Email,
  UserRole,
  UserRoleType,
} from "../../domain/auth/user.entity";
import {
  Result,
  DomainError,
  type DomainResult,
} from "../../common/result/result";

interface ProfileRow {
  id: string;
  email: string;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class SupabaseUserRepository extends UserRepository {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async save(user: User): Promise<DomainResult<User>> {
    try {
      const profileData = {
        id: user.id.value,
        email: user.email.value,
        language_preference: "en",
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("profiles")
        .upsert(profileData)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to save user: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToUser(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error saving user: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findById(id: UserId): Promise<DomainResult<User | null>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("profiles")
        .select("*")
        .eq("id", id.value)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Result.success(null);
        }
        return Result.failure(
          DomainError.internal(`Failed to find user: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToUser(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding user: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByEmail(email: string): Promise<DomainResult<User | null>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Result.success(null);
        }
        return Result.failure(
          DomainError.internal(`Failed to find user by email: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToUser(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding user by email: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async update(user: User): Promise<DomainResult<User>> {
    try {
      const profileData = {
        email: user.email.value,
        language_preference: "en",
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("profiles")
        .update(profileData)
        .eq("id", user.id.value)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to update user: ${error.message}`)
        );
      }

      return Result.success(this.mapRowToUser(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error updating user: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async delete(id: UserId): Promise<DomainResult<void>> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from("profiles")
        .delete()
        .eq("id", id.value);

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to delete user: ${error.message}`)
        );
      }

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error deleting user: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findAll(): Promise<DomainResult<User[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("profiles")
        .select("*");

      if (error) {
        return Result.failure(
          DomainError.internal(`Failed to find all users: ${error.message}`)
        );
      }

      const users = data.map(row => this.mapRowToUser(row));
      return Result.success(users);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding all users: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  private mapRowToUser(row: ProfileRow): User {
    const userIdResult = UserId.create(row.id);
    const emailResult = Email.create(row.email);
    const roleResult = UserRole.create(UserRoleType.USER);

    if (userIdResult.isFailure()) {
      throw new Error(`Invalid user ID: ${userIdResult.getError().message}`);
    }
    if (emailResult.isFailure()) {
      throw new Error(`Invalid email: ${emailResult.getError().message}`);
    }
    if (roleResult.isFailure()) {
      throw new Error(`Invalid role: ${roleResult.getError().message}`);
    }

    const userResult = User.create(
      userIdResult.getValue(),
      emailResult.getValue(),
      roleResult.getValue()
    );

    if (userResult.isFailure()) {
      throw new Error(
        `Failed to create user: ${userResult.getError().message}`
      );
    }

    return userResult.getValue();
  }
}
