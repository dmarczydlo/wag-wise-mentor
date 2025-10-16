import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { InMemoryUserRepository } from "./in-memory-user.repository";
import { UserRepository } from "../../domain/auth/user.repository";
import {
  GetUserUseCase,
  CreateUserProfileUseCase,
  UpdateUserProfileUseCase,
  DeleteUserProfileUseCase,
  USER_REPOSITORY,
} from "../../application/auth/auth.use-cases";
import { SupabaseAuthGuard } from "./supabase-auth.guard";

const _isTestEnvironment = process.env.NODE_ENV === "test";

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
    GetUserUseCase,
    CreateUserProfileUseCase,
    UpdateUserProfileUseCase,
    DeleteUserProfileUseCase,
    SupabaseAuthGuard,
  ],
  exports: [UserRepository, SupabaseAuthGuard],
})
export class AuthModule {}
