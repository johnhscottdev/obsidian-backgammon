import { AnalysisData, MoveAnalysis, CubeAnalysis, PlayerStats, MoveData } from '../types/analysis';

/**
 * Extracts analysis text from XGID code block content
 * Analysis text appears after the XGID line and board display
 */
export function extractAnalysisText(content: string): string | null {
    const lines = content.split('\n');
    const xgidIndex = lines.findIndex(line => line.trim().startsWith('XGID='));
    
    if (xgidIndex === -1) return null;
    
    // Look for analysis starting after the board display
    // Analysis typically starts with numbered moves or winning chances
    let analysisStart = -1;
    for (let i = xgidIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^\d+\.\s+/) || line.includes('Player Winning Chances:')) {
            analysisStart = i;
            break;
        }
    }
    
    if (analysisStart === -1) return null;
    
    return lines.slice(analysisStart).join('\n');
}

/**
 * Parses analysis text and returns structured data
 */
export function parseAnalysis(analysisText: string): AnalysisData | null {
    if (!analysisText) return null;
    
    // Determine if this is move analysis or cube analysis
    if (analysisText.includes('Player Winning Chances:')) {
        return parseCubeAnalysis(analysisText);
    } else if (analysisText.match(/^\s*\d+\.\s+/m)) {
        return parseMoveAnalysis(analysisText);
    }
    
    return null;
}

/**
 * Parses move analysis from eXtremeGammon format
 */
function parseMoveAnalysis(text: string): MoveAnalysis {
    const moves: MoveData[] = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Match move lines like "1. Book¹       Bar/20 13/11                 eq:+0.095"
        // Format: rank. analysisLevel [whitespace] move [whitespace] eq:equity (diff)
        const moveMatch = line.match(/^(\d+)\.\s+(.+?)\s+eq:([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
        
        if (moveMatch) {
            const [, rank, remainder, equity, equityDiff] = moveMatch;
            
            // Split the remainder into analysis level and move
            // The analysis level is typically at the beginning, followed by move notation
            const parts = remainder.trim().split(/\s+/);
            let analysisLevel = '';
            let move = '';
            
            // Find where the move starts (typically contains / or numbers)
            let moveStartIndex = -1;
            for (let j = 0; j < parts.length; j++) {
                if (parts[j].includes('/') || parts[j].includes('(') || /^\d/.test(parts[j])) {
                    moveStartIndex = j;
                    break;
                }
            }
            
            if (moveStartIndex > 0) {
                analysisLevel = parts.slice(0, moveStartIndex).join(' ');
                move = parts.slice(moveStartIndex).join(' ');
            } else {
                // Fallback - assume first part is analysis level
                analysisLevel = parts[0];
                move = parts.slice(1).join(' ');
            }
            
            // Look for player/opponent percentages on next lines
            let playerStats: PlayerStats | null = null;
            let opponentStats: PlayerStats | null = null;
            
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1].trim();
                const playerMatch = nextLine.match(/Player:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
                if (playerMatch) {
                    playerStats = {
                        win: parseFloat(playerMatch[1]),
                        gammon: parseFloat(playerMatch[2]),
                        backgammon: parseFloat(playerMatch[3])
                    };
                }
            }
            
            if (i + 2 < lines.length) {
                const opponentLine = lines[i + 2].trim();
                const opponentMatch = opponentLine.match(/Opponent:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
                if (opponentMatch) {
                    opponentStats = {
                        win: parseFloat(opponentMatch[1]),
                        gammon: parseFloat(opponentMatch[2]),
                        backgammon: parseFloat(opponentMatch[3])
                    };
                }
            }
            
            moves.push({
                rank: parseInt(rank),
                move: move.trim(),
                equity: parseFloat(equity),
                equityDiff: equityDiff ? parseFloat(equityDiff) : 0,
                analysisLevel: analysisLevel.trim(),
                playerStats,
                opponentStats
            });
        }
    }
    
    return {
        type: 'move',
        moves
    };
}

/**
 * Parses cube analysis from eXtremeGammon format
 */
function parseCubeAnalysis(text: string): CubeAnalysis {
    const lines = text.split('\n');
    
    let playerWinning: PlayerStats | null = null;
    let opponentWinning: PlayerStats | null = null;
    let cubelessEquities = null;
    let cubefulEquities = {};
    let bestAction: string | null = null;
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Player Winning Chances: 52.63% (G:14.77% B:0.69%)
        const playerMatch = trimmed.match(/Player Winning Chances:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
        if (playerMatch) {
            playerWinning = {
                win: parseFloat(playerMatch[1]),
                gammon: parseFloat(playerMatch[2]),
                backgammon: parseFloat(playerMatch[3])
            };
        }
        
        // Opponent Winning Chances: 47.37% (G:11.99% B:0.51%)
        const opponentMatch = trimmed.match(/Opponent Winning Chances:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
        if (opponentMatch) {
            opponentWinning = {
                win: parseFloat(opponentMatch[1]),
                gammon: parseFloat(opponentMatch[2]),
                backgammon: parseFloat(opponentMatch[3])
            };
        }
        
        // Cubeless Equities: No Double=+0.082, Double=+0.159
        const cubelessMatch = trimmed.match(/Cubeless Equities:\s+No Double=([\+\-]\d+\.\d+),\s+Double=([\+\-]\d+\.\d+)/);
        if (cubelessMatch) {
            cubelessEquities = {
                noDouble: parseFloat(cubelessMatch[1]),
                double: parseFloat(cubelessMatch[2])
            };
        }
        
        // Cubeful Equities - parse multiple lines
        if (trimmed.includes('No double:')) {
            const noDoubleMatch = trimmed.match(/No double:\s+([\+\-]\d+\.\d+)/);
            if (noDoubleMatch) {
                cubefulEquities = { ...cubefulEquities, noDouble: parseFloat(noDoubleMatch[1]) };
            }
        }
        
        if (trimmed.includes('Double/Take:')) {
            const takeMatch = trimmed.match(/Double\/Take:\s+([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
            if (takeMatch) {
                cubefulEquities = { 
                    ...cubefulEquities, 
                    doubleTake: parseFloat(takeMatch[1]),
                    doubleTakeDiff: takeMatch[2] ? parseFloat(takeMatch[2]) : undefined
                };
            }
        }
        
        if (trimmed.includes('Double/Beaver:')) {
            const beaverMatch = trimmed.match(/Double\/Beaver:\s+([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
            if (beaverMatch) {
                cubefulEquities = { 
                    ...cubefulEquities, 
                    doubleBeaver: parseFloat(beaverMatch[1]),
                    doubleBeaverDiff: beaverMatch[2] ? parseFloat(beaverMatch[2]) : undefined
                };
            }
        }
        
        if (trimmed.includes('Double/Pass:')) {
            const passMatch = trimmed.match(/Double\/Pass:\s+([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
            if (passMatch) {
                cubefulEquities = { 
                    ...cubefulEquities, 
                    doublePass: parseFloat(passMatch[1]),
                    doublePassDiff: passMatch[2] ? parseFloat(passMatch[2]) : undefined
                };
            }
        }
        
        // Best Cube action: No double / Beaver
        const actionMatch = trimmed.match(/Best Cube action:\s+(.+)/);
        if (actionMatch) {
            bestAction = actionMatch[1];
        }
    }
    
    return {
        type: 'cube',
        playerWinning,
        opponentWinning,
        cubelessEquities,
        cubefulEquities: Object.keys(cubefulEquities).length > 0 ? cubefulEquities : null,
        bestAction
    };
}