import { AIRecommendation } from "./ai-recommendation.entity";

export interface AIRepository {
  findById(id: string): Promise<AIRecommendation | null>;
  findByPuppyId(puppyId: string): Promise<AIRecommendation[]>;
  findByCategory(category: string): Promise<AIRecommendation[]>;
  save(recommendation: AIRecommendation): Promise<AIRecommendation>;
  delete(id: string): Promise<void>;
}
