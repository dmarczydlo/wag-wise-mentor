import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { AIUseCases } from "../../application/ai/ai.use-cases";

@Controller("ai")
export class AIController {
  constructor(private readonly aiUseCases: AIUseCases) {}

  @Post("recommendations")
  async generateRecommendation(
    @Body()
    body: {
      puppyId: string;
      category: string;
      recommendation: string;
      confidence: number;
      metadata?: Record<string, any>;
    }
  ) {
    return await this.aiUseCases.generateRecommendation(
      body.puppyId,
      body.category,
      body.recommendation,
      body.confidence,
      body.metadata
    );
  }

  @Get("recommendations/:id")
  async getRecommendation(@Param("id") id: string) {
    return await this.aiUseCases.getRecommendation(id);
  }

  @Get("recommendations/puppy/:puppyId")
  async getPuppyRecommendations(@Param("puppyId") puppyId: string) {
    return await this.aiUseCases.getPuppyRecommendations(puppyId);
  }

  @Get("recommendations")
  async getRecommendationsByCategory(@Query("category") category: string) {
    return await this.aiUseCases.getRecommendationsByCategory(category);
  }

  @Put("recommendations/:id/confidence")
  async updateConfidence(
    @Param("id") id: string,
    @Body() body: { confidence: number }
  ) {
    return await this.aiUseCases.updateConfidence(id, body.confidence);
  }

  @Delete("recommendations/:id")
  async deleteRecommendation(@Param("id") id: string) {
    await this.aiUseCases.deleteRecommendation(id);
    return { message: "AI recommendation deleted successfully" };
  }
}
