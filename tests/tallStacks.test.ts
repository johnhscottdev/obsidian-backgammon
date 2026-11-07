/**
 * Regression: tall stacks overflowed their point. With no cap on checkers per point, the 6th
 * checker crossed the centre line and the 7th+ overlapped the opposite stack. Now at most 5 are
 * drawn per point (4 on the bar, which starts further in), and the first checker (nearest the edge) shows the total.
 */
import { drawCheckers } from '../src/utils/renderBoard';
import { parseXGID } from '../src/utils/parseXGID';
import { styleConfig } from '../src/utils/styleConfig';
import { createMockContext } from './setup';

const FIFTEEN_ON_SIX = 'XGID=------O------------o------:0:0:1:21:0:0:3:0:10';
const SEVEN_ON_SIX = 'XGID=----DDG------------gdd----:0:0:1:64:0:0:3:0:10';
// Black: 9 on the 6-point and 6 on the bar. White: 9 on its 6-point and 6 on the bar.
const SIX_ON_BAR = 'XGID=f-----I------------i-----F:0:0:1:00:0:0:3:0:10';

const BOARD_CENTRE = styleConfig.boardHeight / 2;

function draw(xgid: string) {
	const ctx = createMockContext();
	drawCheckers(ctx, parseXGID(xgid));
	const checkers = (ctx.arc as jest.Mock).mock.calls
		.filter(c => c[2] === styleConfig.checkerRadius)
		.map(c => ({ x: c[0] as number, y: c[1] as number }));
	const labels = (ctx.fillText as jest.Mock).mock.calls.map(c => ({
		text: c[0] as string, x: c[1] as number, y: c[2] as number,
	}));
	return { ctx, checkers, labels };
}

/** True if the label sits on the checker nearest the board edge in its stack. */
function onFirstChecker(label: { x: number; y: number }, checkers: { x: number; y: number }[]): boolean {
	const top = label.y < BOARD_CENTRE;
	const stack = checkers.filter(c => c.x === label.x && (c.y < BOARD_CENTRE) === top);
	const edgeMost = top ? Math.min(...stack.map(c => c.y)) : Math.max(...stack.map(c => c.y));
	return stack.length > 1 && label.y === edgeMost;
}

function crossesCentre(y: number): boolean {
	const r = styleConfig.checkerRadius;
	return y - r < BOARD_CENTRE && y + r > BOARD_CENTRE;
}

describe('tall stacks', () => {
	it('parses the test positions as intended', () => {
		// parseXGID reverses the XGID string, so XGID character i is points[25 - i]
		expect(parseXGID(FIFTEEN_ON_SIX).points[19]).toEqual({ player: 'X', checkerCount: 15 });
		expect(parseXGID(SIX_ON_BAR).points[0]).toEqual({ player: 'X', checkerCount: 6 });
		expect(parseXGID(SIX_ON_BAR).points[25]).toEqual({ player: 'O', checkerCount: 6 });
		expect(parseXGID(SIX_ON_BAR).pipCountX).toBe(9 * 6 + 6 * 25);
	});

	it('draws at most 5 checkers on a 15-checker point, the first one labelled "15"', () => {
		const { checkers, labels } = draw(FIFTEEN_ON_SIX);
		expect(checkers).toHaveLength(10); // 5 black + 5 white
		const fifteens = labels.filter(l => l.text === '15');
		expect(fifteens).toHaveLength(2);
		// Each label sits on the first checker of its stack (nearest the edge)
		for (const l of fifteens) {
			expect(checkers).toContainEqual({ x: l.x, y: l.y });
			expect(onFirstChecker(l, checkers)).toBe(true);
		}
		expect(checkers.some(c => crossesCentre(c.y))).toBe(false);
	});

	it('labels the checker in a colour that contrasts with it', () => {
		const { ctx } = draw(FIFTEEN_ON_SIX);
		const styles: string[] = [];
		(ctx.fillText as jest.Mock).mockImplementation(() => styles.push(ctx.fillStyle as string));
		drawCheckers(ctx, parseXGID(FIFTEEN_ON_SIX));
		expect(styles.sort()).toEqual(
			[styleConfig.colors.checkerBlack, styleConfig.colors.checkerWhite].sort()
		);
	});

	it('draws 5 of 7 on the 6-point, labelled "7", and leaves 4-stacks unlabelled', () => {
		const { checkers, labels } = draw(SEVEN_ON_SIX);
		expect(checkers).toHaveLength(2 * (5 + 4 + 4));
		expect(labels.map(l => l.text).sort()).toEqual(['7', '7']);
		expect(checkers.some(c => crossesCentre(c.y))).toBe(false);
	});

	it('does not label a point with exactly 5 checkers', () => {
		// Opening position: 5 on each side's 6-point and mid-point
		const { checkers, labels } = draw('XGID=-b----E-C---eE---c-e----B-:0:0:0:00:0:0:0:0:10');
		expect(checkers).toHaveLength(30);
		expect(labels).toHaveLength(0);
	});

	it('caps bar stacks so they do not cross the centre, labelled with the total', () => {
		const { checkers, labels } = draw(SIX_ON_BAR);
		expect(checkers.some(c => crossesCentre(c.y))).toBe(false);
		expect(labels.filter(l => l.text === '6')).toHaveLength(2);
		expect(labels.filter(l => l.text === '9')).toHaveLength(2);
		for (const l of labels) expect(onFirstChecker(l, checkers)).toBe(true);
	});

	it('draws 9 on the bar for each side as 4, labelled "9" on the first checker', () => {
		const xgid = 'XGID=i-----F------------f-----I:0:0:1:00:0:0:3:0:10';
		const pos = parseXGID(xgid);
		expect(pos.points[0]).toEqual({ player: 'X', checkerCount: 9 });
		expect(pos.points[25]).toEqual({ player: 'O', checkerCount: 9 });
		expect(pos.pipCountX).toBe(9 * 25 + 6 * 6);
		expect(pos.pipCountO).toBe(9 * 25 + 6 * 6);
		const { checkers, labels } = draw(xgid);
		expect(checkers).toHaveLength(2 * (4 + 5));
		expect(labels.filter(l => l.text === '9')).toHaveLength(2);
		expect(labels.filter(l => l.text === '6')).toHaveLength(2);
		for (const l of labels) expect(onFirstChecker(l, checkers)).toBe(true);
		expect(checkers.some(c => crossesCentre(c.y))).toBe(false);
	});
});
