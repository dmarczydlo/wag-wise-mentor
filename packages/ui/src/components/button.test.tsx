import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button Component - AAA Pattern", () => {
  describe("Button Component Requirements", () => {
    it("should render button with default variant and size", () => {
      // Arrange
      const { container } = render(<Button>Default Button</Button>);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Default Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("bg-primary");
      expect(container.firstChild).toHaveClass("h-10");
    });

    it("should render button with destructive variant", () => {
      // Arrange
      const { container } = render(
        <Button variant="destructive">Destructive Button</Button>
      );

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Destructive Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("bg-destructive");
    });

    it("should render button with outline variant", () => {
      // Arrange
      const { container } = render(
        <Button variant="outline">Outline Button</Button>
      );

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Outline Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("border");
    });

    it("should render button with secondary variant", () => {
      // Arrange
      const { container } = render(
        <Button variant="secondary">Secondary Button</Button>
      );

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Secondary Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("bg-secondary");
    });

    it("should render button with ghost variant", () => {
      // Arrange
      const { container } = render(
        <Button variant="ghost">Ghost Button</Button>
      );

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Ghost Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("hover:bg-accent");
    });

    it("should render button with link variant", () => {
      // Arrange
      const { container } = render(<Button variant="link">Link Button</Button>);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Link Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("text-primary");
    });

    it("should render button with small size", () => {
      // Arrange
      const { container } = render(<Button size="sm">Small Button</Button>);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Small Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("h-9");
    });

    it("should render button with large size", () => {
      // Arrange
      const { container } = render(<Button size="lg">Large Button</Button>);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Large Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("h-11");
    });

    it("should render button with icon size", () => {
      // Arrange
      const { container } = render(<Button size="icon">Icon Button</Button>);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Icon Button")).toBeInTheDocument();
      expect(container.firstChild).toHaveClass("h-10", "w-10");
    });

    it("should apply custom className", () => {
      // Arrange
      const { container } = render(
        <Button className="custom-button">Custom Button</Button>
      );

      // Act & Assert
      expect(container.firstChild).toHaveClass("custom-button");
      expect(screen.getByText("Custom Button")).toBeInTheDocument();
    });

    it("should handle click events", () => {
      // Arrange
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable Button</Button>);

      // Act
      screen.getByText("Clickable Button").click();

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle disabled state", () => {
      // Arrange
      const handleClick = vi.fn();
      const { container } = render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      );

      // Act
      screen.getByText("Disabled Button").click();

      // Assert
      expect(handleClick).not.toHaveBeenCalled();
      expect(container.firstChild).toHaveAttribute("disabled");
    });

    it("should render button with asChild prop", () => {
      // Arrange
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      // Act & Assert
      const link = screen.getByText("Link Button");
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "/test");
    });

    it("should render button with different content types", () => {
      // Arrange
      render(
        <>
          <Button>Text Button</Button>
          <Button>
            <span>Icon</span> Button
          </Button>
          <Button>123</Button>
        </>
      );

      // Act & Assert
      expect(screen.getByText("Text Button")).toBeInTheDocument();
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      // Arrange
      const ref = { current: null };
      render(<Button ref={ref}>Ref Button</Button>);

      // Act & Assert
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("should handle keyboard events", () => {
      // Arrange
      const handleKeyDown = vi.fn();
      render(<Button onKeyDown={handleKeyDown}>Keyboard Button</Button>);

      // Act
      const button = screen.getByText("Keyboard Button");
      button.focus();
      fireEvent.keyDown(button, { key: "Enter" });

      // Assert
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it("should render button with custom attributes", () => {
      // Arrange
      const { container } = render(
        <Button data-testid="custom-button" aria-label="Custom button">
          Custom Button
        </Button>
      );

      // Act & Assert
      expect(container.firstChild).toHaveAttribute(
        "data-testid",
        "custom-button"
      );
      expect(container.firstChild).toHaveAttribute(
        "aria-label",
        "Custom button"
      );
    });

    it("should render button with all variant and size combinations", () => {
      // Arrange
      const variants = [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ] as const;
      const sizes = ["default", "sm", "lg", "icon"] as const;

      variants.forEach(variant => {
        sizes.forEach(size => {
          const { container } = render(
            <Button variant={variant} size={size}>
              {variant} {size}
            </Button>
          );

          // Act & Assert
          expect(container.firstChild).toBeInTheDocument();
          expect(screen.getByText(`${variant} ${size}`)).toBeInTheDocument();
        });
      });
    });
  });
});
