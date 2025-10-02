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
    // Use Cases
    CreatePuppyUseCase,
    GetPuppyByIdUseCase,
    GetPuppiesByOwnerUseCase,
    UpdatePuppyWeightUseCase,

    // Repository Implementation (In-Memory for testing)
    {
      provide: "PuppyRepository",
      useClass: InMemoryPuppyRepository,
    },
  ],
  exports: ["PuppyRepository"], // Export for other modules
})
export class PuppyModule {}
