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
                    wrapper.addClass('mobile-reading');
                }
                
                // Add header bar
                const headerBar = wrapper.createDiv({ cls: "backgammon-header" });
                
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
                wrapper.createDiv({ cls: "backgammon-footer" });

                // Display XGID string (disabled for now)
                // const xgidContainer = el.createDiv({ cls: "xgid-display" });
                // xgidContainer.style.cssText = "margin-top: 10px; padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; color: #333;";
                // xgidContainer.setText(xgidLine);
            } catch (error) {
                const errorDiv = el.createDiv({ cls: "backgammon-error" });
                errorDiv.createDiv().setText(source);
                const errorMsg = errorDiv.createDiv({ cls: "backgammon-error-message" });
                const message = error instanceof Error ? error.message : String(error);
                errorMsg.setText(`⚠️ Error: ${message}`);
            }
        });
    }

    onunload(): void {
        //console.log('Unloading Backgammon Plugin');
    }
}
