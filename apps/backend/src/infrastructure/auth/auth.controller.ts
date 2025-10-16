import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UsePipes,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import {
  GetUserUseCase,
  type GetUserCommand,
  CreateUserProfileUseCase,
  type CreateUserProfileCommand,
  UpdateUserProfileUseCase,
  type UpdateUserProfileCommand,
  DeleteUserProfileUseCase,
  type DeleteUserProfileCommand,
} from "../../application/auth/auth.use-cases";
import { SupabaseAuthGuard } from "./supabase-auth.guard";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  CreateProfileDto,
  CreateProfileDtoSchema,
  UpdateProfileDto,
  UpdateProfileDtoSchema,
} from "./auth.dto";

@ApiTags("User Profile")
@Controller("users")
export class AuthController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly deleteUserProfileUseCase: DeleteUserProfileUseCase
  ) {}

  @Get("me")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User profile not found" })
  async getCurrentUser(@Request() req) {
    const command: GetUserCommand = {
      userId: req.user.id,
    };
    return await this.getUserUseCase.execute(command);
  }

  @Get(":id")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user profile by ID" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserById(@Param("id") id: string) {
    const command: GetUserCommand = {
      userId: id,
    };
    return await this.getUserUseCase.execute(command);
  }

  @Post("profile")
  @UseGuards(SupabaseAuthGuard)
  @UsePipes(new ZodValidationPipe(CreateProfileDtoSchema))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create user profile after Supabase Auth registration",
  })
  @ApiResponse({
    status: 201,
    description: "User profile created successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input or profile already exists",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createUserProfile(@Request() req, @Body() body: CreateProfileDto) {
    const command: CreateUserProfileCommand = {
      userId: req.user.id,
      email: req.user.email,
      role: body.role,
    };
    return await this.createUserProfileUseCase.execute(command);
  }

  @Put(":id")
  @UseGuards(SupabaseAuthGuard)
  @UsePipes(new ZodValidationPipe(UpdateProfileDtoSchema))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile updated successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updateUserProfile(
    @Param("id") id: string,
    @Body() body: UpdateProfileDto
  ) {
    const command: UpdateUserProfileCommand = {
      userId: id,
      role: body.role,
      isActive: body.isActive,
    };
    return await this.updateUserProfileUseCase.execute(command);
  }

  @Delete(":id")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile deleted successfully",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteUserProfile(@Param("id") id: string) {
    const command: DeleteUserProfileCommand = {
      userId: id,
    };
    return await this.deleteUserProfileUseCase.execute(command);
  }
}
