// Jest setup file for additional configuration
// Mock HTMLCanvasElement and CanvasRenderingContext2D for testing
global.HTMLCanvasElement = class MockHTMLCanvasElement {
  width = 800;
  height = 600;
  
  getContext() {
    return {
      setTransform: jest.fn(),
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      arc: jest.fn(),
      fillText: jest.fn(),
      roundRect: jest.fn(),
    };
  }
  
  parentElement = {
    clientWidth: 800,
  };
} as any;

// Mock ResizeObserver
global.ResizeObserver = class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};