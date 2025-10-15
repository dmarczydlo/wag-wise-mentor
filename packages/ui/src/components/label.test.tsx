import { render, screen, fireEvent } from '@testing-library/react';
import { Label } from './label';

describe('Label Component - AAA Pattern', () => {
  describe('Label Component Requirements', () => {
    it('should render label with text content', () => {
      // Arrange
      const { container } = render(<Label>Test Label</Label>);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should render label with htmlFor attribute', () => {
      // Arrange
      const { container } = render(<Label htmlFor="test-input">Label for Input</Label>);

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('for', 'test-input');
      expect(screen.getByText('Label for Input')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      // Arrange
      const { container } = render(<Label className="custom-label">Custom Label</Label>);

      // Act & Assert
      expect(container.firstChild).toHaveClass('custom-label');
      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('should render label with complex content', () => {
      // Arrange
      render(
        <Label>
          <span>Complex</span> Label <strong>Content</strong>
        </Label>
      );

      // Act & Assert
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render label with long text', () => {
      // Arrange
      render(<Label>This is a very long label text that should render correctly</Label>);

      // Act & Assert
      expect(screen.getByText('This is a very long label text that should render correctly')).toBeInTheDocument();
    });

    it('should render label with special characters', () => {
      // Arrange
      render(<Label>Label with @#$% special characters</Label>);

      // Act & Assert
      expect(screen.getByText('Label with @#$% special characters')).toBeInTheDocument();
    });

    it('should render label with numbers', () => {
      // Arrange
      render(<Label>Label 123 with numbers</Label>);

      // Act & Assert
      expect(screen.getByText('Label 123 with numbers')).toBeInTheDocument();
    });

    it('should render label with empty content', () => {
      // Arrange
      const { container } = render(<Label></Label>);

      // Act & Assert
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render label with aria attributes', () => {
      // Arrange
      const { container } = render(
        <Label aria-describedby="help-text" aria-required="true">
          Required Label
        </Label>
      );

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('aria-describedby', 'help-text');
      expect(container.firstChild).toHaveAttribute('aria-required', 'true');
      expect(screen.getByText('Required Label')).toBeInTheDocument();
    });

    it('should render label with data attributes', () => {
      // Arrange
      const { container } = render(
        <Label data-testid="test-label" data-custom="value">
          Data Label
        </Label>
      );

      // Act & Assert
      expect(container.firstChild).toHaveAttribute('data-testid', 'test-label');
      expect(container.firstChild).toHaveAttribute('data-custom', 'value');
      expect(screen.getByText('Data Label')).toBeInTheDocument();
    });

    it('should render multiple labels', () => {
      // Arrange
      render(
        <>
          <Label>First Label</Label>
          <Label>Second Label</Label>
          <Label>Third Label</Label>
        </>
      );

      // Act & Assert
      expect(screen.getByText('First Label')).toBeInTheDocument();
      expect(screen.getByText('Second Label')).toBeInTheDocument();
      expect(screen.getByText('Third Label')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      // Arrange
      const ref = { current: null };
      render(<Label ref={ref}>Ref Label</Label>);

      // Act & Assert
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it('should handle click events', () => {
      // Arrange
      const handleClick = vi.fn();
      render(<Label onClick={handleClick}>Clickable Label</Label>);

      // Act
      screen.getByText('Clickable Label').click();

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', () => {
      // Arrange
      const handleKeyDown = vi.fn();
      render(<Label onKeyDown={handleKeyDown}>Keyboard Label</Label>);

      // Act
      const label = screen.getByText('Keyboard Label');
      label.focus();
      fireEvent.keyDown(label, { key: 'Enter' });

      // Assert
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should render label with different text sizes', () => {
      // Arrange
      render(
        <>
          <Label className="text-xs">Small Label</Label>
          <Label className="text-sm">Medium Label</Label>
          <Label className="text-lg">Large Label</Label>
        </>
      );

      // Act & Assert
      expect(screen.getByText('Small Label')).toBeInTheDocument();
      expect(screen.getByText('Medium Label')).toBeInTheDocument();
      expect(screen.getByText('Large Label')).toBeInTheDocument();
    });

    it('should render label with different colors', () => {
      // Arrange
      render(
        <>
          <Label className="text-red-500">Red Label</Label>
          <Label className="text-blue-500">Blue Label</Label>
          <Label className="text-green-500">Green Label</Label>
        </>
      );

      // Act & Assert
      expect(screen.getByText('Red Label')).toBeInTheDocument();
      expect(screen.getByText('Blue Label')).toBeInTheDocument();
      expect(screen.getByText('Green Label')).toBeInTheDocument();
    });

    it('should render label with form association', () => {
      // Arrange
      render(
        <form>
          <Label htmlFor="username">Username</Label>
          <input id="username" type="text" />
        </form>
      );

      // Act & Assert
      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'username');
      expect(input).toHaveAttribute('id', 'username');
    });
  });
});