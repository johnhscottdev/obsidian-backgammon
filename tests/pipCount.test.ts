import { parseXGID } from '../src/utils/parseXGID';
import type { BackgammonPosition } from '../src/types/board';

describe('calculatePipCount', () => {

  function CheckPipCount(xgid:string, pipCountX:number, pipCountO:number)
  {
    const result = parseXGID(xgid);
    expect(result).toBeDefined();
    
  }

  it('should parse a valid XGID with XGID= prefix', () => {
        const xgid = 'XGID=------------------------A-:2:-1:-1:65:0:0:3:0:10';
        const result = parseXGID(xgid);
        
        expect(result).toBeDefined();
        expect(result.points).toHaveLength(26);
        expect(result.turn).toBe('X'); // turn=1 means X's turn
        expect(result.cubeOwner).toBe('X'); // cubeOwner=1 means X owns cube
        expect(result.cubeValue).toBe(2); // 2^1 = 2
      });

});