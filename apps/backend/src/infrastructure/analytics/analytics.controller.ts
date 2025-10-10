import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { AnalyticsUseCases } from "../../application/analytics/analytics.use-cases";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsUseCases: AnalyticsUseCases) {}

  @Post("events")
  async trackEvent(
    @Body()
    body: {
      userId: string;
      eventType: string;
      eventName: string;
      properties?: Record<string, any>;
    }
  ) {
    return await this.analyticsUseCases.trackEvent(
      body.userId,
      body.eventType,
      body.eventName,
      body.properties
    );
  }

  @Get("events/:id")
  async getEvent(@Param("id") id: string) {
    return await this.analyticsUseCases.getEvent(id);
  }

  @Get("events/user/:userId")
  async getUserEvents(@Param("userId") userId: string) {
    return await this.analyticsUseCases.getUserEvents(userId);
  }

  @Get("events")
  async getEventsByType(@Query("eventType") eventType: string) {
    if (eventType) {
      return await this.analyticsUseCases.getEventsByType(eventType);
    }
    return [];
  }

  @Get("events/date-range")
  async getEventsByDateRange(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    return await this.analyticsUseCases.getEventsByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
  }

  @Put("events/:id/enrich")
  async enrichEvent(
    @Param("id") id: string,
    @Body() body: { properties: Record<string, any> }
  ) {
    return await this.analyticsUseCases.enrichEvent(id, body.properties);
  }

  @Delete("events/:id")
  async deleteEvent(@Param("id") id: string) {
    await this.analyticsUseCases.deleteEvent(id);
    return { message: "Analytics event deleted successfully" };
  }
}
