import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea Component - AAA Pattern', () => {
  describe('Textarea Component Requirements', () => {
    it('should render textarea with default props', () => {
      // Arrange
      const { container } = render(<Textarea />);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('min-h-[80px]');
    });

    it('should render textarea with placeholder', () => {
      // Arrange
      render(<Textarea placeholder="Enter your message" />);

      // Act & Assert
      expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    });

    it('should render textarea with value', () => {
      // Arrange
      const { container } = render(<Textarea value="test value" />);

      // Act & Assert
      expect(container.firstChild).toHaveValue('test value');
    });

    it('should apply custom className', () => {
      // Arrange
      const { container } = render(<Textarea className="custom-textarea" />);

      // Act & Assert
      expect(container.firstChild).toHaveClass('custom-textarea');
    });

    it('should handle change events', () => {
      // Arrange
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);

      // Act
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'new value' } });

      // Assert
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(textarea).toHaveValue('new value');
    });

    it('should handle focus events', () => {
      // Arrange
      const handleFocus = vi.fn();
      render(<Textarea onFocus={handleFocus} />);

      // Act
      const textarea = screen.getByRole('textbox');
      textarea.focus();

      // Assert
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle blur events', () => {
      // Arrange
      const handleBlur = vi.fn();
      render(<Textarea onBlur={handleBlur} />);

      // Act
      const textarea = screen.getByRole('textbox');
      textarea.focus();
      textarea.blur();

      // Assert
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle disabled state', () => {
      // Arrange
      const { container } = render(<Textarea disabled />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('disabled');
      expect(container.firstChild).toHaveClass('disabled:opacity-50');
    });

    it('should handle readonly state', () => {
      // Arrange
      const { container } = render(<Textarea readOnly />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('readOnly');
    });

    it('should handle required state', () => {
      // Arrange
      const { container } = render(<Textarea required />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('required');
    });

    it('should render textarea with rows attribute', () => {
      // Arrange
      const { container } = render(<Textarea rows={5} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('rows', '5');
    });

    it('should render textarea with cols attribute', () => {
      // Arrange
      const { container } = render(<Textarea cols={50} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('cols', '50');
    });

    it('should render textarea with maxLength attribute', () => {
      // Arrange
      const { container } = render(<Textarea maxLength={100} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('maxLength', '100');
    });

    it('should render textarea with minLength attribute', () => {
      // Arrange
      const { container } = render(<Textarea minLength={10} />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('minLength', '10');
    });

    it('should render textarea with name attribute', () => {
      // Arrange
      const { container } = render(<Textarea name="message" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('name', 'message');
    });

    it('should render textarea with id attribute', () => {
      // Arrange
      const { container } = render(<Textarea id="message-input" />);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('id', 'message-input');
    });

    it('should render textarea with aria attributes', () => {
      // Arrange
      const { container } = render(
        <Textarea aria-label="Message input" aria-describedby="message-help" />
      );

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('aria-label', 'Message input');
      expect(container.firstChild).toHaveAttribute('aria-describedby', 'message-help');
    });

    it('should render textarea with data attributes', () => {
      // Arrange
      const { container } = render(
        <Textarea data-testid="test-textarea" data-custom="value" />
      );

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('data-testid', 'test-textarea');
      expect(container.firstChild).toHaveAttribute('data-custom', 'value');
    });

    it('should render textarea with custom height', () => {
      // Arrange
      const { container } = render(<Textarea className="min-h-[200px]" />);

      // Act & Assert
      expect(container.firstChild).toHaveClass('min-h-[200px]');
    });

    it('should render textarea with custom width', () => {
      // Arrange
      const { container } = render(<Textarea className="w-96" />);

      // Act & Assert
      expect(container.firstChild).toHaveClass('w-96');
    });

    it('should forward ref correctly', () => {
      // Arrange
      const ref = { current: null };
      render(<Textarea ref={ref} />);

      // Act & Assert
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it('should handle keyboard events', () => {
      // Arrange
      const handleKeyDown = vi.fn();
      render(<Textarea onKeyDown={handleKeyDown} />);

      // Act
      const textarea = screen.getByRole('textbox');
      fireEvent.keyDown(textarea, { key: 'Enter' });

      // Assert
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should handle input events', () => {
      // Arrange
      const handleInput = vi.fn();
      render(<Textarea onInput={handleInput} />);

      // Act
      const textarea = screen.getByRole('textbox');
      fireEvent.input(textarea, { target: { value: 'input event' } });

      // Assert
      expect(handleInput).toHaveBeenCalledTimes(1);
    });

    it('should render textarea with multiline content', () => {
      // Arrange
      const multilineText = 'Line 1\nLine 2\nLine 3';
      const { container } = render(<Textarea value={multilineText} />);

      // Act & Assert
      expect(container.firstChild).toHaveValue(multilineText);
    });

    it('should render textarea with auto-resize behavior', () => {
      // Arrange
      const { container } = render(<Textarea className="resize-none" />);

      // Act & Assert
      expect(container.firstChild).toHaveClass('resize-none');
    });

    it('should render textarea with different resize options', () => {
      // Arrange
      const resizeOptions = ['resize-none', 'resize-both', 'resize-horizontal', 'resize-vertical'] as const;

      resizeOptions.forEach((resize) => {
        const { container } = render(<Textarea className={resize} />);

        // Act & Assert
        expect(container.firstChild).toHaveClass(resize);
      });
    });

    it('should render textarea with form association', () => {
      // Arrange
      render(
        <form>
          <label htmlFor="message">Message</label>
          <Textarea id="message" name="message" />
        </form>
      );

      // Act & Assert
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('id', 'message');
      expect(textarea).toHaveAttribute('name', 'message');
    });
  });
});
