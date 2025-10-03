import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Skeleton } from "./skeleton";

describe("Skeleton Component", () => {
  it("should render skeleton with default styling", () => {
    render(<Skeleton />);
    const skeleton = screen.getByRole("status");
    expect(skeleton).toBeInTheDocument();
  });

  it("should render skeleton with custom className", () => {
    render(<Skeleton className="custom-class" />);
    const skeleton = screen.getByRole("status");
    expect(skeleton).toHaveClass("custom-class");
  });

  it("should render skeleton with custom dimensions", () => {
    render(<Skeleton className="w-20 h-10" />);
    const skeleton = screen.getByRole("status");
    expect(skeleton).toHaveClass("w-20", "h-10");
  });

  it("should render skeleton with children", () => {
    render(
      <Skeleton>
        <div>Loading content</div>
      </Skeleton>
    );
    expect(screen.getByText("Loading content")).toBeInTheDocument();
  });
});
