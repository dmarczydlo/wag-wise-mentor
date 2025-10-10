import { Module } from "@nestjs/common";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsUseCases } from "../../application/analytics/analytics.use-cases";
import { InMemoryAnalyticsRepository } from "./in-memory-analytics.repository";

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsUseCases,
    {
      provide: "AnalyticsRepository",
      useClass: InMemoryAnalyticsRepository,
    },
  ],
  exports: [AnalyticsUseCases],
})
export class AnalyticsModule {}
