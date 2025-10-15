import { Injectable } from "@nestjs/common";
import { TrainingRepository } from "../../domain/training/training.repository";
import { TrainingSession } from "../../domain/training/training-session.entity";
import { DomainResult, Result } from "../../common/result/result";

@Injectable()
export class InMemoryTrainingRepository implements TrainingRepository {
  private sessions: Map<string, TrainingSession> = new Map();

  async findById(id: string): Promise<DomainResult<TrainingSession | null>> {
    try {
      const session = this.sessions.get(id) || null;
      return Result.success(session);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async findByPuppyId(
    puppyId: string
  ): Promise<DomainResult<TrainingSession[]>> {
    try {
      const sessions = Array.from(this.sessions.values()).filter(
        (session) => session.puppyId === puppyId
      );
      return Result.success(sessions);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async save(session: TrainingSession): Promise<DomainResult<TrainingSession>> {
    try {
      this.sessions.set(session.id, session);
      return Result.success(session);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async delete(id: string): Promise<DomainResult<void>> {
    try {
      this.sessions.delete(id);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(error as any);
    }
  }
}
