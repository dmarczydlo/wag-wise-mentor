import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Slider } from "./slider";

describe("Slider Component", () => {
  it("should render slider with default props", () => {
    render(<Slider />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
  });

  it("should render slider with custom value", () => {
    render(<Slider value={[50]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("should render slider with custom className", () => {
    render(<Slider className="custom-class" />);
    const sliderContainer = document.querySelector(".custom-class");
    expect(sliderContainer).toBeInTheDocument();
  });

  it("should render disabled slider", () => {
    render(<Slider disabled />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("data-disabled", "");
  });

  it("should render slider with min and max values", () => {
    render(<Slider min={0} max={100} value={[25]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });
});
