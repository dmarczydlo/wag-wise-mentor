import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Progress } from "./progress";

describe("Progress Component", () => {
  it("should render progress with default value", () => {
    render(<Progress value={50} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("should render progress with custom className", () => {
    render(<Progress value={75} className="custom-class" />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveClass("custom-class");
  });

  it("should render progress with max value", () => {
    render(<Progress value={30} max={100} />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });

  it("should render indeterminate progress", () => {
    render(<Progress />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toBeInTheDocument();
  });
});
