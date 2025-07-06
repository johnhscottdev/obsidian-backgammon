export type Player = 'X' | 'O';

export interface Point {
	checkerCount: number;
	player: Player | null;
}

export interface BackgammonPosition {
	points: {
		checkerCount: number;
		player: Player | null;
	}[];
	borneOffX:number;
	borneOffO:number;
	turn: Player;	
	cubeValue: number;
	cubeOwner:Player | 'Center';
	die1:number,
	die2:number,
	scoreX: number;
	scoreO: number;
	jacoby:boolean;
	beaver:boolean;
	matchLength: number;
	crawford:boolean;
	xgid: string;
}