import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
} from "@nestjs/common";
import { TrainingUseCases } from "../../application/training/training.use-cases";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
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
    return await this.trainingUseCases.getTrainingSession(id);
  }

  @Get("puppy/:puppyId")
  async getPuppySessions(@Param("puppyId") puppyId: string) {
    return await this.trainingUseCases.getPuppyTrainingSessions(puppyId);
  }

  @Put(":id/notes")
  @UsePipes(new ZodValidationPipe(UpdateTrainingNotesDtoSchema))
  async updateNotes(@Param("id") id: string, @Body() dto: UpdateTrainingNotesDto) {
    return await this.trainingUseCases.updateTrainingNotes(id, dto.notes);
  }

  @Delete(":id")
  async deleteSession(@Param("id") id: string) {
    await this.trainingUseCases.deleteTrainingSession(id);
    return { message: "Training session deleted successfully" };
  }
}
