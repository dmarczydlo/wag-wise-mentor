import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UsePipes,
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
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  CreatePuppyDto,
  CreatePuppyDtoSchema,
  UpdatePuppyWeightDto,
  UpdatePuppyWeightDtoSchema,
} from "./puppy.dto";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "../../common/dto/api-response.dto";
import { DomainErrorMapper } from "../../common/utils/domain-error-mapper";

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
  async createPuppy(
    @Body(new ZodValidationPipe(CreatePuppyDtoSchema))
    createPuppyDto: CreatePuppyDto
  ): Promise<ApiSuccessResponse<any> | ApiErrorResponse> {
    const command: CreatePuppyCommand = {
      name: createPuppyDto.name,
      breed: createPuppyDto.breed,
      birthDate: createPuppyDto.birthDate,
      currentWeight: createPuppyDto.currentWeight,
      weightUnit: createPuppyDto.weightUnit,
      ownerId: createPuppyDto.ownerId,
    };

    const result = await this.createPuppyUseCase.execute(command);

    if (result.isFailure()) {
      const error = result.getError();
      throw new HttpException(
        error.message,
        DomainErrorMapper.mapToHttpStatus(error.code)
      );
    }

    return new ApiSuccessResponse(result.getValue());
  }

  @Get(":id")
  @ApiOperation({ summary: "Get puppy by ID" })
  @ApiParam({ name: "id", description: "Puppy ID" })
  @ApiResponse({ status: 200, description: "Puppy found" })
  @ApiResponse({ status: 404, description: "Puppy not found" })
  async getPuppyById(
    @Param("id") id: string
  ): Promise<ApiSuccessResponse<any> | ApiErrorResponse> {
    const result = await this.getPuppyByIdUseCase.execute(id);

    if (result.isFailure()) {
      const error = result.getError();
      throw new HttpException(
        error.message,
        DomainErrorMapper.mapToHttpStatus(error.code)
      );
    }

    const puppy = result.getValue();
    if (!puppy) {
      throw new HttpException("Puppy not found", HttpStatus.NOT_FOUND);
    }

    return new ApiSuccessResponse(puppy);
  }

  @Get("owner/:ownerId")
  @ApiOperation({ summary: "Get puppies by owner ID" })
  @ApiParam({ name: "ownerId", description: "Owner ID" })
  @ApiResponse({ status: 200, description: "Puppies found" })
  async getPuppiesByOwner(
    @Param("ownerId") ownerId: string
  ): Promise<ApiSuccessResponse<any> | ApiErrorResponse> {
    const result = await this.getPuppiesByOwnerUseCase.execute(ownerId);

    if (result.isFailure()) {
      const error = result.getError();
      throw new HttpException(
        error.message,
        DomainErrorMapper.mapToHttpStatus(error.code)
      );
    }

    return new ApiSuccessResponse(result.getValue());
  }

  @Put(":id/weight")
  @ApiOperation({ summary: "Update puppy weight" })
  @ApiParam({ name: "id", description: "Puppy ID" })
  @ApiResponse({ status: 200, description: "Weight updated successfully" })
  @ApiResponse({ status: 404, description: "Puppy not found" })
  async updatePuppyWeight(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdatePuppyWeightDtoSchema))
    updateWeightDto: UpdatePuppyWeightDto
  ): Promise<ApiSuccessResponse<any> | ApiErrorResponse> {
    const command: UpdatePuppyWeightCommand = {
      puppyId: id,
      newWeight: updateWeightDto.newWeight,
      weightUnit: updateWeightDto.weightUnit,
    };

    const result = await this.updatePuppyWeightUseCase.execute(command);

    if (result.isFailure()) {
      const error = result.getError();
      throw new HttpException(
        error.message,
        DomainErrorMapper.mapToHttpStatus(error.code)
      );
    }

    return new ApiSuccessResponse(result.getValue());
  }
}
