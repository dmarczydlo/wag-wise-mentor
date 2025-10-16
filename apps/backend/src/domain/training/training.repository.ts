import type { TrainingSession } from "./training-session.entity";
import type { DomainResult } from "../../common/result/result";

export interface TrainingRepository {
  findById(id: string): Promise<DomainResult<TrainingSession | null>>;
  findByPuppyId(puppyId: string): Promise<DomainResult<TrainingSession[]>>;
  save(session: TrainingSession): Promise<DomainResult<TrainingSession>>;
  delete(id: string): Promise<DomainResult<void>>;
}
