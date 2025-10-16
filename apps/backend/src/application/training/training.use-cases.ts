import { Injectable, Inject } from "@nestjs/common";
import { TrainingRepository } from "../../domain/training/training.repository";
import { TrainingSession } from "../../domain/training/training-session.entity";
import {
  type DomainResult,
  DomainError,
  Result,
} from "../../common/result/result";

@Injectable()
export class TrainingUseCases {
  constructor(
    @Inject("TrainingRepository")
    private readonly trainingRepository: TrainingRepository
  ) {}

  async createTrainingSession(
    puppyId: string,
    sessionType: string,
    duration: number,
    notes: string
  ): Promise<DomainResult<TrainingSession>> {
    const session = TrainingSession.create(
      crypto.randomUUID(),
      puppyId,
      sessionType,
      duration,
      notes,
      new Date()
    );
    return await this.trainingRepository.save(session);
  }

  async getTrainingSession(id: string): Promise<DomainResult<TrainingSession>> {
    const sessionResult = await this.trainingRepository.findById(id);
    if (sessionResult.isFailure()) {
      return sessionResult;
    }

    const session = sessionResult.getValue();
    if (!session) {
      return Result.failure(DomainError.notFound("Training session", id));
    }

    return Result.success(session);
  }

  async getPuppyTrainingSessions(
    puppyId: string
  ): Promise<DomainResult<TrainingSession[]>> {
    return await this.trainingRepository.findByPuppyId(puppyId);
  }

  async updateTrainingNotes(
    id: string,
    notes: string
  ): Promise<DomainResult<TrainingSession>> {
    const sessionResult = await this.getTrainingSession(id);
    if (sessionResult.isFailure()) {
      return sessionResult;
    }

    const session = sessionResult.getValue();
    const updatedSession = session.updateNotes(notes);
    return await this.trainingRepository.save(updatedSession);
  }

  async deleteTrainingSession(id: string): Promise<DomainResult<void>> {
    return await this.trainingRepository.delete(id);
  }
}
