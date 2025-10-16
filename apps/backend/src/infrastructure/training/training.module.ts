import { Module } from "@nestjs/common";
import { TrainingController } from "./training.controller";
import { TrainingUseCases } from "../../application/training/training.use-cases";
import { InMemoryTrainingRepository } from "./in-memory-training.repository";
import { SupabaseTrainingRepository } from "./supabase-training.repository";
import { ConfigurationModule } from "../config/config.module";

const isTestEnvironment = process.env.NODE_ENV === "test";

@Module({
  imports: [ConfigurationModule],
  controllers: [TrainingController],
  providers: [
    TrainingUseCases,
    {
      provide: "TrainingRepository",
      useClass: isTestEnvironment
        ? InMemoryTrainingRepository
        : SupabaseTrainingRepository,
    },
  ],
  exports: [TrainingUseCases],
})
export class TrainingModule {}
