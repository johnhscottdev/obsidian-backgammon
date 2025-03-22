// src/types/board.ts

export interface CheckerPosition {
	point: number; // 1 to 24 (or 0/bar/off)
	count: number; // how many checkers on that point
}

export interface BoardData {
	X: CheckerPosition[]; // Player X's checkers
	O: CheckerPosition[]; // Player O's checkers
}
