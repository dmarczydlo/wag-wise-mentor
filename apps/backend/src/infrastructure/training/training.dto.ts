import { z } from "zod";

export const CreateTrainingSessionDtoSchema = z.object({
  puppyId: z.string().min(1, "Puppy ID is required"),
  sessionType: z
    .string()
    .min(1, "Session type is required")
    .max(100, "Session type is too long"),
  duration: z.number().positive("Duration must be positive"),
  notes: z.string().max(1000, "Notes are too long"),
});

export const UpdateTrainingNotesDtoSchema = z.object({
  notes: z.string().max(1000, "Notes are too long"),
});

export type CreateTrainingSessionDto = z.infer<
  typeof CreateTrainingSessionDtoSchema
>;
export type UpdateTrainingNotesDto = z.infer<
  typeof UpdateTrainingNotesDtoSchema
>;
