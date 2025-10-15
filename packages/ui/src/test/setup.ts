import "@testing-library/jest-dom";

// Global type declarations for test environment
declare global {
  var ResizeObserver: {
    new (callback: ResizeObserverCallback): ResizeObserver;
    prototype: ResizeObserver;
  };
  var HTMLElement: typeof HTMLElement;
}

// @ts-ignore - Global assignments for test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// @ts-ignore - Global assignments for test environment
global.HTMLElement.prototype.scrollIntoView = () => {};
// @ts-ignore - requestSubmit is not implemented in JSDOM
global.HTMLElement.prototype.requestSubmit = () => {};
