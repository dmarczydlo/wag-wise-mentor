import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../config/supabase.service";
import { AIRepository } from "../../domain/ai/ai.repository";
import { AIRecommendation } from "../../domain/ai/ai-recommendation.entity";
import {
  Result,
  DomainError,
  type DomainResult,
} from "../../common/result/result";

interface AIRecommendationRow {
  id: string;
  puppy_id: string;
  category: string;
  recommendation_text: string;
  confidence_score: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class SupabaseAIRepository implements AIRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findById(id: string): Promise<DomainResult<AIRecommendation | null>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("ai_recommendations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Result.success(null);
        }
        return Result.failure(
          DomainError.internal(
            `Failed to find AI recommendation: ${error.message}`
          )
        );
      }

      return Result.success(this.mapRowToAIRecommendation(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding AI recommendation: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByPuppyId(
    puppyId: string
  ): Promise<DomainResult<AIRecommendation[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("ai_recommendations")
        .select("*")
        .eq("puppy_id", puppyId)
        .order("created_at", { ascending: false });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find AI recommendations by puppy: ${error.message}`
          )
        );
      }

      const recommendations = data.map(row =>
        this.mapRowToAIRecommendation(row)
      );
      return Result.success(recommendations);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding AI recommendations by puppy: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByCategory(
    category: string
  ): Promise<DomainResult<AIRecommendation[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("ai_recommendations")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find AI recommendations by category: ${error.message}`
          )
        );
      }

      const recommendations = data.map(row =>
        this.mapRowToAIRecommendation(row)
      );
      return Result.success(recommendations);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding AI recommendations by category: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async save(
    recommendation: AIRecommendation
  ): Promise<DomainResult<AIRecommendation>> {
    try {
      const recommendationData = {
        id: recommendation.id,
        puppy_id: recommendation.puppyId,
        category: recommendation.category,
        recommendation_text: recommendation.recommendation,
        confidence_score: recommendation.confidence,
        metadata: recommendation.metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("ai_recommendations")
        .upsert(recommendationData)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to save AI recommendation: ${error.message}`
          )
        );
      }

      return Result.success(this.mapRowToAIRecommendation(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error saving AI recommendation: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async delete(id: string): Promise<DomainResult<void>> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from("ai_recommendations")
        .delete()
        .eq("id", id);

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to delete AI recommendation: ${error.message}`
          )
        );
      }

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error deleting AI recommendation: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  private mapRowToAIRecommendation(row: AIRecommendationRow): AIRecommendation {
    return AIRecommendation.create(
      row.id,
      row.puppy_id,
      row.category,
      row.recommendation_text,
      row.confidence_score,
      row.metadata || {}
    );
  }
}
