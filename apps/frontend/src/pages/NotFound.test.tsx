import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import NotFound from "./NotFound";

// Mock react-router-dom
const mockLocation = {
  pathname: "/non-existent-route",
  search: "",
  hash: "",
  state: null,
  key: "default",
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

// Mock console.error to track error logging
const mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});

describe("NotFound Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();
  });

  describe("Component Rendering", () => {
    it("should render 404 error message", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
    });

    it("should render return to home link", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const homeLink = screen.getByRole("link", { name: "Return to Home" });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("should have proper heading structure", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("404");
    });
  });

  describe("Error Logging", () => {
    it("should log error when component mounts", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith(
        "404 Error: User attempted to access non-existent route:",
        "/non-existent-route"
      );
    });

    it("should log different pathname when location changes", () => {
      // Arrange
      const { rerender } = render(<NotFound />);
      
      // Act - Simulate location change
      vi.mocked(mockLocation).pathname = "/another-missing-route";
      rerender(<NotFound />);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith(
        "404 Error: User attempted to access non-existent route:",
        "/another-missing-route"
      );
    });
  });

  describe("Styling and Layout", () => {
    it("should have proper container styling", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const container = screen.getByText("404").closest("div");
      expect(container).toHaveClass("flex", "min-h-screen", "items-center", "justify-center", "bg-gray-100");
    });

    it("should have centered content", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const contentContainer = screen.getByText("404").closest("div");
      expect(contentContainer).toHaveClass("text-center");
    });

    it("should have proper text styling", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const heading = screen.getByText("404");
      expect(heading).toHaveClass("mb-4", "text-4xl", "font-bold");

      const message = screen.getByText("Oops! Page not found");
      expect(message).toHaveClass("mb-4", "text-xl", "text-gray-600");
    });

    it("should have proper link styling", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const homeLink = screen.getByRole("link", { name: "Return to Home" });
      expect(homeLink).toHaveClass("text-blue-500", "underline", "hover:text-blue-700");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("404");
    });

    it("should have accessible link text", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const homeLink = screen.getByRole("link", { name: "Return to Home" });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveTextContent("Return to Home");
    });

    it("should have proper contrast and readability", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const heading = screen.getByText("404");
      const message = screen.getByText("Oops! Page not found");
      const link = screen.getByRole("link", { name: "Return to Home" });

      // Check that elements are visible and have proper text content
      expect(heading).toBeVisible();
      expect(message).toBeVisible();
      expect(link).toBeVisible();
    });
  });

  describe("User Experience", () => {
    it("should provide clear error message", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
    });

    it("should provide navigation back to home", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const homeLink = screen.getByRole("link", { name: "Return to Home" });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("should be visually centered and prominent", () => {
      // Arrange & Act
      render(<NotFound />);

      // Assert
      const container = screen.getByText("404").closest("div");
      expect(container).toHaveClass("flex", "min-h-screen", "items-center", "justify-center");
    });
  });

  describe("Component Behavior", () => {
    it("should render consistently", () => {
      // Arrange & Act
      const { rerender } = render(<NotFound />);
      
      // Assert - First render
      expect(screen.getByText("404")).toBeInTheDocument();
      
      // Act - Re-render
      rerender(<NotFound />);
      
      // Assert - Should still render correctly
      expect(screen.getByText("404")).toBeInTheDocument();
    });

    it("should handle different route paths", () => {
      // Arrange
      vi.mocked(mockLocation).pathname = "/some/deep/nested/route";
      
      // Act
      render(<NotFound />);

      // Assert
      expect(mockConsoleError).toHaveBeenCalledWith(
        "404 Error: User attempted to access non-existent route:",
        "/some/deep/nested/route"
      );
    });
  });
});
