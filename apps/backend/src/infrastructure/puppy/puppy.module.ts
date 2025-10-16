import { Module } from "@nestjs/common";
import { PuppyController } from "./puppy.controller";
import {
  CreatePuppyUseCase,
  GetPuppyByIdUseCase,
  GetPuppiesByOwnerUseCase,
  UpdatePuppyWeightUseCase,
  PUPPY_REPOSITORY,
} from "../../application/puppy/puppy.use-cases";
import { InMemoryPuppyRepository } from "./in-memory-puppy.repository";
import { SupabasePuppyRepository } from "./supabase-puppy.repository";
import { ConfigurationModule } from "../config/config.module";

const isTestEnvironment = process.env.NODE_ENV === "test";

@Module({
  imports: [ConfigurationModule],
  controllers: [PuppyController],
  providers: [
    CreatePuppyUseCase,
    GetPuppyByIdUseCase,
    GetPuppiesByOwnerUseCase,
    UpdatePuppyWeightUseCase,
    {
      provide: PUPPY_REPOSITORY,
      useClass: isTestEnvironment
        ? InMemoryPuppyRepository
        : SupabasePuppyRepository,
    },
  ],
  exports: [PUPPY_REPOSITORY],
})
export class PuppyModule {}
