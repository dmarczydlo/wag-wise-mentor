import { AnalyticsEvent } from "./analytics-event.entity";
import { DomainResult } from "../../common/result/result";

export interface AnalyticsRepository {
  findById(id: string): Promise<DomainResult<AnalyticsEvent | null>>;
  findByUserId(userId: string): Promise<DomainResult<AnalyticsEvent[]>>;
  findByEventType(eventType: string): Promise<DomainResult<AnalyticsEvent[]>>;
  findByDateRange(startDate: Date, endDate: Date): Promise<DomainResult<AnalyticsEvent[]>>;
  save(event: AnalyticsEvent): Promise<DomainResult<AnalyticsEvent>>;
  delete(id: string): Promise<DomainResult<void>>;
}
