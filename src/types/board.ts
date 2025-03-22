export type Player = 'X' | 'O';

export interface Point {
	checkerCount: number;
	player: Player | null;
}

export interface BoardData {
	points: Point[]; // Index 0 = point 1, up to 23 = point 24
	bar: {
		X: number;
		O: number;
	};
	off: {
		X: number;
		O: number;
	};
}
