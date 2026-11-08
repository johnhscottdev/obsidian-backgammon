export type Player = 'X' | 'O';

export type CubeAction = 'doubled' | 'beavered' | 'raccooned';

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
	pipCountX:number;
	pipCountO:number;
	/**
	 * Set when a double has been offered (XGID dice field D, B or R). `turn` is the player who
	 * doubled. doubled = opponent to take or pass; beavered = opponent beavered;
	 * raccooned = the doubler then raccooned.
	 */
	cubeAction?: CubeAction;
	/** True when the XGID turn field is not 1 or -1; `turn` is then only a drawing default. */
	turnUnknown?: boolean;
	/** Problems with the XGID that don't stop it from being drawn. */
	warnings?: string[];
}