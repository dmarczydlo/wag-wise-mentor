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

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MODERATOR = "moderator",
}

export enum NotificationType {
  FEEDING_REMINDER = "feeding_reminder",
  VET_APPOINTMENT = "vet_appointment",
  VACCINATION = "vaccination",
  TRAINING = "training",
  GENERAL = "general",
}

export enum EventType {
  FEEDING = "feeding",
  VET_APPOINTMENT = "vet_appointment",
  VACCINATION = "vaccination",
  TRAINING = "training",
  MEDICATION = "medication",
  GROOMING = "grooming",
  OTHER = "other",
}

export enum RecurrencePattern {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  CUSTOM = "custom",
}
