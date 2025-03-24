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
	const parts = xgid.replace(/^XGID=/, '').split(':');

	const pointString = parts[0];	
	const cubeOwnerCode = parseInt(parts[2], 10); // 0 = center, 1 = X, 2 = O
	const cubeValue = Math.pow(2, parseInt(parts[1], 10)); // e.g., 1, 2, 4, 8, 16
	const turn = parseInt(parts[3], 10); // 0 = X, 1 = O	
	const die1 = parseInt(parts[4][0]);
	const die2 = parseInt(parts[4][1]);
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
	
	const checkersOnBoardX = countCheckers(points, 'X');
	const checkersOnBoardO = countCheckers(points, 'O');
	const borneOffX = 15 - checkersOnBoardX;
	const borneOffO = 15 - checkersOnBoardX;
	let boardData:BoardData = {
		points,
		borneOffX,
		borneOffO,
		turn: turn === -1 ? 'X' : 'O',
		die1:die1,
		die2:die2,
		cubeOwner: cubeOwner,
		cubeValue: cubeOwner === 'Center' ? 64 : cubeValue,
		scoreX:scoreX,
		scoreO:scoreO,
		beaver:beaver,
		jacoby:jacoby,
		matchLength:matchLength,
	};


	return boardData;
}
