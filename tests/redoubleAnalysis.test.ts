/**
 * Regression: when the cube is already owned, XG writes "No redouble:" / "Redouble/Take:" /
 * "Redouble/Pass:" (and "Redouble/Beaver:" in money play) instead of the "double" wording.
 * The parser only knew the "double" wording, so the cubeful equities were silently dropped.
 */
import { parseAnalysis } from '../src/utils/parseAnalysis';
import { renderAnalysis } from '../src/utils/renderAnalysis';
import type { CubeAnalysis } from '../src/types/analysis';

// Real XG output (test-vault/04 Cube analysis.md, "Redouble / No redouble")
const REDOUBLE = `Analyzed in XG Roller+
Player Winning Chances:   64.84% (G:12.13% B:0.47%)
Opponent Winning Chances: 35.16% (G:10.10% B:0.21%)

Cubeless Equities: No Double=+0.321, Double=+0.652

Cubeful Equities:
       No redouble:     +0.582
       Redouble/Take:   +0.449 (-0.133)
       Redouble/Pass:   +1.000 (+0.418)

Best Cube action: No redouble / Take
Percentage of wrong pass needed to make the double decision right: 19.5%

eXtreme Gammon Version: 2.10, MET: Kazaross XG2`;

// Constructed (no real XG copy yet): a money-game redouble where the opponent should beaver.
// Mirrors the real "Double/Beaver" layout with the "redouble" wording.
const REDOUBLE_BEAVER = `Analyzed in XG Roller+
Player Winning Chances:   38.20% (G:8.10% B:0.30%)
Opponent Winning Chances: 61.80% (G:15.40% B:0.70%)

Cubeless Equities: No Double=-0.140, Double=-0.280

Cubeful Equities:
       No redouble:     +0.101
       Redouble/Beaver: -0.402 (-0.503)
       Redouble/Pass:   +1.000 (+0.899)

Best Cube action: No redouble / Beaver`;

function cube(text: string): CubeAnalysis {
	const result = parseAnalysis(text);
	expect(result?.type).toBe('cube');
	return result as CubeAnalysis;
}

function rows(text: string): string[] {
	const el = renderAnalysis(cube(text));
	return Array.from(el.querySelectorAll('.equity-row')).map(r => r.textContent ?? '');
}

describe('redouble cube analysis', () => {
	it('parses the cubeful equities of a real XG redouble analysis', () => {
		expect(cube(REDOUBLE).cubefulEquities).toEqual({
			redouble: true,
			noDouble: 0.582,
			noDoubleDiff: undefined,
			doubleTake: 0.449,
			doubleTakeDiff: -0.133,
			doublePass: 1.0,
			doublePassDiff: 0.418,
		});
		expect(cube(REDOUBLE).bestAction).toBe('No redouble / Take');
	});

	it('shows the redouble rows with XG\'s redouble wording', () => {
		expect(rows(REDOUBLE)).toEqual([
			'No redouble:'.padEnd(20) + '+0.582',
			'Redouble/Take:'.padEnd(20) + '+0.449 (-0.133)',
			'Redouble/Pass:'.padEnd(20) + '+1.000 (+0.418)',
		]);
	});

	it('parses and shows Redouble/Beaver', () => {
		expect(cube(REDOUBLE_BEAVER).cubefulEquities).toEqual(expect.objectContaining({
			redouble: true,
			doubleBeaver: -0.402,
			doubleBeaverDiff: -0.503,
		}));
		expect(rows(REDOUBLE_BEAVER)).toEqual([
			'No redouble:'.padEnd(20) + '+0.101',
			'Redouble/Beaver:'.padEnd(20) + '-0.402 (-0.503)',
			'Redouble/Pass:'.padEnd(20) + '+1.000 (+0.899)',
		]);
	});

	it('still shows the double wording for a first double', () => {
		const text = REDOUBLE
			.replace('No redouble:  ', 'No double:    ')
			.replace(/Redouble\//g, 'Double/');
		expect(cube(text).cubefulEquities?.redouble).toBeUndefined();
		expect(rows(text)).toEqual([
			'No double:'.padEnd(20) + '+0.582',
			'Double/Take:'.padEnd(20) + '+0.449 (-0.133)',
			'Double/Pass:'.padEnd(20) + '+1.000 (+0.418)',
		]);
	});
});
