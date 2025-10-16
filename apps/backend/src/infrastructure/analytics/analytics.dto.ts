import { z } from "zod";

export const TrackEventDtoSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  eventType: z
    .string()
    .min(1, "Event type is required")
    .max(100, "Event type is too long"),
  eventName: z
    .string()
    .min(1, "Event name is required")
    .max(200, "Event name is too long"),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export const EnrichEventDtoSchema = z.object({
  properties: z.record(z.string(), z.unknown()),
});

export type TrackEventDto = z.infer<typeof TrackEventDtoSchema>;
export type EnrichEventDto = z.infer<typeof EnrichEventDtoSchema>;
