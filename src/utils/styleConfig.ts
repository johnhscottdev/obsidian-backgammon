/** Every colour the board canvas uses. */
export interface BoardColors {
	background: string;
	boardBorder: string;
	triangleLight: string;
	triangleDark: string;
	checkerBlack: string;
	checkerWhite: string;
	checkerBorderBlack: string;
	checkerBorderWhite: string;
	/** Black checkers need a heavier outline on a dark board */
	checkerBorderWidthBlack: number;
	cubeBackground: string;
	cubeBorder: string;
	cubeText: string;
	scoreBackground: string;
	scoreBorder: string;
	scoreHeader: string;
	scoreValue: string;
	pointNumber: string;
	pipCountBackground: string;
	pipCountBorder: string;
	pipCount: string;
}

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
	
	// Colors: light palette, and the dark one used when Obsidian is in its dark theme
	colors: BoardColors;
	darkColors: BoardColors;
	
	// Fonts
	fonts: {
		checkerLabel: string;
		scoreHeader: string;
		scoreValue: string;
		cubeValue: string;
		pointNumber: string;
		pipCount: string;
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
	get triangleHeight() { return (this.boardHeight - 40) / 2 - this.columnWidth / 2; },
	get checkerRadius() { return this.columnWidth / 2; },
	get checkerMargin() { return this.boardWidth * 0.04; },
	get barX() { return this.boardWidth / 2; },
	
	colors: {
		background: '#ffffff',
		boardBorder: 'black',
		triangleLight: '#ffffff',
		triangleDark: '#cccccc',
		checkerBlack: 'black',
		checkerWhite: 'white',
		checkerBorderBlack: '#999999',
		checkerBorderWhite: '#666666',
		checkerBorderWidthBlack: 0.5,
		cubeBackground: '#ffffff',
		cubeBorder: '#cccccc',
		cubeText: '#333333',
		scoreBackground: '#ffffff',
		scoreBorder: '#d0d0d0',
		scoreHeader: '#666666',
		scoreValue: '#333333',
		pointNumber: '#555555',
		pipCountBackground: 'rgba(255, 255, 255, 0.9)',
		pipCountBorder: 'rgba(0, 0, 0, 0.15)',
		pipCount: '#444444',
	},

	darkColors: {
		background: '#2b2b2b',
		boardBorder: '#8c8c8c',
		triangleLight: '#3a3a3a',
		triangleDark: '#5c6168',
		checkerBlack: '#111111',
		checkerWhite: '#eeeeee',
		checkerBorderBlack: '#b0b0b0',
		checkerBorderWhite: '#808080',
		checkerBorderWidthBlack: 1.5,
		cubeBackground: '#eeeeee',
		cubeBorder: '#999999',
		cubeText: '#222222',
		scoreBackground: '#383838',
		scoreBorder: '#5a5a5a',
		scoreHeader: '#a8a8a8',
		scoreValue: '#e6e6e6',
		pointNumber: '#a0a0a0',
		pipCountBackground: 'rgba(60, 60, 60, 0.95)',
		pipCountBorder: 'rgba(255, 255, 255, 0.2)',
		pipCount: '#dddddd',
	},
	
	fonts: {
		checkerLabel: 'bold 16px "Segoe UI", system-ui, sans-serif',
		scoreHeader: '600 9px "Segoe UI", system-ui, sans-serif',
		scoreValue: 'bold 17px "Segoe UI", system-ui, sans-serif',
		cubeValue: 'bold 18px "Segoe UI", system-ui, sans-serif',
		pointNumber: '600 13px "Segoe UI", system-ui, sans-serif',
		pipCount: '600 13px "Segoe UI", system-ui, sans-serif',
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