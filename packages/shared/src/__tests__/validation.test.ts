import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidPhone,
  validatePasswordStrength,
  isValidUUID,
  isValidURL,
  sanitizeString,
  validateRequired,
  PasswordSchema,
  EmailSchema,
  UUIDSchema,
  URLSchema,
} from "../utils/validation.js";

describe("Validation Utilities", () => {
  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmail("user+tag@example.org")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("test.example.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("should validate correct phone numbers", () => {
      expect(isValidPhone("1234567890")).toBe(true);
      expect(isValidPhone("+1234567890")).toBe(true);
      expect(isValidPhone("(123) 456-7890")).toBe(true);
      expect(isValidPhone("123-456-7890")).toBe(true);
      expect(isValidPhone("123 456 7890")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidPhone("123")).toBe(false);
      expect(isValidPhone("abc1234567")).toBe(false);
      expect(isValidPhone("")).toBe(false);
      expect(isValidPhone("0123456789")).toBe(false); // starts with 0
    });
  });

  describe("validatePasswordStrength", () => {
    it("should validate strong passwords", () => {
      const result = validatePasswordStrength("StrongPass123!");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject weak passwords", () => {
      const result = validatePasswordStrength("weak");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should check for uppercase letter", () => {
      const result = validatePasswordStrength("lowercase123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter"
      );
    });

    it("should check for lowercase letter", () => {
      const result = validatePasswordStrength("UPPERCASE123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one lowercase letter"
      );
    });

    it("should check for number", () => {
      const result = validatePasswordStrength("NoNumbers!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
    });

    it("should check for special character", () => {
      const result = validatePasswordStrength("NoSpecial123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one special character"
      );
    });

    it("should check minimum length", () => {
      const result = validatePasswordStrength("Sh0rt!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long"
      );
    });
  });

  describe("isValidUUID", () => {
    it("should validate correct UUIDs", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(isValidUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
      expect(isValidUUID("6ba7b811-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(isValidUUID("not-a-uuid")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
      expect(isValidUUID("")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716-44665544000g")).toBe(false);
    });
  });

  describe("isValidURL", () => {
    it("should validate correct URLs", () => {
      expect(isValidURL("https://example.com")).toBe(true);
      expect(isValidURL("http://example.com")).toBe(true);
      expect(isValidURL("https://www.example.com/path?query=value")).toBe(true);
      expect(isValidURL("ftp://files.example.com")).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(isValidURL("not-a-url")).toBe(false);
      expect(isValidURL("example.com")).toBe(false);
      expect(isValidURL("")).toBe(false);
      expect(isValidURL("htp://example.com")).toBe(false);
    });
  });

  describe("sanitizeString", () => {
    it("should remove HTML tags and trim whitespace", () => {
      expect(sanitizeString('  <script>alert("xss")</script>  ')).toBe(
        'scriptalert("xss")/script'
      );
      expect(sanitizeString("<div>content</div>")).toBe("divcontent/div");
      expect(sanitizeString("  normal text  ")).toBe("normal text");
    });

    it("should handle empty strings", () => {
      expect(sanitizeString("")).toBe("");
      expect(sanitizeString("   ")).toBe("");
    });
  });

  describe("validateRequired", () => {
    it("should validate when all required fields are present", () => {
      const data = { name: "John", email: "john@example.com", age: 30 };
      const result = validateRequired(data, ["name", "email"]);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toHaveLength(0);
    });

    it("should identify missing required fields", () => {
      const data = { name: "John", email: "", age: 30 };
      const result = validateRequired(data, ["name", "email", "phone"]);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain("email");
      expect(result.missingFields).toContain("phone");
      expect(result.missingFields).not.toContain("name");
    });

    it("should handle null and undefined values", () => {
      const data = { name: "John", email: null, phone: undefined };
      const result = validateRequired(data, ["name", "email", "phone"]);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain("email");
      expect(result.missingFields).toContain("phone");
    });
  });

  describe("Zod Schemas", () => {
    describe("PasswordSchema", () => {
      it("should validate strong passwords", () => {
        expect(() => PasswordSchema.parse("StrongPass123!")).not.toThrow();
      });

      it("should reject weak passwords", () => {
        expect(() => PasswordSchema.parse("weak")).toThrow();
        expect(() => PasswordSchema.parse("NoNumbers!")).toThrow();
        expect(() => PasswordSchema.parse("nouppercase123!")).toThrow();
      });
    });

    describe("EmailSchema", () => {
      it("should validate correct emails", () => {
        expect(() => EmailSchema.parse("test@example.com")).not.toThrow();
      });

      it("should reject invalid emails", () => {
        expect(() => EmailSchema.parse("invalid-email")).toThrow();
      });
    });

    describe("UUIDSchema", () => {
      it("should validate correct UUIDs", () => {
        expect(() =>
          UUIDSchema.parse("550e8400-e29b-41d4-a716-446655440000")
        ).not.toThrow();
      });

      it("should reject invalid UUIDs", () => {
        expect(() => UUIDSchema.parse("not-a-uuid")).toThrow();
      });
    });

    describe("URLSchema", () => {
      it("should validate correct URLs", () => {
        expect(() => URLSchema.parse("https://example.com")).not.toThrow();
      });

      it("should reject invalid URLs", () => {
        expect(() => URLSchema.parse("not-a-url")).toThrow();
      });
    });
  });
});
