import { describe, it, expect } from "vitest";
import {
  capitalize,
  capitalizeWords,
  truncate,
  slugify,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatFileSize,
  formatDuration,
  formatWeight,
  formatAge,
  formatPhoneNumber,
  maskSensitive,
} from "../utils/formatting.js";

describe("Formatting Utilities", () => {
  describe("capitalize", () => {
    it("should capitalize first letter and lowercase the rest", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("Hello");
      expect(capitalize("hELLO")).toBe("Hello");
    });

    it("should handle empty strings", () => {
      expect(capitalize("")).toBe("");
    });

    it("should handle single characters", () => {
      expect(capitalize("a")).toBe("A");
      expect(capitalize("A")).toBe("A");
    });
  });

  describe("capitalizeWords", () => {
    it("should capitalize each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
      expect(capitalizeWords("HELLO WORLD")).toBe("Hello World");
      expect(capitalizeWords("hELLO wORLD")).toBe("Hello World");
    });

    it("should handle single word", () => {
      expect(capitalizeWords("hello")).toBe("Hello");
    });

    it("should handle empty strings", () => {
      expect(capitalizeWords("")).toBe("");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("This is a long string", 10)).toBe("This is a ...");
      expect(truncate("This is a long string", 10, "---")).toBe(
        "This is a ---"
      );
    });

    it("should not truncate short strings", () => {
      expect(truncate("Short", 10)).toBe("Short");
    });

    it("should handle empty strings", () => {
      expect(truncate("", 10)).toBe("");
    });
  });

  describe("slugify", () => {
    it("should convert strings to slug format", () => {
      expect(slugify("Hello World")).toBe("hello-world");
      expect(slugify("Hello, World!")).toBe("hello-world");
      expect(slugify("Hello___World")).toBe("hello-world");
      expect(slugify("  Hello World  ")).toBe("hello-world");
    });

    it("should handle special characters", () => {
      expect(slugify("Hello@#$%World")).toBe("helloworld");
    });

    it("should handle empty strings", () => {
      expect(slugify("")).toBe("");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
      expect(formatCurrency(1234.56, "EUR", "en-US")).toBe("€1,234.56");
    });

    it("should handle zero", () => {
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("should handle negative numbers", () => {
      expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with commas", () => {
      expect(formatNumber(1234567)).toBe("1,234,567");
      expect(formatNumber(1234.56)).toBe("1,234.56");
    });

    it("should handle zero", () => {
      expect(formatNumber(0)).toBe("0");
    });

    it("should handle negative numbers", () => {
      expect(formatNumber(-1234567)).toBe("-1,234,567");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentages correctly", () => {
      expect(formatPercentage(50)).toBe("50.0%");
      expect(formatPercentage(50, 2)).toBe("50.00%");
      expect(formatPercentage(50.123, 1)).toBe("50.1%");
    });

    it("should handle zero", () => {
      expect(formatPercentage(0)).toBe("0.0%");
    });

    it("should handle 100", () => {
      expect(formatPercentage(100)).toBe("100.0%");
    });
  });

  describe("formatFileSize", () => {
    it("should format file sizes correctly", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1048576)).toBe("1 MB");
      expect(formatFileSize(1073741824)).toBe("1 GB");
    });

    it("should handle bytes", () => {
      expect(formatFileSize(500)).toBe("500 Bytes");
    });

    it("should handle fractional sizes", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB");
    });
  });

  describe("formatDuration", () => {
    it("should format seconds correctly", () => {
      expect(formatDuration(30)).toBe("30 seconds");
      expect(formatDuration(1)).toBe("1 second");
    });

    it("should format minutes correctly", () => {
      expect(formatDuration(90)).toBe("1 minute");
      expect(formatDuration(120)).toBe("2 minutes");
    });

    it("should format hours correctly", () => {
      expect(formatDuration(3600)).toBe("1 hour");
      expect(formatDuration(7200)).toBe("2 hours");
    });

    it("should format days correctly", () => {
      expect(formatDuration(86400)).toBe("1 day");
      expect(formatDuration(172800)).toBe("2 days");
    });
  });

  describe("formatWeight", () => {
    it("should format weight in kg by default", () => {
      expect(formatWeight(5.5)).toBe("5.5 kg");
    });

    it("should format weight in lbs", () => {
      expect(formatWeight(5.5, "lbs")).toBe("5.5 lbs");
    });

    it("should handle whole numbers", () => {
      expect(formatWeight(5)).toBe("5.0 kg");
    });
  });

  describe("formatAge", () => {
    it("should format age with years and months", () => {
      expect(formatAge(2, 6, 15)).toBe("2 years, 6 months");
    });

    it("should format age with months and days", () => {
      expect(formatAge(0, 6, 15)).toBe("6 months, 15 days");
    });

    it("should format age with days only", () => {
      expect(formatAge(0, 0, 15)).toBe("15 days");
    });

    it("should handle singular forms", () => {
      expect(formatAge(1, 1, 1)).toBe("1 year, 1 month");
      expect(formatAge(0, 0, 1)).toBe("1 day");
    });
  });

  describe("formatPhoneNumber", () => {
    it("should format 10-digit numbers", () => {
      expect(formatPhoneNumber("1234567890")).toBe("(123) 456-7890");
    });

    it("should format 11-digit numbers with country code", () => {
      expect(formatPhoneNumber("11234567890")).toBe("+1 (123) 456-7890");
    });

    it("should handle already formatted numbers", () => {
      expect(formatPhoneNumber("(123) 456-7890")).toBe("(123) 456-7890");
    });

    it("should handle numbers with spaces and dashes", () => {
      expect(formatPhoneNumber("123-456-7890")).toBe("(123) 456-7890");
      expect(formatPhoneNumber("123 456 7890")).toBe("(123) 456-7890");
    });
  });

  describe("maskSensitive", () => {
    it("should mask sensitive information", () => {
      expect(maskSensitive("1234567890")).toBe("******7890");
      expect(maskSensitive("1234567890", 2)).toBe("********90");
    });

    it("should handle short strings", () => {
      expect(maskSensitive("1234")).toBe("1234");
      expect(maskSensitive("1234", 2)).toBe("**34");
    });

    it("should handle empty strings", () => {
      expect(maskSensitive("")).toBe("");
    });
  });
});
