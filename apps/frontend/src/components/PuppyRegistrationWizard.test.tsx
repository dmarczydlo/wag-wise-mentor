import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { PuppyRegistrationWizard } from "./PuppyRegistrationWizard";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
    from: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("./BreedAutocomplete", () => ({
  BreedAutocomplete: ({ value, onChange, required }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
    };

    return (
      <div>
        <label htmlFor="breed">Breed{required && <span>*</span>}</label>
        <input
          id="breed"
          type="text"
          value={value || ""}
          onChange={handleChange}
          placeholder="Select breed..."
          data-testid="breed-input"
        />
      </div>
    );
  },
}));

describe("PuppyRegistrationWizard", () => {
  const mockUser = { id: "user-123", email: "test@example.com" };

  const renderWizard = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <PuppyRegistrationWizard />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockNavigate.mockClear();

    const { supabase } = await import("@/integrations/supabase/client");
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: mockUser } },
    });
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  describe("Component Rendering", () => {
    it("should render step 1 by default", () => {
      renderWizard();

      expect(screen.getByText("Basic Info")).toBeInTheDocument();
      expect(screen.getByText("Tell us about your puppy")).toBeInTheDocument();
      expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Birthday")).toBeInTheDocument();
    });

    it("should render progress indicator", () => {
      renderWizard();

      const progressBars = screen
        .getByText("Basic Info")
        .closest("div")
        ?.querySelectorAll(".h-2");
      expect(progressBars).toHaveLength(4);
    });

    it("should render navigation buttons", () => {
      renderWizard();

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("should disable back button on first step", () => {
      renderWizard();

      const backButton = screen.getByRole("button", { name: /back/i });
      expect(backButton).toBeDisabled();
    });
  });

  describe("Step Navigation", () => {
    it("should navigate to step 2 when next is clicked with valid data", async () => {
      renderWizard();

      const nameInput = screen.getByLabelText("Puppy Name");
      const birthdayInput = screen.getByLabelText("Birthday");
      const nextButton = screen.getByRole("button", { name: /next/i });

      fireEvent.change(nameInput, { target: { value: "Max" } });
      fireEvent.change(birthdayInput, { target: { value: "2024-01-01" } });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });
    });

    it("should show validation error when name is empty", async () => {
      renderWizard();

      await waitFor(() => {
        expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      });

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
          "Puppy name is required"
        );
      });

      expect(screen.getByText("Basic Info")).toBeInTheDocument();
    });

    it("should show validation error when birthday is empty", async () => {
      renderWizard();

      await waitFor(() => {
        expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText("Puppy Name");
      fireEvent.change(nameInput, { target: { value: "Max" } });

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
          "Birthday is required"
        );
      });

      expect(screen.getByText("Basic Info")).toBeInTheDocument();
    });

    it("should navigate back to step 1 from step 2", async () => {
      renderWizard();

      const nameInput = screen.getByLabelText("Puppy Name");
      const birthdayInput = screen.getByLabelText("Birthday");
      const nextButton = screen.getByRole("button", { name: /next/i });

      fireEvent.change(nameInput, { target: { value: "Max" } });
      fireEvent.change(birthdayInput, { target: { value: "2024-01-01" } });
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", { name: /back/i });
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByText("Basic Info")).toBeInTheDocument();
      });
    });

    it("should navigate through all steps with valid data", async () => {
      renderWizard();

      await waitFor(() => {
        expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const breedInput = screen.getByLabelText(/breed/i);
      fireEvent.change(breedInput, {
        target: { value: "Golden Retriever" },
      });

      await waitFor(() => {
        expect(breedInput).toHaveValue("Golden Retriever");
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText("Physical Details")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText("Photo")).toBeInTheDocument();
      });
    });
  });

  describe("Step 2 - Breed Selection", () => {
    it("should show validation error when breed is empty", async () => {
      renderWizard();

      await waitFor(() => {
        expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
          "Breed is required"
        );
      });
    });

    it("should accept breed input", async () => {
      renderWizard();

      await waitFor(() => {
        expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const breedInput = screen.getByLabelText(/breed/i);
      fireEvent.change(breedInput, { target: { value: "Labrador" } });
      expect(breedInput).toHaveValue("Labrador");
    });
  });

  describe("Step 3 - Physical Details", () => {
    const navigateToStep3 = async () => {
      renderWizard();

      await waitFor(() => {
        expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const breedInput = screen.getByLabelText(/breed/i);
      fireEvent.change(breedInput, {
        target: { value: "Labrador Retriever" },
      });

      await waitFor(() => {
        expect(breedInput).toHaveValue("Labrador Retriever");
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(
          screen.getByLabelText("Current Weight (kg)")
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("Physical Details")).toBeInTheDocument();
      });
    };

    it("should render weight and activity level inputs", async () => {
      await navigateToStep3();

      expect(screen.getByLabelText("Current Weight (kg)")).toBeInTheDocument();
      expect(screen.getByLabelText("Target Weight (kg)")).toBeInTheDocument();
      expect(screen.getByLabelText("Activity Level")).toBeInTheDocument();
    });

    it("should accept optional weight values", async () => {
      await navigateToStep3();

      const currentWeightInput = screen.getByLabelText("Current Weight (kg)");
      fireEvent.change(currentWeightInput, { target: { value: "5.5" } });
      expect(currentWeightInput).toHaveValue(5.5);
    });

    it("should allow proceeding without weight values", async () => {
      await navigateToStep3();

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText("Photo")).toBeInTheDocument();
      });
    });
  });

  describe("Step 4 - Photo", () => {
    const navigateToStep4 = async () => {
      renderWizard();

      await waitFor(() => {
        expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const breedInput = screen.getByLabelText(/breed/i);
      fireEvent.change(breedInput, {
        target: { value: "Golden Retriever" },
      });

      await waitFor(() => {
        expect(breedInput).toHaveValue("Golden Retriever");
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(
          screen.getByLabelText("Current Weight (kg)")
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText("Photo")).toBeInTheDocument();
      });
    };

    it("should render photo URL input", async () => {
      await navigateToStep4();

      expect(screen.getByLabelText("Photo URL (optional)")).toBeInTheDocument();
      expect(
        screen.getByText("Photo upload feature coming soon")
      ).toBeInTheDocument();
    });

    it("should show register button on last step", async () => {
      await navigateToStep4();

      expect(
        screen.getByRole("button", { name: /register puppy/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should submit puppy registration successfully", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      renderWizard();

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const breedInput = screen.getByLabelText(/breed/i);
      fireEvent.change(breedInput, {
        target: { value: "Golden Retriever" },
      });

      await waitFor(() => {
        expect(breedInput).toHaveValue("Golden Retriever");
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(
          screen.getByLabelText("Current Weight (kg)")
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText("Photo")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /register puppy/i }));

      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalledWith({
          owner_id: mockUser.id,
          name: "Max",
          breed: "Golden Retriever",
          birthday: "2024-01-01",
          current_weight: null,
          target_weight: null,
          activity_level: "moderate",
          photo_url: null,
          characteristics: {},
        });
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
          "Max has been registered successfully!"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should handle submission error", async () => {
      const mockInsert = vi
        .fn()
        .mockResolvedValue({ error: { message: "Database error" } });
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      renderWizard();

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const breedInput = screen.getByLabelText(/breed/i);
      fireEvent.change(breedInput, {
        target: { value: "Golden Retriever" },
      });

      await waitFor(() => {
        expect(breedInput).toHaveValue("Golden Retriever");
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(
          screen.getByLabelText("Current Weight (kg)")
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText("Photo")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /register puppy/i }));

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
          "Failed to register puppy: Database error"
        );
      });
    });

    it("should show loading state during submission", async () => {
      let resolveInsert: (value: any) => void;
      const insertPromise = new Promise(resolve => {
        resolveInsert = resolve;
      });
      const mockInsert = vi.fn().mockReturnValue(insertPromise);
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any);

      renderWizard();

      fireEvent.change(screen.getByLabelText("Puppy Name"), {
        target: { value: "Max" },
      });
      fireEvent.change(screen.getByLabelText("Birthday"), {
        target: { value: "2024-01-01" },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/breed/i)).toBeInTheDocument();
      });

      const breedInput = screen.getByLabelText(/breed/i);
      fireEvent.change(breedInput, {
        target: { value: "Golden Retriever" },
      });

      await waitFor(() => {
        expect(breedInput).toHaveValue("Golden Retriever");
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(
          screen.getByLabelText("Current Weight (kg)")
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /next/i }));

      await waitFor(() => {
        expect(screen.getByText("Photo")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /register puppy/i }));

      expect(screen.getByText("Registering...")).toBeInTheDocument();

      resolveInsert!({ error: null });

      await waitFor(() => {
        expect(screen.queryByText("Registering...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels for all form inputs", () => {
      renderWizard();

      expect(screen.getByLabelText("Puppy Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Birthday")).toBeInTheDocument();
    });

    it("should have proper button roles", () => {
      renderWizard();

      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });
  });
});
