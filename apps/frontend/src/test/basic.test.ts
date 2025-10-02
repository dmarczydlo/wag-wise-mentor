import { describe, it, expect } from "vitest";

describe("Basic Test Setup", () => {
  it("should have jsdom environment available", () => {
    expect(typeof document).toBe("object");
    expect(typeof window).toBe("object");
  });

  it("should be able to create DOM elements", () => {
    const div = document.createElement("div");
    div.textContent = "Hello World";
    expect(div.textContent).toBe("Hello World");
  });
});
