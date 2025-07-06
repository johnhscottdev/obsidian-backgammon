import type { BackgammonPosition, Player } from '../types/board';

/**
 * Converts a character from XGID position string to checker count and player.
 * @param c - Character from XGID position string
 * @returns Tuple of [checker count, player] where:
 *   - lowercase letters (a-z) represent 1-26 checkers for player O
 *   - uppercase letters (A-Z) represent 1-26 checkers for player X
 *   - other characters represent empty points
 */
function charToCount(c: string): [number, Player | null] {
	if (c >= 'a' && c <= 'z') {
		return [c.charCodeAt(0) - 'a'.charCodeAt(0) + 1, 'O'];
	}
	if (c >= 'A' && c <= 'Z') {
		return [c.charCodeAt(0) - 'A'.charCodeAt(0) + 1, 'X'];
	}
	return [0, null];
}

/**
 * Counts the total number of checkers on the board for a specific player.
 * @param points - Array of point objects containing checker counts and player ownership
 * @param player - The player ('X' or 'O') to count checkers for
 * @returns Total number of checkers on the board for the specified player
 */
function countCheckers(points: { checkerCount: number; player: Player | null }[], player: Player): number {
	return points
		.filter(p => p.player === player)
		.reduce((sum, p) => sum + p.checkerCount, 0);
}

/**
 * Parses an XGID (eXtreme Gammon ID) string into structured board data.
 * 
 * XGID format: position:cube:turn:dice:scores:rules
 * - Position: Encoded using a-z (O player) and A-Z (X player) for checker counts
 * - Cube: owner:value encoding (0=center, 1=X, 2=O)
 * - Turn: Player to move (0=X, 1=O)
 * - Dice: Two-digit dice values or special codes (D=double, B=beaver, etc.)
 * - Scores: X:O format
 * - Rules: Bit flags for game rules (Jacoby, Crawford, etc.)
 * 
 * @param xgid - The XGID string to parse (with or without 'XGID=' prefix)
 * @returns BackgammonPosition object containing complete game state
 * @throws Error if XGID format is invalid or incomplete
 */
export function parseXGID(xgid: string): BackgammonPosition {
	if (!xgid || typeof xgid !== 'string') {
		throw new Error('Invalid XGID: input must be a non-empty string');
	}

	// Find the line that begins with "XGID="
	const lines = xgid.trim().split('\n');
	const xgidLine = lines.find(line => line.trim().startsWith('XGID='));
	
	if (!xgidLine) {
		throw new Error('No line found starting with "XGID="');
	}

	const cleanXgid = xgidLine.trim();
	if (!cleanXgid.match(/^XGID=[a-zA-Z\-]+:[0-9]+:-?[0-9]+:-?[0-9]+:/)) {
		throw new Error('Invalid XGID format: does not match expected pattern');
	}

	// Keep the full XGID string including "XGID=" prefix
	const xgidString = cleanXgid;
	const parts = cleanXgid.replace(/^XGID=/, '').split(':');
	
	if (parts.length < 9) {
		throw new Error(`Invalid XGID format: expected at least 9 parts, got ${parts.length}`);
	}

	const pointString = parts[0];	
	const cubeOwnerCode = parseInt(parts[2], 10); // 0 = center, 1 = X, 2 = O
	const cubeValue = Math.pow(2, parseInt(parts[1], 10)); // e.g., 1, 2, 4, 8, 16
	const turn = parseInt(parts[3], 10); // 0 = X, 1 = O	
	
	//5 Dice 63 bullet 00 player is to roll or double  
	//	D player has double, opponent must take or drop 
	//	B player has doubled, the opponent beavered,  
	//	R player has doubled, the opponent beavered and the player racconed. 
	//	xx player has roll the field contain both dice (11,35, etc..) 
	let die1=0;
	let die2=0;
	die1 = parseInt(parts[4][0]);
	die2 = parseInt(parts[4][1]);
	if(isNaN(die1))
		die1 = 0;
	if(isNaN(die2))
		die2 = 0;

	const scoreX = parseInt(parts[5], 10);
	const scoreO = parseInt(parts[6], 10);
	const rulesFlags = parseInt(parts[7], 10);
	const matchLength = parseInt(parts[8], 10);

	const cubeOwner: Player | 'Center' =
		cubeOwnerCode === 0 ? 'Center' : cubeOwnerCode === 1 ? 'X' : 'O';

	const points = pointString
		.split('')
		.map(charToCount)
		.reverse()
		.map(([count, player]) => ({
			checkerCount: count,
			player,
		}));

	const jacoby = rulesFlags % 2 === 1;
	const beaver = rulesFlags % 4 === 1;
	const crawford = matchLength > 0 && jacoby; // this flag is overloaded between money and match games
	
	const checkersOnBoardX = countCheckers(points, 'X');
	const checkersOnBoardO = countCheckers(points, 'O');
	const borneOffX = 15 - checkersOnBoardX;
	const borneOffO = 15 - checkersOnBoardO;
	let boardData:BackgammonPosition = {
		points,
		borneOffX,
		borneOffO,
		turn: turn === -1 ? 'O' : 'X',
		die1:die1,
		die2:die2,
		cubeOwner: cubeOwner,
		cubeValue: cubeOwner === 'Center' ? 64 : cubeValue,
		scoreX:scoreX,
		scoreO:scoreO,
		beaver:beaver,
		jacoby:jacoby,
		matchLength:matchLength,
		crawford:crawford,
		xgid: xgidString,
		pipCountX:0,
		pipCountO:0
	};

	boardData.pipCountX = calculatePipCount(boardData, 'X');
	boardData.pipCountO = calculatePipCount(boardData, 'O');


	return boardData;
}
	
	/**
	 * Calculates the pip count for a specific player.
	 * 
	 * The pip count is the total number of pips (points) a player needs to move
	 * to bear off all their checkers. For each checker, multiply its distance
	 * from the bear-off by the number of checkers on that point.
	 * 
	 * @param boardData - Complete board state
	 * @param player - Player to calculate pip count for ('X' or 'O')
	 * @returns Total pip count for the player
	 */
	function calculatePipCount(boardData: BackgammonPosition, player: 'X' | 'O'): number {
		let pipCount = 0;
		
		for (let i = 0; i < boardData.points.length; i++) {
			const point = boardData.points[i];
			if (point.player === player && point.checkerCount > 0) {
				let distance = 0;
				
				if (i === 0 || i === 25) {
					distance = 25; // Bar positions
				} else if (player === 'X') {
					distance = i; // For X player: point number = distance
				} else {
					distance = 25 - i; // For O player: reverse distance
				}
				
				pipCount += distance * point.checkerCount;
			}
		}
		
		return pipCount;
	}


/**
 * Extracts XG analysis blocks from text, handling both move analysis and general analysis formats.
 * 
 * First attempts to find numbered move blocks (e.g., "1. Move analysis...").
 * If no move blocks are found, extracts general analysis starting from "Analyzed in XG Roller+".
 * 
 * @param text - The text to search for analysis blocks
 * @returns Array of analysis block strings, or empty array if none found
 */
export function extractMoveBlocks(text: string): string[] {
  const moveBlockRegex = /^\s*\d+\..*?(?:\n\s{2,}Player:.*?\n\s{2,}Opponent:.*?)(?=\n\s*\d+\.|\n\n|$)/gms;
  const moveMatches = [...text.matchAll(moveBlockRegex)].map((m) => m[0].trim());

  if (moveMatches.length > 0) {
    return moveMatches;
  } else {
    // Match from "Analyzed in XG Roller+" up to but NOT including "eXtreme Gammon Version:"
    const analysisRegex = /Analyzed in XG Roller\+([\s\S]*?)^\s*eXtreme Gammon Version:/m;
    const match = text.match(analysisRegex);
    if (match) {
      const cleaned = "Analyzed in XG Roller+" + match[1].trim();
      return [cleaned];
    }
  }

  return [];
  }
  
