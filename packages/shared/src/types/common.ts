import { z } from "zod";
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const PaginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const IdSchema = z.string().uuid();

export enum LanguagePreference {
  ENGLISH = "en",
  POLISH = "pl",
}

export enum ActivityLevel {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
}

export enum EventType {
  VET = "vet",
  VACCINATION = "vaccination",
  GROOMING = "grooming",
  TRAINING = "training",
  OTHER = "other",
}

export enum RoutineType {
  FEEDING = "feeding",
  EXERCISE = "exercise",
  TRAINING = "training",
  SLEEP = "sleep",
  SOCIALIZATION = "socialization",
}

export enum RoutineFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}
