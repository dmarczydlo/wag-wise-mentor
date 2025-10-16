import { Injectable } from "@nestjs/common";
import type { AIRepository } from "../../domain/ai/ai.repository";
import type { AIRecommendation } from "../../domain/ai/ai-recommendation.entity";
import {
  type DomainResult,
  Result,
  DomainError,
} from "../../common/result/result";

@Injectable()
export class InMemoryAIRepository implements AIRepository {
  private recommendations: Map<string, AIRecommendation> = new Map();

  async findById(id: string): Promise<DomainResult<AIRecommendation | null>> {
    try {
      const recommendation = this.recommendations.get(id) || null;
      return Result.success(recommendation);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async findByPuppyId(
    puppyId: string
  ): Promise<DomainResult<AIRecommendation[]>> {
    try {
      const recommendations = Array.from(this.recommendations.values()).filter(
        rec => rec.puppyId === puppyId
      );
      return Result.success(recommendations);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async findByCategory(
    category: string
  ): Promise<DomainResult<AIRecommendation[]>> {
    try {
      const recommendations = Array.from(this.recommendations.values()).filter(
        rec => rec.category === category
      );
      return Result.success(recommendations);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async save(
    recommendation: AIRecommendation
  ): Promise<DomainResult<AIRecommendation>> {
    try {
      this.recommendations.set(recommendation.id, recommendation);
      return Result.success(recommendation);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async delete(id: string): Promise<DomainResult<void>> {
    try {
      this.recommendations.delete(id);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }
}
