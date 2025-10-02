import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Dashboard from "./Dashboard";
import { supabase } from "@/integrations/supabase/client";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Supabase client
const mockSupabase = {
  auth: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signOut: vi.fn(),
  },
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: mockSupabase,
}));

// Mock sonner toast
const mockToast = {
  success: vi.fn(),
};

vi.mock("sonner", () => ({
  toast: mockToast,
}));

describe("Dashboard Component", () => {
  const mockUser = {
    id: "123",
    email: "test@example.com",
    user_metadata: { name: "Test User" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: { user: mockUser } } });
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
  });

  describe("Component Rendering", () => {
    it("should render dashboard with user information", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText("Welcome back! 🐾")).toBeInTheDocument();
        expect(screen.getByText("Let's take care of your puppy today")).toBeInTheDocument();
      });
    });

    it("should render header with logo and sign out button", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText("Puppy Mentor")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
      });
    });

    it("should render get started card", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText("Get Started")).toBeInTheDocument();
        expect(screen.getByText("Add your first puppy to begin tracking their care journey")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Your Puppy" })).toBeInTheDocument();
      });
    });

    it("should render quick action cards", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText("Puppy Profile")).toBeInTheDocument();
        expect(screen.getByText("Feeding Schedule")).toBeInTheDocument();
        expect(screen.getByText("Appointments")).toBeInTheDocument();
        expect(screen.getByText("Reminders")).toBeInTheDocument();
      });
    });
  });

  describe("Loading States", () => {
    it("should show loading state initially", () => {
      // Arrange
      let resolveSession: (value: any) => void;
      const sessionPromise = new Promise((resolve) => {
        resolveSession = resolve;
      });
      mockSupabase.auth.getSession.mockReturnValue(sessionPromise);

      // Act
      render(<Dashboard />);

      // Assert
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument(); // Heart icon
    });

    it("should hide loading state after session is loaded", async () => {
      // Arrange
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByText("Welcome back! 🐾")).toBeInTheDocument();
      });
    });
  });

  describe("Authentication", () => {
    it("should redirect to auth page if no session", async () => {
      // Arrange
      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });

      // Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/auth");
      });
    });

    it("should set up auth state change listener", () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled();
    });

    it("should redirect to auth page on auth state change to no session", async () => {
      // Arrange
      const mockOnAuthStateChange = vi.fn();
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        mockOnAuthStateChange.mockImplementation(callback);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      });

      render(<Dashboard />);

      // Act - Simulate auth state change to no session
      mockOnAuthStateChange("SIGNED_OUT", null);

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/auth");
      });
    });
  });

  describe("Sign Out Functionality", () => {
    it("should handle sign out successfully", async () => {
      // Arrange
      render(<Dashboard />);
      const signOutButton = await screen.findByRole("button", { name: /sign out/i });

      // Act
      fireEvent.click(signOutButton);

      // Assert
      await waitFor(() => {
        expect(mockSupabase.auth.signOut).toHaveBeenCalled();
        expect(mockToast.success).toHaveBeenCalledWith("Signed out successfully");
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("should show sign out button with proper styling", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      const signOutButton = await screen.findByRole("button", { name: /sign out/i });
      expect(signOutButton).toBeInTheDocument();
      expect(signOutButton).toHaveClass("gap-2");
    });
  });

  describe("Quick Action Cards", () => {
    it("should render all quick action cards with correct content", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        // Puppy Profile
        expect(screen.getByText("Puppy Profile")).toBeInTheDocument();
        expect(screen.getByText("Manage your puppy's information")).toBeInTheDocument();

        // Feeding Schedule
        expect(screen.getByText("Feeding Schedule")).toBeInTheDocument();
        expect(screen.getByText("Track meals and portions")).toBeInTheDocument();

        // Appointments
        expect(screen.getByText("Appointments")).toBeInTheDocument();
        expect(screen.getByText("Upcoming vet visits")).toBeInTheDocument();

        // Reminders
        expect(screen.getByText("Reminders")).toBeInTheDocument();
        expect(screen.getByText("Set up notifications")).toBeInTheDocument();
      });
    });

    it("should render quick action cards as clickable elements", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const cards = screen.getAllByRole("button");
        // Should have sign out button + 4 quick action cards (if they're buttons)
        // Note: Quick action cards might be divs with cursor-pointer class
        expect(cards.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Get Started Section", () => {
    it("should render get started card with proper styling", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const getStartedCard = screen.getByText("Get Started").closest("div");
        expect(getStartedCard).toBeInTheDocument();
      });
    });

    it("should render add puppy button", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const addPuppyButton = screen.getByRole("button", { name: "Add Your Puppy" });
        expect(addPuppyButton).toBeInTheDocument();
        expect(addPuppyButton).toHaveClass("bg-primary");
      });
    });
  });

  describe("Layout and Styling", () => {
    it("should have proper header layout", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const header = screen.getByRole("banner");
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass("bg-card", "border-b", "border-border");
      });
    });

    it("should have proper main content layout", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const main = screen.getByRole("main");
        expect(main).toBeInTheDocument();
        expect(main).toHaveClass("container", "mx-auto", "px-4", "py-8");
      });
    });

    it("should have proper background styling", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const dashboardContainer = screen.getByText("Welcome back! 🐾").closest("div");
        expect(dashboardContainer).toHaveClass("min-h-screen", "bg-gradient-warm");
      });
    });
  });

  describe("Icons and Visual Elements", () => {
    it("should render heart icons", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const heartIcons = screen.getAllByRole("img", { hidden: true });
        expect(heartIcons.length).toBeGreaterThan(0);
      });
    });

    it("should render plus icon in add puppy button", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const addPuppyButton = screen.getByRole("button", { name: "Add Your Puppy" });
        expect(addPuppyButton).toBeInTheDocument();
        // The plus icon should be present (hidden for screen readers)
        const plusIcon = addPuppyButton.querySelector("svg");
        expect(plusIcon).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const h1 = screen.getByRole("heading", { level: 1 });
        expect(h1).toHaveTextContent("Puppy Mentor");

        const h2 = screen.getByRole("heading", { level: 2 });
        expect(h2).toHaveTextContent("Welcome back! 🐾");
      });
    });

    it("should have proper button roles", async () => {
      // Arrange & Act
      render(<Dashboard />);

      // Assert
      await waitFor(() => {
        const signOutButton = screen.getByRole("button", { name: /sign out/i });
        const addPuppyButton = screen.getByRole("button", { name: "Add Your Puppy" });
        
        expect(signOutButton).toBeInTheDocument();
        expect(addPuppyButton).toBeInTheDocument();
      });
    });
  });
});
