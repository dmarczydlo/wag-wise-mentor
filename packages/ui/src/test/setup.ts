import "@testing-library/jest-dom";

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.HTMLElement.prototype.scrollIntoView = () => {};
global.HTMLElement.prototype.requestSubmit = () => {};
