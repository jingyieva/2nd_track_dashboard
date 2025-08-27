import { TextEncoder, TextDecoder } from 'util';
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false, // 可改成 true 代表符合媒體查詢
    media: query,
    onchange: null,
    addListener: jest.fn(), // 舊 API
    removeListener: jest.fn(), // 舊 API
    addEventListener: jest.fn(), // 新 API
    removeEventListener: jest.fn(), // 新 API
    dispatchEvent: jest.fn(),
  })),
});

window.scrollTo = jest.fn();

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

jest.mock('@radix-ui/react-popover', () => {
  const actual = jest.requireActual('@radix-ui/react-popover');
  return { ...actual, Portal: ({ children }) => <>{children}</> };
});

window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.ResizeObserver = window.ResizeObserver || class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
