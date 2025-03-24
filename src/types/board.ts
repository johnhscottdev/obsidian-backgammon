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
	borneOffX:number;
	borneOffO:number;
	turn: Player;
	cubeValue: number;
	cubeOwner:Player | 'Center';
	scoreX: number;
	scoreO: number;
	matchLength: number;
}