import { z } from "zod";

export const GenerateRecommendationDtoSchema = z.object({
  puppyId: z.string().min(1, "Puppy ID is required"),
  category: z.string().min(1, "Category is required").max(100, "Category is too long"),
  recommendation: z.string().min(1, "Recommendation is required").max(1000, "Recommendation is too long"),
  confidence: z.number().min(0).max(1),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const UpdateConfidenceDtoSchema = z.object({
  confidence: z.number().min(0).max(1),
});

export type GenerateRecommendationDto = z.infer<typeof GenerateRecommendationDtoSchema>;
export type UpdateConfidenceDto = z.infer<typeof UpdateConfidenceDtoSchema>;

