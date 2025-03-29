/**
 * Obsidian Backgammon Plugin
 * This plugin detects a code block with the language 'backgammon',
 * parses the position string, and renders a visualization inline.
 */

import { Plugin } from 'obsidian';
import { BoardData } from './types';
import { renderBoard } from './utils';
import { parseXGID } from './utils/parseXGID';


export default class BackgammonPlugin extends Plugin {
    async onload(): Promise<void> {
        this.registerMarkdownCodeBlockProcessor('xgid', (source, el) => {
            const xgid = source.trim(); // assume raw XGID string
            const boardData = parseXGID(xgid);
            //console.log('[Processor] Parsed boardData:', boardData);
            renderBoard(el, boardData);
        });
    }

    onunload(): void {
        //console.log('Unloading Backgammon Plugin');
    }
}
