import BackgammonPlugin from '../src/main';

const START = 'XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10';

type Processor = (source: string, el: HTMLElement) => void;

async function loadProcessor(): Promise<{ plugin: BackgammonPlugin; processor: Processor }> {
	const plugin = new BackgammonPlugin({} as any, {} as any);
	plugin.registerMarkdownCodeBlockProcessor = jest.fn() as any;
	await plugin.onload();
	const processor = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
	return { plugin, processor };
}

function render(processor: Processor, source: string): HTMLElement {
	const el = document.createElement('div');
	document.body.appendChild(el);
	processor(source, el);
	return el;
}

describe('BackgammonPlugin', () => {
	let processor: Processor;
	let plugin: BackgammonPlugin;

	beforeEach(async () => {
		document.body.innerHTML = '';
		({ plugin, processor } = await loadProcessor());
	});

	it('registers the xgid code block processor', () => {
		expect(plugin.registerMarkdownCodeBlockProcessor).toHaveBeenCalledWith('xgid', expect.any(Function));
	});

	it('renders header, canvas and footer for a valid XGID', () => {
		const el = render(processor, START);

		expect(el.querySelector('.backgammon-error')).toBeNull();
		expect(el.querySelector('.backgammon-header')?.textContent).toBe('Black on roll - cube decision');
		expect(el.querySelector('canvas.backgammon-canvas')).not.toBeNull();
		expect(el.querySelector('.backgammon-footer')).not.toBeNull();
	});

	it('shows the dice in the header for a move decision', () => {
		const el = render(processor, 'XGID=-b----E-C---eE---c-e----B-:0:0:1:52:0:0:3:0:10');
		expect(el.querySelector('.backgammon-header')?.textContent).toBe('Black to play 52');
	});

	it('names White when it is O to play', () => {
		const el = render(processor, 'XGID=-b----E-C---eE---c-e----B-:0:0:-1:31:0:0:3:0:10');
		expect(el.querySelector('.backgammon-header')?.textContent).toBe('White to play 31');
	});

	it('accepts surrounding whitespace on the XGID line', () => {
		const el = render(processor, `   ${START}   `);
		expect(el.querySelector('.backgammon-error')).toBeNull();
	});

	it('renders move analysis when present', () => {
		const source = `${START.replace(':00:', ':52:')}
X:Player 1   O:Player 2

    1. Book¹       Bar/20 13/11                 eq:+0.095
      Player:   52.09% (G:13.91% B:0.59%)
      Opponent: 47.91% (G:11.60% B:0.51%)

    2. XG Roller++ Bar/23 13/8                  eq:+0.085 (-0.010)
      Player:   51.73% (G:13.47% B:0.49%)
      Opponent: 48.27% (G:11.24% B:0.44%)
`;
		const el = render(processor, source);

		const moves = el.querySelectorAll('.backgammon-analysis .analysis-move');
		expect(moves).toHaveLength(2);
		expect(moves[0].querySelector('.move-text')?.textContent).toBe('1. Bar/20 13/11');
	});

	it('does not render analysis when there is none', () => {
		const el = render(processor, START);
		expect(el.querySelector('.backgammon-analysis')).toBeNull();
	});

	describe('errors', () => {
		it('shows an error when there is no XGID line', () => {
			const el = render(processor, 'invalid-xgid-format');

			const error = el.querySelector('.backgammon-error');
			expect(error).not.toBeNull();
			expect(error?.textContent).toContain('invalid-xgid-format');
			expect(el.querySelector('.backgammon-error-message')?.textContent).toBe(
				'⚠️ Error: No XGID found in code block'
			);
			expect(el.querySelector('canvas')).toBeNull();
		});

		it('shows an error for a malformed XGID', () => {
			const el = render(processor, 'XGID=invalid-xgid-format');
			expect(el.querySelector('.backgammon-error-message')?.textContent).toContain('Invalid XGID format');
		});

		it('shows an error for empty input', () => {
			const el = render(processor, '');
			expect(el.querySelector('.backgammon-error')).not.toBeNull();
		});
	});

	it('unloads without errors', () => {
		expect(() => plugin.onunload()).not.toThrow();
	});
});
