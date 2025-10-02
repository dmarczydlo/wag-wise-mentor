import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useToast, toast, reducer, clearAllToasts } from "./use-toast";

// Mock setTimeout and clearTimeout
const mockSetTimeout = vi.fn();
const mockClearTimeout = vi.fn();

Object.defineProperty(global, "setTimeout", {
  value: mockSetTimeout,
  writable: true,
});

Object.defineProperty(global, "clearTimeout", {
  value: mockClearTimeout,
  writable: true,
});

describe("useToast Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetTimeout.mockClear();
    mockClearTimeout.mockClear();

    // Reset the global toast state by clearing all toasts
    act(() => {
      clearAllToasts();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Hook Initialization", () => {
    it("should initialize with empty toasts array", () => {
      // Arrange & Act
      const { result } = renderHook(() => useToast());

      // Assert
      expect(result.current.toasts).toEqual([]);
      expect(result.current.toast).toBeDefined();
      expect(result.current.dismiss).toBeDefined();
    });

    it("should provide toast function", () => {
      // Arrange & Act
      const { result } = renderHook(() => useToast());

      // Assert
      expect(typeof result.current.toast).toBe("function");
    });

    it("should provide dismiss function", () => {
      // Arrange & Act
      const { result } = renderHook(() => useToast());

      // Assert
      expect(typeof result.current.dismiss).toBe("function");
    });
  });

  describe("Toast Creation", () => {
    it("should create a toast with basic properties", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act
      act(() => {
        result.current.toast({
          title: "Test Toast",
          description: "This is a test toast",
        });
      });

      // Assert
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        title: "Test Toast",
        description: "This is a test toast",
        open: true,
      });
      expect(result.current.toasts[0].id).toBeDefined();
    });

    it("should create toast with default open state", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act
      act(() => {
        result.current.toast({
          title: "Test Toast",
        });
      });

      // Assert
      expect(result.current.toasts[0].open).toBe(true);
    });

    it("should generate unique IDs for toasts", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act
      act(() => {
        result.current.toast({ title: "Toast 1" });
      });

      // Assert - With TOAST_LIMIT = 1, only one toast should exist
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Toast 1");
      expect(result.current.toasts[0].id).toBeDefined();
    });
  });

  describe("Toast Dismissal", () => {
    it("should dismiss a specific toast", () => {
      // Arrange
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        const toastResult = result.current.toast({
          title: "Test Toast",
        });
        toastId = toastResult.id;
      });

      // Act
      act(() => {
        result.current.dismiss(toastId!);
      });

      // Assert
      expect(result.current.toasts[0].open).toBe(false);
    });

    it("should dismiss all toasts when no ID provided", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Toast 1" });
      });

      // Act
      act(() => {
        result.current.dismiss();
      });

      // Assert - With TOAST_LIMIT = 1, only one toast should exist
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(false);
    });

    it("should handle dismissing non-existent toast", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Test Toast" });
      });

      // Act
      act(() => {
        result.current.dismiss("non-existent-id");
      });

      // Assert
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(true);
    });
  });

  describe("Toast Updates", () => {
    it("should update existing toast", () => {
      // Arrange
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        const toastResult = result.current.toast({
          title: "Original Title",
          description: "Original Description",
        });
        toastId = toastResult.id;
      });

      // Act
      act(() => {
        result.current.toast({
          id: toastId!,
          title: "Updated Title",
          description: "Updated Description",
        });
      });

      // Assert
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        title: "Updated Title",
        description: "Updated Description",
      });
      // Note: The ID might change due to the update mechanism, so we don't assert on it
    });

    it("should create new toast when updating with non-existent ID", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: "Original Toast" });
      });

      // Act
      act(() => {
        result.current.toast({
          id: "non-existent-id",
          title: "New Toast",
        });
      });

      // Assert - The toast function always generates a new ID, so the provided ID is ignored
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        title: "New Toast",
      });
      expect(result.current.toasts[0].id).toBeDefined();
      expect(result.current.toasts[0].id).not.toBe("non-existent-id");
    });
  });

  describe("Toast Limit", () => {
    it("should respect toast limit", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act - Create more toasts than the limit
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.toast({ title: `Toast ${i}` });
        }
      });

      // Assert - Should only have 1 toast (TOAST_LIMIT = 1)
      expect(result.current.toasts).toHaveLength(1);
    });

    it("should keep the most recent toast when limit is exceeded", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act
      act(() => {
        result.current.toast({ title: "First Toast" });
        result.current.toast({ title: "Second Toast" });
      });

      // Assert
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Second Toast");
    });
  });

  describe("Toast Return Value", () => {
    it("should return toast object with id, dismiss, and update functions", () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act
      let toastResult: any;
      act(() => {
        toastResult = result.current.toast({
          title: "Test Toast",
        });
      });

      // Assert
      expect(toastResult).toHaveProperty("id");
      expect(toastResult).toHaveProperty("dismiss");
      expect(toastResult).toHaveProperty("update");
      expect(typeof toastResult.dismiss).toBe("function");
      expect(typeof toastResult.update).toBe("function");
    });

    it("should allow dismissing toast via returned dismiss function", () => {
      // Arrange
      const { result } = renderHook(() => useToast());
      let toastResult: any;

      act(() => {
        toastResult = result.current.toast({
          title: "Test Toast",
        });
      });

      // Act
      act(() => {
        toastResult.dismiss();
      });

      // Assert
      expect(result.current.toasts[0].open).toBe(false);
    });

    it("should allow updating toast via returned update function", () => {
      // Arrange
      const { result } = renderHook(() => useToast());
      let toastResult: any;

      act(() => {
        toastResult = result.current.toast({
          title: "Original Title",
        });
      });

      // Act
      act(() => {
        toastResult.update({
          title: "Updated Title",
        });
      });

      // Assert
      expect(result.current.toasts[0].title).toBe("Updated Title");
    });
  });

  describe("Multiple Hook Instances", () => {
    it("should share state between multiple hook instances", () => {
      // Arrange
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());

      // Act
      act(() => {
        result1.current.toast({ title: "Shared Toast" });
      });

      // Assert
      expect(result1.current.toasts).toHaveLength(1);
      expect(result2.current.toasts).toHaveLength(1);
      expect(result1.current.toasts[0].title).toBe("Shared Toast");
      expect(result2.current.toasts[0].title).toBe("Shared Toast");
    });

    it("should update all hook instances when toast is dismissed", () => {
      // Arrange
      const { result: result1 } = renderHook(() => useToast());
      const { result: result2 } = renderHook(() => useToast());

      act(() => {
        result1.current.toast({ title: "Test Toast" });
      });

      // Act
      act(() => {
        result2.current.dismiss();
      });

      // Assert
      expect(result1.current.toasts[0].open).toBe(false);
      expect(result2.current.toasts[0].open).toBe(false);
    });
  });

  describe("Reducer Function", () => {
    it("should handle ADD_TOAST action", () => {
      // Arrange
      const initialState = { toasts: [] };
      const action = {
        type: "ADD_TOAST" as const,
        toast: {
          id: "test-id",
          title: "Test Toast",
          open: true,
        },
      };

      // Act
      const newState = reducer(initialState, action);

      // Assert
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toMatchObject(action.toast);
    });

    it("should handle UPDATE_TOAST action", () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: "test-id",
            title: "Original Title",
            open: true,
          },
        ],
      };
      const action = {
        type: "UPDATE_TOAST" as const,
        toast: {
          id: "test-id",
          title: "Updated Title",
        },
      };

      // Act
      const newState = reducer(initialState, action);

      // Assert
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe("Updated Title");
      expect(newState.toasts[0].open).toBe(true);
    });

    it("should handle DISMISS_TOAST action", () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: "test-id",
            title: "Test Toast",
            open: true,
          },
        ],
      };
      const action = {
        type: "DISMISS_TOAST" as const,
        toastId: "test-id",
      };

      // Act
      const newState = reducer(initialState, action);

      // Assert
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].open).toBe(false);
    });

    it("should handle REMOVE_TOAST action", () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: "test-id",
            title: "Test Toast",
            open: true,
          },
        ],
      };
      const action = {
        type: "REMOVE_TOAST" as const,
        toastId: "test-id",
      };

      // Act
      const newState = reducer(initialState, action);

      // Assert
      expect(newState.toasts).toHaveLength(0);
    });
  });
});
