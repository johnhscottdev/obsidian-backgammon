/**
 * Obsidian Backgammon Plugin
 * This plugin detects a code block with the language 'backgammon',
 * parses the position string, and renders a visualization inline.
 */

import { Plugin } from 'obsidian';
import { parsePosition } from './utils';
import { BoardData } from './types';
import { renderBoard } from './utils';


export default class BackgammonPlugin extends Plugin {
    async onload(): Promise<void> {
        this.registerMarkdownCodeBlockProcessor('backgammon', (source: string, el: HTMLElement) => {
            const boardData: BoardData = parsePosition(source);
            renderBoard(el, boardData);
        });
    }

    onunload(): void {
        console.log('Unloading Backgammon Plugin');
    }
}
