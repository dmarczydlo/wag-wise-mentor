import { Injectable } from "@nestjs/common";
import { AIRepository } from "../../domain/ai/ai.repository";
import { AIRecommendation } from "../../domain/ai/ai-recommendation.entity";
import { DomainResult, Result } from "../../common/result/result";

@Injectable()
export class InMemoryAIRepository implements AIRepository {
  private recommendations: Map<string, AIRecommendation> = new Map();

  async findById(id: string): Promise<DomainResult<AIRecommendation | null>> {
    try {
      const recommendation = this.recommendations.get(id) || null;
      return Result.success(recommendation);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async findByPuppyId(
    puppyId: string
  ): Promise<DomainResult<AIRecommendation[]>> {
    try {
      const recommendations = Array.from(this.recommendations.values()).filter(
        (rec) => rec.puppyId === puppyId
      );
      return Result.success(recommendations);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async findByCategory(
    category: string
  ): Promise<DomainResult<AIRecommendation[]>> {
    try {
      const recommendations = Array.from(this.recommendations.values()).filter(
        (rec) => rec.category === category
      );
      return Result.success(recommendations);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async save(
    recommendation: AIRecommendation
  ): Promise<DomainResult<AIRecommendation>> {
    try {
      this.recommendations.set(recommendation.id, recommendation);
      return Result.success(recommendation);
    } catch (error) {
      return Result.failure(error as any);
    }
  }

  async delete(id: string): Promise<DomainResult<void>> {
    try {
      this.recommendations.delete(id);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(error as any);
    }
  }
}
