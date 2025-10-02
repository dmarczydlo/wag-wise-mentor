import { render, screen } from "../test/test-utils";
import Index from "./Index";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock react-router-dom with proper exports
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Index Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("Hero Section Requirements", () => {
    it("should render main heading with correct content", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent(/your puppy's journey/i);
      expect(mainHeading).toHaveTextContent(/perfectly guided/i);
    });

    it("should render hero description with key value propositions", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      expect(screen.getByText(/never miss a milestone/i)).toBeInTheDocument();
      expect(screen.getByText(/ai-powered care plans/i)).toBeInTheDocument();
    });

    it("should render hero image with proper accessibility", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      const heroImage = screen.getByAltText(/happy golden retriever puppy/i);
      expect(heroImage).toBeInTheDocument();
      expect(heroImage).toHaveAttribute("src");
    });
  });

  describe("Call-to-Action Requirements", () => {
    it("should render primary and secondary CTA buttons", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      const getStartedButton = screen.getByRole("button", {
        name: /get started free/i,
      });
      const signInButton = screen.getByRole("button", { name: /sign in/i });

      expect(getStartedButton).toBeInTheDocument();
      expect(signInButton).toBeInTheDocument();
    });

    it("should navigate to auth page when CTA buttons are clicked", () => {
      // Arrange
      render(<Index />);
      const getStartedButton = screen.getByRole("button", {
        name: /get started free/i,
      });
      const signInButton = screen.getByRole("button", { name: /sign in/i });

      // Act
      getStartedButton.click();

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith("/auth");
      expect(mockNavigate).toHaveBeenCalledTimes(1);

      // Act
      signInButton.click();

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith("/auth");
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });

    it("should render final CTA section with proper messaging", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      expect(
        screen.getByText(/start your puppy's journey today/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create free account/i })
      ).toBeInTheDocument();
    });

    it("should navigate to auth when final CTA is clicked", () => {
      // Arrange
      render(<Index />);
      const createAccountButton = screen.getByRole("button", {
        name: /create free account/i,
      });

      // Act
      createAccountButton.click();

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith("/auth");
    });
  });

  describe("Features Section Requirements", () => {
    it("should render features section heading and description", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      expect(
        screen.getByText(/everything your puppy needs/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/comprehensive care management/i)
      ).toBeInTheDocument();
    });

    it("should render all six feature cards with correct content", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      const expectedFeatures = [
        "Smart Calendar",
        "Weight-Based Feeding",
        "Training Library",
        "Smart Reminders",
        "Family Sharing",
        "AI Care Plans",
      ];

      expectedFeatures.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });

    it("should render feature descriptions with value propositions", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      expect(
        screen.getByText(/automated scheduling for vet visits/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/precise portion calculations/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/age-appropriate exercises/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/never miss feeding times/i)).toBeInTheDocument();
      expect(
        screen.getByText(/coordinate care with household/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/personalized recommendations/i)
      ).toBeInTheDocument();
    });
  });

  describe("Language Support Requirements", () => {
    it("should render language support section with correct information", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      expect(
        screen.getByText(/available in your language/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/currently supporting english and polish/i)
      ).toBeInTheDocument();
    });

    it("should display language flags correctly", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      expect(screen.getByText("🇬🇧")).toBeInTheDocument();
      expect(screen.getByText("🇵🇱")).toBeInTheDocument();
    });
  });

  describe("Footer Requirements", () => {
    it("should render footer with copyright information", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      expect(screen.getByText(/© 2025 puppy mentor/i)).toBeInTheDocument();
      expect(screen.getByText(/helping puppies thrive/i)).toBeInTheDocument();
    });
  });

  describe("Page Structure Requirements", () => {
    it("should render complete page structure without errors", () => {
      // Arrange & Act
      render(<Index />);

      // Assert - Check that all major sections are present
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent(/your puppy's journey/i); // Hero
      expect(
        screen.getByText(/everything your puppy needs/i)
      ).toBeInTheDocument(); // Features
      expect(
        screen.getByText(/available in your language/i)
      ).toBeInTheDocument(); // Language
      expect(
        screen.getByText(/start your puppy's journey today/i)
      ).toBeInTheDocument(); // Final CTA
      expect(screen.getByText(/© 2025 puppy mentor/i)).toBeInTheDocument(); // Footer
    });

    it("should have proper semantic structure with headings", () => {
      // Arrange & Act
      render(<Index />);

      // Assert
      const headings = screen.getAllByRole("heading");
      expect(headings.length).toBeGreaterThan(0);

      // Check for main heading
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
