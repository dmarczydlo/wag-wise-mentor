import { Injectable, Inject } from "@nestjs/common";
import { AIRepository } from "../../domain/ai/ai.repository";
import { AIRecommendation } from "../../domain/ai/ai-recommendation.entity";
import { DomainResult, DomainError, Result } from "../../common/result/result";

@Injectable()
export class AIUseCases {
  constructor(
    @Inject("AIRepository")
    private readonly aiRepository: AIRepository
  ) {}

  async generateRecommendation(
    puppyId: string,
    category: string,
    recommendation: string,
    confidence: number,
    metadata: Record<string, any> = {}
  ): Promise<DomainResult<AIRecommendation>> {
    const aiRecommendation = AIRecommendation.create(
      crypto.randomUUID(),
      puppyId,
      category,
      recommendation,
      confidence,
      metadata
    );
    return await this.aiRepository.save(aiRecommendation);
  }

  async getRecommendation(id: string): Promise<DomainResult<AIRecommendation>> {
    const recommendationResult = await this.aiRepository.findById(id);
    if (recommendationResult.isFailure()) {
      return recommendationResult;
    }
    
    const recommendation = recommendationResult.getValue();
    if (!recommendation) {
      return Result.failure(DomainError.notFound('AI recommendation', id));
    }
    
    return Result.success(recommendation);
  }

  async getPuppyRecommendations(puppyId: string): Promise<DomainResult<AIRecommendation[]>> {
    return await this.aiRepository.findByPuppyId(puppyId);
  }

  async getRecommendationsByCategory(
    category: string
  ): Promise<DomainResult<AIRecommendation[]>> {
    return await this.aiRepository.findByCategory(category);
  }

  async updateConfidence(
    id: string,
    confidence: number
  ): Promise<DomainResult<AIRecommendation>> {
    const recommendationResult = await this.getRecommendation(id);
    if (recommendationResult.isFailure()) {
      return recommendationResult;
    }
    
    const recommendation = recommendationResult.getValue();
    const updated = recommendation.updateConfidence(confidence);
    return await this.aiRepository.save(updated);
  }

  async deleteRecommendation(id: string): Promise<DomainResult<void>> {
    return await this.aiRepository.delete(id);
  }
}
