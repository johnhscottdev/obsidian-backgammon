export type Player = 'X' | 'O';

export interface Point {
	checkerCount: number;
	player: Player | null;
}

export interface BoardData {
	points: Point[];
}
