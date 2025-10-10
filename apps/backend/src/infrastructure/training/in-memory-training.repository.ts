import { Injectable } from "@nestjs/common";
import { TrainingRepository } from "../../domain/training/training.repository";
import { TrainingSession } from "../../domain/training/training-session.entity";

@Injectable()
export class InMemoryTrainingRepository implements TrainingRepository {
  private sessions: Map<string, TrainingSession> = new Map();

  async findById(id: string): Promise<TrainingSession | null> {
    return this.sessions.get(id) || null;
  }

  async findByPuppyId(puppyId: string): Promise<TrainingSession[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.puppyId === puppyId
    );
  }

  async save(session: TrainingSession): Promise<TrainingSession> {
    this.sessions.set(session.id, session);
    return session;
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }
}
