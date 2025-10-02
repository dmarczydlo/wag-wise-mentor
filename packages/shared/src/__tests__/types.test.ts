import { describe, it, expect } from "vitest";
import {
  PaginationSchema,
  IdSchema,
  UserRole,
  NotificationType,
  EventType,
  RecurrencePattern,
  CreateUserSchema,
  UpdateUserSchema,
  LoginSchema,
  CreatePuppySchema,
  UpdatePuppySchema,
} from "../types/index.js";

describe("Type Definitions and Schemas", () => {
  describe("PaginationSchema", () => {
    it("should validate correct pagination parameters", () => {
      const validData = {
        page: 1,
        limit: 10,
        sortBy: "name",
        sortOrder: "asc" as const,
      };
      expect(() => PaginationSchema.parse(validData)).not.toThrow();
    });

    it("should apply default values", () => {
      const result = PaginationSchema.parse({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.sortOrder).toBe("asc");
    });

    it("should validate page number", () => {
      expect(() => PaginationSchema.parse({ page: 0 })).toThrow();
      expect(() => PaginationSchema.parse({ page: -1 })).toThrow();
    });

    it("should validate limit", () => {
      expect(() => PaginationSchema.parse({ limit: 0 })).toThrow();
      expect(() => PaginationSchema.parse({ limit: 101 })).toThrow();
    });

    it("should validate sortOrder", () => {
      expect(() => PaginationSchema.parse({ sortOrder: "invalid" })).toThrow();
    });
  });

  describe("IdSchema", () => {
    it("should validate correct UUIDs", () => {
      const validId = "550e8400-e29b-41d4-a716-446655440000";
      expect(() => IdSchema.parse(validId)).not.toThrow();
    });

    it("should reject invalid UUIDs", () => {
      expect(() => IdSchema.parse("not-a-uuid")).toThrow();
      expect(() => IdSchema.parse("123")).toThrow();
    });
  });

  describe("Enums", () => {
    it("should have correct UserRole values", () => {
      expect(UserRole.ADMIN).toBe("admin");
      expect(UserRole.USER).toBe("user");
      expect(UserRole.MODERATOR).toBe("moderator");
    });

    it("should have correct NotificationType values", () => {
      expect(NotificationType.FEEDING_REMINDER).toBe("feeding_reminder");
      expect(NotificationType.VET_APPOINTMENT).toBe("vet_appointment");
      expect(NotificationType.VACCINATION).toBe("vaccination");
      expect(NotificationType.TRAINING).toBe("training");
      expect(NotificationType.GENERAL).toBe("general");
    });

    it("should have correct EventType values", () => {
      expect(EventType.FEEDING).toBe("feeding");
      expect(EventType.VET_APPOINTMENT).toBe("vet_appointment");
      expect(EventType.VACCINATION).toBe("vaccination");
      expect(EventType.TRAINING).toBe("training");
      expect(EventType.MEDICATION).toBe("medication");
      expect(EventType.GROOMING).toBe("grooming");
      expect(EventType.OTHER).toBe("other");
    });

    it("should have correct RecurrencePattern values", () => {
      expect(RecurrencePattern.DAILY).toBe("daily");
      expect(RecurrencePattern.WEEKLY).toBe("weekly");
      expect(RecurrencePattern.MONTHLY).toBe("monthly");
      expect(RecurrencePattern.YEARLY).toBe("yearly");
      expect(RecurrencePattern.CUSTOM).toBe("custom");
    });
  });

  describe("CreateUserSchema", () => {
    it("should validate correct user data", () => {
      const validUser = {
        email: "test@example.com",
        password: "StrongPass123!",
        firstName: "John",
        lastName: "Doe",
      };
      expect(() => CreateUserSchema.parse(validUser)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidUser = {
        email: "invalid-email",
        password: "StrongPass123!",
        firstName: "John",
        lastName: "Doe",
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });

    it("should reject weak password", () => {
      const invalidUser = {
        email: "test@example.com",
        password: "weak",
        firstName: "John",
        lastName: "Doe",
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });

    it("should reject empty names", () => {
      const invalidUser = {
        email: "test@example.com",
        password: "StrongPass123!",
        firstName: "",
        lastName: "Doe",
      };
      expect(() => CreateUserSchema.parse(invalidUser)).toThrow();
    });
  });

  describe("UpdateUserSchema", () => {
    it("should validate partial user data", () => {
      const validUpdate = { firstName: "Jane" };
      expect(() => UpdateUserSchema.parse(validUpdate)).not.toThrow();
    });

    it("should validate empty object", () => {
      expect(() => UpdateUserSchema.parse({})).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidUpdate = { email: "invalid-email" };
      expect(() => UpdateUserSchema.parse(invalidUpdate)).toThrow();
    });

    it("should reject empty names", () => {
      const invalidUpdate = { firstName: "" };
      expect(() => UpdateUserSchema.parse(invalidUpdate)).toThrow();
    });
  });

  describe("LoginSchema", () => {
    it("should validate correct login data", () => {
      const validLogin = {
        email: "test@example.com",
        password: "password123",
      };
      expect(() => LoginSchema.parse(validLogin)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidLogin = {
        email: "invalid-email",
        password: "password123",
      };
      expect(() => LoginSchema.parse(invalidLogin)).toThrow();
    });

    it("should reject empty password", () => {
      const invalidLogin = {
        email: "test@example.com",
        password: "",
      };
      expect(() => LoginSchema.parse(invalidLogin)).toThrow();
    });
  });

  describe("CreatePuppySchema", () => {
    it("should validate correct puppy data", () => {
      const validPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        weight: 5.5,
        photos: ["https://example.com/photo.jpg"],
      };
      expect(() => CreatePuppySchema.parse(validPuppy)).not.toThrow();
    });

    it("should validate puppy data without photos", () => {
      const validPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        weight: 5.5,
      };
      expect(() => CreatePuppySchema.parse(validPuppy)).not.toThrow();
    });

    it("should reject empty name", () => {
      const invalidPuppy = {
        name: "",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        weight: 5.5,
      };
      expect(() => CreatePuppySchema.parse(invalidPuppy)).toThrow();
    });

    it("should reject negative weight", () => {
      const invalidPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        weight: -1,
      };
      expect(() => CreatePuppySchema.parse(invalidPuppy)).toThrow();
    });

    it("should reject zero weight", () => {
      const invalidPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        weight: 0,
      };
      expect(() => CreatePuppySchema.parse(invalidPuppy)).toThrow();
    });

    it("should reject invalid photo URLs", () => {
      const invalidPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthDate: new Date("2023-01-01"),
        weight: 5.5,
        photos: ["not-a-url"],
      };
      expect(() => CreatePuppySchema.parse(invalidPuppy)).toThrow();
    });
  });

  describe("UpdatePuppySchema", () => {
    it("should validate partial puppy data", () => {
      const validUpdate = { name: "Buddy Jr." };
      expect(() => UpdatePuppySchema.parse(validUpdate)).not.toThrow();
    });

    it("should validate empty object", () => {
      expect(() => UpdatePuppySchema.parse({})).not.toThrow();
    });

    it("should reject negative weight", () => {
      const invalidUpdate = { weight: -1 };
      expect(() => UpdatePuppySchema.parse(invalidUpdate)).toThrow();
    });

    it("should reject empty name", () => {
      const invalidUpdate = { name: "" };
      expect(() => UpdatePuppySchema.parse(invalidUpdate)).toThrow();
    });
  });
});
