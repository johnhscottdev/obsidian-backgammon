import { AnalysisData, MoveAnalysis, CubeAnalysis } from '../types/analysis';

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
        playerLabel.textContent = 'Player winning chances:';
        const playerStats = document.createElement('span');
        playerStats.className = 'winning-stats';
        playerStats.textContent = `${analysis.playerWinning.win.toFixed(2)}% (G:${analysis.playerWinning.gammon.toFixed(2)}% B:${analysis.playerWinning.backgammon.toFixed(2)}%)`;
        playerLine.appendChild(playerLabel);
        playerLine.appendChild(playerStats);
        
        const opponentLine = document.createElement('div');
        opponentLine.className = 'cube-line winning-chances';
        const opponentLabel = document.createElement('span');
        opponentLabel.className = 'winning-label';
        opponentLabel.textContent = 'Opponent winning chances:';
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
        title.textContent = 'Cubeful equities:';
        
        const equityTable = document.createElement('div');
        equityTable.className = 'equity-table';
        
        const eq = analysis.cubefulEquities;
        // XG says "redouble" once the cube is owned; show its wording
        const verb = eq.redouble ? 'Redouble' : 'Double';
        const rows: [string, number | undefined, number | undefined][] = [
            [`No ${verb.toLowerCase()}:`, eq.noDouble, eq.noDoubleDiff],
            [`${verb}/Take:`, eq.doubleTake, eq.doubleTakeDiff],
            [`${verb}/Beaver:`, eq.doubleBeaver, eq.doubleBeaverDiff],
            [`${verb}/Pass:`, eq.doublePass, eq.doublePassDiff],
        ];
        for (const [label, equity, diff] of rows) {
            if (equity === undefined) continue;
            const row = document.createElement('div');
            row.className = 'equity-row';
            // Fixed-width formatting: label padded to 20 chars, then equity and optional diff
            const diffText = diff !== undefined ? ` (${formatSigned(diff)})` : '';
            row.textContent = label.padEnd(20) + formatSigned(equity) + diffText;
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
        actionDiv.textContent = `Best cube action: ${analysis.bestAction}`;
        cubeDiv.appendChild(actionDiv);
    }
    
    container.appendChild(cubeDiv);
}

/** Formats an equity with an explicit sign and 3 decimals, e.g. +0.582 or -0.133. */
function formatSigned(value: number): string {
    return value >= 0 ? `+${value.toFixed(3)}` : value.toFixed(3);
}
