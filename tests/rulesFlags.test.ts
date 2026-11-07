/**
 * Regression: the XGID rules field was decoded wrongly. It is a bit field in money play
 * (1 = Jacoby, 2 = Beaver, 3 = both) and means "Crawford game" (1) in match play, where Jacoby and
 * beavers don't apply. The beaver test was `rulesFlags % 4 === 1`, so "Jacoby Beaver" (3) gave
 * beaver = false, Jacoby-only (1) gave beaver = true, and match games could report Jacoby.
 */
import { parseXGID } from '../src/utils/parseXGID';

const OPENING = '-b----E-C---eE---c-e----B-';
// Money game; XG writes rules 3 for "Unlimited Game, Jacoby Beaver" (real copies in test-vault/03, 04)
const money = (rules: number) => `XGID=${OPENING}:0:0:1:00:0:0:${rules}:0:10`;
// 7-point match; real copies in test-vault/02 Cube and match.md
const match = (rules: number) => `XGID=${OPENING}:0:0:1:31:6:4:${rules}:7:10`;

function rules(xgid: string) {
	const { jacoby, beaver, crawford } = parseXGID(xgid);
	return { jacoby, beaver, crawford };
}

describe('XGID rules field', () => {
	it('money, Jacoby and Beaver (3)', () => {
		expect(rules(money(3))).toEqual({ jacoby: true, beaver: true, crawford: false });
	});

	it('money, Jacoby only (1)', () => {
		expect(rules(money(1))).toEqual({ jacoby: true, beaver: false, crawford: false });
	});

	it('money, Beaver only (2)', () => {
		expect(rules(money(2))).toEqual({ jacoby: false, beaver: true, crawford: false });
	});

	it('money, no rules (0)', () => {
		expect(rules(money(0))).toEqual({ jacoby: false, beaver: false, crawford: false });
	});

	it('match, Crawford game (1): no Jacoby or beaver in match play', () => {
		expect(rules(match(1))).toEqual({ jacoby: false, beaver: false, crawford: true });
	});

	it('match, not the Crawford game (0)', () => {
		expect(rules(match(0))).toEqual({ jacoby: false, beaver: false, crawford: false });
	});
});
