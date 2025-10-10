import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
} from "@nestjs/common";
import { AIUseCases } from "../../application/ai/ai.use-cases";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  GenerateRecommendationDto,
  GenerateRecommendationDtoSchema,
  UpdateConfidenceDto,
  UpdateConfidenceDtoSchema,
} from "./ai.dto";

@Controller("ai")
export class AIController {
  constructor(private readonly aiUseCases: AIUseCases) {}

  @Post("recommendations")
  @UsePipes(new ZodValidationPipe(GenerateRecommendationDtoSchema))
  async generateRecommendation(@Body() dto: GenerateRecommendationDto) {
    return await this.aiUseCases.generateRecommendation(
      dto.puppyId,
      dto.category,
      dto.recommendation,
      dto.confidence,
      dto.metadata
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
  @UsePipes(new ZodValidationPipe(UpdateConfidenceDtoSchema))
  async updateConfidence(
    @Param("id") id: string,
    @Body() dto: UpdateConfidenceDto
  ) {
    return await this.aiUseCases.updateConfidence(id, dto.confidence);
  }

  @Delete("recommendations/:id")
  async deleteRecommendation(@Param("id") id: string) {
    await this.aiUseCases.deleteRecommendation(id);
    return { message: "AI recommendation deleted successfully" };
  }
}
