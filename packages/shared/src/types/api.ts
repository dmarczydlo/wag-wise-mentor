import { z } from "zod";
import { BaseEntity, PaginationParams, PaginatedResponse } from "./common.js";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface UserDto extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

export interface PuppyDto extends BaseEntity {
  name: string;
  breed: string;
  birthDate: Date;
  weight: number;
  ownerId: string;
  photos: string[];
  medicalHistory: MedicalRecordDto[];
  weightHistory: WeightRecordDto[];
}

export interface CreatePuppyDto {
  name: string;
  breed: string;
  birthDate: Date;
  weight: number;
  photos?: string[];
}

export interface UpdatePuppyDto {
  name?: string;
  breed?: string;
  birthDate?: Date;
  weight?: number;
  photos?: string[];
}

export interface MedicalRecordDto extends BaseEntity {
  puppyId: string;
  type: string;
  description: string;
  date: Date;
  veterinarian?: string;
  notes?: string;
}

export interface WeightRecordDto extends BaseEntity {
  puppyId: string;
  weight: number;
  date: Date;
  notes?: string;
}

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const CreatePuppySchema = z.object({
  name: z.string().min(1),
  breed: z.string().min(1),
  birthDate: z.date(),
  weight: z.number().positive(),
  photos: z.array(z.string().url()).optional(),
});

export const UpdatePuppySchema = z.object({
  name: z.string().min(1).optional(),
  breed: z.string().min(1).optional(),
  birthDate: z.date().optional(),
  weight: z.number().positive().optional(),
  photos: z.array(z.string().url()).optional(),
});

export type UsersResponse = PaginatedResponse<UserDto>;
export type PuppiesResponse = PaginatedResponse<PuppyDto>;
export type MedicalRecordsResponse = PaginatedResponse<MedicalRecordDto>;
export type WeightRecordsResponse = PaginatedResponse<WeightRecordDto>;
