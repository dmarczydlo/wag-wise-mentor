import { describe, it, expect } from "vitest";
import {
  PaginationSchema,
  IdSchema,
  LanguagePreference,
  ActivityLevel,
  EventType,
  RoutineType,
  RoutineFrequency,
  CreateProfileSchema,
  UpdateProfileSchema,
  CreatePuppySchema,
  UpdatePuppySchema,
  CreateWeightRecordSchema,
  CreateEventSchema,
  CreateRoutineSchema,
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
    it("should have correct LanguagePreference values", () => {
      expect(LanguagePreference.ENGLISH).toBe("en");
      expect(LanguagePreference.POLISH).toBe("pl");
    });

    it("should have correct ActivityLevel values", () => {
      expect(ActivityLevel.LOW).toBe("low");
      expect(ActivityLevel.MODERATE).toBe("moderate");
      expect(ActivityLevel.HIGH).toBe("high");
    });

    it("should have correct EventType values", () => {
      expect(EventType.VET).toBe("vet");
      expect(EventType.VACCINATION).toBe("vaccination");
      expect(EventType.GROOMING).toBe("grooming");
      expect(EventType.TRAINING).toBe("training");
      expect(EventType.OTHER).toBe("other");
    });

    it("should have correct RoutineType values", () => {
      expect(RoutineType.FEEDING).toBe("feeding");
      expect(RoutineType.EXERCISE).toBe("exercise");
      expect(RoutineType.TRAINING).toBe("training");
      expect(RoutineType.SLEEP).toBe("sleep");
      expect(RoutineType.SOCIALIZATION).toBe("socialization");
    });

    it("should have correct RoutineFrequency values", () => {
      expect(RoutineFrequency.DAILY).toBe("daily");
      expect(RoutineFrequency.WEEKLY).toBe("weekly");
      expect(RoutineFrequency.MONTHLY).toBe("monthly");
    });
  });

  describe("CreateProfileSchema", () => {
    it("should validate correct profile data", () => {
      const validProfile = {
        email: "test@example.com",
        languagePreference: LanguagePreference.ENGLISH,
      };
      expect(() => CreateProfileSchema.parse(validProfile)).not.toThrow();
    });

    it("should validate profile data without language preference", () => {
      const validProfile = {
        email: "test@example.com",
      };
      expect(() => CreateProfileSchema.parse(validProfile)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidProfile = {
        email: "invalid-email",
        languagePreference: LanguagePreference.ENGLISH,
      };
      expect(() => CreateProfileSchema.parse(invalidProfile)).toThrow();
    });
  });

  describe("UpdateProfileSchema", () => {
    it("should validate partial profile data", () => {
      const validUpdate = { languagePreference: LanguagePreference.POLISH };
      expect(() => UpdateProfileSchema.parse(validUpdate)).not.toThrow();
    });

    it("should validate empty object", () => {
      expect(() => UpdateProfileSchema.parse({})).not.toThrow();
    });
  });

  describe("CreatePuppySchema", () => {
    it("should validate correct puppy data", () => {
      const validPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthday: new Date("2023-01-01"),
        currentWeight: 5.5,
        targetWeight: 25.0,
        activityLevel: ActivityLevel.MODERATE,
        photoUrl: "https://example.com/photo.jpg",
        characteristics: { friendly: true, energetic: true },
      };
      expect(() => CreatePuppySchema.parse(validPuppy)).not.toThrow();
    });

    it("should validate puppy data with minimal fields", () => {
      const validPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthday: new Date("2023-01-01"),
      };
      expect(() => CreatePuppySchema.parse(validPuppy)).not.toThrow();
    });

    it("should reject empty name", () => {
      const invalidPuppy = {
        name: "",
        breed: "Golden Retriever",
        birthday: new Date("2023-01-01"),
      };
      expect(() => CreatePuppySchema.parse(invalidPuppy)).toThrow();
    });

    it("should reject negative weight", () => {
      const invalidPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthday: new Date("2023-01-01"),
        currentWeight: -1,
      };
      expect(() => CreatePuppySchema.parse(invalidPuppy)).toThrow();
    });

    it("should reject invalid photo URL", () => {
      const invalidPuppy = {
        name: "Buddy",
        breed: "Golden Retriever",
        birthday: new Date("2023-01-01"),
        photoUrl: "not-a-url",
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
      const invalidUpdate = { currentWeight: -1 };
      expect(() => UpdatePuppySchema.parse(invalidUpdate)).toThrow();
    });

    it("should reject empty name", () => {
      const invalidUpdate = { name: "" };
      expect(() => UpdatePuppySchema.parse(invalidUpdate)).toThrow();
    });
  });

  describe("CreateWeightRecordSchema", () => {
    it("should validate correct weight record data", () => {
      const validRecord = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        weightKg: 5.5,
        recordedDate: new Date("2023-01-01"),
        notes: "Healthy weight",
      };
      expect(() => CreateWeightRecordSchema.parse(validRecord)).not.toThrow();
    });

    it("should validate weight record with minimal fields", () => {
      const validRecord = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        weightKg: 5.5,
      };
      expect(() => CreateWeightRecordSchema.parse(validRecord)).not.toThrow();
    });

    it("should reject invalid puppy ID", () => {
      const invalidRecord = {
        puppyId: "not-a-uuid",
        weightKg: 5.5,
      };
      expect(() => CreateWeightRecordSchema.parse(invalidRecord)).toThrow();
    });

    it("should reject negative weight", () => {
      const invalidRecord = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        weightKg: -1,
      };
      expect(() => CreateWeightRecordSchema.parse(invalidRecord)).toThrow();
    });
  });

  describe("CreateEventSchema", () => {
    it("should validate correct event data", () => {
      const validEvent = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        type: EventType.VET,
        title: "Annual Checkup",
        scheduledDate: new Date("2023-12-01"),
        notes: "Regular checkup",
      };
      expect(() => CreateEventSchema.parse(validEvent)).not.toThrow();
    });

    it("should validate event with minimal fields", () => {
      const validEvent = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        type: EventType.TRAINING,
        title: "Basic Training",
        scheduledDate: new Date("2023-12-01"),
      };
      expect(() => CreateEventSchema.parse(validEvent)).not.toThrow();
    });

    it("should reject invalid puppy ID", () => {
      const invalidEvent = {
        puppyId: "not-a-uuid",
        type: EventType.VET,
        title: "Checkup",
        scheduledDate: new Date("2023-12-01"),
      };
      expect(() => CreateEventSchema.parse(invalidEvent)).toThrow();
    });

    it("should reject empty title", () => {
      const invalidEvent = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        type: EventType.VET,
        title: "",
        scheduledDate: new Date("2023-12-01"),
      };
      expect(() => CreateEventSchema.parse(invalidEvent)).toThrow();
    });
  });

  describe("CreateRoutineSchema", () => {
    it("should validate correct routine data", () => {
      const validRoutine = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        type: RoutineType.FEEDING,
        title: "Morning Feeding",
        frequency: RoutineFrequency.DAILY,
        targetTime: "08:00",
        active: true,
      };
      expect(() => CreateRoutineSchema.parse(validRoutine)).not.toThrow();
    });

    it("should validate routine with minimal fields", () => {
      const validRoutine = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        type: RoutineType.EXERCISE,
        title: "Daily Walk",
        frequency: RoutineFrequency.DAILY,
      };
      expect(() => CreateRoutineSchema.parse(validRoutine)).not.toThrow();
    });

    it("should reject invalid puppy ID", () => {
      const invalidRoutine = {
        puppyId: "not-a-uuid",
        type: RoutineType.FEEDING,
        title: "Feeding",
        frequency: RoutineFrequency.DAILY,
      };
      expect(() => CreateRoutineSchema.parse(invalidRoutine)).toThrow();
    });

    it("should reject empty title", () => {
      const invalidRoutine = {
        puppyId: "550e8400-e29b-41d4-a716-446655440000",
        type: RoutineType.FEEDING,
        title: "",
        frequency: RoutineFrequency.DAILY,
      };
      expect(() => CreateRoutineSchema.parse(invalidRoutine)).toThrow();
    });
  });
});
