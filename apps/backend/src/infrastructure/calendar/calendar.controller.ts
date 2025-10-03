import { Controller, Post, Body, Get, Param, Put } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  CreateEventUseCase,
  CreateEventCommand,
  UpdateEventUseCase,
  UpdateEventCommand,
  GenerateHealthTimelineUseCase,
  GenerateHealthTimelineCommand,
} from "../../application/calendar/calendar.use-cases";

@ApiTags("Calendar")
@Controller("calendar")
export class CalendarController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly generateHealthTimelineUseCase: GenerateHealthTimelineUseCase
  ) {}

  @Post("events")
  @ApiOperation({ summary: "Create a new event" })
  @ApiResponse({ status: 201, description: "Event created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async createEvent(@Body() command: CreateEventCommand) {
    return await this.createEventUseCase.execute(command);
  }

  @Put("events/:id")
  @ApiOperation({ summary: "Update an existing event" })
  @ApiResponse({ status: 200, description: "Event updated successfully" })
  @ApiResponse({ status: 404, description: "Event not found" })
  async updateEvent(
    @Param("id") eventId: string,
    @Body() command: Omit<UpdateEventCommand, "eventId">
  ) {
    return await this.updateEventUseCase.execute({
      ...command,
      eventId,
    });
  }

  @Post("health-timeline")
  @ApiOperation({ summary: "Generate health timeline for a puppy" })
  @ApiResponse({ status: 201, description: "Health timeline generated successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async generateHealthTimeline(@Body() command: GenerateHealthTimelineCommand) {
    return await this.generateHealthTimelineUseCase.execute(command);
  }

  @Get("puppy/:puppyId/events")
  @ApiOperation({ summary: "Get all events for a puppy" })
  @ApiResponse({ status: 200, description: "Events retrieved successfully" })
  async getPuppyEvents(@Param("puppyId") puppyId: string) {
    return { puppyId, events: [] };
  }

  @Get("puppy/:puppyId/upcoming")
  @ApiOperation({ summary: "Get upcoming events for a puppy" })
  @ApiResponse({ status: 200, description: "Upcoming events retrieved successfully" })
  async getUpcomingEvents(@Param("puppyId") puppyId: string) {
    return { puppyId, upcomingEvents: [] };
  }
}
