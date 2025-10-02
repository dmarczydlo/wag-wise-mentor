import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Auth from "./Auth";
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
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

// Mock sonner toast
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
};

vi.mock("sonner", () => ({
  toast: mockToast,
}));

describe("Auth Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    const { supabase } = await import("@/integrations/supabase/client");
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null } });
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  describe("Component Rendering", () => {
    it("should render login form by default", () => {
      // Arrange & Act
      render(<Auth />);

      // Assert
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByText("Sign in to continue your puppy's journey")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    });

    it("should render sign up form when toggled", () => {
      // Arrange & Act
      render(<Auth />);
      const toggleButton = screen.getByText("Sign Up");
      fireEvent.click(toggleButton);

      // Assert
      expect(screen.getByText("Get Started")).toBeInTheDocument();
      expect(screen.getByText("Create an account to start caring for your puppy")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
    });

    it("should render heart icon", () => {
      // Arrange & Act
      render(<Auth />);

      // Assert
      const heartIcon = screen.getByRole("img", { hidden: true });
      expect(heartIcon).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show validation error for invalid email", async () => {
      // Arrange
      render(<Auth />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      // Act
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("Please enter a valid email");
      });
    });

    it("should show validation error for short password", async () => {
      // Arrange
      render(<Auth />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      // Act
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "123" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("Password must be at least 6 characters");
      });
    });

    it("should allow form submission with valid data", async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });
      render(<Auth />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      // Act
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });
  });

  describe("Authentication Flow", () => {
    it("should handle successful login", async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null });
      render(<Auth />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      // Act
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith("Welcome back!");
      });
    });

    it("should handle login error with invalid credentials", async () => {
      // Arrange
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        error: { message: "Invalid login credentials" },
      });
      render(<Auth />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      // Act
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("Invalid email or password");
      });
    });

    it("should handle successful sign up", async () => {
      // Arrange
      mockSupabase.auth.signUp.mockResolvedValue({ error: null });
      render(<Auth />);
      const toggleButton = screen.getByText("Sign Up");
      fireEvent.click(toggleButton);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Create Account" });

      // Act
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
          options: {
            emailRedirectTo: expect.stringContaining("/dashboard"),
          },
        });
        expect(mockToast.success).toHaveBeenCalledWith("Account created! Welcome to Puppy Mentor!");
      });
    });

    it("should handle sign up error for existing email", async () => {
      // Arrange
      mockSupabase.auth.signUp.mockResolvedValue({
        error: { message: "User already registered" },
      });
      render(<Auth />);
      const toggleButton = screen.getByText("Sign Up");
      fireEvent.click(toggleButton);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Create Account" });

      // Act
      fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          "This email is already registered. Please sign in instead."
        );
      });
    });
  });

  describe("Form Toggle", () => {
    it("should toggle between login and sign up modes", () => {
      // Arrange
      render(<Auth />);

      // Act & Assert - Start with login
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();

      // Toggle to sign up
      const toggleButton = screen.getByText("Sign Up");
      fireEvent.click(toggleButton);

      expect(screen.getByText("Get Started")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();

      // Toggle back to login
      const toggleBackButton = screen.getByText("Sign In");
      fireEvent.click(toggleBackButton);

      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should show loading state during authentication", async () => {
      // Arrange
      let resolveAuth: (value: any) => void;
      const authPromise = new Promise((resolve) => {
        resolveAuth = resolve;
      });
      mockSupabase.auth.signInWithPassword.mockReturnValue(authPromise);

      render(<Auth />);
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Sign In" });

      // Act
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      // Assert
      expect(screen.getByText("Please wait...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Resolve the promise
      resolveAuth!({ error: null });
      await waitFor(() => {
        expect(screen.getByText("Sign In")).toBeInTheDocument();
      });
    });
  });

  describe("Session Management", () => {
    it("should redirect to dashboard if user is already authenticated", async () => {
      // Arrange
      const mockSession = { user: { id: "123", email: "test@example.com" } };
      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

      // Act
      render(<Auth />);

      // Assert
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should set up auth state change listener", () => {
      // Arrange & Act
      render(<Auth />);

      // Assert
      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      // Arrange & Act
      render(<Auth />);

      // Assert
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("should have proper button roles", () => {
      // Arrange & Act
      render(<Auth />);

      // Assert
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    });

    it("should have proper form structure", () => {
      // Arrange & Act
      render(<Auth />);

      // Assert
      const form = screen.getByRole("form");
      expect(form).toBeInTheDocument();
    });
  });
});
