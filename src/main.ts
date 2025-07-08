/**
 * Obsidian Backgammon Plugin
 * This plugin detects a code block with the language 'backgammon',
 * parses the position string, and renders a visualization inline.
 */

import { Plugin } from 'obsidian';
// import { BackgammonPosition } from './types'; // Unused import removed
import { renderBoard, parseXGID, extractAnalysisText, parseAnalysis, renderAnalysis } from './utils';


export default class BackgammonPlugin extends Plugin {
    async onload(): Promise<void> {
        this.registerMarkdownCodeBlockProcessor('xgid', (source, el) => {
            try {
                // Extract XGID from first line that starts with XGID=
                const lines = source.split('\n');
                const xgidLine = lines.find(line => line.trim().startsWith('XGID='));
                
                if (!xgidLine) {
                    throw new Error('No XGID found in code block');
                }
                
                const boardData = parseXGID(xgidLine);
                
                // Render the board
                renderBoard(el, boardData);

                // Display XGID string (disabled for now)
                // const xgidContainer = el.createDiv({ cls: "xgid-display" });
                // xgidContainer.style.cssText = "margin-top: 10px; padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; color: #333;";
                // xgidContainer.setText(xgidLine);

                // Parse and render analysis if present
                const analysisText = extractAnalysisText(source);
                if (analysisText) {
                    const analysis = parseAnalysis(analysisText);
                    if (analysis) {
                        const analysisElement = renderAnalysis(analysis);
                        el.appendChild(analysisElement);
                    }
                }
            } catch (error) {
                const errorDiv = el.createDiv({ cls: "backgammon-error" });
                errorDiv.style.cssText = "background-color: #ffe6e6; border: 1px solid #ffcccc; padding: 10px; border-radius: 4px; margin: 5px 0;";
                errorDiv.createDiv().setText(source);
                const errorMsg = errorDiv.createDiv();
                const message = error instanceof Error ? error.message : String(error);
                errorMsg.setText(`⚠️ Error: ${message}`);
                errorMsg.style.cssText = "color: #cc0000; font-weight: bold; margin-top: 5px;";
            }
        });
    }

    onunload(): void {
        //console.log('Unloading Backgammon Plugin');
    }
}
