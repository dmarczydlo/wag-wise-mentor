import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { TrainingUseCases } from "../../application/training/training.use-cases";

@Controller("training")
export class TrainingController {
  constructor(private readonly trainingUseCases: TrainingUseCases) {}

  @Post()
  async createSession(
    @Body()
    body: {
      puppyId: string;
      sessionType: string;
      duration: number;
      notes: string;
    }
  ) {
    return await this.trainingUseCases.createTrainingSession(
      body.puppyId,
      body.sessionType,
      body.duration,
      body.notes
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
  async updateNotes(@Param("id") id: string, @Body() body: { notes: string }) {
    return await this.trainingUseCases.updateTrainingNotes(id, body.notes);
  }

  @Delete(":id")
  async deleteSession(@Param("id") id: string) {
    await this.trainingUseCases.deleteTrainingSession(id);
    return { message: "Training session deleted successfully" };
  }
}
