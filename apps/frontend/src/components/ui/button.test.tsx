import { render, screen, fireEvent } from "@/test/test-utils";
import { Button } from "./button";
import { vi, describe, it, expect } from "vitest";

describe("Button Component", () => {
  describe("Rendering Requirements", () => {
    it("should render with default props and correct styling", () => {
      // Arrange
      const buttonText = "Click me";

      // Act
      render(<Button>{buttonText}</Button>);

      // Assert
      const button = screen.getByRole("button", { name: buttonText });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("bg-primary", "text-primary-foreground");
      expect(button).toHaveClass("h-10", "px-4", "py-2"); // default size
    });

    it("should render with destructive variant and correct styling", () => {
      // Arrange
      const buttonText = "Delete";

      // Act
      render(<Button variant="destructive">{buttonText}</Button>);

      // Assert
      const button = screen.getByRole("button", { name: buttonText });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(
        "bg-destructive",
        "text-destructive-foreground"
      );
    });

    it("should render with outline variant and correct styling", () => {
      // Arrange
      const buttonText = "Outline";

      // Act
      render(<Button variant="outline">{buttonText}</Button>);

      // Assert
      const button = screen.getByRole("button", { name: buttonText });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("border", "border-input", "bg-background");
    });

    it("should render with small size and correct styling", () => {
      // Arrange
      const buttonText = "Small";

      // Act
      render(<Button size="sm">{buttonText}</Button>);

      // Assert
      const button = screen.getByRole("button", { name: buttonText });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("h-9", "rounded-md", "px-3");
    });

    it("should render with large size and correct styling", () => {
      // Arrange
      const buttonText = "Large";

      // Act
      render(<Button size="lg">{buttonText}</Button>);

      // Assert
      const button = screen.getByRole("button", { name: buttonText });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("h-11", "rounded-md", "px-8");
    });
  });

  describe("Interaction Requirements", () => {
    it("should handle click events correctly", () => {
      // Arrange
      const handleClick = vi.fn();
      const buttonText = "Click me";

      // Act
      render(<Button onClick={handleClick}>{buttonText}</Button>);
      const button = screen.getByRole("button", { name: buttonText });
      fireEvent.click(button);

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should not trigger click events when disabled", () => {
      // Arrange
      const handleClick = vi.fn();
      const buttonText = "Disabled";

      // Act
      render(
        <Button disabled onClick={handleClick}>
          {buttonText}
        </Button>
      );
      const button = screen.getByRole("button", { name: buttonText });
      fireEvent.click(button);

      // Assert
      expect(button).toBeDisabled();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility Requirements", () => {
    it("should be accessible with proper ARIA attributes when disabled", () => {
      // Arrange
      const buttonText = "Disabled";

      // Act
      render(<Button disabled>{buttonText}</Button>);

      // Assert
      const button = screen.getByRole("button", { name: buttonText });
      expect(button).toBeDisabled();
      expect(button).toHaveClass(
        "disabled:pointer-events-none",
        "disabled:opacity-50"
      );
    });

    it("should forward ref correctly for accessibility tools", () => {
      // Arrange
      const ref = vi.fn();
      const buttonText = "Ref test";

      // Act
      render(<Button ref={ref}>{buttonText}</Button>);

      // Assert
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });

  describe("Advanced Features", () => {
    it("should render as child component when asChild is true", () => {
      // Arrange
      const linkText = "Link button";
      const href = "/test";

      // Act
      render(
        <Button asChild>
          <a href={href}>{linkText}</a>
        </Button>
      );

      // Assert
      const link = screen.getByRole("link", { name: linkText });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveClass("bg-primary", "text-primary-foreground"); // Should inherit button styles
    });

    it("should combine custom className with default classes", () => {
      // Arrange
      const buttonText = "Custom";
      const customClass = "custom-class";

      // Act
      render(<Button className={customClass}>{buttonText}</Button>);

      // Assert
      const button = screen.getByRole("button", { name: buttonText });
      expect(button).toHaveClass(customClass);
      expect(button).toHaveClass("bg-primary", "text-primary-foreground"); // Should still have default classes
    });
  });
});
