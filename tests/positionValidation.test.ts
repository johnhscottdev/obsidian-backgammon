/**
 * Regression: the XGID position wasn't validated. A position that isn't 26 characters drew a
 * shifted board, and a side with more than 15 checkers drew garbage (a negative borne-off count).
 * Both should show the error box instead.
 */
import BackgammonPlugin from '../src/main';
import { parseXGID } from '../src/utils/parseXGID';

const REST = ':0:0:1:00:0:0:3:0:10';
// The 23-character position from README usage example 1
const SHORT = 'XGID=-a-bE-D---cD---c-b-a-E-:0:0:1:63:0:0:0:0';
const LONG = `XGID=-b----E-C---eE---c-e----B--${REST}`;
// Black (X): 2 + 5 + 3 + 6 = 16 checkers (the opening position with one extra on the 6-point)
const BLACK_16 = `XGID=-b----F-C---eE---c-e----B-${REST}`;
// White (O): 2 + 6 + 3 + 5 = 16 checkers
const WHITE_16 = `XGID=-b----E-C---eE---c-f----B-${REST}`;

async function render(source: string): Promise<HTMLElement> {
	const plugin = new BackgammonPlugin({} as any, {} as any);
	plugin.registerMarkdownCodeBlockProcessor = jest.fn() as any;
	await plugin.onload();
	const processor = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
	const el = document.createElement('div');
	processor(source, el);
	return el;
}

describe('XGID position validation', () => {
	it('rejects a position that is not 26 characters', () => {
		expect(() => parseXGID(SHORT)).toThrow('position must be 26 characters, got 23');
		expect(() => parseXGID(LONG)).toThrow('position must be 26 characters, got 27');
	});

	it('rejects a side with more than 15 checkers', () => {
		expect(() => parseXGID(BLACK_16)).toThrow('Black has 16 checkers (maximum 15)');
		expect(() => parseXGID(WHITE_16)).toThrow('White has 16 checkers (maximum 15)');
	});

	it('accepts exactly 15 a side, including all 15 on one point', () => {
		expect(parseXGID(`XGID=-b----E-C---eE---c-e----B-${REST}`).borneOffX).toBe(0);
		expect(parseXGID(`XGID=------O------------o------${REST}`).borneOffO).toBe(0);
	});

	it('shows the error box instead of a board', async () => {
		for (const xgid of [SHORT, BLACK_16]) {
			const el = await render(xgid);
			expect(el.querySelector('.backgammon-error-message')?.textContent).toMatch(/^⚠️ Error: Invalid XGID position/);
			expect(el.querySelector('canvas')).toBeNull();
		}
	});
});
