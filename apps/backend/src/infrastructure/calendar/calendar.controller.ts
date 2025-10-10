import { Controller, Post, Body, Get, Param, Put, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  CreateEventUseCase,
  CreateEventCommand,
  UpdateEventUseCase,
  UpdateEventCommand,
  GenerateHealthTimelineUseCase,
  GenerateHealthTimelineCommand,
} from "../../application/calendar/calendar.use-cases";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  CreateEventDto,
  CreateEventDtoSchema,
  UpdateEventDto,
  UpdateEventDtoSchema,
  GenerateHealthTimelineDto,
  GenerateHealthTimelineDtoSchema,
} from "./calendar.dto";

@ApiTags("Calendar")
@Controller("calendar")
export class CalendarController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly generateHealthTimelineUseCase: GenerateHealthTimelineUseCase
  ) {}

  @Post("events")
  @UsePipes(new ZodValidationPipe(CreateEventDtoSchema))
  @ApiOperation({ summary: "Create a new event" })
  @ApiResponse({ status: 201, description: "Event created successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async createEvent(@Body() dto: CreateEventDto) {
    return await this.createEventUseCase.execute(dto as CreateEventCommand);
  }

  @Put("events/:id")
  @UsePipes(new ZodValidationPipe(UpdateEventDtoSchema))
  @ApiOperation({ summary: "Update an existing event" })
  @ApiResponse({ status: 200, description: "Event updated successfully" })
  @ApiResponse({ status: 404, description: "Event not found" })
  async updateEvent(
    @Param("id") eventId: string,
    @Body() dto: UpdateEventDto
  ) {
    return await this.updateEventUseCase.execute({
      ...dto,
      eventId,
    } as UpdateEventCommand);
  }

  @Post("health-timeline")
  @UsePipes(new ZodValidationPipe(GenerateHealthTimelineDtoSchema))
  @ApiOperation({ summary: "Generate health timeline for a puppy" })
  @ApiResponse({
    status: 201,
    description: "Health timeline generated successfully",
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async generateHealthTimeline(@Body() dto: GenerateHealthTimelineDto) {
    return await this.generateHealthTimelineUseCase.execute(dto as GenerateHealthTimelineCommand);
  }

  @Get("health-timeline/:puppyId")
  @ApiOperation({ summary: "Generate health timeline for a puppy via GET" })
  @ApiResponse({
    status: 200,
    description: "Health timeline generated successfully",
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async generateHealthTimelineGet(
    @Param("puppyId") puppyId: string,
    @Body() command: Omit<GenerateHealthTimelineCommand, "puppyId">
  ) {
    return await this.generateHealthTimelineUseCase.execute({
      ...command,
      puppyId,
    });
  }

  @Get("puppy/:puppyId/events")
  @ApiOperation({ summary: "Get all events for a puppy" })
  @ApiResponse({ status: 200, description: "Events retrieved successfully" })
  async getPuppyEvents(@Param("puppyId") puppyId: string) {
    return { puppyId, events: [] };
  }

  @Get("puppy/:puppyId/upcoming")
  @ApiOperation({ summary: "Get upcoming events for a puppy" })
  @ApiResponse({
    status: 200,
    description: "Upcoming events retrieved successfully",
  })
  async getUpcomingEvents(@Param("puppyId") puppyId: string) {
    return { puppyId, upcomingEvents: [] };
  }
}
