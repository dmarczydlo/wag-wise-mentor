import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import {
  CreatePuppyUseCase,
  CreatePuppyCommand,
  UpdatePuppyWeightCommand,
} from "../../application/puppy/puppy.use-cases";
import { GetPuppyByIdUseCase } from "../../application/puppy/puppy.use-cases";
import { GetPuppiesByOwnerUseCase } from "../../application/puppy/puppy.use-cases";
import { UpdatePuppyWeightUseCase } from "../../application/puppy/puppy.use-cases";
import { WeightUnit } from "../../domain/puppy/puppy.entity";

// DTOs for API
export class CreatePuppyDto {
  name: string;
  breed: string;
  birthDate: Date;
  currentWeight: number;
  weightUnit: WeightUnit;
  ownerId: string;
}

export class UpdatePuppyWeightDto {
  newWeight: number;
  weightUnit: WeightUnit;
}

@ApiTags("Puppies")
@Controller("puppies")
export class PuppyController {
  constructor(
    private readonly createPuppyUseCase: CreatePuppyUseCase,
    private readonly getPuppyByIdUseCase: GetPuppyByIdUseCase,
    private readonly getPuppiesByOwnerUseCase: GetPuppiesByOwnerUseCase,
    private readonly updatePuppyWeightUseCase: UpdatePuppyWeightUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new puppy" })
  @ApiResponse({ status: 201, description: "Puppy created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  async createPuppy(@Body() createPuppyDto: CreatePuppyDto) {
    const command: CreatePuppyCommand = {
      name: createPuppyDto.name,
      breed: createPuppyDto.breed,
      birthDate: createPuppyDto.birthDate,
      currentWeight: createPuppyDto.currentWeight,
      weightUnit: createPuppyDto.weightUnit,
      ownerId: createPuppyDto.ownerId,
    };

    const result = await this.createPuppyUseCase.execute(command);

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      data: result.puppy,
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get puppy by ID" })
  @ApiParam({ name: "id", description: "Puppy ID" })
  @ApiResponse({ status: 200, description: "Puppy found" })
  @ApiResponse({ status: 404, description: "Puppy not found" })
  async getPuppyById(@Param("id") id: string) {
    const puppy = await this.getPuppyByIdUseCase.execute(id);

    if (!puppy) {
      throw new HttpException("Puppy not found", HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      data: puppy,
    };
  }

  @Get("owner/:ownerId")
  @ApiOperation({ summary: "Get puppies by owner ID" })
  @ApiParam({ name: "ownerId", description: "Owner ID" })
  @ApiResponse({ status: 200, description: "Puppies found" })
  async getPuppiesByOwner(@Param("ownerId") ownerId: string) {
    const puppies = await this.getPuppiesByOwnerUseCase.execute(ownerId);

    return {
      success: true,
      data: puppies,
    };
  }

  @Put(":id/weight")
  @ApiOperation({ summary: "Update puppy weight" })
  @ApiParam({ name: "id", description: "Puppy ID" })
  @ApiResponse({ status: 200, description: "Weight updated successfully" })
  @ApiResponse({ status: 404, description: "Puppy not found" })
  async updatePuppyWeight(
    @Param("id") id: string,
    @Body() updateWeightDto: UpdatePuppyWeightDto
  ) {
    const command: UpdatePuppyWeightCommand = {
      puppyId: id,
      newWeight: updateWeightDto.newWeight,
      weightUnit: updateWeightDto.weightUnit,
    };

    const result = await this.updatePuppyWeightUseCase.execute(command);

    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      data: result.puppy,
    };
  }
}
