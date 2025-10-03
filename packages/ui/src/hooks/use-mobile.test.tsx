import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useIsMobile } from "./use-mobile";

// Mock window.matchMedia
const mockMatchMedia = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: mockMatchMedia,
});

Object.defineProperty(window, "innerWidth", {
  writable: true,
  value: 1024,
});

describe("useIsMobile Hook", () => {
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockMediaQueryList = {
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    };

    mockMatchMedia.mockReturnValue(mockMediaQueryList);
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Hook Initialization", () => {
    it("should initialize with undefined state", () => {
      // Arrange & Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(false); // Should be false after initial render
    });

    it("should set up media query listener on mount", () => {
      // Arrange & Act
      renderHook(() => useIsMobile());

      // Assert
      expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
      expect(mockAddEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });

    it("should clean up event listener on unmount", () => {
      // Arrange
      const { unmount } = renderHook(() => useIsMobile());

      // Act
      unmount();

      // Assert
      expect(mockRemoveEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });
  });

  describe("Mobile Detection", () => {
    it("should return true for mobile screen width", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 500,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(true);
    });

    it("should return false for desktop screen width", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1024,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(false);
    });

    it("should return false for tablet screen width", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 768,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(false);
    });

    it("should return true for small mobile screen width", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 320,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(true);
    });
  });

  describe("Media Query Changes", () => {
    it("should update state when media query changes", () => {
      // Arrange
      let changeHandler: (event: any) => void;
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === "change") {
          changeHandler = handler;
        }
      });

      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useIsMobile());

      // Act - Simulate window resize to mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 500,
      });

      act(() => {
        changeHandler!({ matches: true });
      });

      // Assert
      expect(result.current).toBe(true);
    });

    it("should update state when resizing from mobile to desktop", () => {
      // Arrange
      let changeHandler: (event: any) => void;
      mockAddEventListener.mockImplementation((event, handler) => {
        if (event === "change") {
          changeHandler = handler;
        }
      });

      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 500,
      });

      const { result } = renderHook(() => useIsMobile());

      // Act - Simulate window resize to desktop
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1024,
      });

      act(() => {
        changeHandler!({ matches: false });
      });

      // Assert
      expect(result.current).toBe(false);
    });
  });

  describe("Breakpoint Behavior", () => {
    it("should use correct breakpoint (768px)", () => {
      // Arrange & Act
      renderHook(() => useIsMobile());

      // Assert
      expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
    });

    it("should return false exactly at breakpoint", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 768,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(false);
    });

    it("should return true just below breakpoint", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 767,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(true);
    });
  });

  describe("Hook Re-renders", () => {
    it("should maintain state across re-renders", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 500,
      });

      // Act
      const { result, rerender } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(true);

      // Act - Re-render
      rerender();

      // Assert
      expect(result.current).toBe(true);
    });

    it("should handle multiple hook instances", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 500,
      });

      // Act
      const { result: result1 } = renderHook(() => useIsMobile());
      const { result: result2 } = renderHook(() => useIsMobile());

      // Assert
      expect(result1.current).toBe(true);
      expect(result2.current).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero width", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 0,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(true);
    });

    it("should handle very large width", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 9999,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(false);
    });

    it("should handle negative width gracefully", () => {
      // Arrange
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: -100,
      });

      // Act
      const { result } = renderHook(() => useIsMobile());

      // Assert
      expect(result.current).toBe(true);
    });
  });

  describe("Performance", () => {
    it("should only set up one event listener per hook instance", () => {
      // Arrange & Act
      renderHook(() => useIsMobile());

      // Assert
      expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    });

    it("should clean up event listener properly", () => {
      // Arrange
      const { unmount } = renderHook(() => useIsMobile());

      // Act
      unmount();

      // Assert
      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
    });
  });
});
