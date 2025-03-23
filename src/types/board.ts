export type Player = 'X' | 'O';

export interface Point {
	checkerCount: number;
	player: Player | null;
}

export interface BoardData {
	points: {
		checkerCount: number;
		player: Player | null;
	}[];
	turn?: Player;
	cube?: {
		value: number;
		owner: Player | 'Center';
	};
	score?: {
		X: number;
		O: number;
	};
	matchLength?: number;
}