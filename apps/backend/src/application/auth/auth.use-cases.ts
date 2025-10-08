import { Injectable, Inject } from "@nestjs/common";
import {
  User,
  UserId,
  Email,
  Password,
  UserRole,
  UserRoleType,
} from "../../domain/auth/user.entity";
import { UserRepository } from "../../domain/auth/user.repository";
import * as bcrypt from "bcrypt";

export const USER_REPOSITORY = Symbol("UserRepository");

export interface RegisterUserCommand {
  email: string;
  password: string;
  role?: UserRoleType;
}

export interface RegisterUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface PasswordResetCommand {
  email: string;
}

export interface PasswordResetResult {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    try {
      const email = new Email(command.email);
      const password = new Password(command.password);
      const role = new UserRole(command.role || UserRoleType.USER);

      const existingUser = await this.userRepository.findByEmail(email.value);
      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        };
      }

      const hashedPassword = await bcrypt.hash(password.value, 10);
      const userId = new UserId(this.generateId());

      const user = User.create(userId, email, role);

      const savedUser = await this.userRepository.save(user);

      return {
        success: true,
        user: savedUser,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    try {
      const email = new Email(command.email);
      const password = new Password(command.password);

      const user = await this.userRepository.findByEmail(email.value);
      if (!user) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: "Account is deactivated",
        };
      }

      const isValidPassword = await bcrypt.compare(
        password.value,
        command.password
      );
      if (!isValidPassword) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      const token = this.generateJwtToken(user);

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private generateJwtToken(user: User): string {
    return `jwt_token_${user.id.value}_${Date.now()}`;
  }
}

@Injectable()
export class PasswordResetUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(command: PasswordResetCommand): Promise<PasswordResetResult> {
    try {
      const email = new Email(command.email);

      const user = await this.userRepository.findByEmail(email.value);
      if (!user) {
        return {
          success: true,
          message: "If the email exists, a password reset link has been sent",
        };
      }

      const resetToken = this.generateResetToken();
      await this.sendPasswordResetEmail(email.value, resetToken);

      return {
        success: true,
        message: "Password reset link has been sent to your email",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private generateResetToken(): string {
    return `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<void> {
    console.log(`Password reset email sent to ${email} with token ${token}`);
  }
}
