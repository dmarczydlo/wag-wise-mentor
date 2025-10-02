import { render, screen, fireEvent } from "../../test/test-utils";
import { Input } from "./input";
import { describe, it, expect } from "vitest";

describe("Input Component - AAA Pattern", () => {
  describe("Rendering Requirements", () => {
    it("should render with default styling", () => {
      // Arrange
      const placeholder = "Enter text";

      // Act
      render(<Input placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass(
        "flex",
        "h-10",
        "w-full",
        "rounded-md",
        "border",
        "border-input",
        "bg-background",
        "px-3",
        "py-2",
        "text-base"
      );
    });

    it("should render with correct input type", () => {
      // Arrange
      const placeholder = "Enter email";

      // Act
      render(<Input type="email" placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("type", "email");
    });

    it("should render with correct input type for password", () => {
      // Arrange
      const placeholder = "Enter password";

      // Act
      render(<Input type="password" placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("type", "password");
    });

    it("should render with correct input type for number", () => {
      // Arrange
      const placeholder = "Enter number";

      // Act
      render(<Input type="number" placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("type", "number");
    });

    it("should accept custom className", () => {
      // Arrange
      const placeholder = "Custom input";
      const customClass = "custom-input-class";

      // Act
      render(<Input className={customClass} placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveClass(customClass);
    });

    it("should forward ref correctly", () => {
      // Arrange
      const placeholder = "Ref test";
      const ref = { current: null };

      // Act
      render(<Input ref={ref} placeholder={placeholder} />);

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe("Input Attributes Requirements", () => {
    it("should accept placeholder attribute", () => {
      // Arrange
      const placeholder = "Enter your name";

      // Act
      render(<Input placeholder={placeholder} />);

      // Assert
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });

    it("should accept value attribute", () => {
      // Arrange
      const value = "Initial value";

      // Act
      render(<Input value={value} readOnly />);

      // Assert
      const input = screen.getByDisplayValue(value);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(value);
    });

    it("should accept disabled attribute", () => {
      // Arrange
      const placeholder = "Disabled input";

      // Act
      render(<Input disabled placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeDisabled();
      expect(input).toHaveClass(
        "disabled:cursor-not-allowed",
        "disabled:opacity-50"
      );
    });

    it("should accept required attribute", () => {
      // Arrange
      const placeholder = "Required input";

      // Act
      render(<Input required placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeRequired();
    });

    it("should accept name attribute", () => {
      // Arrange
      const name = "test-input";
      const placeholder = "Named input";

      // Act
      render(<Input name={name} placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("name", name);
    });

    it("should accept id attribute", () => {
      // Arrange
      const id = "test-input-id";
      const placeholder = "ID input";

      // Act
      render(<Input id={id} placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("id", id);
    });

    it("should accept maxLength attribute", () => {
      // Arrange
      const maxLength = 10;
      const placeholder = "Max length input";

      // Act
      render(<Input maxLength={maxLength} placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("maxLength", maxLength.toString());
    });

    it("should accept min and max attributes for number input", () => {
      // Arrange
      const min = 0;
      const max = 100;
      const placeholder = "Number input";

      // Act
      render(
        <Input type="number" min={min} max={max} placeholder={placeholder} />
      );

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("min", min.toString());
      expect(input).toHaveAttribute("max", max.toString());
    });
  });

  describe("User Interaction Requirements", () => {
    it("should handle value changes", () => {
      // Arrange
      const placeholder = "Type here";
      const testValue = "Test input";

      // Act
      render(<Input placeholder={placeholder} />);
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.change(input, { target: { value: testValue } });

      // Assert
      expect(input).toHaveValue(testValue);
    });

    it("should handle focus events", () => {
      // Arrange
      const placeholder = "Focus test";
      const onFocus = vi.fn();

      // Act
      render(<Input placeholder={placeholder} onFocus={onFocus} />);
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.focus(input);

      // Assert
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("should handle blur events", () => {
      // Arrange
      const placeholder = "Blur test";
      const onBlur = vi.fn();

      // Act
      render(<Input placeholder={placeholder} onBlur={onBlur} />);
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.blur(input);

      // Assert
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it("should handle key events", () => {
      // Arrange
      const placeholder = "Key test";
      const onKeyDown = vi.fn();

      // Act
      render(<Input placeholder={placeholder} onKeyDown={onKeyDown} />);
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.keyDown(input, { key: "Enter" });

      // Assert
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });

    it("should handle click events", () => {
      // Arrange
      const placeholder = "Click test";
      const onClick = vi.fn();

      // Act
      render(<Input placeholder={placeholder} onClick={onClick} />);
      const input = screen.getByPlaceholderText(placeholder);
      fireEvent.click(input);

      // Assert
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility Requirements", () => {
    it("should be accessible via label", () => {
      // Arrange
      const label = "Test Label";
      const placeholder = "Labeled input";

      // Act
      render(
        <div>
          <label htmlFor="test-input">{label}</label>
          <Input id="test-input" placeholder={placeholder} />
        </div>
      );

      // Assert
      const input = screen.getByLabelText(label);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "test-input");
    });

    it("should support aria-label", () => {
      // Arrange
      const ariaLabel = "Accessible input";
      const placeholder = "Aria labeled input";

      // Act
      render(<Input aria-label={ariaLabel} placeholder={placeholder} />);

      // Assert
      const input = screen.getByLabelText(ariaLabel);
      expect(input).toBeInTheDocument();
    });

    it("should support aria-describedby", () => {
      // Arrange
      const placeholder = "Described input";
      const descriptionId = "input-description";

      // Act
      render(
        <div>
          <Input aria-describedby={descriptionId} placeholder={placeholder} />
          <div id={descriptionId}>This input is described</div>
        </div>
      );

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("aria-describedby", descriptionId);
    });

    it("should support aria-invalid for validation", () => {
      // Arrange
      const placeholder = "Invalid input";

      // Act
      render(<Input aria-invalid="true" placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should support aria-required", () => {
      // Arrange
      const placeholder = "Required input";

      // Act
      render(<Input aria-required="true" placeholder={placeholder} />);

      // Assert
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveAttribute("aria-required", "true");
    });
  });

  describe("Form Integration Requirements", () => {
    it("should work with form submission", () => {
      // Arrange
      const onSubmit = vi.fn();
      const placeholder = "Form input";

      // Act
      render(
        <form onSubmit={onSubmit}>
          <Input name="test-field" placeholder={placeholder} />
          <button type="submit">Submit</button>
        </form>
      );

      const input = screen.getByPlaceholderText(placeholder);
      const submitButton = screen.getByRole("button", { name: "Submit" });

      fireEvent.change(input, { target: { value: "test value" } });
      fireEvent.click(submitButton);

      // Assert
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("should work with controlled components", () => {
      // Arrange
      const placeholder = "Controlled input";
      const initialValue = "Initial";
      const newValue = "Updated";

      // Act
      const { rerender } = render(
        <Input value={initialValue} placeholder={placeholder} readOnly />
      );
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toHaveValue(initialValue);

      rerender(<Input value={newValue} placeholder={placeholder} readOnly />);

      // Assert
      expect(input).toHaveValue(newValue);
    });
  });

  describe("Styling Requirements", () => {
    it("should apply focus styles correctly", () => {
      // Arrange
      const placeholder = "Focus styles test";

      // Act
      render(<Input placeholder={placeholder} />);
      const input = screen.getByPlaceholderText(placeholder);

      // Assert
      expect(input).toHaveClass(
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring"
      );
    });

    it("should apply disabled styles correctly", () => {
      // Arrange
      const placeholder = "Disabled styles test";

      // Act
      render(<Input disabled placeholder={placeholder} />);
      const input = screen.getByPlaceholderText(placeholder);

      // Assert
      expect(input).toHaveClass(
        "disabled:cursor-not-allowed",
        "disabled:opacity-50"
      );
    });

    it("should apply placeholder styles correctly", () => {
      // Arrange
      const placeholder = "Placeholder styles test";

      // Act
      render(<Input placeholder={placeholder} />);
      const input = screen.getByPlaceholderText(placeholder);

      // Assert
      expect(input).toHaveClass("placeholder:text-muted-foreground");
    });
  });
});
