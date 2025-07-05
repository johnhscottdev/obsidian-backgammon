import type { BoardData, Player } from '../types/board';

function charToCount(c: string): [number, Player | null] {
	if (c >= 'a' && c <= 'z') {
		return [c.charCodeAt(0) - 'a'.charCodeAt(0) + 1, 'O'];
	}
	if (c >= 'A' && c <= 'Z') {
		return [c.charCodeAt(0) - 'A'.charCodeAt(0) + 1, 'X'];
	}
	return [0, null];
}

function countCheckers(points: { checkerCount: number; player: Player | null }[], player: Player): number {
	return points
		.filter(p => p.player === player)
		.reduce((sum, p) => sum + p.checkerCount, 0);
}

export function parseXGID(xgid: string): BoardData {
	if (!xgid || typeof xgid !== 'string') {
		throw new Error('Invalid XGID: input must be a non-empty string');
	}

	const cleanXgid = xgid.trim();
	if (!cleanXgid.match(/^(XGID=)?[a-zA-Z-]+:[0-9]+:[-0-9]+:[-0-9]+:/)) {
		throw new Error('Invalid XGID format: does not match expected pattern');
	}

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
	let boardData:BoardData = {
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
	};


	return boardData;
}


// Original working for just checker play
// export function extractMoveBlocks(text: string): string[] {
// 	const moveBlockRegex = /^\s*\d+\..*?(?:\n\s{2,}Player:.*?\n\s{2,}Opponent:.*?)(?=\n\s*\d+\.|\n\n|$)/gms;
// 	const matches = [...text.matchAll(moveBlockRegex)].map((m) => m[0].trim());
// 	return matches;
//   }
  

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
  
