import { Injectable } from "@nestjs/common";
import { AIRepository } from "../../domain/ai/ai.repository";
import { AIRecommendation } from "../../domain/ai/ai-recommendation.entity";

@Injectable()
export class InMemoryAIRepository implements AIRepository {
  private recommendations: Map<string, AIRecommendation> = new Map();

  async findById(id: string): Promise<AIRecommendation | null> {
    return this.recommendations.get(id) || null;
  }

  async findByPuppyId(puppyId: string): Promise<AIRecommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (rec) => rec.puppyId === puppyId
    );
  }

  async findByCategory(category: string): Promise<AIRecommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (rec) => rec.category === category
    );
  }

  async save(recommendation: AIRecommendation): Promise<AIRecommendation> {
    this.recommendations.set(recommendation.id, recommendation);
    return recommendation;
  }

  async delete(id: string): Promise<void> {
    this.recommendations.delete(id);
  }
}
