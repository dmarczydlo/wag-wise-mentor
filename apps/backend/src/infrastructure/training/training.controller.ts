import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { TrainingUseCases } from "../../application/training/training.use-cases";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { DomainErrorMapper } from "../../common/utils/domain-error-mapper";
import {
  CreateTrainingSessionDto,
  CreateTrainingSessionDtoSchema,
  UpdateTrainingNotesDto,
  UpdateTrainingNotesDtoSchema,
} from "./training.dto";

@Controller("training")
export class TrainingController {
  constructor(private readonly trainingUseCases: TrainingUseCases) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateTrainingSessionDtoSchema))
  async createSession(@Body() dto: CreateTrainingSessionDto) {
    return await this.trainingUseCases.createTrainingSession(
      dto.puppyId,
      dto.sessionType,
      dto.duration,
      dto.notes
    );
  }

  @Get(":id")
  async getSession(@Param("id") id: string) {
    const result = await this.trainingUseCases.getTrainingSession(id);
    if (result.isFailure()) {
      const status = DomainErrorMapper.mapToHttpStatus(result.getError().code);
      throw new HttpException(result.getError().message, status);
    }
    return result.getValue();
  }

  @Get("puppy/:puppyId")
  async getPuppySessions(@Param("puppyId") puppyId: string) {
    return await this.trainingUseCases.getPuppyTrainingSessions(puppyId);
  }

  @Put(":id/notes")
  @UsePipes(new ZodValidationPipe(UpdateTrainingNotesDtoSchema))
  async updateNotes(
    @Param("id") id: string,
    @Body() dto: UpdateTrainingNotesDto
  ) {
    const result = await this.trainingUseCases.updateTrainingNotes(
      id,
      dto.notes
    );
    if (result.isFailure()) {
      const status = DomainErrorMapper.mapToHttpStatus(result.getError().code);
      throw new HttpException(result.getError().message, status);
    }
    return result.getValue();
  }

  @Delete(":id")
  async deleteSession(@Param("id") id: string) {
    return await this.trainingUseCases.deleteTrainingSession(id);
  }
}
