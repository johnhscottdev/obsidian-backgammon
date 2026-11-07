/**
 * Regression: the XGID turn field must be 1 (Black/X) or -1 (White/O). XG produced an XGID
 * with turn 0 (after a broken copy was pasted back into XG), and the plugin silently showed
 * "Black on roll". It should say the player on roll is unknown and show a warning.
 */
import BackgammonPlugin from '../src/main';
import { parseXGID } from '../src/utils/parseXGID';

const TURN_ZERO = 'XGID=--CAABD---------D---cdbba-:1:-1:0:00:0:0:0:0:10';

async function render(source: string): Promise<HTMLElement> {
	const plugin = new BackgammonPlugin({} as any, {} as any);
	plugin.registerMarkdownCodeBlockProcessor = jest.fn() as any;
	await plugin.onload();
	const processor = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
	const el = document.createElement('div');
	processor(source, el);
	return el;
}

describe('XGID turn field', () => {
	it('flags turn 0 as unknown with a warning', () => {
		const data = parseXGID(TURN_ZERO);
		expect(data.turnUnknown).toBe(true);
		expect(data.warnings).toEqual([expect.stringContaining('turn')]);
	});

	it('accepts 1 and -1 without warnings', () => {
		for (const turn of ['1', '-1']) {
			const data = parseXGID(`XGID=-b----E-C---eE---c-e----B-:0:0:${turn}:00:0:0:3:0:10`);
			expect(data.turnUnknown).toBeFalsy();
			expect(data.warnings ?? []).toEqual([]);
		}
	});

	it('says the player on roll is unknown and shows the warning', async () => {
		const el = await render(TURN_ZERO);

		expect(el.querySelector('.backgammon-error')).toBeNull();
		expect(el.querySelector('.backgammon-header')?.textContent).toBe('Unknown player on roll - cube decision');
		const warning = el.querySelector('.backgammon-warning');
		expect(warning?.textContent).toContain('turn');
		expect(el.querySelector('canvas')).not.toBeNull();
	});

	it('shows no warning for a normal position', async () => {
		const el = await render('XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10');
		expect(el.querySelector('.backgammon-warning')).toBeNull();
	});
});
