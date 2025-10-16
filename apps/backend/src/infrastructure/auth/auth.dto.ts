import { z } from "zod";
import { UserRoleType } from "../../domain/auth/user.entity";

export const CreateProfileDtoSchema = z.object({
  role: z.nativeEnum(UserRoleType).optional(),
});

export const UpdateProfileDtoSchema = z.object({
  role: z.nativeEnum(UserRoleType).optional(),
  isActive: z.boolean().optional(),
});

export type CreateProfileDto = z.infer<typeof CreateProfileDtoSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;
