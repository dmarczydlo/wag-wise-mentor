import { Module } from "@nestjs/common";
import { CalendarController } from "./calendar.controller";
import {
  CreateEventUseCase,
  UpdateEventUseCase,
  GenerateHealthTimelineUseCase,
  EVENT_REPOSITORY,
} from "../../application/calendar/calendar.use-cases";
import { InMemoryEventRepository } from "./in-memory-event.repository";
import { SupabaseEventRepository } from "./supabase-event.repository";
import { ConfigurationModule } from "../config/config.module";

const isTestEnvironment = process.env.NODE_ENV === "test";

@Module({
  imports: isTestEnvironment ? [] : [ConfigurationModule],
  controllers: [CalendarController],
  providers: [
    CreateEventUseCase,
    UpdateEventUseCase,
    GenerateHealthTimelineUseCase,
    {
      provide: EVENT_REPOSITORY,
      useClass: isTestEnvironment
        ? InMemoryEventRepository
        : SupabaseEventRepository,
    },
  ],
  exports: [EVENT_REPOSITORY],
})
export class CalendarModule {}
