/**
 * Obsidian Backgammon Plugin
 * This plugin detects a code block with the language 'backgammon',
 * parses the position string, and renders a visualization inline.
 */

import { Plugin } from 'obsidian';
import { BoardData } from './types';
import { renderBoard } from './utils';
import { parseXGID } from './utils/parseXGID';
import { extractMoveBlocks as extractDecisionAnalysis } from './utils/parseXGID';


export default class BackgammonPlugin extends Plugin {
    async onload(): Promise<void> {
        this.registerMarkdownCodeBlockProcessor('xgid', (source, el) => {
            try {
                const xgid = source.trim(); // assume raw XGID string
                const boardData = parseXGID(xgid);
                const decisions = extractDecisionAnalysis(source);
                //console.log('[Processor] Parsed boardData:', boardData);
                renderBoard(el, boardData);

                const container = el.createDiv({ cls: "my-container" });

                decisions.forEach(item => {
                    const pre = container.createEl("pre");
                    const code = pre.createEl("code");
                    code.textContent = item;
                });
            } catch (error) {
                const errorDiv = el.createDiv({ cls: "backgammon-error" });
                errorDiv.style.cssText = "background-color: #ffe6e6; border: 1px solid #ffcccc; padding: 10px; border-radius: 4px; margin: 5px 0;";
                errorDiv.createDiv().setText(source);
                const errorMsg = errorDiv.createDiv();
                errorMsg.setText(`⚠️ Error: ${error.message}`);
                errorMsg.style.cssText = "color: #cc0000; font-weight: bold; margin-top: 5px;";
            }
        });
    }

    onunload(): void {
        //console.log('Unloading Backgammon Plugin');
    }
}
