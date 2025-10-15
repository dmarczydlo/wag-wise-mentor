import { Injectable, Inject } from "@nestjs/common";
import {
  User,
  UserId,
  Email,
  UserRole,
  UserRoleType,
} from "../../domain/auth/user.entity";
import { UserRepository } from "../../domain/auth/user.repository";
import { DomainResult, DomainError, Result } from "../../common/result/result";

export const USER_REPOSITORY = Symbol("UserRepository");

export interface GetUserCommand {
  userId: string;
}

export interface CreateUserProfileCommand {
  userId: string;
  email: string;
  role?: UserRoleType;
}

export interface UpdateUserProfileCommand {
  userId: string;
  role?: UserRoleType;
  isActive?: boolean;
}

export interface DeleteUserProfileCommand {
  userId: string;
}

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(command: GetUserCommand): Promise<DomainResult<User>> {
    const userIdResult = UserId.create(command.userId);
    if (userIdResult.isFailure()) {
      return Result.failure(userIdResult.getError());
    }

    const userResult = await this.userRepository.findById(
      userIdResult.getValue()
    );
    if (userResult.isFailure()) {
      return userResult;
    }

    const user = userResult.getValue();
    if (!user) {
      return Result.failure(DomainError.notFound("User", command.userId));
    }

    return Result.success(user);
  }
}

@Injectable()
export class CreateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(
    command: CreateUserProfileCommand
  ): Promise<DomainResult<User>> {
    const userIdResult = UserId.create(command.userId);
    if (userIdResult.isFailure()) {
      return Result.failure(userIdResult.getError());
    }

    const emailResult = Email.create(command.email);
    if (emailResult.isFailure()) {
      return Result.failure(emailResult.getError());
    }

    const roleResult = UserRole.create(command.role || UserRoleType.USER);
    if (roleResult.isFailure()) {
      return Result.failure(roleResult.getError());
    }

    const existingUserResult = await this.userRepository.findById(
      userIdResult.getValue()
    );
    if (existingUserResult.isFailure()) {
      return existingUserResult;
    }

    const existingUser = existingUserResult.getValue();
    if (existingUser) {
      return Result.failure(
        DomainError.conflict("User profile already exists")
      );
    }

    const userResult = User.create(
      userIdResult.getValue(),
      emailResult.getValue(),
      roleResult.getValue()
    );
    if (userResult.isFailure()) {
      return userResult;
    }

    return await this.userRepository.save(userResult.getValue());
  }
}

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(
    command: UpdateUserProfileCommand
  ): Promise<DomainResult<User>> {
    const userIdResult = UserId.create(command.userId);
    if (userIdResult.isFailure()) {
      return Result.failure(userIdResult.getError());
    }

    const userResult = await this.userRepository.findById(
      userIdResult.getValue()
    );
    if (userResult.isFailure()) {
      return userResult;
    }

    const user = userResult.getValue();
    if (!user) {
      return Result.failure(DomainError.notFound("User", command.userId));
    }

    let updatedUser = user;

    if (command.role !== undefined) {
      const roleResult = UserRole.create(command.role);
      if (roleResult.isFailure()) {
        return Result.failure(roleResult.getError());
      }
      updatedUser = updatedUser.changeRole(roleResult.getValue());
    }

    if (command.isActive !== undefined) {
      updatedUser = command.isActive
        ? updatedUser.activate()
        : updatedUser.deactivate();
    }

    return await this.userRepository.update(updatedUser);
  }
}

@Injectable()
export class DeleteUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(
    command: DeleteUserProfileCommand
  ): Promise<DomainResult<void>> {
    const userIdResult = UserId.create(command.userId);
    if (userIdResult.isFailure()) {
      return Result.failure(userIdResult.getError());
    }

    const userResult = await this.userRepository.findById(
      userIdResult.getValue()
    );
    if (userResult.isFailure()) {
      return Result.failure(userResult.getError());
    }

    const user = userResult.getValue();
    if (!user) {
      return Result.failure(DomainError.notFound("User", command.userId));
    }

    return await this.userRepository.delete(userIdResult.getValue());
  }
}
