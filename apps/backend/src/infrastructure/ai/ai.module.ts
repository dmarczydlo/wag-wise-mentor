import { Module } from "@nestjs/common";
import { AIController } from "./ai.controller";
import { AIUseCases } from "../../application/ai/ai.use-cases";
import { InMemoryAIRepository } from "./in-memory-ai.repository";

@Module({
  controllers: [AIController],
  providers: [
    AIUseCases,
    {
      provide: "AIRepository",
      useClass: InMemoryAIRepository,
    },
  ],
  exports: [AIUseCases],
})
export class AIModule {}
