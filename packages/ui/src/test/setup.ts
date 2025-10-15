import "@testing-library/jest-dom";

// @ts-ignore - Global type declarations for test environment
declare global {
  var ResizeObserver: typeof ResizeObserver;
  var HTMLElement: typeof HTMLElement;
}

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.HTMLElement.prototype.scrollIntoView = () => {};
// @ts-ignore - requestSubmit is not implemented in JSDOM
global.HTMLElement.prototype.requestSubmit = () => {};
