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

@Module({
  controllers: [PuppyController],
  providers: [
    CreatePuppyUseCase,
    GetPuppyByIdUseCase,
    GetPuppiesByOwnerUseCase,
    UpdatePuppyWeightUseCase,
    {
      provide: PUPPY_REPOSITORY,
      useClass: InMemoryPuppyRepository,
    },
  ],
  exports: [PUPPY_REPOSITORY],
})
export class PuppyModule {}
