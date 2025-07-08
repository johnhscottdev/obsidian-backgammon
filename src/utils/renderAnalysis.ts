import { AnalysisData, MoveAnalysis, CubeAnalysis } from '../types/analysis';

/**
 * Determines move color based on equity difference
 * Black: Good moves (equity loss < 0.02)
 * Green: Errors (equity loss 0.02-0.08)
 * Red: Blunders (equity loss > 0.08)
 */
function getMoveColor(equityDiff: number): string {
    const absEquityDiff = Math.abs(equityDiff);
    
    if (absEquityDiff < 0.02) {
        return '#000000'; // Black for good moves
    } else if (absEquityDiff < 0.08) {
        return '#008000'; // Green for errors
    } else {
        return '#ff0000'; // Red for blunders
    }
}

/**
 * Renders analysis data as HTML content
 */
export function renderAnalysis(analysis: AnalysisData): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'backgammon-analysis';
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .backgammon-analysis {
            margin-top: 20px;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.4;
            background: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            max-width: 500px;
            width: 100%;
            box-sizing: border-box;
        }
        
        .analysis-move {
            margin-bottom: 8px;
            padding: 4px 8px;
            border-radius: 3px;
        }
        
        .analysis-move.even {
            background-color: #ffffff;
        }
        
        .analysis-move.odd {
            background-color: #f8f8f8;
        }
        
        .move-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2px;
        }
        
        .move-text {
            font-weight: bold;
        }
        
        .move-equity {
            font-weight: bold;
            text-align: right;
        }
        
        .move-stats {
            font-size: 12px;
            color: #666;
            margin-left: 20px;
        }
        
        .stats-line {
            display: flex;
            gap: 0;
        }
        
        .stats-label {
            width: 20px;
            flex-shrink: 0;
        }
        
        .stats-number {
            width: 35px;
            text-align: right;
            flex-shrink: 0;
        }
        
        .cube-analysis {
            margin-bottom: 12px;
        }
        
        .cube-section {
            margin-bottom: 8px;
        }
        
        .cube-title {
            font-weight: bold;
            margin-bottom: 4px;
        }
        
        .cube-line {
            margin-bottom: 2px;
        }
        
        .winning-chances {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            flex-wrap: wrap;
        }
        
        .winning-label {
            flex: 0 0 auto;
            min-width: 180px;
        }
        
        .winning-stats {
            flex: 1;
            text-align: right;
            font-family: monospace;
            min-width: 200px;
        }
        
        @media (max-width: 400px) {
            .winning-chances {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .winning-label {
                min-width: auto;
                margin-bottom: 2px;
            }
            
            .winning-stats {
                text-align: left;
                min-width: auto;
                margin-left: 20px;
            }
        }
        
        .equity-table {
            margin: 8px 0;
        }
        
        .equity-row {
            font-family: monospace;
            white-space: pre;
            margin-bottom: 2px;
        }
        
        .best-action {
            font-weight: bold;
            color: #0066cc;
            margin-top: 8px;
        }
    `;
    
    container.appendChild(style);
    
    if (analysis.type === 'move') {
        renderMoveAnalysis(container, analysis);
    } else {
        renderCubeAnalysis(container, analysis);
    }
    
    return container;
}

/**
 * Renders move analysis
 */
function renderMoveAnalysis(container: HTMLDivElement, analysis: MoveAnalysis): void {
    analysis.moves.forEach((move, index) => {
        const moveDiv = document.createElement('div');
        moveDiv.className = `analysis-move ${index % 2 === 0 ? 'even' : 'odd'}`;
        
        // Main move line
        const moveLine = document.createElement('div');
        moveLine.className = 'move-line';
        
        const moveText = document.createElement('span');
        moveText.className = 'move-text';
        moveText.style.color = getMoveColor(move.equityDiff);
        
        const moveNotation = `${move.rank}. ${move.move}`;
        moveText.textContent = moveNotation;
        
        const equityText = document.createElement('span');
        equityText.className = 'move-equity';
        equityText.style.color = getMoveColor(move.equityDiff);
        
        let equityDisplay = move.equity >= 0 ? `+${move.equity.toFixed(3)}` : move.equity.toFixed(3);
        if (move.equityDiff !== 0) {
            const diffDisplay = move.equityDiff >= 0 ? `+${move.equityDiff.toFixed(3)}` : move.equityDiff.toFixed(3);
            equityDisplay += ` (${diffDisplay})`;
        }
        equityText.textContent = equityDisplay;
        
        moveLine.appendChild(moveText);
        moveLine.appendChild(equityText);
        moveDiv.appendChild(moveLine);
        
        // Player stats
        if (move.playerStats) {
            const statsContainer = document.createElement('div');
            statsContainer.className = 'move-stats';
            
            const moveColor = getMoveColor(move.equityDiff);
            
            const playerStats = document.createElement('div');
            playerStats.className = 'stats-line';
            playerStats.style.color = moveColor;
            playerStats.innerHTML = `
                <span class="stats-label">P:</span>
                <span class="stats-number">${move.playerStats.win.toFixed(1)}</span>
                <span class="stats-number">${move.playerStats.gammon.toFixed(1)}</span>
                <span class="stats-number">${move.playerStats.backgammon.toFixed(1)}</span>
            `;
            
            const opponentStats = document.createElement('div');
            opponentStats.className = 'stats-line';
            opponentStats.style.color = moveColor;
            opponentStats.innerHTML = `
                <span class="stats-label">O:</span>
                <span class="stats-number">${move.opponentStats?.win.toFixed(1) || '0.0'}</span>
                <span class="stats-number">${move.opponentStats?.gammon.toFixed(1) || '0.0'}</span>
                <span class="stats-number">${move.opponentStats?.backgammon.toFixed(1) || '0.0'}</span>
            `;
            
            statsContainer.appendChild(playerStats);
            statsContainer.appendChild(opponentStats);
            moveDiv.appendChild(statsContainer);
        }
        
        container.appendChild(moveDiv);
    });
}

/**
 * Renders cube analysis
 */
function renderCubeAnalysis(container: HTMLDivElement, analysis: CubeAnalysis): void {
    const cubeDiv = document.createElement('div');
    cubeDiv.className = 'cube-analysis';
    
    // Winning chances
    if (analysis.playerWinning && analysis.opponentWinning) {
        const winningDiv = document.createElement('div');
        winningDiv.className = 'cube-section';
        
        const playerLine = document.createElement('div');
        playerLine.className = 'cube-line winning-chances';
        const playerLabel = document.createElement('span');
        playerLabel.className = 'winning-label';
        playerLabel.textContent = 'Player Winning Chances:';
        const playerStats = document.createElement('span');
        playerStats.className = 'winning-stats';
        playerStats.textContent = `${analysis.playerWinning.win.toFixed(2)}% (G:${analysis.playerWinning.gammon.toFixed(2)}% B:${analysis.playerWinning.backgammon.toFixed(2)}%)`;
        playerLine.appendChild(playerLabel);
        playerLine.appendChild(playerStats);
        
        const opponentLine = document.createElement('div');
        opponentLine.className = 'cube-line winning-chances';
        const opponentLabel = document.createElement('span');
        opponentLabel.className = 'winning-label';
        opponentLabel.textContent = 'Opponent Winning Chances:';
        const opponentStats = document.createElement('span');
        opponentStats.className = 'winning-stats';
        opponentStats.textContent = `${analysis.opponentWinning.win.toFixed(2)}% (G:${analysis.opponentWinning.gammon.toFixed(2)}% B:${analysis.opponentWinning.backgammon.toFixed(2)}%)`;
        opponentLine.appendChild(opponentLabel);
        opponentLine.appendChild(opponentStats);
        
        winningDiv.appendChild(playerLine);
        winningDiv.appendChild(opponentLine);
        cubeDiv.appendChild(winningDiv);
    }
    
    // Cubeless equities (commented out for now)
    /*
    if (analysis.cubelessEquities) {
        const cubelessDiv = document.createElement('div');
        cubelessDiv.className = 'cube-section';
        
        const title = document.createElement('div');
        title.className = 'cube-title';
        title.textContent = 'Cubeless Equities:';
        
        const equityLine = document.createElement('div');
        equityLine.className = 'cube-line';
        const noDouble = analysis.cubelessEquities.noDouble >= 0 ? `+${analysis.cubelessEquities.noDouble.toFixed(3)}` : analysis.cubelessEquities.noDouble.toFixed(3);
        const double = analysis.cubelessEquities.double >= 0 ? `+${analysis.cubelessEquities.double.toFixed(3)}` : analysis.cubelessEquities.double.toFixed(3);
        equityLine.textContent = `No Double=${noDouble}, Double=${double}`;
        
        cubelessDiv.appendChild(title);
        cubelessDiv.appendChild(equityLine);
        cubeDiv.appendChild(cubelessDiv);
    }
    */
    
    // Cubeful equities
    if (analysis.cubefulEquities) {
        const cubefulDiv = document.createElement('div');
        cubefulDiv.className = 'cube-section';
        
        const title = document.createElement('div');
        title.className = 'cube-title';
        title.textContent = 'Cubeful Equities:';
        
        const equityTable = document.createElement('div');
        equityTable.className = 'equity-table';
        
        if (analysis.cubefulEquities.noDouble !== undefined) {
            const row = document.createElement('div');
            row.className = 'equity-row';
            let baseValue = analysis.cubefulEquities.noDouble >= 0 ? `+${analysis.cubefulEquities.noDouble.toFixed(3)}` : analysis.cubefulEquities.noDouble.toFixed(3);
            let diffValue = '';
            if (analysis.cubefulEquities.noDoubleDiff !== undefined) {
                const diff = analysis.cubefulEquities.noDoubleDiff >= 0 ? `+${analysis.cubefulEquities.noDoubleDiff.toFixed(3)}` : analysis.cubefulEquities.noDoubleDiff.toFixed(3);
                diffValue = ` (${diff})`;
            }
            // Use fixed-width formatting: label padded to 15 chars, then equity
            row.textContent = 'No double:'.padEnd(20) + baseValue + diffValue;
            equityTable.appendChild(row);
        }
        
        if (analysis.cubefulEquities.doubleTake !== undefined) {
            const row = document.createElement('div');
            row.className = 'equity-row';
            let baseValue = analysis.cubefulEquities.doubleTake >= 0 ? `+${analysis.cubefulEquities.doubleTake.toFixed(3)}` : analysis.cubefulEquities.doubleTake.toFixed(3);
            let diffValue = '';
            if (analysis.cubefulEquities.doubleTakeDiff !== undefined) {
                const diff = analysis.cubefulEquities.doubleTakeDiff >= 0 ? `+${analysis.cubefulEquities.doubleTakeDiff.toFixed(3)}` : analysis.cubefulEquities.doubleTakeDiff.toFixed(3);
                diffValue = ` (${diff})`;
            }
            row.textContent = 'Double/Take:'.padEnd(20) + baseValue + diffValue;
            equityTable.appendChild(row);
        }
        
        if (analysis.cubefulEquities.doubleBeaver !== undefined) {
            const row = document.createElement('div');
            row.className = 'equity-row';
            let baseValue = analysis.cubefulEquities.doubleBeaver >= 0 ? `+${analysis.cubefulEquities.doubleBeaver.toFixed(3)}` : analysis.cubefulEquities.doubleBeaver.toFixed(3);
            let diffValue = '';
            if (analysis.cubefulEquities.doubleBeaverDiff !== undefined) {
                const diff = analysis.cubefulEquities.doubleBeaverDiff >= 0 ? `+${analysis.cubefulEquities.doubleBeaverDiff.toFixed(3)}` : analysis.cubefulEquities.doubleBeaverDiff.toFixed(3);
                diffValue = ` (${diff})`;
            }
            row.textContent = 'Double/Beaver:'.padEnd(20) + baseValue + diffValue;
            equityTable.appendChild(row);
        }
        
        if (analysis.cubefulEquities.doublePass !== undefined) {
            const row = document.createElement('div');
            row.className = 'equity-row';
            let baseValue = analysis.cubefulEquities.doublePass >= 0 ? `+${analysis.cubefulEquities.doublePass.toFixed(3)}` : analysis.cubefulEquities.doublePass.toFixed(3);
            let diffValue = '';
            if (analysis.cubefulEquities.doublePassDiff !== undefined) {
                const diff = analysis.cubefulEquities.doublePassDiff >= 0 ? `+${analysis.cubefulEquities.doublePassDiff.toFixed(3)}` : analysis.cubefulEquities.doublePassDiff.toFixed(3);
                diffValue = ` (${diff})`;
            }
            row.textContent = 'Double/Pass:'.padEnd(20) + baseValue + diffValue;
            equityTable.appendChild(row);
        }
        
        cubefulDiv.appendChild(title);
        cubefulDiv.appendChild(equityTable);
        cubeDiv.appendChild(cubefulDiv);
    }
    
    // Best action
    if (analysis.bestAction) {
        const actionDiv = document.createElement('div');
        actionDiv.className = 'best-action';
        actionDiv.textContent = `Best Cube action: ${analysis.bestAction}`;
        cubeDiv.appendChild(actionDiv);
    }
    
    container.appendChild(cubeDiv);
}