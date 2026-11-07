/**
 * Regression: XG sometimes produces a copy where the player-names line
 * ("X:Amy Trudeau   O:John Scott") is spliced into the middle of the XGID line,
 * and the rest of the XGID continues on the next line. This is still a valid
 * position and must render as intended.
 */
import BackgammonPlugin from '../src/main';
import { parseXGID } from '../src/utils/parseXGID';

const INBOX_SOURCE = `XGID=--CAABD-------------cdbba-:1:-1:-X:Amy Trudeau   O:John Scott
1:00:1:0:0:9:10

Score is X:0 O:1 9 pt.(s) match.
Pip count  X: 42  O: 47 X-O: 0-1/9
Cube: 2, X own cube
X on roll, cube action

Analyzed in XG Roller+
Player Winning Chances:   74.36% (G:0.00% B:0.00%)
Opponent Winning Chances: 25.64% (G:0.00% B:0.00%)

Best Cube action: Redouble / Take`;

// Same problem, split at a field boundary (from README example 3).
const README_SOURCE = `XGID=-a-a--ECBA--dB---cBf------:0:0:1:00:0:0:3:0:X:Player 1   O:Player 2
10

Score is X:0 O:0. Unlimited Game, Jacoby Beaver`;

describe('XGID line split by the player-names line', () => {
	it('parses a split inside a field', () => {
		const data = parseXGID(INBOX_SOURCE);
		expect(data.xgid).toBe('XGID=--CAABD-------------cdbba-:1:-1:-1:00:1:0:0:9:10');
		expect(data.turn).toBe('O');
		expect(data.cubeOwner).toBe('O');
		expect(data.cubeValue).toBe(2);
		expect(data.scoreX).toBe(1);
		expect(data.scoreO).toBe(0);
		expect(data.matchLength).toBe(9);
		expect(data.pipCountX).toBe(47);
		expect(data.pipCountO).toBe(42);
	});

	it('parses a split at a field boundary', () => {
		const data = parseXGID(README_SOURCE);
		expect(data.xgid).toBe('XGID=-a-a--ECBA--dB---cBf------:0:0:1:00:0:0:3:0:10');
		expect(data.matchLength).toBe(0);
		expect(data.jacoby).toBe(true);
	});

	it('still parses a normal XGID followed by a names line', () => {
		const data = parseXGID('XGID=-b----E-C---eE---c-e----B-:0:0:1:52:0:0:3:0:10\nX:Player 1   O:Player 2');
		expect(data.xgid).toBe('XGID=-b----E-C---eE---c-e----B-:0:0:1:52:0:0:3:0:10');
	});

	it('renders the split block in the plugin without an error', async () => {
		const plugin = new BackgammonPlugin({} as any, {} as any);
		plugin.registerMarkdownCodeBlockProcessor = jest.fn() as any;
		await plugin.onload();
		const processor = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];

		const el = document.createElement('div');
		processor(INBOX_SOURCE, el);

		expect(el.querySelector('.backgammon-error')).toBeNull();
		expect(el.querySelector('.backgammon-header')?.textContent).toBe('White on roll - cube decision');
		expect(el.querySelector('.backgammon-analysis')).not.toBeNull();
	});
});
