import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BreedAutocomplete } from "./BreedAutocomplete";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Element.prototype.scrollIntoView = vi.fn();

describe("BreedAutocomplete", () => {
  const mockOnChange = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <BreedAutocomplete
        value=""
        onChange={mockOnChange}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Component Rendering", () => {
    it("should render label and button", () => {
      renderComponent();

      expect(screen.getByText("Breed")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByText("Select breed...")).toBeInTheDocument();
    });

    it("should render with required indicator", () => {
      renderComponent({ required: true });

      const label = screen.getByText("Breed");
      expect(label.parentElement).toHaveTextContent("*");
    });

    it("should display selected breed value", () => {
      renderComponent({ value: "Labrador Retriever" });

      expect(screen.getByText("Labrador Retriever")).toBeInTheDocument();
    });

    it("should render with custom id", () => {
      renderComponent({ id: "custom-breed-id" });

      expect(screen.getByRole("combobox")).toHaveAttribute("id", "custom-breed-id");
    });
  });

  describe("Breed Selection and Display", () => {
    it("should display breed characteristics when breed is selected", () => {
      renderComponent({ value: "French Bulldog" });

      expect(screen.getByText(/Small/)).toBeInTheDocument();
      expect(screen.getByText(/Playful, Adaptable, Smart/)).toBeInTheDocument();
    });

    it("should display size and temperament for Golden Retriever", () => {
      renderComponent({ value: "Golden Retriever" });

      expect(screen.getByText("Size:")).toBeInTheDocument();
      expect(screen.getByText("Large")).toBeInTheDocument();
      expect(screen.getByText("Temperament:")).toBeInTheDocument();
      expect(screen.getByText("Intelligent, Friendly, Devoted")).toBeInTheDocument();
    });

    it("should display characteristics for Siberian Husky", () => {
      renderComponent({ value: "Siberian Husky" });

      expect(screen.getByText("Size:")).toBeInTheDocument();
      expect(screen.getByText("Large")).toBeInTheDocument();
      expect(screen.getByText("Temperament:")).toBeInTheDocument();
      expect(screen.getByText("Outgoing, Alert, Gentle")).toBeInTheDocument();
    });

    it("should not show characteristics panel when no breed is selected", () => {
      renderComponent();

      expect(screen.queryByText("Size:")).not.toBeInTheDocument();
      expect(screen.queryByText("Temperament:")).not.toBeInTheDocument();
    });
  });

  describe("Case Insensitivity", () => {
    it("should match breed regardless of case in value", () => {
      renderComponent({ value: "labrador retriever" });

      expect(screen.getByText("Size:")).toBeInTheDocument();
      expect(screen.getByText("Large")).toBeInTheDocument();
    });

    it("should match breed with mixed case", () => {
      renderComponent({ value: "GOLDEN RETRIEVER" });

      expect(screen.getByText("Size:")).toBeInTheDocument();
      expect(screen.getByText("Large")).toBeInTheDocument();
    });

    it("should match breed with partial case difference", () => {
      renderComponent({ value: "french bulldog" });

      expect(screen.getByText("Small")).toBeInTheDocument();
    });
  });

  describe("Breed Options Availability", () => {
    it("should have Labrador Retriever in breed list", () => {
      renderComponent({ value: "Labrador Retriever" });
      expect(screen.getByText("Labrador Retriever")).toBeInTheDocument();
    });

    it("should have German Shepherd available", () => {
      renderComponent({ value: "German Shepherd" });
      expect(screen.getByText("German Shepherd")).toBeInTheDocument();
      expect(screen.getByText("Large")).toBeInTheDocument();
    });

    it("should have small breeds like Chihuahua", () => {
      renderComponent({ value: "Chihuahua" });
      expect(screen.getByText("Chihuahua")).toBeInTheDocument();
      expect(screen.getByText("Small")).toBeInTheDocument();
    });

    it("should have Mixed Breed option", () => {
      renderComponent({ value: "Mixed Breed" });
      expect(screen.getByText("Mixed Breed")).toBeInTheDocument();
      expect(screen.getByText("Unique")).toBeInTheDocument();
    });

    it("should have Other option", () => {
      renderComponent({ value: "Other" });
      expect(screen.getByText("Other")).toBeInTheDocument();
      expect(screen.getAllByText("Varies")).toHaveLength(2);
    });
  });

  describe("Breed Information", () => {
    it("should show correct info for Border Collie", () => {
      renderComponent({ value: "Border Collie" });

      expect(screen.getByText("Medium")).toBeInTheDocument();
      expect(screen.getByText("Affectionate, Smart, Energetic")).toBeInTheDocument();
    });

    it("should show correct info for Great Dane", () => {
      renderComponent({ value: "Great Dane" });

      expect(screen.getByText("Extra Large")).toBeInTheDocument();
      expect(screen.getByText("Friendly, Patient, Dependable")).toBeInTheDocument();
    });

    it("should show correct info for Pomeranian", () => {
      renderComponent({ value: "Pomeranian" });

      expect(screen.getByText("Small")).toBeInTheDocument();
      expect(screen.getByText("Inquisitive, Bold, Lively")).toBeInTheDocument();
    });

    it("should show correct info for Australian Shepherd", () => {
      renderComponent({ value: "Australian Shepherd" });

      expect(screen.getByText("Medium")).toBeInTheDocument();
      expect(screen.getByText("Smart, Work-Oriented, Exuberant")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes on combobox", () => {
      renderComponent();

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded");
    });

    it("should have proper label association with default id", () => {
      renderComponent();

      const label = screen.getByText("Breed");
      const combobox = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", "breed");
      expect(combobox).toHaveAttribute("id", "breed");
    });

    it("should have proper label association with custom id", () => {
      renderComponent({ id: "breed-select" });

      const label = screen.getByText("Breed");
      const combobox = screen.getByRole("combobox");

      expect(label).toHaveAttribute("for", "breed-select");
      expect(combobox).toHaveAttribute("id", "breed-select");
    });
  });
});
