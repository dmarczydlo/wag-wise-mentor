import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import {
  RegisterUserUseCase,
  LoginUseCase,
  PasswordResetUseCase,
  USER_REPOSITORY,
} from "../../application/auth/auth.use-cases";
import { InMemoryUserRepository } from "./in-memory-user.repository";

@Module({
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUseCase,
    PasswordResetUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
