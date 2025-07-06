import { renderBoard } from '../src/utils/renderBoard';
import type { BackgammonPosition } from '../src/types/board';

// Mock the styleConfig module
jest.mock('../src/utils/styleConfig', () => ({
  styleConfig: {
    boardWidth: 800,
    boardHeight: 600,
    columnWidth: 50,
    pointWidth: 40,
    barWidth: 30,
    triangleHeight: 150,
    checkerRadius: 15,
    checkerMargin: 20,
    colors: {
      background: '#f0f0f0',
      boardBorder: '#333',
      bar: '#8B4513',
      triangleDark: '#8B4513',
      triangleLight: '#DEB887',
      checkerBlack: '#000',
      checkerWhite: '#fff',
      text: '#000',
      pointNumber: '#666',
      pipCount: '#666',
      cubeBackground: '#fff',
      cubeBorder: '#333',
      scoreBackground: '#fff',
      scoreBorder: '#333',
    },
    fonts: {
      checkerLabel: '12px Arial',
      pointNumber: '10px Arial',
      pipCount: '12px Arial',
      cubeValue: '14px Arial',
      scoreHeader: '10px Arial',
      scoreValue: '12px Arial',
    },
    sizing: {
      unexplainedScaleError: 1.0,
      strokeWidth: 1,
      borderWidth: 2,
      cubeSize: 5,
      scoreMargin: 2,
      diePipRadius: 0.05,
      dieCornerRadius: 0.1,
    },
    spacing: {
      dieOffset: 2,
      dieSpacing: 1.2,
    },
    boardColumns: 15,
  },
}));

describe('renderBoard', () => {
  let mockElement: HTMLElement;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;
  let mockObserver: ResizeObserver;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock context with all required methods
    mockContext = {
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
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: 'start' as CanvasTextAlign,
      textBaseline: 'alphabetic' as CanvasTextBaseline,
    } as any;

    // Create mock canvas
    mockCanvas = {
      width: 800,
      height: 600,
      getContext: jest.fn().mockReturnValue(mockContext),
      parentElement: {
        clientWidth: 800,
      },
    } as any;

    // Create mock element
    mockElement = {
      appendChild: jest.fn(),
      clientWidth: 800,
    } as any;

    // Mock document.createElement to return our mock canvas
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as any;
      }
      return document.createElement(tagName);
    });

    // Mock ResizeObserver
    mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    } as any;

    global.ResizeObserver = jest.fn().mockImplementation(() => mockObserver);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('canvas setup', () => {
    it('should create and append canvas to element', () => {
      const boardData = createMinimalBoardData();
      
      renderBoard(mockElement, boardData);
      
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(mockElement.appendChild).toHaveBeenCalledWith(mockCanvas);
    });

    it('should get 2D context from canvas', () => {
      const boardData = createMinimalBoardData();
      
      renderBoard(mockElement, boardData);
      
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    it('should handle null context gracefully', () => {
      const boardData = createMinimalBoardData();
      mockCanvas.getContext = jest.fn().mockReturnValue(null);
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });

    it('should set up ResizeObserver', () => {
      const boardData = createMinimalBoardData();
      
      renderBoard(mockElement, boardData);
      
      expect(ResizeObserver).toHaveBeenCalledWith(expect.any(Function));
      expect(mockObserver.observe).toHaveBeenCalledWith(mockCanvas.parentElement);
    });
  });

  describe('rendering calls', () => {
    it('should call basic rendering methods when ResizeObserver callback is triggered', () => {
      const boardData = createMinimalBoardData();
      
      // Capture the ResizeObserver callback
      let resizeCallback: ResizeObserverCallback;
      global.ResizeObserver = jest.fn().mockImplementation((callback) => {
        resizeCallback = callback;
        return mockObserver;
      });
      
      renderBoard(mockElement, boardData);
      
      // Trigger the ResizeObserver callback
      resizeCallback!([] as any, mockObserver as any);
      
      // Should set transform for scaling
      expect(mockContext.setTransform).toHaveBeenCalled();
      
      // Should clear the canvas
      expect(mockContext.clearRect).toHaveBeenCalled();
      
      // Should draw board background
      expect(mockContext.fillRect).toHaveBeenCalled();
      expect(mockContext.strokeRect).toHaveBeenCalled();
    });

    it('should complete without errors for match play data', () => {
      const boardData = createMatchPlayBoardData();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });

    it('should complete without errors for dice data', () => {
      const boardData = createBoardDataWithDice();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });

    it('should complete without errors for cube data', () => {
      const boardData = createBoardDataWithCube();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });

    it('should complete without errors for checkers data', () => {
      const boardData = createBoardDataWithCheckers();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });

    it('should complete without errors for borne off data', () => {
      const boardData = createBoardDataWithBorneOff();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });
  });

  describe('responsive scaling', () => {
    it('should handle different container widths without errors', () => {
      const boardData = createMinimalBoardData();
      mockCanvas.parentElement!.clientWidth = 400; // Half the board width
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
      
      // Should set canvas dimensions
      expect(mockCanvas.width).toBeDefined();
      expect(mockCanvas.height).toBeDefined();
    });

    it('should handle large container widths without errors', () => {
      const boardData = createMinimalBoardData();
      mockCanvas.parentElement!.clientWidth = 1600; // Double the board width
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });
  });

  describe('special rule handling', () => {
    it('should handle crawford rule without errors', () => {
      const boardData = createCrawfordBoardData();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });

    it('should handle O player turn without errors', () => {
      const boardData = createBoardDataWithOTurn();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });

    it('should handle pip count calculations without errors', () => {
      const boardData = createBoardDataWithCheckers();
      
      expect(() => renderBoard(mockElement, boardData)).not.toThrow();
    });
  });
});

// Helper functions to create test board data
function createMinimalBoardData(): BackgammonPosition {
  return {
    points: Array(26).fill(null).map(() => ({ checkerCount: 0, player: null })),
    borneOffX: 0,
    borneOffO: 0,
    turn: 'X',
    die1: 0,
    die2: 0,
    cubeOwner: 'Center',
    cubeValue: 64,
    scoreX: 0,
    scoreO: 0,
    beaver: false,
    jacoby: false,
    matchLength: 0,
    crawford: false,
  };
}

function createMatchPlayBoardData(): BackgammonPosition {
  return {
    ...createMinimalBoardData(),
    matchLength: 7,
    scoreX: 3,
    scoreO: 2,
  };
}

function createBoardDataWithDice(): BackgammonPosition {
  return {
    ...createMinimalBoardData(),
    die1: 3,
    die2: 5,
    turn: 'X',
  };
}

function createBoardDataWithCube(): BackgammonPosition {
  return {
    ...createMinimalBoardData(),
    cubeOwner: 'X',
    cubeValue: 4,
  };
}

function createBoardDataWithCheckers(): BackgammonPosition {
  const boardData = createMinimalBoardData();
  boardData.points[1] = { checkerCount: 2, player: 'X' };
  boardData.points[24] = { checkerCount: 2, player: 'O' };
  return boardData;
}

function createBoardDataWithBorneOff(): BackgammonPosition {
  return {
    ...createMinimalBoardData(),
    borneOffX: 5,
    borneOffO: 3,
  };
}

function createCrawfordBoardData(): BackgammonPosition {
  return {
    ...createMinimalBoardData(),
    crawford: true,
    matchLength: 7,
    scoreX: 6,
    scoreO: 5,
  };
}

function createBoardDataWithOTurn(): BackgammonPosition {
  return {
    ...createMinimalBoardData(),
    turn: 'O',
  };
}