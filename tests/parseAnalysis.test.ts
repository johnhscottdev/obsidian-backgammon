import { extractAnalysisText, parseAnalysis } from '../src/utils/parseAnalysis';
import { AnalysisData, MoveAnalysis, CubeAnalysis } from '../src/types/analysis';

describe('Analysis Parsing', () => {
    describe('extractAnalysisText', () => {
        it('should extract move analysis text from XGID block', () => {
            const content = `XGID=aa----E-C---eE---c-e----AA:0:0:1:52:0:0:3:0:10
X:Player 1   O:Player 2

Score is X:0 O:0. Unlimited Game, Jacoby Beaver
 +13-14-15-16-17-18------19-20-21-22-23-24-+
 | X           O    |   | O              X |
 | X           O    |   | O                |
 | X           O    |   | O                |
 | X                |   | O                |
 | X                | X | O                |
 |                  |BAR|                  |
 | O                | O | X                |
 | O                |   | X                |
 | O           X    |   | X                |
 | O           X    |   | X                |
 | O           X    |   | X              O |
 +12-11-10--9--8--7-------6--5--4--3--2--1-+
Pip count  X: 168  O: 168 X-O: 0-0
Cube: 1
X to play 52

    1. Book¹       Bar/20 13/11                 eq:+0.095
      Player:   52.09% (G:13.91% B:0.59%)
      Opponent: 47.91% (G:11.60% B:0.51%)
      Confidence: ±0.002 (+0.093..+0.097) - [100.0%]

    2. XG Roller++ Bar/23 13/8                  eq:+0.085 (-0.010)
      Player:   51.73% (G:13.47% B:0.49%)
      Opponent: 48.27% (G:11.24% B:0.44%)`;

            const result = extractAnalysisText(content);
            expect(result).toBeTruthy();
            expect(result).toContain('1. Book¹       Bar/20 13/11');
            expect(result).toContain('2. XG Roller++ Bar/23 13/8');
        });

        it('should extract cube analysis text from XGID block', () => {
            const content = `XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10
X:Player 1   O:Player 2

Score is X:0 O:0. Unlimited Game, Jacoby Beaver
 +13-14-15-16-17-18------19-20-21-22-23-24-+
 | X           O    |   | O              X |
 | X           O    |   | O              X |
 | X           O    |   | O                |
 | X                |   | O                |
 | X                |   | O                |
 |                  |BAR|                  |
 | O                |   | X                |
 | O                |   | X                |
 | O           X    |   | X                |
 | O           X    |   | X              O |
 | O           X    |   | X              O |
 +12-11-10--9--8--7-------6--5--4--3--2--1-+
Pip count  X: 167  O: 167 X-O: 0-0
Cube: 1
X on roll, cube action

Analyzed in XG Roller+
Player Winning Chances:   52.63% (G:14.77% B:0.69%)
Opponent Winning Chances: 47.37% (G:11.99% B:0.51%)`;

            const result = extractAnalysisText(content);
            expect(result).toBeTruthy();
            expect(result).toContain('Player Winning Chances:');
            expect(result).toContain('Opponent Winning Chances:');
        });

        it('should return null if no analysis found', () => {
            const content = `XGID=aa----E-C---eE---c-e----AA:0:0:1:52:0:0:3:0:10
X:Player 1   O:Player 2

Score is X:0 O:0. Unlimited Game, Jacoby Beaver`;

            const result = extractAnalysisText(content);
            expect(result).toBeNull();
        });

        it('should return null if no XGID found', () => {
            const content = `This is just some text
No XGID here`;

            const result = extractAnalysisText(content);
            expect(result).toBeNull();
        });
    });

    describe('parseAnalysis', () => {
        it('should parse move analysis correctly', () => {
            const analysisText = `    1. Book¹       Bar/20 13/11                 eq:+0.095
      Player:   52.09% (G:13.91% B:0.59%)
      Opponent: 47.91% (G:11.60% B:0.51%)
      Confidence: ±0.002 (+0.093..+0.097) - [100.0%]

    2. XG Roller++ Bar/23 13/8                  eq:+0.085 (-0.010)
      Player:   51.73% (G:13.47% B:0.49%)
      Opponent: 48.27% (G:11.24% B:0.44%)`;

            const result = parseAnalysis(analysisText) as MoveAnalysis;
            expect(result).toBeTruthy();
            expect(result.type).toBe('move');
            expect(result.moves).toHaveLength(2);
            
            const firstMove = result.moves[0];
            expect(firstMove.rank).toBe(1);
            expect(firstMove.move).toBe('Bar/20 13/11');
            expect(firstMove.equity).toBe(0.095);
            expect(firstMove.equityDiff).toBe(0);
            expect(firstMove.analysisLevel).toBe('Book¹');
            expect(firstMove.playerStats).toEqual({
                win: 52.09,
                gammon: 13.91,
                backgammon: 0.59
            });
            expect(firstMove.opponentStats).toEqual({
                win: 47.91,
                gammon: 11.60,
                backgammon: 0.51
            });

            const secondMove = result.moves[1];
            expect(secondMove.rank).toBe(2);
            expect(secondMove.move).toBe('Bar/23 13/8');
            expect(secondMove.equity).toBe(0.085);
            expect(secondMove.equityDiff).toBe(-0.010);
            expect(secondMove.analysisLevel).toBe('XG Roller++');
        });

        it('should parse cube analysis correctly', () => {
            const analysisText = `Analyzed in XG Roller+
Player Winning Chances:   52.63% (G:14.77% B:0.69%)
Opponent Winning Chances: 47.37% (G:11.99% B:0.51%)

Cubeless Equities: No Double=+0.082, Double=+0.159

Cubeful Equities:
       No double:     +0.119
       Double/Beaver: -0.361 (-0.480)
       Double/Pass:   +1.000 (+0.881)

Best Cube action: No double / Beaver`;

            const result = parseAnalysis(analysisText) as CubeAnalysis;
            expect(result).toBeTruthy();
            expect(result.type).toBe('cube');
            
            expect(result.playerWinning).toEqual({
                win: 52.63,
                gammon: 14.77,
                backgammon: 0.69
            });
            
            expect(result.opponentWinning).toEqual({
                win: 47.37,
                gammon: 11.99,
                backgammon: 0.51
            });
            
            expect(result.cubelessEquities).toEqual({
                noDouble: 0.082,
                double: 0.159
            });
            
            expect(result.cubefulEquities).toEqual({
                noDouble: 0.119,
                doubleBeaver: -0.361,
                doubleBeaverDiff: -0.480,
                doublePass: 1.000,
                doublePassDiff: 0.881
            });
            
            expect(result.bestAction).toBe('No double / Beaver');
        });

        it('should parse cube analysis with Double/Take correctly', () => {
            const analysisText = `Analyzed in XG Roller+
Player Winning Chances:   67.98% (G:30.15% B:0.89%)
Opponent Winning Chances: 32.02% (G:5.78% B:0.19%)

Cubeless Equities: No Double=+0.610, Double=+1.262

Cubeful Equities:
       No double:     +0.828 (-0.172)
       Double/Take:   +1.005 (+0.005)
       Double/Pass:   +1.000

Best Cube action: Double / Pass`;

            const result = parseAnalysis(analysisText) as CubeAnalysis;
            expect(result).toBeTruthy();
            expect(result.type).toBe('cube');
            
            expect(result.playerWinning).toEqual({
                win: 67.98,
                gammon: 30.15,
                backgammon: 0.89
            });
            
            expect(result.opponentWinning).toEqual({
                win: 32.02,
                gammon: 5.78,
                backgammon: 0.19
            });
            
            expect(result.cubelessEquities).toEqual({
                noDouble: 0.610,
                double: 1.262
            });
            
            expect(result.cubefulEquities).toEqual({
                noDouble: 0.828,
                doubleTake: 1.005,
                doubleTakeDiff: 0.005,
                doublePass: 1.000,
                doublePassDiff: undefined
            });
            
            expect(result.bestAction).toBe('Double / Pass');
        });

        it('should return null for invalid analysis text', () => {
            const analysisText = `Some random text
That doesn't match any pattern`;

            const result = parseAnalysis(analysisText);
            expect(result).toBeNull();
        });

        it('should return null for empty analysis text', () => {
            const result = parseAnalysis('');
            expect(result).toBeNull();
        });
    });
});