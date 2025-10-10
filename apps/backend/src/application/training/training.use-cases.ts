import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { TrainingRepository } from "../../domain/training/training.repository";
import { TrainingSession } from "../../domain/training/training-session.entity";

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
  ): Promise<TrainingSession> {
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

  async getTrainingSession(id: string): Promise<TrainingSession> {
    const session = await this.trainingRepository.findById(id);
    if (!session) {
      throw new NotFoundException(`Training session with id ${id} not found`);
    }
    return session;
  }

  async getPuppyTrainingSessions(puppyId: string): Promise<TrainingSession[]> {
    return await this.trainingRepository.findByPuppyId(puppyId);
  }

  async updateTrainingNotes(
    id: string,
    notes: string
  ): Promise<TrainingSession> {
    const session = await this.getTrainingSession(id);
    const updatedSession = session.updateNotes(notes);
    return await this.trainingRepository.save(updatedSession);
  }

  async deleteTrainingSession(id: string): Promise<void> {
    await this.trainingRepository.delete(id);
  }
}
