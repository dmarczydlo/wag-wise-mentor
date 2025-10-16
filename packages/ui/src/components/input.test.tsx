import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./input";

describe("Input Component - AAA Pattern", () => {
  describe("Input Component Requirements", () => {
    it("should render input with default props", () => {
      // Arrange
      const { container } = render(<Input />);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toBeInstanceOf(HTMLInputElement);
    });

    it("should render input with custom type", () => {
      // Arrange
      const { container } = render(<Input type="email" />);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute("type", "email");
    });

    it("should render input with placeholder", () => {
      // Arrange
      render(<Input placeholder="Enter your name" />);

      // Act & Assert
      expect(
        screen.getByPlaceholderText("Enter your name")
      ).toBeInTheDocument();
    });

    it("should render input with value", () => {
      // Arrange
      const { container } = render(<Input value="test value" />);

      // Act & Assert
      expect(container.firstChild).toHaveValue("test value");
    });

    it("should apply custom className", () => {
      // Arrange
      const { container } = render(<Input className="custom-input" />);

      // Act & Assert
      expect(container.firstChild).toHaveClass("custom-input");
    });

    it("should handle change events", () => {
      // Arrange
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      // Act
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "new value" } });

      // Assert
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue("new value");
    });

    it("should handle focus events", () => {
      // Arrange
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);

      // Act
      const input = screen.getByRole("textbox");
      input.focus();

      // Assert
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("should handle blur events", () => {
      // Arrange
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);

      // Act
      const input = screen.getByRole("textbox");
      input.focus();
      input.blur();

      // Assert
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle disabled state", () => {
      // Arrange
      const { container } = render(<Input disabled />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("disabled");
      expect(container.firstChild).toHaveClass("disabled:opacity-50");
    });

    it("should handle required state", () => {
      // Arrange
      const { container } = render(<Input required />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("required");
    });

    it("should handle readonly state", () => {
      // Arrange
      const { container } = render(<Input readOnly />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("readOnly");
    });

    it("should render input with different types", () => {
      // Arrange
      const types = [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "search",
      ] as const;

      types.forEach(type => {
        const { container } = render(<Input type={type} />);

        // Act & Assert
        expect(container.firstChild).toHaveAttribute("type", type);
      });
    });

    it("should render input with name attribute", () => {
      // Arrange
      const { container } = render(<Input name="username" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("name", "username");
    });

    it("should render input with id attribute", () => {
      // Arrange
      const { container } = render(<Input id="user-input" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("id", "user-input");
    });

    it("should render input with maxLength attribute", () => {
      // Arrange
      const { container } = render(<Input maxLength={10} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("maxLength", "10");
    });

    it("should render input with minLength attribute", () => {
      // Arrange
      const { container } = render(<Input minLength={5} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("minLength", "5");
    });

    it("should render input with min and max attributes for number type", () => {
      // Arrange
      const { container } = render(<Input type="number" min={0} max={100} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("min", "0");
      expect(container.firstChild).toHaveAttribute("max", "100");
    });

    it("should render input with step attribute", () => {
      // Arrange
      const { container } = render(<Input type="number" step={0.1} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("step", "0.1");
    });

    it("should render input with pattern attribute", () => {
      // Arrange
      const { container } = render(<Input pattern="[0-9]+" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("pattern", "[0-9]+");
    });

    it("should render input with autocomplete attribute", () => {
      // Arrange
      const { container } = render(<Input autoComplete="email" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("autoComplete", "email");
    });

    it("should render input with aria attributes", () => {
      // Arrange
      const { container } = render(
        <Input aria-label="Username input" aria-describedby="username-help" />
      );

      // Act & Assert
      expect(container.firstChild).toHaveAttribute(
        "aria-label",
        "Username input"
      );
      expect(container.firstChild).toHaveAttribute(
        "aria-describedby",
        "username-help"
      );
    });

    it("should forward ref correctly", () => {
      // Arrange
      const ref = { current: null };
      render(<Input ref={ref} />);

      // Act & Assert
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("should handle keyboard events", () => {
      // Arrange
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} />);

      // Act
      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });

      // Assert
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it("should render input with file type", () => {
      // Arrange
      const { container } = render(<Input type="file" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("type", "file");
    });

    it("should render input with multiple file selection", () => {
      // Arrange
      const { container } = render(<Input type="file" multiple />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("multiple");
    });

    it("should render input with accept attribute for file type", () => {
      // Arrange
      const { container } = render(<Input type="file" accept="image/*" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute("accept", "image/*");
    });
  });
});
