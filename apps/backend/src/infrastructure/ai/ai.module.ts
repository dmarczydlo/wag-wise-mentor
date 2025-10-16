import { Module } from "@nestjs/common";
import { AIController } from "./ai.controller";
import { AIUseCases } from "../../application/ai/ai.use-cases";
import { InMemoryAIRepository } from "./in-memory-ai.repository";
import { SupabaseAIRepository } from "./supabase-ai.repository";
import { ConfigurationModule } from "../config/config.module";

const isTestEnvironment = process.env.NODE_ENV === "test";

@Module({
  imports: isTestEnvironment ? [] : [ConfigurationModule],
  controllers: [AIController],
  providers: [
    AIUseCases,
    {
      provide: "AIRepository",
      useClass: isTestEnvironment ? InMemoryAIRepository : SupabaseAIRepository,
    },
  ],
  exports: [AIUseCases],
})
export class AIModule {}
