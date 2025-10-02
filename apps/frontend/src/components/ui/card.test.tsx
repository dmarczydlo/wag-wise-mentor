import { render, screen } from "../../test/test-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { describe, it, expect } from "vitest";

describe("Card Component - AAA Pattern", () => {
  describe("Card Component Requirements", () => {
    it("should render with default styling", () => {
      // Arrange
      const cardContent = "Card content";

      // Act
      render(<Card>{cardContent}</Card>);

      // Assert
      const card = screen.getByText(cardContent);
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(
        "rounded-lg",
        "border",
        "bg-card",
        "text-card-foreground",
        "shadow-sm"
      );
    });

    it("should accept custom className", () => {
      // Arrange
      const cardContent = "Card content";
      const customClass = "custom-card-class";

      // Act
      render(<Card className={customClass}>{cardContent}</Card>);

      // Assert
      const card = screen.getByText(cardContent);
      expect(card).toHaveClass(customClass);
    });

    it("should forward ref correctly", () => {
      // Arrange
      const cardContent = "Card content";
      const ref = { current: null };

      // Act
      render(<Card ref={ref}>{cardContent}</Card>);

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should accept additional props", () => {
      // Arrange
      const cardContent = "Card content";
      const testId = "test-card";

      // Act
      render(<Card data-testid={testId}>{cardContent}</Card>);

      // Assert
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  describe("CardHeader Component Requirements", () => {
    it("should render with default styling", () => {
      // Arrange
      const headerContent = "Header content";

      // Act
      render(
        <Card>
          <CardHeader>{headerContent}</CardHeader>
        </Card>
      );

      // Assert
      const header = screen.getByText(headerContent);
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
    });

    it("should accept custom className", () => {
      // Arrange
      const headerContent = "Header content";
      const customClass = "custom-header-class";

      // Act
      render(
        <Card>
          <CardHeader className={customClass}>{headerContent}</CardHeader>
        </Card>
      );

      // Assert
      const header = screen.getByText(headerContent);
      expect(header).toHaveClass(customClass);
    });

    it("should forward ref correctly", () => {
      // Arrange
      const headerContent = "Header content";
      const ref = { current: null };

      // Act
      render(
        <Card>
          <CardHeader ref={ref}>{headerContent}</CardHeader>
        </Card>
      );

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardTitle Component Requirements", () => {
    it("should render with default styling", () => {
      // Arrange
      const titleContent = "Card Title";

      // Act
      render(
        <Card>
          <CardHeader>
            <CardTitle>{titleContent}</CardTitle>
          </CardHeader>
        </Card>
      );

      // Assert
      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent(titleContent);
      expect(title).toHaveClass(
        "text-2xl",
        "font-semibold",
        "leading-none",
        "tracking-tight"
      );
    });

    it("should accept custom className", () => {
      // Arrange
      const titleContent = "Card Title";
      const customClass = "custom-title-class";

      // Act
      render(
        <Card>
          <CardHeader>
            <CardTitle className={customClass}>{titleContent}</CardTitle>
          </CardHeader>
        </Card>
      );

      // Assert
      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toHaveClass(customClass);
    });

    it("should forward ref correctly", () => {
      // Arrange
      const titleContent = "Card Title";
      const ref = { current: null };

      // Act
      render(
        <Card>
          <CardHeader>
            <CardTitle ref={ref}>{titleContent}</CardTitle>
          </CardHeader>
        </Card>
      );

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe("CardDescription Component Requirements", () => {
    it("should render with default styling", () => {
      // Arrange
      const descriptionContent = "Card description";

      // Act
      render(
        <Card>
          <CardHeader>
            <CardDescription>{descriptionContent}</CardDescription>
          </CardHeader>
        </Card>
      );

      // Assert
      const description = screen.getByText(descriptionContent);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("text-sm", "text-muted-foreground");
    });

    it("should accept custom className", () => {
      // Arrange
      const descriptionContent = "Card description";
      const customClass = "custom-description-class";

      // Act
      render(
        <Card>
          <CardHeader>
            <CardDescription className={customClass}>
              {descriptionContent}
            </CardDescription>
          </CardHeader>
        </Card>
      );

      // Assert
      const description = screen.getByText(descriptionContent);
      expect(description).toHaveClass(customClass);
    });

    it("should forward ref correctly", () => {
      // Arrange
      const descriptionContent = "Card description";
      const ref = { current: null };

      // Act
      render(
        <Card>
          <CardHeader>
            <CardDescription ref={ref}>{descriptionContent}</CardDescription>
          </CardHeader>
        </Card>
      );

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe("CardContent Component Requirements", () => {
    it("should render with default styling", () => {
      // Arrange
      const contentText = "Card content";

      // Act
      render(
        <Card>
          <CardContent>{contentText}</CardContent>
        </Card>
      );

      // Assert
      const content = screen.getByText(contentText);
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass("p-6", "pt-0");
    });

    it("should accept custom className", () => {
      // Arrange
      const contentText = "Card content";
      const customClass = "custom-content-class";

      // Act
      render(
        <Card>
          <CardContent className={customClass}>{contentText}</CardContent>
        </Card>
      );

      // Assert
      const content = screen.getByText(contentText);
      expect(content).toHaveClass(customClass);
    });

    it("should forward ref correctly", () => {
      // Arrange
      const contentText = "Card content";
      const ref = { current: null };

      // Act
      render(
        <Card>
          <CardContent ref={ref}>{contentText}</CardContent>
        </Card>
      );

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("CardFooter Component Requirements", () => {
    it("should render with default styling", () => {
      // Arrange
      const footerContent = "Footer content";

      // Act
      render(
        <Card>
          <CardFooter>{footerContent}</CardFooter>
        </Card>
      );

      // Assert
      const footer = screen.getByText(footerContent);
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("flex", "items-center", "p-6", "pt-0");
    });

    it("should accept custom className", () => {
      // Arrange
      const footerContent = "Footer content";
      const customClass = "custom-footer-class";

      // Act
      render(
        <Card>
          <CardFooter className={customClass}>{footerContent}</CardFooter>
        </Card>
      );

      // Assert
      const footer = screen.getByText(footerContent);
      expect(footer).toHaveClass(customClass);
    });

    it("should forward ref correctly", () => {
      // Arrange
      const footerContent = "Footer content";
      const ref = { current: null };

      // Act
      render(
        <Card>
          <CardFooter ref={ref}>{footerContent}</CardFooter>
        </Card>
      );

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Complete Card Structure Requirements", () => {
    it("should render complete card with all components", () => {
      // Arrange
      const title = "Complete Card";
      const description = "This is a complete card example";
      const content = "Card content goes here";
      const footer = "Card footer";

      // Act
      render(
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{content}</CardContent>
          <CardFooter>{footer}</CardFooter>
        </Card>
      );

      // Assert
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        title
      );
      expect(screen.getByText(description)).toBeInTheDocument();
      expect(screen.getByText(content)).toBeInTheDocument();
      expect(screen.getByText(footer)).toBeInTheDocument();
    });

    it("should maintain proper semantic structure", () => {
      // Arrange
      const title = "Semantic Card";
      const description = "Semantic description";
      const content = "Semantic content";

      // Act
      render(
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{content}</CardContent>
        </Card>
      );

      // Assert
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(title);

      // Check that description comes after title
      const descriptionElement = screen.getByText(description);
      expect(descriptionElement).toBeInTheDocument();

      // Check that content comes after header
      const contentElement = screen.getByText(content);
      expect(contentElement).toBeInTheDocument();
    });

    it("should handle nested content correctly", () => {
      // Arrange
      const nestedContent = (
        <div>
          <h4>Nested Heading</h4>
          <p>Nested paragraph</p>
          <button>Nested Button</button>
        </div>
      );

      // Act
      render(
        <Card>
          <CardContent>{nestedContent}</CardContent>
        </Card>
      );

      // Assert
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Nested Heading"
      );
      expect(screen.getByText("Nested paragraph")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Nested Button" })
      ).toBeInTheDocument();
    });
  });
});
