/**
 * Obsidian Backgammon Plugin
 * This plugin detects a code block with the language 'backgammon',
 * parses the position string, and renders a visualization inline.
 */

import { Plugin, Platform } from 'obsidian';
import { BackgammonPosition } from './types';
import { renderBoard, parseXGID, extractAnalysisText, parseAnalysis, renderAnalysis } from './utils';


export default class BackgammonPlugin extends Plugin {
    async onload(): Promise<void> {
        // Different approach - create visual effect using margins and container width
        this.registerMarkdownCodeBlockProcessor('xgid', (source, el) => {
            try {
                // Extract XGID from first line that starts with XGID=
                const lines = source.split('\n');
                const xgidLine = lines.find(line => line.trim().startsWith('XGID='));
                
                if (!xgidLine) {
                    throw new Error('No XGID found in code block');
                }
                
                const boardData = parseXGID(xgidLine);
                
                // Create a wrapper with conditional 31px left shift
                const wrapper = el.createDiv({ cls: "backgammon-wrapper" });
                
                // Check if we're on mobile and in Reading Mode
                const isMobile = Platform.isMobile;
                
                // More reliable Reading Mode detection
                const isReadingMode = el.closest('.markdown-preview-view') !== null;
                
                // Apply 31px shift only on mobile in Reading Mode
                if (isMobile && isReadingMode) {
                    wrapper.style.cssText = `
                        position: relative;
                        left: -31px;
                        overflow: visible;
                    `;
                } else {
                    wrapper.style.cssText = `
                        position: relative;
                        overflow: visible;
                    `;
                }
                
                // Add header bar
                const headerBar = wrapper.createDiv({ cls: "backgammon-header" });
                headerBar.style.cssText = `
                    background: #34495e;
                    color: white;
                    padding: 12px 16px;
                    font-family: "Segoe UI", system-ui, sans-serif;
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 0;
                    border-radius: 4px 4px 0 0;
                    border-left: 8px solid #34495e;
                    border-right: 8px solid #34495e;
                    border-top: 8px solid #34495e;
                    max-width: 500px;
                    box-sizing: border-box;
                `;
                
                // Determine the action text based on board state
                const getActionText = (data: BackgammonPosition): string => {
                    const playerName = data.turn === 'X' ? 'Black' : 'White';
                    
                    // Check if dice are rolled (move decision)
                    if (data.die1 > 0 && data.die2 > 0) {
                        const diceText = data.die1 === data.die2 ? 
                            `${data.die1}${data.die1}` : // Doubles: "66"
                            `${data.die1}${data.die2}`;  // Regular: "63"
                        return `${playerName} to Play ${diceText}`;
                    }
                    
                    // No dice rolled - cube decision
                    return `${playerName} on Roll - Cube Decision`;
                };
                
                headerBar.setText(getActionText(boardData));
                
                // Render the board
                renderBoard(wrapper, boardData);

                // Parse and render analysis if present
                const analysisText = extractAnalysisText(source);
                if (analysisText) {
                    const analysis = parseAnalysis(analysisText);
                    if (analysis) {
                        const analysisElement = renderAnalysis(analysis);
                        wrapper.appendChild(analysisElement);
                    }
                }

                // Add footer bar
                const footerBar = wrapper.createDiv({ cls: "backgammon-footer" });
                footerBar.style.cssText = `
                    background: #34495e;
                    height: 8px;
                    margin-top: 0;
                    border-radius: 0 0 4px 4px;
                    border-left: 8px solid #34495e;
                    border-right: 8px solid #34495e;
                    border-bottom: 8px solid #34495e;
                    max-width: 500px;
                    box-sizing: border-box;
                `;

                // Display XGID string (disabled for now)
                // const xgidContainer = el.createDiv({ cls: "xgid-display" });
                // xgidContainer.style.cssText = "margin-top: 10px; padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; color: #333;";
                // xgidContainer.setText(xgidLine);
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
