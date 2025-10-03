import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  RegisterUserUseCase,
  RegisterUserCommand,
  LoginUseCase,
  LoginCommand,
  PasswordResetUseCase,
  PasswordResetCommand,
} from "../../application/auth/auth.use-cases";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly passwordResetUseCase: PasswordResetUseCase
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Invalid input or user already exists" })
  async register(@Body() command: RegisterUserCommand) {
    return await this.registerUserUseCase.execute(command);
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() command: LoginCommand) {
    return await this.loginUseCase.execute(command);
  }

  @Post("password-reset")
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  async requestPasswordReset(@Body() command: PasswordResetCommand) {
    return await this.passwordResetUseCase.execute(command);
  }
}
