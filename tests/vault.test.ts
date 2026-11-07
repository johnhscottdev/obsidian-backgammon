/**
 * Runs every ```xgid block in test-vault/ through the real plugin pipeline.
 *
 * Each note's frontmatter says what its blocks should do:
 *   expect: board     -> renders a board, no error box
 *   expect: analysis  -> renders a board AND an analysis panel
 *   expect: error     -> shows the error box, no board
 *
 * Every block must also have an **Expect:** line in its section, so the person reviewing the
 * vault knows what correct looks like.
 */
import * as fs from 'fs';
import * as path from 'path';
import BackgammonPlugin from '../src/main';
import { parseXGID } from '../src/utils/parseXGID';

const VAULT = path.join(__dirname, '..', 'test-vault');

interface VaultBlock {
	note: string;
	heading: string;
	source: string;
	hasExpect: boolean;
}

type Expectation = 'board' | 'analysis' | 'error';

function readFrontmatterExpect(text: string): Expectation | null {
	const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	const m = fm?.[1].match(/^expect:\s*(\w+)\s*$/m);
	return (m?.[1] as Expectation) ?? null;
}

/** Extracts top-level ```xgid blocks, ignoring any nested inside a longer fence (e.g. ````markdown). */
export function extractXgidBlocks(note: string, text: string): VaultBlock[] {
	const lines = text.split(/\r?\n/);
	const blocks: VaultBlock[] = [];
	let heading = '(no heading)';
	let sectionHasExpect = false;
	let fence: { ticks: number; isXgid: boolean; body: string[] } | null = null;

	for (const line of lines) {
		const fenceMatch = line.match(/^(`{3,})\s*(\S*)\s*$/);
		if (fence) {
			if (fenceMatch && fenceMatch[1].length >= fence.ticks && fenceMatch[2] === '') {
				if (fence.isXgid) {
					blocks.push({ note, heading, source: fence.body.join('\n'), hasExpect: sectionHasExpect });
				}
				fence = null;
			} else {
				fence.body.push(line);
			}
			continue;
		}
		if (fenceMatch) {
			fence = { ticks: fenceMatch[1].length, isXgid: fenceMatch[2] === 'xgid', body: [] };
			continue;
		}
		const h = line.match(/^#{1,6}\s+(.*)$/);
		if (h) {
			heading = h[1].trim();
			sectionHasExpect = false;
		} else if (line.includes('**Expect:**')) {
			sectionHasExpect = true;
		}
	}
	return blocks;
}

const notes = fs
	.readdirSync(VAULT)
	.filter(f => f.endsWith('.md'))
	.sort()
	.map(f => {
		const text = fs.readFileSync(path.join(VAULT, f), 'utf8');
		return { file: f, text, expect: readFrontmatterExpect(text), blocks: extractXgidBlocks(f, text) };
	});

const notesWithBlocks = notes.filter(n => n.blocks.length > 0);

let processor: (source: string, el: HTMLElement) => void;

beforeAll(async () => {
	const plugin = new BackgammonPlugin({} as any, {} as any);
	plugin.registerMarkdownCodeBlockProcessor = jest.fn() as any;
	await plugin.onload();
	processor = (plugin.registerMarkdownCodeBlockProcessor as jest.Mock).mock.calls[0][1];
});

function render(source: string): HTMLElement {
	const el = document.createElement('div');
	processor(source, el);
	return el;
}

describe('test vault', () => {
	it('contains review notes', () => {
		expect(notesWithBlocks.length).toBeGreaterThan(0);
	});

	it('every note with xgid blocks declares `expect:` in its frontmatter', () => {
		const missing = notesWithBlocks.filter(n => !n.expect).map(n => n.file);
		expect(missing).toEqual([]);
	});

	for (const note of notesWithBlocks) {
		describe(note.file, () => {
			for (const block of note.blocks) {
				describe(block.heading, () => {
					it('has an **Expect:** line', () => {
						expect(block.hasExpect).toBe(true);
					});

					if (note.expect === 'error') {
						it('shows the error box and no board', () => {
							const el = render(block.source);
							expect(el.querySelector('.backgammon-error')).not.toBeNull();
							expect(el.querySelector('canvas')).toBeNull();
						});
						return;
					}

					it('renders a board without an error', () => {
						const el = render(block.source);
						const errorText = el.querySelector('.backgammon-error-message')?.textContent;
						expect(errorText).toBeUndefined();
						expect(el.querySelector('canvas.backgammon-canvas')).not.toBeNull();
						if (note.expect === 'analysis') {
							expect(el.querySelector('.backgammon-analysis')).not.toBeNull();
						}
					});

					// Sanity checks on the fixture itself, so a typo in a note can't masquerade as a bug.
					it('is a well-formed position (26 chars, at most 15 checkers per side)', () => {
						const xgidLine = block.source.split(/\r?\n/).find(l => l.trim().startsWith('XGID='))!;
						const position = xgidLine.trim().slice('XGID='.length).split(':')[0];
						expect(position).toHaveLength(26);
						const data = parseXGID(xgidLine);
						expect(data.borneOffX).toBeGreaterThanOrEqual(0);
						expect(data.borneOffO).toBeGreaterThanOrEqual(0);
					});
				});
			}
		});
	}
});
