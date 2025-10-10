import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { AnalyticsRepository } from "../../domain/analytics/analytics.repository";
import { AnalyticsEvent } from "../../domain/analytics/analytics-event.entity";

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
  ): Promise<AnalyticsEvent> {
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

  async getEvent(id: string): Promise<AnalyticsEvent> {
    const event = await this.analyticsRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Analytics event with id ${id} not found`);
    }
    return event;
  }

  async getUserEvents(userId: string): Promise<AnalyticsEvent[]> {
    return await this.analyticsRepository.findByUserId(userId);
  }

  async getEventsByType(eventType: string): Promise<AnalyticsEvent[]> {
    return await this.analyticsRepository.findByEventType(eventType);
  }

  async getEventsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsEvent[]> {
    return await this.analyticsRepository.findByDateRange(startDate, endDate);
  }

  async enrichEvent(
    id: string,
    additionalProperties: Record<string, any>
  ): Promise<AnalyticsEvent> {
    const event = await this.getEvent(id);
    const enriched = event.enrichProperties(additionalProperties);
    return await this.analyticsRepository.save(enriched);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.analyticsRepository.delete(id);
  }
}
