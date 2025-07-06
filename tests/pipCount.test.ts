import { parseXGID } from '../src/utils/parseXGID';
import type { BackgammonPosition } from '../src/types/board';

describe('calculatePipCount', () => {

  function CheckPipCount(xgid:string, pipCountX:number, pipCountO:number)
  {
    const result = parseXGID(xgid);
    expect(result).toBeDefined();
    expect(result.pipCountO).toBe(pipCountO);
    expect(result.pipCountX).toBe(pipCountX);    
  }

  it('test the pip count from every point for player X', () => {        
    CheckPipCount('XGID=-------------------------A:2:-1:-1:65:0:0:3:0:10', 25, 0); // on the bar
    CheckPipCount('XGID=------------------------A-:2:-1:-1:65:0:0:3:0:10', 24, 0);
    CheckPipCount('XGID=-----------------------A--:2:-1:-1:65:0:0:3:0:10', 23, 0);
    CheckPipCount('XGID=----------------------A---:2:-1:-1:65:0:0:3:0:10', 22, 0);
    CheckPipCount('XGID=---------------------A----:2:-1:-1:65:0:0:3:0:10', 21, 0);
    CheckPipCount('XGID=--------------------A-----:2:-1:-1:65:0:0:3:0:10', 20, 0);
    CheckPipCount('XGID=-------------------A------:2:-1:-1:65:0:0:3:0:10', 19, 0);
    CheckPipCount('XGID=------------------A-------:2:-1:-1:65:0:0:3:0:10', 18, 0);
    CheckPipCount('XGID=-----------------A--------:2:-1:-1:65:0:0:3:0:10', 17, 0);
    CheckPipCount('XGID=----------------A---------:2:-1:-1:65:0:0:3:0:10', 16, 0);
    CheckPipCount('XGID=---------------A----------:2:-1:-1:65:0:0:3:0:10', 15, 0);
    CheckPipCount('XGID=--------------A-----------:2:-1:-1:65:0:0:3:0:10', 14, 0);
    CheckPipCount('XGID=-------------A------------:2:-1:-1:65:0:0:3:0:10', 13, 0);
    CheckPipCount('XGID=------------A-------------:2:-1:-1:65:0:0:3:0:10', 12, 0);
    CheckPipCount('XGID=-----------A--------------:2:-1:-1:65:0:0:3:0:10', 11, 0);
    CheckPipCount('XGID=----------A---------------:2:-1:-1:65:0:0:3:0:10', 10, 0);
    CheckPipCount('XGID=---------A----------------:2:-1:-1:65:0:0:3:0:10',  9, 0);
    CheckPipCount('XGID=--------A-----------------:2:-1:-1:65:0:0:3:0:10',  8, 0);
    CheckPipCount('XGID=-------A------------------:2:-1:-1:65:0:0:3:0:10',  7, 0);
    CheckPipCount('XGID=------A-------------------:2:-1:-1:65:0:0:3:0:10',  6, 0);
    CheckPipCount('XGID=-----A--------------------:2:-1:-1:65:0:0:3:0:10',  5, 0);
    CheckPipCount('XGID=----A---------------------:2:-1:-1:65:0:0:3:0:10',  4, 0);
    CheckPipCount('XGID=---A----------------------:2:-1:-1:65:0:0:3:0:10',  3, 0);
    CheckPipCount('XGID=--A-----------------------:2:-1:-1:65:0:0:3:0:10',  2, 0);
    CheckPipCount('XGID=-A------------------------:2:-1:-1:65:0:0:3:0:10',  1, 0);
    CheckPipCount('XGID=--------------------------:2:-1:-1:65:0:0:3:0:10',  0, 0); // all borne off
  });

  it('test the pip count from every point for player O', () => {        
    CheckPipCount('XGID=-------------------------a:2:-1:-1:65:0:0:3:0:10', 0, 25); // on the bar
    CheckPipCount('XGID=------------------------a-:2:-1:-1:65:0:0:3:0:10', 0,  1);
    CheckPipCount('XGID=-----------------------a--:2:-1:-1:65:0:0:3:0:10', 0,  2);
    CheckPipCount('XGID=----------------------a---:2:-1:-1:65:0:0:3:0:10', 0,  3);
    CheckPipCount('XGID=---------------------a----:2:-1:-1:65:0:0:3:0:10', 0,  4);
    CheckPipCount('XGID=--------------------a-----:2:-1:-1:65:0:0:3:0:10', 0,  5);
    CheckPipCount('XGID=-------------------a------:2:-1:-1:65:0:0:3:0:10', 0,  6);
    CheckPipCount('XGID=------------------a-------:2:-1:-1:65:0:0:3:0:10', 0,  7);
    CheckPipCount('XGID=-----------------a--------:2:-1:-1:65:0:0:3:0:10', 0,  8);
    CheckPipCount('XGID=----------------a---------:2:-1:-1:65:0:0:3:0:10', 0,  9);
    CheckPipCount('XGID=---------------a----------:2:-1:-1:65:0:0:3:0:10', 0, 10);
    CheckPipCount('XGID=--------------a-----------:2:-1:-1:65:0:0:3:0:10', 0, 11);
    CheckPipCount('XGID=-------------a------------:2:-1:-1:65:0:0:3:0:10', 0, 12);
    CheckPipCount('XGID=------------a-------------:2:-1:-1:65:0:0:3:0:10', 0, 13);
    CheckPipCount('XGID=-----------a--------------:2:-1:-1:65:0:0:3:0:10', 0, 14);
    CheckPipCount('XGID=----------a---------------:2:-1:-1:65:0:0:3:0:10', 0, 15);
    CheckPipCount('XGID=---------a----------------:2:-1:-1:65:0:0:3:0:10', 0, 16);
    CheckPipCount('XGID=--------a-----------------:2:-1:-1:65:0:0:3:0:10', 0, 17);
    CheckPipCount('XGID=-------a------------------:2:-1:-1:65:0:0:3:0:10', 0, 18);
    CheckPipCount('XGID=------a-------------------:2:-1:-1:65:0:0:3:0:10', 0, 19);
    CheckPipCount('XGID=-----a--------------------:2:-1:-1:65:0:0:3:0:10', 0, 20);
    CheckPipCount('XGID=----a---------------------:2:-1:-1:65:0:0:3:0:10', 0, 21);
    CheckPipCount('XGID=---a----------------------:2:-1:-1:65:0:0:3:0:10', 0, 22);
    CheckPipCount('XGID=--a-----------------------:2:-1:-1:65:0:0:3:0:10', 0, 23);
    CheckPipCount('XGID=-a------------------------:2:-1:-1:65:0:0:3:0:10', 0, 24);
    CheckPipCount('XGID=--------------------------:2:-1:-1:65:0:0:3:0:10', 0, 0); // all borne off
  });

  it('opening position pip count', () => {        
    CheckPipCount('XGID=-b----E-C---eE---c-e----B-:0:0:1:61:0:0:3:0:10', 167, 167); // on the bar
  });

});