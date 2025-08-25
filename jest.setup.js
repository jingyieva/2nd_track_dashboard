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