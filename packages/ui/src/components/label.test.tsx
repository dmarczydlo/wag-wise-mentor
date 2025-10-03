import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Label } from "./label";

describe("Label Component", () => {
  it("should render with text content", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should render with htmlFor attribute", () => {
    render(<Label htmlFor="test-input">Label for Input</Label>);
    const label = screen.getByText("Label for Input");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("should apply custom className", () => {
    render(<Label className="custom-class">Custom Label</Label>);
    const label = screen.getByText("Custom Label");
    expect(label).toHaveClass("custom-class");
  });

  it("should render as child component", () => {
    render(
      <Label>
        <span>Nested Content</span>
      </Label>
    );
    expect(screen.getByText("Nested Content")).toBeInTheDocument();
  });
});
