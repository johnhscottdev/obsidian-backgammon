/**
 * Dark theme: the board follows Obsidian's theme (body.theme-dark) and redraws live when the
 * theme changes (Obsidian's workspace "css-change" event). The light palette is unchanged.
 */
import * as fs from 'fs';
import * as path from 'path';
import BackgammonPlugin from '../src/main';
import { styleConfig } from '../src/utils/styleConfig';

// Opening position, 3-1 to play, 7-point match (so dice and score boxes are drawn)
const XGID = 'XGID=-b----E-C---eE---c-e----B-:0:0:1:31:2:1:0:7:10';

async function setup() {
	const plugin = new BackgammonPlugin({} as any, {} as any);
	plugin.registerMarkdownCodeBlockProcessor = jest.fn() as any;
	await plugin.onload();
	const processor = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
	return { plugin, processor };
}

/** Records the fillStyle in effect each time something is filled. */
function recordFills(canvas: HTMLCanvasElement): string[] {
	const ctx = canvas.getContext('2d') as any;
	const fills: string[] = [];
	for (const m of ['fillRect', 'fill', 'fillText']) {
		(ctx[m] as jest.Mock).mockImplementation(() => fills.push(ctx.fillStyle));
	}
	return fills;
}

function render(processor: any): HTMLCanvasElement {
	const el = document.createElement('div');
	document.body.appendChild(el);
	processor(XGID, el);
	return el.querySelector('canvas')!;
}

afterEach(() => {
	document.body.className = '';
	document.body.innerHTML = '';
});

describe('dark theme', () => {
	it('has a dark palette with the same entries as the light one', () => {
		expect(Object.keys(styleConfig.darkColors).sort()).toEqual(Object.keys(styleConfig.colors).sort());
		expect(styleConfig.darkColors.background).not.toBe(styleConfig.colors.background);
	});

	it('uses the dark palette when Obsidian is in the dark theme', async () => {
		document.body.classList.add('theme-dark');
		const { plugin, processor } = await setup();
		const canvas = render(processor);
		const fills = recordFills(canvas);
		(plugin.app.workspace as any).trigger('css-change');
		const dark = styleConfig.darkColors;
		expect(fills[0]).toBe(dark.background);
		expect(fills).toContain(dark.triangleLight);
		expect(fills).toContain(dark.pointNumber);
		expect(fills).toContain(dark.scoreBackground);
		expect(fills).not.toContain(styleConfig.colors.background);
	});

	it('redraws live when the theme changes', async () => {
		document.body.classList.add('theme-light');
		const { plugin, processor } = await setup();
		const canvas = render(processor);

		let fills = recordFills(canvas);
		(plugin.app.workspace as any).trigger('css-change');
		expect(fills[0]).toBe(styleConfig.colors.background);

		document.body.classList.replace('theme-light', 'theme-dark');
		fills = recordFills(canvas);
		(plugin.app.workspace as any).trigger('css-change');
		expect(fills[0]).toBe(styleConfig.darkColors.background);
	});

	// Regression: Obsidian takes sections scrolled out of view off the page and puts the same
	// elements back later without re-rendering them. Those boards stayed in the old theme.
	it('also redraws boards that are off the page (scrolled out of view)', async () => {
		document.body.classList.add('theme-light');
		const { plugin, processor } = await setup();
		const canvas = render(processor);
		const section = canvas.closest('div')!.parentElement!;
		section.remove();

		document.body.classList.replace('theme-light', 'theme-dark');
		const fills = recordFills(canvas);
		(plugin.app.workspace as any).trigger('css-change');
		document.body.appendChild(section); // scrolled back into view
		expect(fills[0]).toBe(styleConfig.darkColors.background);
	});

	it('has dark-theme styles for the panels, keeping errors green and blunders red', () => {
		const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
		for (const cls of ['backgammon-analysis', 'backgammon-warning', 'backgammon-error', 'backgammon-error-message',
			'analysis-move.even', 'analysis-move.odd', 'move-good', 'move-stats', 'best-action']) {
			expect(css).toMatch(new RegExp(`\\.theme-dark \\.${cls.replace('.', '\\.')}\\s*\\{`));
		}
		const rule = (cls: string) => css.match(new RegExp(`\\.theme-dark \\.${cls}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
		const colour = (cls: string) => rule(cls).match(/color:\s*(#[0-9a-f]{6})/i)?.[1] ?? '';
		// Errors green, blunders red (matches XG), in shades readable on a dark background
		const [r1, g1, b1] = rgb(colour('move-error'));
		expect(g1).toBeGreaterThan(Math.max(r1, b1));
		const [r2, g2, b2] = rgb(colour('move-blunder'));
		expect(r2).toBeGreaterThan(Math.max(g2, b2));
		expect(luminance(colour('move-error'))).toBeGreaterThan(0.25);
		expect(luminance(colour('move-blunder'))).toBeGreaterThan(0.2);
	});
});

function rgb(hex: string): [number, number, number] {
	const n = parseInt(hex.slice(1), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
	const [r, g, b] = rgb(hex).map(v => v / 255);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
