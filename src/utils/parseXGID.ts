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

//XGID=-b----E-C---eE---c-e----B-:0:0:1:65:0:0:3:0:10

export function parseXGID(xgid: string): BoardData {
	const parts = xgid.split(':');
	const pointString = parts[0].slice(5); // remove "XGID=" or "-"

	const points = pointString.split('').map(charToCount).reverse().map(([count, player]) => ({
		checkerCount: count,
		player,
	}));

	return {
		points,
	};
}
