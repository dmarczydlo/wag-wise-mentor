import { z } from "zod";
import {
  BaseEntity,
  PaginatedResponse,
  LanguagePreference,
  ActivityLevel,
  EventType,
  RoutineType,
  RoutineFrequency,
} from "./common.js";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ProfileDto extends BaseEntity {
  email: string;
  languagePreference: LanguagePreference;
}

export interface CreateProfileDto {
  email: string;
  languagePreference?: LanguagePreference;
}

export interface UpdateProfileDto {
  languagePreference?: LanguagePreference;
}

export interface PuppyDto extends BaseEntity {
  ownerId: string;
  name: string;
  breed: string;
  birthday: Date;
  currentWeight: number | null;
  targetWeight: number | null;
  activityLevel: ActivityLevel;
  photoUrl: string | null;
  characteristics: Record<string, unknown>;
}

export interface CreatePuppyDto {
  name: string;
  breed: string;
  birthday: Date;
  currentWeight?: number | null;
  targetWeight?: number | null;
  activityLevel?: ActivityLevel;
  photoUrl?: string | null;
  characteristics?: Record<string, unknown>;
}

export interface UpdatePuppyDto {
  name?: string;
  breed?: string;
  birthday?: Date;
  currentWeight?: number | null;
  targetWeight?: number | null;
  activityLevel?: ActivityLevel;
  photoUrl?: string | null;
  characteristics?: Record<string, unknown>;
}

export interface WeightRecordDto extends BaseEntity {
  puppyId: string;
  weightKg: number;
  recordedDate: Date;
  notes: string | null;
}

export interface CreateWeightRecordDto {
  puppyId: string;
  weightKg: number;
  recordedDate?: Date;
  notes?: string | null;
}

export interface UpdateWeightRecordDto {
  weightKg?: number;
  recordedDate?: Date;
  notes?: string | null;
}

export interface FoodTypeDto extends BaseEntity {
  brandName: string;
  productName: string;
  proteinPercent: number | null;
  fatPercent: number | null;
  caloriesPer100g: number | null;
  feedingGuidelines: Record<string, unknown> | null;
}

export interface CreateFoodTypeDto {
  brandName: string;
  productName: string;
  proteinPercent?: number | null;
  fatPercent?: number | null;
  caloriesPer100g?: number | null;
  feedingGuidelines?: Record<string, unknown> | null;
}

export interface UpdateFoodTypeDto {
  brandName?: string;
  productName?: string;
  proteinPercent?: number | null;
  fatPercent?: number | null;
  caloriesPer100g?: number | null;
  feedingGuidelines?: Record<string, unknown> | null;
}

export interface FoodAssignmentDto extends BaseEntity {
  puppyId: string;
  foodTypeId: string;
  percentage: number;
  startDate: Date;
  endDate: Date | null;
  active: boolean;
}

export interface CreateFoodAssignmentDto {
  puppyId: string;
  foodTypeId: string;
  percentage?: number;
  startDate?: Date;
  endDate?: Date | null;
  active?: boolean;
}

export interface UpdateFoodAssignmentDto {
  percentage?: number;
  startDate?: Date;
  endDate?: Date | null;
  active?: boolean;
}

export interface FeedingScheduleDto extends BaseEntity {
  puppyId: string;
  mealNumber: number;
  targetTime: string;
  portionGrams: number;
  active: boolean;
}

export interface CreateFeedingScheduleDto {
  puppyId: string;
  mealNumber: number;
  targetTime: string;
  portionGrams: number;
  active?: boolean;
}

export interface UpdateFeedingScheduleDto {
  mealNumber?: number;
  targetTime?: string;
  portionGrams?: number;
  active?: boolean;
}

export interface FeedingLogDto extends BaseEntity {
  puppyId: string;
  scheduledFeedingId: string | null;
  actualTime: Date;
  actualPortion: number | null;
  notes: string | null;
  completed: boolean;
}

export interface CreateFeedingLogDto {
  puppyId: string;
  scheduledFeedingId?: string | null;
  actualTime?: Date;
  actualPortion?: number | null;
  notes?: string | null;
  completed?: boolean;
}

export interface UpdateFeedingLogDto {
  actualTime?: Date;
  actualPortion?: number | null;
  notes?: string | null;
  completed?: boolean;
}

export interface EventDto extends BaseEntity {
  puppyId: string;
  type: EventType;
  title: string;
  scheduledDate: Date;
  completedDate: Date | null;
  notes: string | null;
}

export interface CreateEventDto {
  puppyId: string;
  type: EventType;
  title: string;
  scheduledDate: Date;
  completedDate?: Date | null;
  notes?: string | null;
}

export interface UpdateEventDto {
  type?: EventType;
  title?: string;
  scheduledDate?: Date;
  completedDate?: Date | null;
  notes?: string | null;
}

export interface RoutineDto extends BaseEntity {
  puppyId: string;
  type: RoutineType;
  title: string;
  frequency: RoutineFrequency;
  targetTime: string | null;
  active: boolean;
}

export interface CreateRoutineDto {
  puppyId: string;
  type: RoutineType;
  title: string;
  frequency: RoutineFrequency;
  targetTime?: string | null;
  active?: boolean;
}

export interface UpdateRoutineDto {
  type?: RoutineType;
  title?: string;
  frequency?: RoutineFrequency;
  targetTime?: string | null;
  active?: boolean;
}

export const CreateProfileSchema = z.object({
  email: z.string().email(),
  languagePreference: z.nativeEnum(LanguagePreference).optional(),
});

export const UpdateProfileSchema = z.object({
  languagePreference: z.nativeEnum(LanguagePreference).optional(),
});

export const CreatePuppySchema = z.object({
  name: z.string().min(1),
  breed: z.string().min(1),
  birthday: z.date(),
  currentWeight: z.number().positive().nullable().optional(),
  targetWeight: z.number().positive().nullable().optional(),
  activityLevel: z.nativeEnum(ActivityLevel).optional(),
  photoUrl: z.string().url().nullable().optional(),
  characteristics: z.record(z.unknown()).optional(),
});

export const UpdatePuppySchema = z.object({
  name: z.string().min(1).optional(),
  breed: z.string().min(1).optional(),
  birthday: z.date().optional(),
  currentWeight: z.number().positive().nullable().optional(),
  targetWeight: z.number().positive().nullable().optional(),
  activityLevel: z.nativeEnum(ActivityLevel).optional(),
  photoUrl: z.string().url().nullable().optional(),
  characteristics: z.record(z.unknown()).optional(),
});

export const CreateWeightRecordSchema = z.object({
  puppyId: z.string().uuid(),
  weightKg: z.number().positive(),
  recordedDate: z.date().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateWeightRecordSchema = z.object({
  weightKg: z.number().positive().optional(),
  recordedDate: z.date().optional(),
  notes: z.string().nullable().optional(),
});

export const CreateFoodTypeSchema = z.object({
  brandName: z.string().min(1),
  productName: z.string().min(1),
  proteinPercent: z.number().min(0).max(100).nullable().optional(),
  fatPercent: z.number().min(0).max(100).nullable().optional(),
  caloriesPer100g: z.number().positive().nullable().optional(),
  feedingGuidelines: z.record(z.unknown()).nullable().optional(),
});

export const UpdateFoodTypeSchema = z.object({
  brandName: z.string().min(1).optional(),
  productName: z.string().min(1).optional(),
  proteinPercent: z.number().min(0).max(100).nullable().optional(),
  fatPercent: z.number().min(0).max(100).nullable().optional(),
  caloriesPer100g: z.number().positive().nullable().optional(),
  feedingGuidelines: z.record(z.unknown()).nullable().optional(),
});

export const CreateFoodAssignmentSchema = z.object({
  puppyId: z.string().uuid(),
  foodTypeId: z.string().uuid(),
  percentage: z.number().min(1).max(100).optional(),
  startDate: z.date().optional(),
  endDate: z.date().nullable().optional(),
  active: z.boolean().optional(),
});

export const UpdateFoodAssignmentSchema = z.object({
  percentage: z.number().min(1).max(100).optional(),
  startDate: z.date().optional(),
  endDate: z.date().nullable().optional(),
  active: z.boolean().optional(),
});

export const CreateFeedingScheduleSchema = z.object({
  puppyId: z.string().uuid(),
  mealNumber: z.number().min(1).max(4),
  targetTime: z.string(),
  portionGrams: z.number().positive(),
  active: z.boolean().optional(),
});

export const UpdateFeedingScheduleSchema = z.object({
  mealNumber: z.number().min(1).max(4).optional(),
  targetTime: z.string().optional(),
  portionGrams: z.number().positive().optional(),
  active: z.boolean().optional(),
});

export const CreateFeedingLogSchema = z.object({
  puppyId: z.string().uuid(),
  scheduledFeedingId: z.string().uuid().nullable().optional(),
  actualTime: z.date().optional(),
  actualPortion: z.number().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
  completed: z.boolean().optional(),
});

export const UpdateFeedingLogSchema = z.object({
  actualTime: z.date().optional(),
  actualPortion: z.number().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
  completed: z.boolean().optional(),
});

export const CreateEventSchema = z.object({
  puppyId: z.string().uuid(),
  type: z.nativeEnum(EventType),
  title: z.string().min(1),
  scheduledDate: z.date(),
  completedDate: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const UpdateEventSchema = z.object({
  type: z.nativeEnum(EventType).optional(),
  title: z.string().min(1).optional(),
  scheduledDate: z.date().optional(),
  completedDate: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const CreateRoutineSchema = z.object({
  puppyId: z.string().uuid(),
  type: z.nativeEnum(RoutineType),
  title: z.string().min(1),
  frequency: z.nativeEnum(RoutineFrequency),
  targetTime: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

export const UpdateRoutineSchema = z.object({
  type: z.nativeEnum(RoutineType).optional(),
  title: z.string().min(1).optional(),
  frequency: z.nativeEnum(RoutineFrequency).optional(),
  targetTime: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

export type ProfilesResponse = PaginatedResponse<ProfileDto>;
export type PuppiesResponse = PaginatedResponse<PuppyDto>;
export type WeightRecordsResponse = PaginatedResponse<WeightRecordDto>;
export type FoodTypesResponse = PaginatedResponse<FoodTypeDto>;
export type FoodAssignmentsResponse = PaginatedResponse<FoodAssignmentDto>;
export type FeedingSchedulesResponse = PaginatedResponse<FeedingScheduleDto>;
export type FeedingLogsResponse = PaginatedResponse<FeedingLogDto>;
export type EventsResponse = PaginatedResponse<EventDto>;
export type RoutinesResponse = PaginatedResponse<RoutineDto>;
