import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    // Arrange
    const classes = ["text-red-500", "bg-blue-500"];

    // Act
    const result = cn(...classes);

    // Assert
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("should handle conditional classes", () => {
    // Arrange
    const isActive = true;

    // Act
    const result = cn("base-class", isActive && "active-class");

    // Assert
    expect(result).toBe("base-class active-class");
  });

  it("should merge Tailwind conflicting classes correctly", () => {
    // Arrange
    const classes = ["px-2", "px-4"]; // Conflicting padding

    // Act
    const result = cn(...classes);

    // Assert
    expect(result).toBe("px-4"); // Should keep the last one
  });

  it("should handle empty inputs", () => {
    // Arrange & Act
    const result = cn();

    // Assert
    expect(result).toBe("");
  });

  it("should filter out falsy values", () => {
    // Arrange & Act
    const result = cn("class1", false, null, undefined, "class2");

    // Assert
    expect(result).toBe("class1 class2");
  });
});
