import { Module } from "@nestjs/common";
import { CalendarController } from "./calendar.controller";
import {
  CreateEventUseCase,
  UpdateEventUseCase,
  GenerateHealthTimelineUseCase,
  EVENT_REPOSITORY,
} from "../../application/calendar/calendar.use-cases";
import { InMemoryEventRepository } from "./in-memory-event.repository";

@Module({
  controllers: [CalendarController],
  providers: [
    CreateEventUseCase,
    UpdateEventUseCase,
    GenerateHealthTimelineUseCase,
    {
      provide: EVENT_REPOSITORY,
      useClass: InMemoryEventRepository,
    },
  ],
  exports: [EVENT_REPOSITORY],
})
export class CalendarModule {}
