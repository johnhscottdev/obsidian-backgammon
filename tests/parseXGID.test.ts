import { parseXGID, extractMoveBlocks } from '../src/utils/parseXGID';
import type { BoardData } from '../src/types/board';

describe('parseXGID', () => {
  describe('input validation', () => {
    it('should throw error for null input', () => {
      expect(() => parseXGID(null as any)).toThrow('Invalid XGID: input must be a non-empty string');
    });

    it('should throw error for undefined input', () => {
      expect(() => parseXGID(undefined as any)).toThrow('Invalid XGID: input must be a non-empty string');
    });

    it('should throw error for empty string', () => {
      expect(() => parseXGID('')).toThrow('Invalid XGID: input must be a non-empty string');
    });

    it('should throw error for invalid format', () => {
      expect(() => parseXGID('invalid-format')).toThrow('Invalid XGID format: does not match expected pattern');
    });

    it('should throw error for insufficient parts', () => {
      expect(() => parseXGID('abc:1:2:3')).toThrow('Invalid XGID format: does not match expected pattern');
    });
  });

  describe('basic parsing', () => {
    it('should parse a valid XGID with XGID= prefix', () => {
      const xgid = 'XGID=-a----E-C---eE---c-e----B-:1:1:11:0:0:0:0:10';
      const result = parseXGID(xgid);
      
      expect(result).toBeDefined();
      expect(result.points).toHaveLength(26);
      expect(result.turn).toBe('X'); // turn=1 means X's turn
      expect(result.cubeOwner).toBe('X'); // cubeOwner=1 means X owns cube
      expect(result.cubeValue).toBe(2); // 2^1 = 2
    });

    it('should parse a valid XGID without XGID= prefix', () => {
      const xgid = '-a----E-C---eE---c-e----B-:1:1:11:0:0:0:0:10';
      const result = parseXGID(xgid);
      
      expect(result).toBeDefined();
      expect(result.points).toHaveLength(26);
      expect(result.turn).toBe('X'); // turn=1 means X's turn
    });

    it('should handle whitespace in input', () => {
      const xgid = '  -a----E-C---eE---c-e----B-:1:1:11:0:0:0:0:10  ';
      const result = parseXGID(xgid);
      
      expect(result).toBeDefined();
      expect(result.points).toHaveLength(26);
    });
  });

  describe('position parsing', () => {
    it('should correctly parse checker positions', () => {
      const xgid = 'abcdefghijklmnopqrstuvwxyz:0:0:00:0:0:0:0:5';
      const result = parseXGID(xgid);
      
      // Check that lowercase letters create O player checkers
      expect(result.points[25].player).toBe('O'); // 'a' reversed to position 25
      expect(result.points[25].checkerCount).toBe(1);
      
      expect(result.points[24].player).toBe('O'); // 'b' reversed to position 24
      expect(result.points[24].checkerCount).toBe(2);
    });

    it('should correctly parse uppercase letters as X player checkers', () => {
      const xgid = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ:0:0:00:0:0:0:0:5';
      const result = parseXGID(xgid);
      
      // Check that uppercase letters create X player checkers
      expect(result.points[25].player).toBe('X'); // 'A' reversed to position 25
      expect(result.points[25].checkerCount).toBe(1);
      
      expect(result.points[24].player).toBe('X'); // 'B' reversed to position 24
      expect(result.points[24].checkerCount).toBe(2);
    });

    it('should handle empty points with dashes', () => {
      const xgid = '------------------------A-:0:0:00:0:0:0:0:5';
      const result = parseXGID(xgid);
      
      // Most points should be empty
      expect(result.points[2].player).toBe(null);
      expect(result.points[2].checkerCount).toBe(0);
      
      // Only position 1 should have a checker
      expect(result.points[1].player).toBe('X');
      expect(result.points[1].checkerCount).toBe(1);
    });
  });

  describe('cube parsing', () => {
    it('should parse cube owned by center', () => {
      const xgid = 'abcd----------------------:0:0:00:0:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.cubeOwner).toBe('Center');
      expect(result.cubeValue).toBe(64);
    });

    it('should parse cube owned by X player', () => {
      const xgid = 'abcd----------------------:2:1:00:0:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.cubeOwner).toBe('X');
      expect(result.cubeValue).toBe(4); // 2^2 = 4
    });

    it('should parse cube owned by O player', () => {
      const xgid = 'abcd----------------------:3:2:00:0:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.cubeOwner).toBe('O');
      expect(result.cubeValue).toBe(8); // 2^3 = 8
    });
  });

  describe('turn parsing', () => {
    it('should parse X player turn', () => {
      const xgid = 'abcd----------------------:0:0:00:0:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.turn).toBe('X');
    });

    it('should parse O player turn', () => {
      const xgid = 'abcd----------------------:0:0:-1:00:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.turn).toBe('O');
    });

    it('should handle -1 turn as O player', () => {
      const xgid = 'abcd----------------------:0:0:-1:00:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.turn).toBe('O');
    });
  });

  describe('dice parsing', () => {
    it('should parse valid dice values', () => {
      const xgid = 'abcd----------------------:0:0:00:35:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.die1).toBe(3);
      expect(result.die2).toBe(5);
    });

    it('should handle doubles', () => {
      const xgid = 'abcd----------------------:0:0:00:44:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.die1).toBe(4);
      expect(result.die2).toBe(4);
    });

    it('should handle special dice codes', () => {
      const xgid = 'abcd----------------------:0:0:00:DD:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.die1).toBe(0);
      expect(result.die2).toBe(0);
    });

    it('should handle zero dice', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.die1).toBe(0);
      expect(result.die2).toBe(0);
    });
  });

  describe('score parsing', () => {
    it('should parse match scores', () => {
      const xgid = 'abcd----------------------:0:0:00:00:3:7:0:11';
      const result = parseXGID(xgid);
      
      expect(result.scoreX).toBe(3);
      expect(result.scoreO).toBe(7);
    });

    it('should handle zero scores', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.scoreX).toBe(0);
      expect(result.scoreO).toBe(0);
    });
  });

  describe('rules parsing', () => {
    it('should parse jacoby rule', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:1:5';
      const result = parseXGID(xgid);
      
      expect(result.jacoby).toBe(true);
    });

    it('should parse beaver rule', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:1:5';
      const result = parseXGID(xgid);
      
      expect(result.beaver).toBe(true);
    });

    it('should handle no special rules', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.jacoby).toBe(false);
      expect(result.beaver).toBe(false);
    });
  });

  describe('match length and crawford rule', () => {
    it('should parse match length', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:0:11';
      const result = parseXGID(xgid);
      
      expect(result.matchLength).toBe(11);
    });

    it('should set crawford rule for match play with jacoby', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:1:7';
      const result = parseXGID(xgid);
      
      expect(result.crawford).toBe(true);
      expect(result.matchLength).toBe(7);
    });

    it('should not set crawford rule for money play', () => {
      const xgid = 'abcd----------------------:0:0:00:00:0:0:1:0';
      const result = parseXGID(xgid);
      
      expect(result.crawford).toBe(false);
      expect(result.matchLength).toBe(0);
    });
  });

  describe('borne off calculations', () => {
    it('should calculate borne off checkers correctly', () => {
      const xgid = 'a-------------------------:0:0:00:00:0:0:0:5';
      const result = parseXGID(xgid);
      
      expect(result.borneOffO).toBe(14); // 15 - 1 checker on board
      expect(result.borneOffX).toBe(15); // 15 - 0 checkers on board
    });

    it('should handle full board', () => {
      const xgid = 'abcdefghijklmnopqrstuvwxyz:0:0:00:00:0:0:0:5';
      const result = parseXGID(xgid);
      
      const totalO = result.points
        .filter(p => p.player === 'O')
        .reduce((sum, p) => sum + p.checkerCount, 0);
      
      expect(result.borneOffO).toBe(15 - totalO);
    });
  });

  describe('real-world examples', () => {
    it('should parse opening position', () => {
      // Standard opening position XGID
      const xgid = 'XGID=-a----E-C---eE---c-e----B-:1:0:-1:11:0:0:0:10';
      const result = parseXGID(xgid);
      
      expect(result.turn).toBe('O');
      expect(result.die1).toBe(1);
      expect(result.die2).toBe(1);
      expect(result.cubeOwner).toBe('Center'); // cubeOwner=0 means center
      expect(result.cubeValue).toBe(64); // Center cube gets value 64
      expect(result.matchLength).toBe(10);
    });

    it('should parse mid-game position', () => {
      const xgid = 'XGID=--b-C-E----bB-Bb-c----A--:2:0:00:63:2:1:0:7';
      const result = parseXGID(xgid);
      
      expect(result.scoreX).toBe(2);
      expect(result.scoreO).toBe(1);
      expect(result.matchLength).toBe(7);
      expect(result.die1).toBe(6);
      expect(result.die2).toBe(3);
    });
  });
});

describe('extractMoveBlocks', () => {
  describe('move block extraction', () => {
    it('should extract numbered move blocks', () => {
      const text = `
1. Move analysis for position 1
   Player: Some analysis
   Opponent: Some response

2. Move analysis for position 2
   Player: More analysis
   Opponent: More response
`;
      
      const result = extractMoveBlocks(text);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toContain('1. Move analysis for position 1');
      expect(result[1]).toContain('2. Move analysis for position 2');
    });

    it('should extract general analysis when no move blocks found', () => {
      const text = `
Some preamble text
Analyzed in XG Roller+ some analysis content here
More analysis content
eXtreme Gammon Version: 2.02
`;
      
      const result = extractMoveBlocks(text);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('Analyzed in XG Roller+');
      expect(result[0]).not.toContain('eXtreme Gammon Version:');
    });

    it('should return empty array when no analysis found', () => {
      const text = 'Some random text without analysis';
      
      const result = extractMoveBlocks(text);
      
      expect(result).toHaveLength(0);
    });

    it('should handle empty input', () => {
      const result = extractMoveBlocks('');
      
      expect(result).toHaveLength(0);
    });
  });

  describe('complex move block formats', () => {
    it('should handle multi-line move blocks with indentation', () => {
      const text = `
1. 24/23 13/11
   Player: -0.123 equity
   Opponent: +0.456 equity

2. 8/7 6/4
   Player: -0.234 equity
   Opponent: +0.567 equity
`;
      
      const result = extractMoveBlocks(text);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toContain('Player: -0.123 equity');
      expect(result[1]).toContain('Player: -0.234 equity');
    });

    it('should handle analysis blocks with various whitespace', () => {
      const text = `
  1.   Move with extra spaces
     Player: Analysis
     Opponent: Response

3. Move with gap in numbering
   Player: More analysis
   Opponent: More response
`;
      
      const result = extractMoveBlocks(text);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toContain('1.   Move with extra spaces');
      expect(result[1]).toContain('3. Move with gap in numbering');
    });
  });
});