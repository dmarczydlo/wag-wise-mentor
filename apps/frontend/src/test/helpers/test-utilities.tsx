import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, beforeEach, afterEach } from "vitest";

/**
 * Mock data factory for creating test data objects
 */
export class MockDataFactory {
  /**
   * Create mock user data
   */
  static createUser(
    overrides: Partial<{
      id: string;
      email: string;
      created_at: string;
    }> = {}
  ) {
    return {
      id: overrides.id || "user-1",
      email: overrides.email || "test@example.com",
      created_at: overrides.created_at || "2023-01-01T00:00:00Z",
    };
  }

  /**
   * Create mock session data
   */
  static createSession(
    overrides: Partial<{
      user: any;
      access_token: string;
      refresh_token: string;
    }> = {}
  ) {
    return {
      user: overrides.user || this.createUser(),
      access_token: overrides.access_token || "mock-access-token",
      refresh_token: overrides.refresh_token || "mock-refresh-token",
    };
  }

  /**
   * Create mock puppy data
   */
  static createPuppy(
    overrides: Partial<{
      id: string;
      name: string;
      breed: string;
      birthDate: string;
      currentWeight: number;
      weightUnit: string;
      ownerId: string;
    }> = {}
  ) {
    return {
      id: overrides.id || "puppy-1",
      name: overrides.name || "Buddy",
      breed: overrides.breed || "Golden Retriever",
      birthDate: overrides.birthDate || "2023-01-01",
      currentWeight: overrides.currentWeight || 10,
      weightUnit: overrides.weightUnit || "kg",
      ownerId: overrides.ownerId || "owner-1",
    };
  }
}

/**
 * Mock service factory for creating mock implementations
 */
export class MockServiceFactory {
  /**
   * Create mock Supabase auth service
   */
  static createSupabaseAuth() {
    return {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    };
  }

  /**
   * Create mock toast service
   */
  static createToast() {
    return {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    };
  }

  /**
   * Create mock navigation function
   */
  static createNavigate() {
    return vi.fn();
  }
}

/**
 * Test wrapper component that provides all necessary providers
 */
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

/**
 * Custom render function that includes all providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Test utilities for common testing patterns
 */
export class TestUtils {
  /**
   * Wait for element to appear with custom timeout
   */
  static async waitForElement(
    container: HTMLElement,
    selector: string,
    timeout: number = 1000
  ): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkElement = () => {
        const element = container.querySelector(selector) as HTMLElement;
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(
            new Error(`Element ${selector} not found within ${timeout}ms`)
          );
        } else {
          setTimeout(checkElement, 10);
        }
      };

      checkElement();
    });
  }

  /**
   * Wait for text content to appear
   */
  static async waitForText(
    container: HTMLElement,
    text: string,
    timeout: number = 1000
  ): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkText = () => {
        const element = Array.from(container.querySelectorAll("*")).find(el =>
          el.textContent?.includes(text)
        ) as HTMLElement;

        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Text "${text}" not found within ${timeout}ms`));
        } else {
          setTimeout(checkText, 10);
        }
      };

      checkText();
    });
  }

  /**
   * Simulate user typing with realistic delays
   */
  static async typeWithDelay(
    element: HTMLElement,
    text: string,
    delay: number = 50
  ): Promise<void> {
    for (const char of text) {
      element.dispatchEvent(new KeyboardEvent("keydown", { key: char }));
      element.dispatchEvent(new KeyboardEvent("keypress", { key: char }));
      element.value += char;
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new KeyboardEvent("keyup", { key: char }));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * Simulate form submission
   */
  static async submitForm(form: HTMLFormElement): Promise<void> {
    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    form.dispatchEvent(submitEvent);
  }

  /**
   * Assert element has specific classes
   */
  static assertHasClasses(element: HTMLElement, classes: string[]): void {
    classes.forEach(className => {
      expect(element).toHaveClass(className);
    });
  }

  /**
   * Assert element has specific attributes
   */
  static assertHasAttributes(
    element: HTMLElement,
    attributes: Record<string, string>
  ): void {
    Object.entries(attributes).forEach(([name, value]) => {
      expect(element).toHaveAttribute(name, value);
    });
  }

  /**
   * Assert element is accessible
   */
  static assertAccessible(element: HTMLElement): void {
    // Check for required accessibility attributes
    const hasId = element.hasAttribute("id");
    const hasAriaLabel = element.hasAttribute("aria-label");
    const hasAriaLabelledBy = element.hasAttribute("aria-labelledby");
    const hasRole = element.hasAttribute("role");

    // For interactive elements, should have at least one accessibility attribute
    if (
      element.tagName === "BUTTON" ||
      element.tagName === "INPUT" ||
      element.tagName === "SELECT"
    ) {
      expect(hasId || hasAriaLabel || hasAriaLabelledBy || hasRole).toBe(true);
    }
  }
}

/**
 * Component test helper for common component testing patterns
 */
export class ComponentTestHelper {
  /**
   * Test component rendering with default props
   */
  static testRendering(
    Component: React.ComponentType<any>,
    props: any = {},
    expectedText?: string
  ): void {
    const { container } = customRender(<Component {...props} />);

    if (expectedText) {
      expect(container).toHaveTextContent(expectedText);
    }

    expect(container.firstChild).toBeInTheDocument();
  }

  /**
   * Test component with different prop variations
   */
  static testPropVariations(
    Component: React.ComponentType<any>,
    baseProps: any,
    variations: Array<{
      props: any;
      expectedText?: string;
      expectedClass?: string;
    }>
  ): void {
    variations.forEach(({ props, expectedText, expectedClass }) => {
      const { container } = customRender(
        <Component {...baseProps} {...props} />
      );

      if (expectedText) {
        expect(container).toHaveTextContent(expectedText);
      }

      if (expectedClass) {
        expect(container.firstChild).toHaveClass(expectedClass);
      }
    });
  }

  /**
   * Test component event handling
   */
  static testEventHandling(
    Component: React.ComponentType<any>,
    props: any,
    eventTests: Array<{
      event: string;
      selector: string;
      handler: (element: HTMLElement) => void;
      expectedResult: () => void;
    }>
  ): void {
    const { container } = customRender(<Component {...props} />);

    eventTests.forEach(
      ({ event: _event, selector, handler, expectedResult }) => {
        const element = container.querySelector(selector) as HTMLElement;
        expect(element).toBeInTheDocument();

        handler(element);
        expectedResult();
      }
    );
  }
}

/**
 * Form test helper for testing form components
 */
export class FormTestHelper {
  /**
   * Test form validation
   */
  static testValidation(
    FormComponent: React.ComponentType<any>,
    props: any,
    validationTests: Array<{
      field: string;
      value: string;
      expectedError: string;
    }>
  ): void {
    validationTests.forEach(({ field, value, expectedError }) => {
      const { container } = customRender(<FormComponent {...props} />);

      const input = container.querySelector(
        `[name="${field}"]`
      ) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      // Simulate user input
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("blur", { bubbles: true }));

      // Check for error message
      expect(container).toHaveTextContent(expectedError);
    });
  }

  /**
   * Test form submission
   */
  static testSubmission(
    FormComponent: React.ComponentType<any>,
    props: any,
    formData: Record<string, string>,
    _onSubmit: (_data: any) => void
  ): void {
    const mockOnSubmit = vi.fn();
    const { container } = customRender(
      <FormComponent {...props} onSubmit={mockOnSubmit} />
    );

    // Fill form fields
    Object.entries(formData).forEach(([field, value]) => {
      const input = container.querySelector(
        `[name="${field}"]`
      ) as HTMLInputElement;
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    // Submit form
    const form = container.querySelector("form");
    if (form) {
      TestUtils.submitForm(form);
    }

    // Verify submission
    expect(mockOnSubmit).toHaveBeenCalledWith(formData);
  }
}

/**
 * Hook test helper for testing custom hooks
 */
export class HookTestHelper {
  /**
   * Test hook with different input values
   */
  static testHook<T, R>(
    useHook: (input: T) => R,
    testCases: Array<{ input: T; expected: R }>
  ): void {
    testCases.forEach(({ input, expected }) => {
      const { result } = renderHook(() => useHook(input));
      expect(result.current).toEqual(expected);
    });
  }
}

/**
 * Mock cleanup utility
 */
export class MockCleanup {
  private static mocks: Array<() => void> = [];

  static addMock(cleanupFn: () => void): void {
    this.mocks.push(cleanupFn);
  }

  static cleanup(): void {
    this.mocks.forEach(cleanup => cleanup());
    this.mocks = [];
  }
}

// Global setup and teardown
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  MockCleanup.cleanup();
});

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };
export {
  MockDataFactory,
  MockServiceFactory,
  TestUtils,
  ComponentTestHelper,
  FormTestHelper,
  HookTestHelper,
};
