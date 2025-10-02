import { describe, it, expect } from "vitest";
import {
  calculateIdealWeightRange,
  calculateFeedingPortion,
  calculateGrowthRate,
  calculateBodyConditionScore,
  calculateVaccinationSchedule,
  calculateTrainingProgress,
} from "../utils/calculations.js";

describe("Calculation Utilities", () => {
  describe("calculateIdealWeightRange", () => {
    it("should calculate weight range for a puppy", () => {
      const result = calculateIdealWeightRange("golden_retriever", 12);
      expect(result.min).toBeGreaterThan(0);
      expect(result.max).toBeGreaterThan(result.min);
      expect(result.unit).toBe("kg");
    });

    it("should handle different breeds", () => {
      const largeBreed = calculateIdealWeightRange("golden_retriever", 12);
      const smallBreed = calculateIdealWeightRange("chihuahua", 12);

      expect(largeBreed.min).toBeGreaterThan(smallBreed.min);
      expect(largeBreed.max).toBeGreaterThan(smallBreed.max);
    });

    it("should handle different ages", () => {
      const youngPuppy = calculateIdealWeightRange("golden_retriever", 8);
      const olderPuppy = calculateIdealWeightRange("golden_retriever", 24);

      expect(olderPuppy.min).toBeGreaterThan(youngPuppy.min);
      expect(olderPuppy.max).toBeGreaterThan(youngPuppy.max);
    });

    it("should handle unknown breeds", () => {
      const result = calculateIdealWeightRange("unknown_breed", 12);
      expect(result.min).toBeGreaterThan(0);
      expect(result.max).toBeGreaterThan(result.min);
    });
  });

  describe("calculateFeedingPortion", () => {
    it("should calculate feeding portion for a puppy", () => {
      const result = calculateFeedingPortion(5, 12);
      expect(result.amount).toBeGreaterThan(0);
      expect(result.unit).toBe("g");
      expect(result.frequency).toBeGreaterThan(0);
    });

    it("should adjust for activity level", () => {
      const lowActivity = calculateFeedingPortion(5, 12, "low");
      const highActivity = calculateFeedingPortion(5, 12, "high");

      expect(highActivity.amount).toBeGreaterThan(lowActivity.amount);
    });

    it("should adjust frequency based on age", () => {
      const youngPuppy = calculateFeedingPortion(5, 8);
      const olderPuppy = calculateFeedingPortion(5, 24);

      expect(youngPuppy.frequency).toBeGreaterThan(olderPuppy.frequency);
    });

    it("should handle different weights", () => {
      const smallPuppy = calculateFeedingPortion(2, 12);
      const largePuppy = calculateFeedingPortion(10, 12);

      expect(largePuppy.amount).toBeGreaterThan(smallPuppy.amount);
    });
  });

  describe("calculateGrowthRate", () => {
    it("should calculate growth rate correctly", () => {
      const result = calculateGrowthRate(5.5, 5.0, 7);
      expect(result.rate).toBeGreaterThan(0);
      expect(result.unit).toBe("g/day");
    });

    it("should handle weight loss", () => {
      const result = calculateGrowthRate(5.0, 5.5, 7);
      expect(result.rate).toBeLessThan(0);
    });

    it("should handle zero days between", () => {
      const result = calculateGrowthRate(5.5, 5.0, 0);
      expect(result.rate).toBe(0);
    });

    it("should handle negative days", () => {
      const result = calculateGrowthRate(5.5, 5.0, -1);
      expect(result.rate).toBe(0);
    });
  });

  describe("calculateBodyConditionScore", () => {
    it("should calculate ideal body condition score", () => {
      const result = calculateBodyConditionScore(
        5,
        5,
        "slightly_visible",
        "visible"
      );
      expect(result.score).toBe(5);
      expect(result.description).toBe("Ideal");
    });

    it("should identify underweight conditions", () => {
      const result = calculateBodyConditionScore(4, 5, "visible", "pronounced");
      expect(result.score).toBeLessThan(5);
      expect(result.description).toMatch(/thin|underweight|emaciated/i);
    });

    it("should identify overweight conditions", () => {
      const result = calculateBodyConditionScore(
        6,
        5,
        "not_visible",
        "not_visible"
      );
      expect(result.score).toBeGreaterThan(5);
      expect(result.description).toMatch(/overweight|heavy|obese/i);
    });

    it("should clamp score between 1 and 9", () => {
      const extremeUnderweight = calculateBodyConditionScore(
        1,
        5,
        "visible",
        "pronounced"
      );
      const extremeOverweight = calculateBodyConditionScore(
        10,
        5,
        "not_visible",
        "not_visible"
      );

      expect(extremeUnderweight.score).toBeGreaterThanOrEqual(1);
      expect(extremeOverweight.score).toBeLessThanOrEqual(9);
    });
  });

  describe("calculateVaccinationSchedule", () => {
    it("should return due vaccinations for older puppies", () => {
      const result = calculateVaccinationSchedule(20);
      expect(result.due.length).toBeGreaterThan(0);
      expect(result.due).toContain("DHPP (First)");
      expect(result.due).toContain("DHPP (Second)");
      expect(result.due).toContain("DHPP (Third)");
    });

    it("should return next vaccination for young puppies", () => {
      const result = calculateVaccinationSchedule(4);
      expect(result.due).toHaveLength(0);
      expect(result.next).toBe("DHPP (First)");
      expect(result.nextDueDate).toBeInstanceOf(Date);
    });

    it("should return null for next vaccination when all are due", () => {
      const result = calculateVaccinationSchedule(25);
      expect(result.next).toBeNull();
      expect(result.nextDueDate).toBeNull();
    });

    it("should calculate correct next due date", () => {
      const result = calculateVaccinationSchedule(4);
      const expectedWeeks = 6 - 4;
      const expectedDate = new Date(
        Date.now() + expectedWeeks * 7 * 24 * 60 * 60 * 1000
      );

      // Allow for some time difference due to test execution
      const timeDiff = Math.abs(
        result.nextDueDate!.getTime() - expectedDate.getTime()
      );
      expect(timeDiff).toBeLessThan(1000); // Less than 1 second difference
    });
  });

  describe("calculateTrainingProgress", () => {
    it("should calculate progress for completed training", () => {
      const result = calculateTrainingProgress(10, 10);
      expect(result.percentage).toBe(100);
      expect(result.level).toBe("Advanced");
    });

    it("should calculate progress for partial training", () => {
      const result = calculateTrainingProgress(5, 10);
      expect(result.percentage).toBe(50);
      expect(result.level).toBe("Intermediate");
    });

    it("should handle no exercises", () => {
      const result = calculateTrainingProgress(0, 0);
      expect(result.percentage).toBe(0);
      expect(result.level).toBe("Not started");
    });

    it("should adjust for mastery level", () => {
      const beginner = calculateTrainingProgress(5, 10, "beginner");
      const advanced = calculateTrainingProgress(5, 10, "advanced");

      expect(beginner.percentage).toBeGreaterThan(advanced.percentage);
    });

    it("should classify levels correctly", () => {
      const beginner = calculateTrainingProgress(2, 10, "beginner");
      const intermediate = calculateTrainingProgress(6, 10, "beginner");
      const advanced = calculateTrainingProgress(9, 10, "beginner");

      expect(beginner.level).toBe("Beginner");
      expect(intermediate.level).toBe("Intermediate");
      expect(advanced.level).toBe("Advanced");
    });
  });
});
