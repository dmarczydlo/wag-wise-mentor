import { Module } from "@nestjs/common";
import { TrainingController } from "./training.controller";
import { TrainingUseCases } from "../../application/training/training.use-cases";
import { InMemoryTrainingRepository } from "./in-memory-training.repository";

@Module({
  controllers: [TrainingController],
  providers: [
    TrainingUseCases,
    {
      provide: "TrainingRepository",
      useClass: InMemoryTrainingRepository,
    },
  ],
  exports: [TrainingUseCases],
})
export class TrainingModule {}
