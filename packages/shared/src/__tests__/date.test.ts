import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateShort,
  formatTime,
  calculateAge,
  getRelativeTime,
  isToday,
  isPast,
  isFuture,
} from "../utils/date.js";

describe("Date Utilities", () => {
  describe("formatDate", () => {
    it("should format a date object correctly", () => {
      const date = new Date("2023-12-25T10:30:00Z");
      const result = formatDate(date);
      expect(result).toMatch(/December 25, 2023/);
    });

    it("should format a date string correctly", () => {
      const result = formatDate("2023-12-25T10:30:00Z");
      expect(result).toMatch(/December 25, 2023/);
    });

    it("should use custom locale", () => {
      const date = new Date("2023-12-25T10:30:00Z");
      const result = formatDate(date, "pl-PL");
      expect(result).toMatch(/25 grudnia 2023/);
    });
  });

  describe("formatDateShort", () => {
    it("should format date in MM/DD/YYYY format", () => {
      const date = new Date("2023-12-25T10:30:00Z");
      const result = formatDateShort(date);
      expect(result).toBe("12/25/2023");
    });

    it("should format date string in MM/DD/YYYY format", () => {
      const result = formatDateShort("2023-12-25T10:30:00Z");
      expect(result).toBe("12/25/2023");
    });
  });

  describe("formatTime", () => {
    it("should format time correctly", () => {
      const date = new Date("2023-12-25T14:30:00Z");
      const result = formatTime(date);
      expect(result).toMatch(/3:30|14:30/);
    });

    it("should format time string correctly", () => {
      const result = formatTime("2023-12-25T14:30:00Z");
      expect(result).toMatch(/3:30|14:30/);
    });
  });

  describe("calculateAge", () => {
    it("should calculate age correctly for a puppy born 1 year ago", () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 1);

      const result = calculateAge(birthDate);
      expect(result.years).toBe(1);
      expect(result.totalDays).toBeGreaterThanOrEqual(365);
    });

    it("should calculate age correctly for a puppy born 6 months ago", () => {
      const birthDate = new Date();
      birthDate.setMonth(birthDate.getMonth() - 6);

      const result = calculateAge(birthDate);
      expect(result.months).toBe(6);
      expect(result.years).toBe(0);
    });

    it("should calculate age correctly for a puppy born 1 week ago", () => {
      const birthDate = new Date();
      birthDate.setDate(birthDate.getDate() - 7);

      const result = calculateAge(birthDate);
      expect(result.days).toBe(7);
      expect(result.totalDays).toBe(7);
    });

    it("should handle string input", () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 2);

      const result = calculateAge(birthDate.toISOString());
      expect(result.years).toBe(2);
    });
  });

  describe("getRelativeTime", () => {
    it('should return "just now" for recent dates', () => {
      const now = new Date();
      const result = getRelativeTime(now);
      expect(result).toBe("just now");
    });

    it("should return minutes ago for recent dates", () => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 5);

      const result = getRelativeTime(date);
      expect(result).toBe("5 minutes ago");
    });

    it("should return hours ago for older dates", () => {
      const date = new Date();
      date.setHours(date.getHours() - 3);

      const result = getRelativeTime(date);
      expect(result).toBe("3 hours ago");
    });

    it("should return days ago for older dates", () => {
      const date = new Date();
      date.setDate(date.getDate() - 2);

      const result = getRelativeTime(date);
      expect(result).toBe("2 days ago");
    });

    it("should handle string input", () => {
      const date = new Date();
      date.setHours(date.getHours() - 1);

      const result = getRelativeTime(date.toISOString());
      expect(result).toBe("1 hour ago");
    });
  });

  describe("isToday", () => {
    it("should return true for today", () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it("should return false for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it("should return false for tomorrow", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });

    it("should handle string input", () => {
      const today = new Date();
      expect(isToday(today.toISOString())).toBe(true);
    });
  });

  describe("isPast", () => {
    it("should return true for past dates", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isPast(past)).toBe(true);
    });

    it("should return false for future dates", () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isPast(future)).toBe(false);
    });

    it("should handle string input", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isPast(past.toISOString())).toBe(true);
    });
  });

  describe("isFuture", () => {
    it("should return true for future dates", () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isFuture(future)).toBe(true);
    });

    it("should return false for past dates", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      expect(isFuture(past)).toBe(false);
    });

    it("should handle string input", () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      expect(isFuture(future.toISOString())).toBe(true);
    });
  });
});
