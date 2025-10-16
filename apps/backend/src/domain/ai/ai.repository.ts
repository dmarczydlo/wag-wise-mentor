import type { AIRecommendation } from "./ai-recommendation.entity";
import type { DomainResult } from "../../common/result/result";

export interface AIRepository {
  findById(id: string): Promise<DomainResult<AIRecommendation | null>>;
  findByPuppyId(puppyId: string): Promise<DomainResult<AIRecommendation[]>>;
  findByCategory(category: string): Promise<DomainResult<AIRecommendation[]>>;
  save(
    recommendation: AIRecommendation
  ): Promise<DomainResult<AIRecommendation>>;
  delete(id: string): Promise<DomainResult<void>>;
}
