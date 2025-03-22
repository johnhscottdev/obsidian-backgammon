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

export function parseXGID(xgid: string): BoardData {
	const parts = xgid.split(':');
	const pointString = parts[0].slice(5); // remove "XGID=" or "-"

	const points = pointString.split('').map(charToCount).reverse().map(([count, player]) => ({
		checkerCount: count,
		player,
	}));

	// Pad to 24 points if somehow shorter
	while (points.length < 24) {
		points.push({ checkerCount: 0, player: null });
	}

	return {
		points,
		bar: { X: 0, O: 0 },
		off: { X: 0, O: 0 }
	};
}
