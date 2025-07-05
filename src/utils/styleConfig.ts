export interface StyleConfig {
	// Board dimensions
	scale: number;
	boardWidth: number;
	boardHeight: number;
	boardColumns: number;
	
	// Layout dimensions
	columnWidth: number;
	barWidth: number;
	pointWidth: number;
	triangleHeight: number;
	checkerRadius: number;
	checkerMargin: number;
	barX: number;
	
	// Colors
	colors: {
		background: string;
		boardBorder: string;
		bar: string;
		triangleLight: string;
		triangleDark: string;
		checkerBlack: string;
		checkerWhite: string;
		cubeBackground: string;
		cubeBorder: string;
		scoreBackground: string;
		scoreBorder: string;
		text: string;
		pointNumber: string;
	};
	
	// Fonts
	fonts: {
		checkerLabel: string;
		scoreHeader: string;
		scoreValue: string;
		cubeValue: string;
		pointNumber: string;
	};
	
	// Sizing
	sizing: {
		borderWidth: number;
		strokeWidth: number;
		cubeSize: number;
		scoreMargin: number;
		dieCornerRadius: number;
		diePipRadius: number;
		unexplainedScaleError: number;
	};
	
	// Spacing
	spacing: {
		dieOffset: number;
		dieSpacing: number;
	};
}

export const styleConfig: StyleConfig = {
	scale: 1,
	boardWidth: 500,
	boardHeight: 440, // Expanded to accommodate point numbers outside board
	boardColumns: 6 + 6 + 3, // all 12 points, the bar, and the bear off trays
	
	get columnWidth() { return this.boardWidth / this.boardColumns; },
	get barWidth() { return this.columnWidth; },
	get pointWidth() { return this.columnWidth; },
	get triangleHeight() { return (this.boardHeight / 2) * 0.9; },
	get checkerRadius() { return this.columnWidth / 2; },
	get checkerMargin() { return this.boardWidth * 0.04; },
	get barX() { return this.boardWidth / 2; },
	
	colors: {
		background: '#ffffff',
		boardBorder: 'black',
		bar: '#000000',
		triangleLight: '#ffffff',
		triangleDark: '#cccccc',
		checkerBlack: 'black',
		checkerWhite: 'white',
		cubeBackground: 'white',
		cubeBorder: 'black',
		scoreBackground: 'white',
		scoreBorder: 'black',
		text: 'black',
		pointNumber: 'black',
	},
	
	fonts: {
		checkerLabel: 'bold 16px sans-serif',
		scoreHeader: 'bold 8px sans-serif',
		scoreValue: 'bold 16px sans-serif',
		cubeValue: 'bold 16px sans-serif',
		pointNumber: 'bold 16px sans-serif',
	},
	
	sizing: {
		borderWidth: 3,
		strokeWidth: 2,
		cubeSize: 5,
		scoreMargin: 6,
		dieCornerRadius: 0.15,
		diePipRadius: 0.1,
		unexplainedScaleError: 1.0,
	},
	
	spacing: {
		dieOffset: 2.5,
		dieSpacing: 1.2,
	},
};