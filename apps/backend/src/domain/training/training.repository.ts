import { TrainingSession } from "./training-session.entity";

export interface TrainingRepository {
  findById(id: string): Promise<TrainingSession | null>;
  findByPuppyId(puppyId: string): Promise<TrainingSession[]>;
  save(session: TrainingSession): Promise<TrainingSession>;
  delete(id: string): Promise<void>;
}
