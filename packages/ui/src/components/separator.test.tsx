import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Separator } from "./separator";

describe("Separator Component", () => {
  it("should render horizontal separator by default", () => {
    render(<Separator />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });

  it("should render vertical separator", () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<Separator className="custom-class" />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveClass("custom-class");
  });

  it("should render with decorative prop", () => {
    render(<Separator decorative />);
    const separator = screen.getByRole("separator");
    expect(separator).toBeInTheDocument();
  });
});
