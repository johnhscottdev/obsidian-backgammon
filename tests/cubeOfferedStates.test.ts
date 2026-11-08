/**
 * Regression: when a double has been offered, XG writes a letter in the XGID dice field instead
 * of a roll: D = doubled (opponent to take or pass), B = the opponent beavered, R = the doubler
 * raccooned. These parsed as "no dice" and the header said "<player> on roll - cube decision".
 */
import BackgammonPlugin from '../src/main';
import { parseXGID } from '../src/utils/parseXGID';

// Real XG copy (Ctrl+C while XG, as White, had doubled John, as Black): test-vault/10 Regressions.md
const DOUBLED = `XGID=---aa-DCC-a-bC---c-dba---B:0:0:-1:D:0:0:3:0:10
X:Professional   O:John

Score is X:0 O:0. Unlimited Game, Jacoby Beaver
Pip count  X: 146  O: 158 X-O: 0-0
Cube: 1
X on roll, cube action

Analyzed in 4-ply
Player Winning Chances:   71.17% (G:34.19% B:0.95%)
Opponent Winning Chances: 28.83% (G:5.77% B:0.27%)

Cubeless Equities: No Double=+0.715, Double=+1.430

Cubeful Equities:
       No double:     +0.893 (-0.107)
       Double/Take:   +1.226 (+0.226)
       Double/Pass:   +1.000

Best Cube action: Double / Pass

eXtreme Gammon Version: 2.10`;

// Constructed from the real copy until real XG copies of the beaver and raccoon states exist
const BEAVERED = 'XGID=---aa-DCC-a-bC---c-dba---B:0:0:-1:B:0:0:3:0:10';
const RACCOONED = 'XGID=---aa-DCC-a-bC---c-dba---B:0:0:-1:R:0:0:3:0:10';
const BLACK_DOUBLED = 'XGID=---aa-DCC-a-bC---c-dba---B:0:0:1:D:0:0:3:0:10';

async function render(source: string): Promise<HTMLElement> {
	const plugin = new BackgammonPlugin({} as any, {} as any);
	plugin.registerMarkdownCodeBlockProcessor = jest.fn() as any;
	await plugin.onload();
	const processor = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
	const el = document.createElement('div');
	processor(source, el);
	return el;
}

const header = async (source: string) =>
	(await render(source)).querySelector('.backgammon-header')?.textContent;

describe('cube offered dice states (D, B, R)', () => {
	it('parses the real XG "doubled" copy', () => {
		const pos = parseXGID(DOUBLED);
		expect(pos.cubeAction).toBe('doubled');
		expect(pos.turn).toBe('O');
		expect(pos.die1).toBe(0);
		expect(pos.die2).toBe(0);
		// XG's text calls the doubler "X"; in the plugin the doubler (turn -1) is White
		expect(pos.pipCountO).toBe(146);
		expect(pos.pipCountX).toBe(158);
	});

	it('parses beaver and raccoon', () => {
		expect(parseXGID(BEAVERED).cubeAction).toBe('beavered');
		expect(parseXGID(RACCOONED).cubeAction).toBe('raccooned');
	});

	it('leaves cubeAction unset for a normal roll or cube decision', () => {
		expect(parseXGID('XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10').cubeAction).toBeUndefined();
		expect(parseXGID('XGID=-b----E-C---eE---c-e----B-:0:0:1:31:0:0:3:0:10').cubeAction).toBeUndefined();
	});

	it('says who must take or pass', async () => {
		expect(await header(DOUBLED)).toBe('White doubles - Black to take or pass');
		expect(await header(BLACK_DOUBLED)).toBe('Black doubles - White to take or pass');
	});

	it('describes beaver and raccoon', async () => {
		expect(await header(BEAVERED)).toBe('White doubles, Black beavers');
		expect(await header(RACCOONED)).toBe('White doubles, Black beavers, White raccoons');
	});

	it('still shows the analysis and no error', async () => {
		const el = await render(DOUBLED);
		expect(el.querySelector('.backgammon-error')).toBeNull();
		expect(el.textContent).toContain('Best cube action: Double / Pass');
	});
});
