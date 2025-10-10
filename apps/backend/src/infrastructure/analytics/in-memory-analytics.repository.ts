import { Injectable } from "@nestjs/common";
import { AnalyticsRepository } from "../../domain/analytics/analytics.repository";
import { AnalyticsEvent } from "../../domain/analytics/analytics-event.entity";

@Injectable()
export class InMemoryAnalyticsRepository implements AnalyticsRepository {
  private events: Map<string, AnalyticsEvent> = new Map();

  async findById(id: string): Promise<AnalyticsEvent | null> {
    return this.events.get(id) || null;
  }

  async findByUserId(userId: string): Promise<AnalyticsEvent[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId
    );
  }

  async findByEventType(eventType: string): Promise<AnalyticsEvent[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.eventType === eventType
    );
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsEvent[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.timestamp >= startDate && event.timestamp <= endDate
    );
  }

  async save(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    this.events.set(event.id, event);
    return event;
  }

  async delete(id: string): Promise<void> {
    this.events.delete(id);
  }
}
