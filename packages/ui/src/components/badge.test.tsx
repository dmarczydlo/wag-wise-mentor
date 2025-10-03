import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Badge } from "./badge";

describe("Badge Component", () => {
  it("should render with default variant", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("should render with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    expect(screen.getByText("Secondary Badge")).toBeInTheDocument();
  });

  it("should render with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    expect(screen.getByText("Destructive Badge")).toBeInTheDocument();
  });

  it("should render with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    expect(screen.getByText("Outline Badge")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
  });
});
