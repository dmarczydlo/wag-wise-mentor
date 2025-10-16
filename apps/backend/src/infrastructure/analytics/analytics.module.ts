import { Module } from "@nestjs/common";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsUseCases } from "../../application/analytics/analytics.use-cases";
import { InMemoryAnalyticsRepository } from "./in-memory-analytics.repository";
import { SupabaseAnalyticsRepository } from "./supabase-analytics.repository";
import { ConfigurationModule } from "../config/config.module";

const isTestEnvironment = process.env.NODE_ENV === "test";

@Module({
  imports: [ConfigurationModule],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsUseCases,
    {
      provide: "AnalyticsRepository",
      useClass: isTestEnvironment
        ? InMemoryAnalyticsRepository
        : SupabaseAnalyticsRepository,
    },
  ],
  exports: [AnalyticsUseCases],
})
export class AnalyticsModule {}
