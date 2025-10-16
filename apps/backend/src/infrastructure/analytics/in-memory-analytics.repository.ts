import { Injectable } from "@nestjs/common";
import type { AnalyticsRepository } from "../../domain/analytics/analytics.repository";
import type { AnalyticsEvent } from "../../domain/analytics/analytics-event.entity";
import {
  type DomainResult,
  Result,
  DomainError,
} from "../../common/result/result";

@Injectable()
export class InMemoryAnalyticsRepository implements AnalyticsRepository {
  private events: Map<string, AnalyticsEvent> = new Map();

  async findById(id: string): Promise<DomainResult<AnalyticsEvent | null>> {
    try {
      const event = this.events.get(id) || null;
      return Result.success(event);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async findByUserId(userId: string): Promise<DomainResult<AnalyticsEvent[]>> {
    try {
      const events = Array.from(this.events.values()).filter(
        event => event.userId === userId
      );
      return Result.success(events);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async findByEventType(
    eventType: string
  ): Promise<DomainResult<AnalyticsEvent[]>> {
    try {
      const events = Array.from(this.events.values()).filter(
        event => event.eventType === eventType
      );
      return Result.success(events);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<DomainResult<AnalyticsEvent[]>> {
    try {
      const events = Array.from(this.events.values()).filter(
        event => event.timestamp >= startDate && event.timestamp <= endDate
      );
      return Result.success(events);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async save(event: AnalyticsEvent): Promise<DomainResult<AnalyticsEvent>> {
    try {
      this.events.set(event.id, event);
      return Result.success(event);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }

  async delete(id: string): Promise<DomainResult<void>> {
    try {
      this.events.delete(id);
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(DomainError.internal(String(error)));
    }
  }
}
