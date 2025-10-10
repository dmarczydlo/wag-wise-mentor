import { Injectable, Inject } from "@nestjs/common";
import {
  User,
  UserId,
  Email,
  UserRole,
  UserRoleType,
} from "../../domain/auth/user.entity";
import { UserRepository } from "../../domain/auth/user.repository";

export const USER_REPOSITORY = Symbol("UserRepository");

export interface GetUserCommand {
  userId: string;
}

export interface GetUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface CreateUserProfileCommand {
  userId: string;
  email: string;
  role?: UserRoleType;
}

export interface CreateUserProfileResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UpdateUserProfileCommand {
  userId: string;
  role?: UserRoleType;
  isActive?: boolean;
}

export interface UpdateUserProfileResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface DeleteUserProfileCommand {
  userId: string;
}

export interface DeleteUserProfileResult {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(command: GetUserCommand): Promise<GetUserResult> {
    try {
      const userId = new UserId(command.userId);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

@Injectable()
export class CreateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(
    command: CreateUserProfileCommand
  ): Promise<CreateUserProfileResult> {
    try {
      const userId = new UserId(command.userId);
      const email = new Email(command.email);
      const role = new UserRole(command.role || UserRoleType.USER);

      const existingUser = await this.userRepository.findById(userId);
      if (existingUser) {
        return {
          success: false,
          error: "User profile already exists",
        };
      }

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
}

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(
    command: UpdateUserProfileCommand
  ): Promise<UpdateUserProfileResult> {
    try {
      const userId = new UserId(command.userId);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      let updatedUser = user;

      if (command.role !== undefined) {
        updatedUser = updatedUser.changeRole(new UserRole(command.role));
      }

      if (command.isActive !== undefined) {
        updatedUser = command.isActive
          ? updatedUser.activate()
          : updatedUser.deactivate();
      }

      const savedUser = await this.userRepository.update(updatedUser);

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
}

@Injectable()
export class DeleteUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(
    command: DeleteUserProfileCommand
  ): Promise<DeleteUserProfileResult> {
    try {
      const userId = new UserId(command.userId);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      await this.userRepository.delete(userId);

      return {
        success: true,
        message: "User profile deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
