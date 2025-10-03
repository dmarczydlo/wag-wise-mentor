import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Skeleton } from "./skeleton";

describe("Skeleton Component", () => {
  it("should render skeleton with default styling", () => {
    render(<Skeleton />);
    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
  });

  it("should render skeleton with custom className", () => {
    render(<Skeleton className="custom-class" />);
    const skeleton = document.querySelector(".custom-class");
    expect(skeleton).toBeInTheDocument();
  });

  it("should render skeleton with custom dimensions", () => {
    render(<Skeleton className="w-20 h-10" />);
    const skeleton = document.querySelector(".w-20.h-10");
    expect(skeleton).toBeInTheDocument();
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
