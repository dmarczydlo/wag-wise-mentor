import { Module } from "@nestjs/common";
import { PuppyController } from "./puppy.controller";
import {
  CreatePuppyUseCase,
  GetPuppyByIdUseCase,
  GetPuppiesByOwnerUseCase,
  UpdatePuppyWeightUseCase,
} from "../../application/puppy/puppy.use-cases";
import { InMemoryPuppyRepository } from "./in-memory-puppy.repository";
import { PuppyRepository } from "../../domain/puppy/puppy.repository";

@Module({
  controllers: [PuppyController],
  providers: [
    CreatePuppyUseCase,
    GetPuppyByIdUseCase,
    GetPuppiesByOwnerUseCase,
    UpdatePuppyWeightUseCase,

    {
      provide: "PuppyRepository",
      useClass: InMemoryPuppyRepository,
    },
  ],
  exports: ["PuppyRepository"], // Export for other modules
})
export class PuppyModule {}
