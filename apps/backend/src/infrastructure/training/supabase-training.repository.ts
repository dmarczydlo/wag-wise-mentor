import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../config/supabase.service";
import { TrainingRepository } from "../../domain/training/training.repository";
import { TrainingSession } from "../../domain/training/training-session.entity";
import {
  Result,
  DomainError,
  type DomainResult,
} from "../../common/result/result";

interface TrainingSessionRow {
  id: string;
  puppy_id: string;
  session_type: string;
  duration_minutes: number;
  notes?: string;
  completed_at?: string;
  created_at: string;
}

@Injectable()
export class SupabaseTrainingRepository implements TrainingRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findById(id: string): Promise<DomainResult<TrainingSession | null>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("training_sessions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Result.success(null);
        }
        return Result.failure(
          DomainError.internal(
            `Failed to find training session: ${error.message}`
          )
        );
      }

      return Result.success(this.mapRowToTrainingSession(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding training session: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByPuppyId(
    puppyId: string
  ): Promise<DomainResult<TrainingSession[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("training_sessions")
        .select("*")
        .eq("puppy_id", puppyId)
        .order("created_at", { ascending: false });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find training sessions by puppy: ${error.message}`
          )
        );
      }

      const sessions = data.map(row => this.mapRowToTrainingSession(row));
      return Result.success(sessions);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding training sessions by puppy: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async save(session: TrainingSession): Promise<DomainResult<TrainingSession>> {
    try {
      const sessionData = {
        id: session.id,
        puppy_id: session.puppyId,
        session_type: session.sessionType,
        duration_minutes: session.duration,
        notes: session.notes,
        completed_at: session.completedAt?.toISOString() || null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("training_sessions")
        .upsert(sessionData)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to save training session: ${error.message}`
          )
        );
      }

      return Result.success(this.mapRowToTrainingSession(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error saving training session: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async delete(id: string): Promise<DomainResult<void>> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from("training_sessions")
        .delete()
        .eq("id", id);

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to delete training session: ${error.message}`
          )
        );
      }

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error deleting training session: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  private mapRowToTrainingSession(row: TrainingSessionRow): TrainingSession {
    return TrainingSession.create(
      row.id,
      row.puppy_id,
      row.session_type,
      row.duration_minutes,
      row.notes || "",
      row.completed_at ? new Date(row.completed_at) : new Date()
    );
  }
}
