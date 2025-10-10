import { AnalyticsEvent } from "./analytics-event.entity";

export interface AnalyticsRepository {
  findById(id: string): Promise<AnalyticsEvent | null>;
  findByUserId(userId: string): Promise<AnalyticsEvent[]>;
  findByEventType(eventType: string): Promise<AnalyticsEvent[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsEvent[]>;
  save(event: AnalyticsEvent): Promise<AnalyticsEvent>;
  delete(id: string): Promise<void>;
}
