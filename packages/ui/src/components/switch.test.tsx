import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@/test/test-utils";
import { Switch } from "./switch";

describe("Switch Component", () => {
  it("should render switch with default props", () => {
    render(<Switch />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
  });

  it("should render checked switch", () => {
    render(<Switch checked />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  it("should render disabled switch", () => {
    render(<Switch disabled />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Switch className="custom-class" />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveClass("custom-class");
  });
});
