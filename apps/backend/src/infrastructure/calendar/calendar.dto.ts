import { z } from "zod";

export const CreateEventDtoSchema = z.object({
  puppyId: z.string().min(1, "Puppy ID is required"),
  eventType: z.string().min(1, "Event type is required"),
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().optional(),
  scheduledDate: z.coerce.date(),
});

export const UpdateEventDtoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long").optional(),
  description: z.string().optional(),
  scheduledDate: z.coerce.date().optional(),
  completed: z.boolean().optional(),
});

export const GenerateHealthTimelineDtoSchema = z.object({
  puppyId: z.string().min(1, "Puppy ID is required"),
  breed: z.string().optional(),
});

export type CreateEventDto = z.infer<typeof CreateEventDtoSchema>;
export type UpdateEventDto = z.infer<typeof UpdateEventDtoSchema>;
export type GenerateHealthTimelineDto = z.infer<typeof GenerateHealthTimelineDtoSchema>;

