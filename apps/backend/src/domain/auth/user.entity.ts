import { Entity } from "../shared/base.entity";
import { ValueObject } from "../shared/base.entity";

export class UserId extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error("UserId cannot be empty");
    }
  }
}

export class Email extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error("Email format is invalid");
    }
  }
}

export class Password extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error("Password cannot be empty");
    }
    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
  }
}

export class UserRole extends ValueObject {
  constructor(public readonly value: UserRoleType) {
    super();
    if (!Object.values(UserRoleType).includes(value)) {
      throw new Error("Invalid user role");
    }
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
  ): User {
    return new User(id, email, role, true);
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
    return this.role.value === UserRoleType.ADMIN || this.role.value === UserRoleType.USER;
  }
}
