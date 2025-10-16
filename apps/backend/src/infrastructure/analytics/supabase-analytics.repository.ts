import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../config/supabase.service";
import { AnalyticsRepository } from "../../domain/analytics/analytics.repository";
import { AnalyticsEvent } from "../../domain/analytics/analytics-event.entity";
import {
  Result,
  DomainError,
  type DomainResult,
} from "../../common/result/result";

interface AnalyticsEventRow {
  id: string;
  user_id: string;
  event_type: string;
  event_name: string;
  properties: Record<string, unknown>;
  timestamp: string;
  created_at: string;
}

@Injectable()
export class SupabaseAnalyticsRepository implements AnalyticsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findById(id: string): Promise<DomainResult<AnalyticsEvent | null>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("analytics_events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return Result.success(null);
        }
        return Result.failure(
          DomainError.internal(
            `Failed to find analytics event: ${error.message}`
          )
        );
      }

      return Result.success(this.mapRowToAnalyticsEvent(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding analytics event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByUserId(userId: string): Promise<DomainResult<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("analytics_events")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find analytics events by user: ${error.message}`
          )
        );
      }

      const events = data.map(row => this.mapRowToAnalyticsEvent(row));
      return Result.success(events);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding analytics events by user: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByEventType(
    eventType: string
  ): Promise<DomainResult<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("analytics_events")
        .select("*")
        .eq("event_type", eventType)
        .order("timestamp", { ascending: false });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find analytics events by type: ${error.message}`
          )
        );
      }

      const events = data.map(row => this.mapRowToAnalyticsEvent(row));
      return Result.success(events);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding analytics events by type: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<DomainResult<AnalyticsEvent[]>> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from("analytics_events")
        .select("*")
        .gte("timestamp", startDate.toISOString())
        .lte("timestamp", endDate.toISOString())
        .order("timestamp", { ascending: false });

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to find analytics events by date range: ${error.message}`
          )
        );
      }

      const events = data.map(row => this.mapRowToAnalyticsEvent(row));
      return Result.success(events);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error finding analytics events by date range: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async save(event: AnalyticsEvent): Promise<DomainResult<AnalyticsEvent>> {
    try {
      const eventData = {
        id: event.id,
        user_id: event.userId,
        event_type: event.eventType,
        event_name: event.eventName,
        properties: event.properties,
        timestamp: event.timestamp.toISOString(),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabaseService
        .getClient()
        .from("analytics_events")
        .insert(eventData)
        .select()
        .single();

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to save analytics event: ${error.message}`
          )
        );
      }

      return Result.success(this.mapRowToAnalyticsEvent(data));
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error saving analytics event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  async delete(id: string): Promise<DomainResult<void>> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from("analytics_events")
        .delete()
        .eq("id", id);

      if (error) {
        return Result.failure(
          DomainError.internal(
            `Failed to delete analytics event: ${error.message}`
          )
        );
      }

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        DomainError.internal(
          `Unexpected error deleting analytics event: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  private mapRowToAnalyticsEvent(row: AnalyticsEventRow): AnalyticsEvent {
    return AnalyticsEvent.create(
      row.id,
      row.user_id,
      row.event_type,
      row.event_name,
      row.properties || {},
      new Date(row.timestamp)
    );
  }
}
