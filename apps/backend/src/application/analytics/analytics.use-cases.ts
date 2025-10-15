import { Injectable, Inject } from "@nestjs/common";
import { AnalyticsRepository } from "../../domain/analytics/analytics.repository";
import { AnalyticsEvent } from "../../domain/analytics/analytics-event.entity";
import { DomainResult, DomainError, Result } from "../../common/result/result";

@Injectable()
export class AnalyticsUseCases {
  constructor(
    @Inject("AnalyticsRepository")
    private readonly analyticsRepository: AnalyticsRepository
  ) {}

  async trackEvent(
    userId: string,
    eventType: string,
    eventName: string,
    properties: Record<string, any> = {}
  ): Promise<DomainResult<AnalyticsEvent>> {
    const event = AnalyticsEvent.create(
      crypto.randomUUID(),
      userId,
      eventType,
      eventName,
      properties,
      new Date()
    );
    return await this.analyticsRepository.save(event);
  }

  async getEvent(id: string): Promise<DomainResult<AnalyticsEvent>> {
    const eventResult = await this.analyticsRepository.findById(id);
    if (eventResult.isFailure()) {
      return eventResult;
    }

    const event = eventResult.getValue();
    if (!event) {
      return Result.failure(DomainError.notFound("Analytics event", id));
    }

    return Result.success(event);
  }

  async getUserEvents(userId: string): Promise<DomainResult<AnalyticsEvent[]>> {
    return await this.analyticsRepository.findByUserId(userId);
  }

  async getEventsByType(
    eventType: string
  ): Promise<DomainResult<AnalyticsEvent[]>> {
    return await this.analyticsRepository.findByEventType(eventType);
  }

  async getEventsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<DomainResult<AnalyticsEvent[]>> {
    return await this.analyticsRepository.findByDateRange(startDate, endDate);
  }

  async enrichEvent(
    id: string,
    additionalProperties: Record<string, any>
  ): Promise<DomainResult<AnalyticsEvent>> {
    const eventResult = await this.getEvent(id);
    if (eventResult.isFailure()) {
      return eventResult;
    }

    const event = eventResult.getValue();
    const enriched = event.enrichProperties(additionalProperties);
    return await this.analyticsRepository.save(enriched);
  }

  async deleteEvent(id: string): Promise<DomainResult<void>> {
    return await this.analyticsRepository.delete(id);
  }
}
