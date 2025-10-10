import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
} from "@nestjs/common";
import { AnalyticsUseCases } from "../../application/analytics/analytics.use-cases";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  TrackEventDto,
  TrackEventDtoSchema,
  EnrichEventDto,
  EnrichEventDtoSchema,
} from "./analytics.dto";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsUseCases: AnalyticsUseCases) {}

  @Post("events")
  @UsePipes(new ZodValidationPipe(TrackEventDtoSchema))
  async trackEvent(@Body() dto: TrackEventDto) {
    return await this.analyticsUseCases.trackEvent(
      dto.userId,
      dto.eventType,
      dto.eventName,
      dto.properties
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
  @UsePipes(new ZodValidationPipe(EnrichEventDtoSchema))
  async enrichEvent(
    @Param("id") id: string,
    @Body() dto: EnrichEventDto
  ) {
    return await this.analyticsUseCases.enrichEvent(id, dto.properties);
  }

  @Delete("events/:id")
  async deleteEvent(@Param("id") id: string) {
    await this.analyticsUseCases.deleteEvent(id);
    return { message: "Analytics event deleted successfully" };
  }
}
