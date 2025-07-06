import BackgammonPlugin from '../src/main';
import { parseXGID } from '../src/utils/parseXGID';
import { renderBoard } from '../src/utils/renderBoard';

// Mock the utilities
jest.mock('../src/utils/parseXGID');
jest.mock('../src/utils/renderBoard');

describe('BackgammonPlugin', () => {
  let plugin: BackgammonPlugin;
  let mockParseXGID: jest.MockedFunction<typeof parseXGID>;
  let mockRenderBoard: jest.MockedFunction<typeof renderBoard>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockParseXGID = parseXGID as jest.MockedFunction<typeof parseXGID>;
    mockRenderBoard = renderBoard as jest.MockedFunction<typeof renderBoard>;
    
    plugin = new BackgammonPlugin({} as any, {} as any);
    
    // Spy on the registerMarkdownCodeBlockProcessor method
    plugin.registerMarkdownCodeBlockProcessor = jest.fn();
  });

  describe('onload', () => {
    it('should register xgid code block processor', async () => {
      await plugin.onload();
      
      expect(plugin.registerMarkdownCodeBlockProcessor).toHaveBeenCalledWith(
        'xgid',
        expect.any(Function)
      );
    });

    describe('code block processor', () => {
      let processorCallback: (source: string, el: HTMLElement) => void;
      let mockElement: HTMLElement;

      beforeEach(async () => {
        await plugin.onload();
        
        // Get the processor callback
        const calls = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls;
        processorCallback = calls[0][1];
        
        // Create mock element with required methods
        const mockErrorDiv = {
          createEl: jest.fn().mockReturnValue({
            textContent: '',
          }),
          createDiv: jest.fn().mockReturnValue({
            setText: jest.fn(),
            style: { cssText: '' },
          }),
          setText: jest.fn(),
          style: { cssText: '' },
        };
        
        const mockContainer = {
          createEl: jest.fn().mockReturnValue({
            createEl: jest.fn().mockReturnValue({
              textContent: '',
            }),
          }),
        };
        
        mockElement = {
          createDiv: jest.fn().mockImplementation((options) => {
            if (options?.cls === 'backgammon-error') {
              return mockErrorDiv;
            } else if (options?.cls === 'my-container') {
              return mockContainer;
            }
            return mockContainer;
          }),
        } as any;
      });

      it('should process valid XGID and render board', () => {
        const validXGID = 'XGID=-a----E-C---eE---c-e----B-:1:1:11:0:0:0:0:10';
        const mockBoardData = {
          points: Array(26).fill({ checkerCount: 0, player: null }),
          turn: 'X',
          cubeOwner: 'Center',
          cubeValue: 64,
        };

        mockParseXGID.mockReturnValue(mockBoardData as any);
        
        processorCallback(validXGID, mockElement);
        
        expect(mockParseXGID).toHaveBeenCalledWith(validXGID);
        expect(mockRenderBoard).toHaveBeenCalledWith(mockElement, mockBoardData);
      });

      it('should handle XGID with whitespace', () => {
        const xgidWithWhitespace = '  XGID=-a----E-C---eE---c-e----B-:1:1:11:0:0:0:0:10  ';
        const mockBoardData = { points: [] };

        mockParseXGID.mockReturnValue(mockBoardData as any);
        
        processorCallback(xgidWithWhitespace, mockElement);
        
        expect(mockParseXGID).toHaveBeenCalledWith(xgidWithWhitespace.trim());
      });

      it('should process move analysis blocks', () => {
        const xgidWithAnalysis = `XGID=-a----E-C---eE---c-e----B-:1:1:11:0:0:0:0:10
        
1. 24/23 13/11
   Player: -0.123 equity
   Opponent: +0.456 equity`;

        const mockBoardData = { points: [] };
        mockParseXGID.mockReturnValue(mockBoardData as any);
        
        processorCallback(xgidWithAnalysis, mockElement);
        
        expect(mockElement.createDiv).toHaveBeenCalledWith({ cls: "xgid-display" });
      });

      it('should handle parsing errors gracefully', () => {
        const invalidXGID = 'invalid-xgid-format';
        const errorMessage = 'Invalid XGID format';
        
        mockParseXGID.mockImplementation(() => {
          throw new Error(errorMessage);
        });
        
        processorCallback(invalidXGID, mockElement);
        
        expect(mockElement.createDiv).toHaveBeenCalledWith({ cls: "backgammon-error" });
        expect(mockRenderBoard).not.toHaveBeenCalled();
      });

      it('should display error message in error div', () => {
        const invalidXGID = 'invalid-xgid-format';
        const errorMessage = 'Invalid XGID format';
        
        const mockErrorDiv = {
          createDiv: jest.fn().mockReturnValue({
            setText: jest.fn(),
            style: { cssText: '' },
          }),
          style: { cssText: '' },
        };
        
        mockElement.createDiv = jest.fn().mockReturnValue(mockErrorDiv);
        
        mockParseXGID.mockImplementation(() => {
          throw new Error(errorMessage);
        });
        
        processorCallback(invalidXGID, mockElement);
        
        expect(mockErrorDiv.createDiv).toHaveBeenCalledTimes(2);
        const setTextCalls = mockErrorDiv.createDiv().setText.mock.calls;
        expect(setTextCalls).toEqual([
          [invalidXGID],
          [`⚠️ Error: ${errorMessage}`]
        ]);
      });

      it('should handle non-Error exceptions', () => {
        const invalidXGID = 'invalid-xgid-format';
        const errorMessage = 'String error';
        
        const mockErrorDiv = {
          createDiv: jest.fn().mockReturnValue({
            setText: jest.fn(),
            style: { cssText: '' },
          }),
          style: { cssText: '' },
        };
        
        mockElement.createDiv = jest.fn().mockReturnValue(mockErrorDiv);
        
        mockParseXGID.mockImplementation(() => {
          throw errorMessage; // Throw a string instead of Error
        });
        
        processorCallback(invalidXGID, mockElement);
        
        const setTextCalls = mockErrorDiv.createDiv().setText.mock.calls;
        expect(setTextCalls[1]).toEqual([`⚠️ Error: ${errorMessage}`]);
      });

      it('should apply error styling to error div', () => {
        const invalidXGID = 'invalid-xgid-format';
        
        const mockErrorDiv = {
          createDiv: jest.fn().mockReturnValue({
            setText: jest.fn(),
            style: { cssText: '' },
          }),
          style: { cssText: '' },
        };
        
        mockElement.createDiv = jest.fn().mockReturnValue(mockErrorDiv);
        
        mockParseXGID.mockImplementation(() => {
          throw new Error('Test error');
        });
        
        processorCallback(invalidXGID, mockElement);
        
        expect(mockErrorDiv.style.cssText).toContain('background-color: #ffe6e6');
        expect(mockErrorDiv.style.cssText).toContain('border: 1px solid #ffcccc');
        expect(mockErrorDiv.style.cssText).toContain('padding: 10px');
      });

      it('should create analysis container for any input', () => {
        const validXGID = 'XGID=-a----E-C---eE---c-e----B-:1:0:0:11:0:0:0:10';

        const mockBoardData = { points: [] };
        const mockContainer = {
          createEl: jest.fn().mockReturnValue({
            createEl: jest.fn().mockReturnValue({
              textContent: '',
            }),
          }),
        };
        
        // Create a fresh mock element for this test to avoid conflicts
        const testMockElement = {
          createDiv: jest.fn().mockImplementation((options) => {
            if (options?.cls === 'my-container') {
              return mockContainer;
            }
            // Return error div for other cases
            return {
              createDiv: jest.fn().mockReturnValue({
                setText: jest.fn(),
                style: { cssText: '' },
              }),
              setText: jest.fn(),
              style: { cssText: '' },
            };
          }),
        };
        
        mockParseXGID.mockReturnValue(mockBoardData as any);
        
        processorCallback(validXGID, testMockElement as any);
        
        // Should create container for analysis blocks (even if empty)
        expect(testMockElement.createDiv).toHaveBeenCalledWith({ cls: "my-container" });
        // Don't test for specific analysis extraction since that's tested separately
      });
    });
  });

  describe('onunload', () => {
    it('should execute without errors', () => {
      expect(() => plugin.onunload()).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    it('should handle empty XGID input', async () => {
      await plugin.onload();
      
      const processorCallback = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
      const mockElement = {
        createDiv: jest.fn().mockReturnValue({
          createDiv: jest.fn().mockReturnValue({
            setText: jest.fn(),
            style: { cssText: '' },
          }),
          style: { cssText: '' },
        }),
      };
      
      mockParseXGID.mockImplementation(() => {
        throw new Error('Invalid XGID: input must be a non-empty string');
      });
      
      processorCallback('', mockElement as any);
      
      expect(mockElement.createDiv).toHaveBeenCalledWith({ cls: "backgammon-error" });
    });

    it('should handle valid XGID without analysis', async () => {
      await plugin.onload();
      
      const processorCallback = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
      const mockElement = {
        createDiv: jest.fn().mockImplementation((options) => {
          if (options?.cls === 'my-container') {
            return {
              createEl: jest.fn().mockReturnValue({
                createEl: jest.fn().mockReturnValue({
                  textContent: '',
                }),
              }),
            };
          }
          // Return error div for other cases
          return {
            createDiv: jest.fn().mockReturnValue({
              setText: jest.fn(),
              style: { cssText: '' },
            }),
            setText: jest.fn(),
            style: { cssText: '' },
          };
        }),
      };
      
      const validXGID = 'XGID=-a----E-C---eE---c-e----B-:1:0:0:11:0:0:0:10';
      const mockBoardData = { points: [] };
      
      mockParseXGID.mockReturnValue(mockBoardData as any);
      
      processorCallback(validXGID, mockElement as any);
      
      expect(mockParseXGID).toHaveBeenCalledWith(validXGID);
      expect(mockRenderBoard).toHaveBeenCalledWith(mockElement, mockBoardData);
      expect(mockElement.createDiv).toHaveBeenCalledWith({ cls: "my-container" });
    });
  });
});