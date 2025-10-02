import { AnalysisData, MoveAnalysis, CubeAnalysis, MoveData } from '../types/analysis';

/**
 * Helper function to determine move classification based on equity difference
 */
function getMoveClass(equityDiff: number): string {
    const absEquityDiff = Math.abs(equityDiff);

    if (absEquityDiff < 0.02) {
        return 'good';
    } else if (absEquityDiff < 0.08) {
        return 'error';
    } else {
        return 'blunder';
    }
}

/**
 * Renders analysis data as HTML content
 */
export function renderAnalysis(analysis: AnalysisData): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'backgammon-analysis';

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
        moveText.className += ' move-' + getMoveClass(move.equityDiff);
        
        const moveNotation = `${move.rank}. ${move.move}`;
        moveText.textContent = moveNotation;
        
        const equityText = document.createElement('span');
        equityText.className = 'move-equity';
        equityText.className += ' move-' + getMoveClass(move.equityDiff);
        
        let equityDisplay = move.equity >= 0 ? `+${move.equity.toFixed(3)}` : move.equity.toFixed(3);
        if (move.equityDiff !== 0) {
            const diffDisplay = move.equityDiff >= 0 ? `+${move.equityDiff.toFixed(3)}` : move.equityDiff.toFixed(3);
            equityDisplay += ` (${diffDisplay})`;
        }
        equityText.textContent = equityDisplay;
        
        moveLine.appendChild(moveText);
        moveLine.appendChild(equityText);
        moveDiv.appendChild(moveLine);
        
        // Player stats (disabled for now - uncomment line below to enable)
        // renderMoveStats(moveDiv, move);
        
        container.appendChild(moveDiv);
    });
}

/**
 * Renders move statistics (winning chances) for a single move
 */
// @ts-ignore - Function kept for easy re-enabling
function renderMoveStats(moveDiv: HTMLDivElement, move: MoveData): void {
    if (move.playerStats) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'move-stats';
        
        
        const playerStats = document.createElement('div');
        playerStats.className = 'stats-line move-' + getMoveClass(move.equityDiff);

        const playerLabel = document.createElement('span');
        playerLabel.className = 'stats-label';
        playerLabel.textContent = 'P:';

        const playerWin = document.createElement('span');
        playerWin.className = 'stats-number';
        playerWin.textContent = move.playerStats.win.toFixed(1);

        const playerGammon = document.createElement('span');
        playerGammon.className = 'stats-number';
        playerGammon.textContent = move.playerStats.gammon.toFixed(1);

        const playerBackgammon = document.createElement('span');
        playerBackgammon.className = 'stats-number';
        playerBackgammon.textContent = move.playerStats.backgammon.toFixed(1);

        playerStats.appendChild(playerLabel);
        playerStats.appendChild(playerWin);
        playerStats.appendChild(playerGammon);
        playerStats.appendChild(playerBackgammon);
        
        const opponentStats = document.createElement('div');
        opponentStats.className = 'stats-line move-' + getMoveClass(move.equityDiff);

        const opponentLabel = document.createElement('span');
        opponentLabel.className = 'stats-label';
        opponentLabel.textContent = 'O:';

        const opponentWin = document.createElement('span');
        opponentWin.className = 'stats-number';
        opponentWin.textContent = move.opponentStats?.win.toFixed(1) || '0.0';

        const opponentGammon = document.createElement('span');
        opponentGammon.className = 'stats-number';
        opponentGammon.textContent = move.opponentStats?.gammon.toFixed(1) || '0.0';

        const opponentBackgammon = document.createElement('span');
        opponentBackgammon.className = 'stats-number';
        opponentBackgammon.textContent = move.opponentStats?.backgammon.toFixed(1) || '0.0';

        opponentStats.appendChild(opponentLabel);
        opponentStats.appendChild(opponentWin);
        opponentStats.appendChild(opponentGammon);
        opponentStats.appendChild(opponentBackgammon);
        
        statsContainer.appendChild(playerStats);
        statsContainer.appendChild(opponentStats);
        moveDiv.appendChild(statsContainer);
    }
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