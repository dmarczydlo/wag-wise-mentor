import "@testing-library/jest-dom";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.HTMLElement.prototype.scrollIntoView = () => {};
// @ts-ignore - requestSubmit is not implemented in JSDOM
global.HTMLElement.prototype.requestSubmit = () => {};
