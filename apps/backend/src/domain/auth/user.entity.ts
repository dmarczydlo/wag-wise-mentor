import { Entity, ValueObject } from "../shared/base.entity";
import {
  Result,
  DomainError,
  type DomainResult,
} from "../../common/result/result";

export class UserId extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<UserId> {
    if (!value || value.trim().length === 0) {
      return Result.failure(DomainError.validation("UserId cannot be empty"));
    }
    return Result.success(new UserId(value));
  }
}

export class Email extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<Email> {
    if (!value || value.trim().length === 0) {
      return Result.failure(DomainError.validation("Email cannot be empty"));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Result.failure(DomainError.validation("Email format is invalid"));
    }
    return Result.success(new Email(value));
  }
}

export class Password extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }

  static create(value: string): DomainResult<Password> {
    if (!value || value.trim().length === 0) {
      return Result.failure(DomainError.validation("Password cannot be empty"));
    }
    if (value.length < 8) {
      return Result.failure(
        DomainError.validation("Password must be at least 8 characters long")
      );
    }
    return Result.success(new Password(value));
  }
}

export class UserRole extends ValueObject {
  constructor(public readonly value: UserRoleType) {
    super();
  }

  static create(value: UserRoleType): DomainResult<UserRole> {
    if (!Object.values(UserRoleType).includes(value)) {
      return Result.failure(DomainError.validation("Invalid user role"));
    }
    return Result.success(new UserRole(value));
  }
}

export enum UserRoleType {
  USER = "user",
  ADMIN = "admin",
  FAMILY_MEMBER = "family_member",
}

export class User extends Entity<UserId> {
  private constructor(
    id: UserId,
    public readonly email: Email,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }

  public static create(
    id: UserId,
    email: Email,
    role: UserRole = new UserRole(UserRoleType.USER)
  ): DomainResult<User> {
    return Result.success(new User(id, email, role, true));
  }

  public deactivate(): User {
    return new User(
      this.id,
      this.email,
      this.role,
      false,
      this.createdAt,
      new Date()
    );
  }

  public activate(): User {
    return new User(
      this.id,
      this.email,
      this.role,
      true,
      this.createdAt,
      new Date()
    );
  }

  public changeRole(newRole: UserRole): User {
    return new User(
      this.id,
      this.email,
      newRole,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  public isAdmin(): boolean {
    return this.role.value === UserRoleType.ADMIN;
  }

  public canManageFamily(): boolean {
    return (
      this.role.value === UserRoleType.ADMIN ||
      this.role.value === UserRoleType.USER
    );
  }
}
