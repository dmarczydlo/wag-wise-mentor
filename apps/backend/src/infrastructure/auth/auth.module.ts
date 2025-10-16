import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { InMemoryUserRepository } from "./in-memory-user.repository";
import { SupabaseUserRepository } from "./supabase-user.repository";
import { UserRepository } from "../../domain/auth/user.repository";
import {
  GetUserUseCase,
  CreateUserProfileUseCase,
  UpdateUserProfileUseCase,
  DeleteUserProfileUseCase,
  USER_REPOSITORY,
} from "../../application/auth/auth.use-cases";
import { SupabaseAuthGuard } from "./supabase-auth.guard";
import { ConfigurationModule } from "../config/config.module";

const isTestEnvironment = process.env.NODE_ENV === "test";

@Module({
  imports: [ConfigurationModule],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: isTestEnvironment
        ? InMemoryUserRepository
        : SupabaseUserRepository,
    },
    {
      provide: UserRepository,
      useClass: isTestEnvironment
        ? InMemoryUserRepository
        : SupabaseUserRepository,
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
