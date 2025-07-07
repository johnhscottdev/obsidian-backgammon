/**
 * Player statistics for winning chances
 */
export interface PlayerStats {
    win: number;      // Winning percentage
    gammon: number;   // Gammon percentage
    backgammon: number; // Backgammon percentage
}

/**
 * Individual move analysis data
 */
export interface MoveData {
    rank: number;           // Move ranking (1, 2, 3, etc.)
    move: string;           // Move notation (e.g., "Bar/20 13/11")
    equity: number;         // Equity value
    equityDiff: number;     // Difference from best move (0 for best move)
    analysisLevel: string;  // Analysis level (e.g., "Book", "4-ply", "XG Roller++")
    playerStats: PlayerStats | null;    // Player winning chances
    opponentStats: PlayerStats | null;  // Opponent winning chances
}

/**
 * Move analysis data structure
 */
export interface MoveAnalysis {
    type: 'move';
    moves: MoveData[];
}

/**
 * Cube analysis equities
 */
export interface CubelessEquities {
    noDouble: number;
    double: number;
}

export interface CubefulEquities {
    noDouble?: number;
    doubleTake?: number;
    doubleTakeDiff?: number;
    doubleBeaver?: number;
    doubleBeaverDiff?: number;
    doublePass?: number;
    doublePassDiff?: number;
}

/**
 * Cube analysis data structure
 */
export interface CubeAnalysis {
    type: 'cube';
    playerWinning: PlayerStats | null;
    opponentWinning: PlayerStats | null;
    cubelessEquities: CubelessEquities | null;
    cubefulEquities: CubefulEquities | null;
    bestAction: string | null;
}

/**
 * Union type for all analysis data
 */
export type AnalysisData = MoveAnalysis | CubeAnalysis;