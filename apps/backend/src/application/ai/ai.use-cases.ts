import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { AIRepository } from "../../domain/ai/ai.repository";
import { AIRecommendation } from "../../domain/ai/ai-recommendation.entity";

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
  ): Promise<AIRecommendation> {
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

  async getRecommendation(id: string): Promise<AIRecommendation> {
    const recommendation = await this.aiRepository.findById(id);
    if (!recommendation) {
      throw new NotFoundException(`AI recommendation with id ${id} not found`);
    }
    return recommendation;
  }

  async getPuppyRecommendations(puppyId: string): Promise<AIRecommendation[]> {
    return await this.aiRepository.findByPuppyId(puppyId);
  }

  async getRecommendationsByCategory(
    category: string
  ): Promise<AIRecommendation[]> {
    return await this.aiRepository.findByCategory(category);
  }

  async updateConfidence(
    id: string,
    confidence: number
  ): Promise<AIRecommendation> {
    const recommendation = await this.getRecommendation(id);
    const updated = recommendation.updateConfidence(confidence);
    return await this.aiRepository.save(updated);
  }

  async deleteRecommendation(id: string): Promise<void> {
    await this.aiRepository.delete(id);
  }
}
