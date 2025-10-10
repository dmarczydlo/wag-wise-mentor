import { z } from "zod";
import { WeightUnit } from "../../domain/puppy/puppy.entity";

export const CreatePuppyDtoSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  breed: z.string().min(1, "Breed is required").max(100, "Breed is too long"),
  birthDate: z.coerce.date(),
  currentWeight: z.number().positive("Weight must be positive"),
  weightUnit: z.nativeEnum(WeightUnit),
  ownerId: z.string().min(1, "Owner ID is required"),
});

export const UpdatePuppyWeightDtoSchema = z.object({
  newWeight: z.number().positive("Weight must be positive"),
  weightUnit: z.nativeEnum(WeightUnit),
});

export type CreatePuppyDto = z.infer<typeof CreatePuppyDtoSchema>;
export type UpdatePuppyWeightDto = z.infer<typeof UpdatePuppyWeightDtoSchema>;
