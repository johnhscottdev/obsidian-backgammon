import type { BoardData } from '../types/board';
import { styleConfig } from './styleConfig';

/**
 * Renders a backgammon board to a canvas element within the provided HTML element.
 * 
 * Creates a responsive canvas that scales based on container width and uses ResizeObserver
 * to handle dynamic resizing. Renders the complete game state including board, checkers,
 * dice, doubling cube, and match scores.
 * 
 * @param el - The HTML element to contain the canvas
 * @param boardData - Complete board state data including positions, cube, scores, etc.
 */
export function renderBoard(el: HTMLElement, boardData: BoardData): void {
	const canvas: HTMLCanvasElement = document.createElement('canvas');
	el.appendChild(canvas);
	const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

	if (!ctx) return;
	let scaleFactor = 1;

	const getCanvasContainerWidth = (): number => {
		return canvas.parentElement?.clientWidth || window.innerWidth;
	};

	const resizeCanvas = () => {
		let noteWidth = getCanvasContainerWidth();

		scaleFactor = noteWidth / styleConfig.boardWidth;
		scaleFactor *= styleConfig.sizing.unexplainedScaleError;
		scaleFactor = Math.min(scaleFactor, 1);

		canvas.width = styleConfig.boardWidth * scaleFactor;
		canvas.height = styleConfig.boardHeight * scaleFactor;

		ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBoard(ctx); // draw triangles/background
		renderPointNumbers(ctx); // draw point numbers
		drawCheckers(ctx, boardData); // now using points[]

		const boardTop = 20;
		const boardBottom = styleConfig.boardHeight - 20;
		const boardHeight = boardBottom - boardTop;
		let cubeY = boardTop + boardHeight/2;
		if(boardData.cubeOwner === 'X')
			cubeY = boardBottom - styleConfig.checkerMargin;
		else if (boardData.cubeOwner === 'O')
			cubeY = boardTop + styleConfig.checkerMargin;

		let cubeValue = boardData.cubeValue.toString();
		if(boardData.crawford)
			cubeValue = "Cr";
		drawCubeAtPosition(ctx, styleConfig.columnWidth/2, cubeY, cubeValue);

		const dieColor = boardData.turn === 'X' ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite
		//if(boardData.die1 > 0 && boardData.die2 > 0)
		{	
			let dieOffset = styleConfig.columnWidth * styleConfig.spacing.dieOffset;
			let dieSpacing = styleConfig.spacing.dieSpacing;
			if(boardData.turn === 'O')
			{
				dieOffset *= -1;
				dieSpacing *= -1;
			}

			let dieSize = styleConfig.checkerRadius*2;
			drawDieAtPosition(ctx, styleConfig.boardWidth/2+dieOffset, boardTop + boardHeight/2, dieSize, boardData.die1, dieColor);
			drawDieAtPosition(ctx, styleConfig.boardWidth/2+dieOffset + dieSize * dieSpacing, boardTop + boardHeight/2, dieSize, boardData.die2, dieColor);
		}

		if(boardData.matchLength > 0)
		{
			const scoreX = styleConfig.boardWidth - styleConfig.columnWidth/2;
			drawScoreAtPosition(ctx, scoreX , boardTop + styleConfig.checkerRadius*styleConfig.sizing.scoreMargin, boardData.scoreO, "White");
			drawScoreAtPosition(ctx, scoreX, boardBottom - styleConfig.checkerRadius*styleConfig.sizing.scoreMargin, boardData.scoreX, "Black");
			drawScoreAtPosition(ctx, scoreX, boardTop + boardHeight/2, boardData.matchLength, "Length");
		}
	};

	const observer = new ResizeObserver(() => {
		resizeCanvas(); // your resize logic
	});
	observer.observe(canvas.parentElement!);
	//resizeCanvas();
}

/**
 * Draws the backgammon board background including triangular points and borders.
 * 
 * Renders the board structure with alternating colored triangles for points,
 * the central bar, and bearoff areas. Uses a 15-column layout with proper
 * spacing for the standard backgammon board.
 * 
 * @param ctx - 2D canvas rendering context
 */
function drawBoard(ctx: CanvasRenderingContext2D): void {
	// clear the canvas
	ctx.fillStyle = styleConfig.colors.background;
	ctx.strokeStyle = styleConfig.colors.boardBorder;
	ctx.lineWidth = 1;
	ctx.fillRect(0, 0, styleConfig.boardWidth, styleConfig.boardHeight);

	// Define the actual board area (excluding space for point numbers)
	const boardTop = 20;
	const boardBottom = styleConfig.boardHeight - 20;
	const boardHeight = boardBottom - boardTop;

	// draw the bar
	ctx.fillStyle = styleConfig.colors.bar;
	ctx.strokeRect(styleConfig.boardWidth / 2 - styleConfig.barWidth / 2, boardTop, styleConfig.barWidth, boardHeight);
	ctx.strokeRect(0, boardTop, styleConfig.barWidth, boardHeight);
	ctx.strokeRect(styleConfig.boardWidth-styleConfig.columnWidth, boardTop, styleConfig.barWidth, boardHeight);

	const colors = [styleConfig.colors.triangleDark, styleConfig.colors.triangleLight];

	const drawTriangle = (x: number, isBottomHalf: boolean, color: string) => {
		ctx.beginPath();
		if (isBottomHalf) {
			ctx.moveTo(x, boardBottom);
			ctx.lineTo(x + styleConfig.pointWidth / 2, boardBottom - styleConfig.triangleHeight);
			ctx.lineTo(x + styleConfig.pointWidth, boardBottom);
		} else {
			ctx.moveTo(x, boardTop);
			ctx.lineTo(x + styleConfig.pointWidth / 2, boardTop + styleConfig.triangleHeight);
			ctx.lineTo(x + styleConfig.pointWidth, boardTop);
		}
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.strokeStyle = styleConfig.colors.boardBorder;
		ctx.lineWidth = styleConfig.sizing.strokeWidth;
		ctx.stroke();
		ctx.fill();
	};

	for (let i = 0; i < 12; i++) {
		let x = i * styleConfig.pointWidth;
		x += styleConfig.columnWidth; // offset for bear off tray
		if (i >= 6) x += styleConfig.barWidth;
		let quadrantIndex = i < 6 ? 0 : 1;
		let color = colors[(i+1) % 2];
		drawTriangle(x, true, color);
	}

	for (let i = 0; i < 12; i++) {
		let x = i * styleConfig.pointWidth;
		x += styleConfig.columnWidth; // offset for bear off tray
		if (i >= 6) x += styleConfig.barWidth;
		let quadrantIndex = i < 6 ? 3 : 2;
		let color = colors[i % 2];
		drawTriangle(x, false, color);
	}

	ctx.lineWidth = styleConfig.sizing.borderWidth;
	ctx.strokeRect(0, boardTop, styleConfig.boardWidth, boardHeight);
}

/**
 * Draws text labels on checkers (typically used for borne-off checker counts).
 * 
 * @param ctx - 2D canvas rendering context
 * @param x - X coordinate for label center
 * @param y - Y coordinate for label center
 * @param text - Text to display on the checker
 * @param checkerColor - Color of the text ('black' or 'white')
 */
function drawCheckerLabel(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, checkerColor: 'black' | 'white'): void {
	ctx.font = styleConfig.fonts.checkerLabel;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = checkerColor;
	ctx.fillText(text, x, y);
}
/**
 * Draws a score display box showing match scores or match length.
 * 
 * @param ctx - 2D canvas rendering context
 * @param xPos - X coordinate for score box center
 * @param yPos - Y coordinate for score box center
 * @param score - Numeric score value to display
 * @param header - Header text (e.g., "White", "Black", "Length")
 */
function drawScoreAtPosition(ctx: CanvasRenderingContext2D, xPos:number, yPos:number, score:number, header:string)
{
	const sizeX = styleConfig.columnWidth;
	const sizeY = sizeX + styleConfig.checkerRadius;
	ctx.fillStyle = styleConfig.colors.scoreBackground;
	ctx.strokeStyle = styleConfig.colors.scoreBorder;
	ctx.fillRect(xPos-sizeX/2, yPos-sizeY/2, sizeX, sizeY);

	ctx.lineWidth = 1;
	ctx.strokeRect(xPos-sizeX/2, yPos-sizeY/2, sizeX, sizeY);		
	
	ctx.font = styleConfig.fonts.scoreHeader;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = styleConfig.colors.text;
	ctx.fillText(header, xPos, yPos-styleConfig.checkerRadius*.5);

	ctx.font = styleConfig.fonts.scoreValue;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = styleConfig.colors.text;
	ctx.fillText(score.toString(), xPos, yPos + styleConfig.checkerRadius*.5);
}

/**
 * Draws the doubling cube at a specified position.
 * 
 * @param ctx - 2D canvas rendering context
 * @param xPos - X coordinate for cube center
 * @param yPos - Y coordinate for cube center
 * @param cubeValue - Value to display on cube (number or "Cr" for Crawford)
 */
function drawCubeAtPosition(ctx: CanvasRenderingContext2D, xPos:number, yPos:number, cubeValue:string)
{
	const size = styleConfig.columnWidth - styleConfig.sizing.cubeSize;
	ctx.fillStyle = styleConfig.colors.cubeBackground;
	ctx.strokeStyle = styleConfig.colors.cubeBorder;
	ctx.fillRect(xPos-size/2, yPos-size/2, size, size);
	ctx.strokeRect(xPos-size/2, yPos-size/2, size, size);		
	
	ctx.font = styleConfig.fonts.cubeValue;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = styleConfig.colors.text;
	ctx.fillText(cubeValue, xPos, yPos);
}

/**
 * Draws a die with the specified value and color at the given position.
 * 
 * Renders a rounded rectangle die with appropriate pip patterns for values 1-6.
 * Value 0 results in a blank die (no pips displayed).
 * 
 * @param ctx - 2D canvas rendering context
 * @param x - X coordinate for die center
 * @param y - Y coordinate for die center
 * @param size - Size of the die (width/height)
 * @param value - Die value (0-6, where 0 shows no pips)
 * @param color - Background color of the die
 */
function drawDieAtPosition(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, value: number, color:string) {
	// Clamp value between 1 and 6
	const dieValue = Math.max(1, Math.min(value, 6));

	const radius = size / 2;
	const pipRadius = size * styleConfig.sizing.diePipRadius;

	// Draw die background
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.strokeStyle = color === styleConfig.colors.checkerWhite ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite ;
	ctx.lineWidth = styleConfig.sizing.strokeWidth;
	ctx.roundRect(x - radius, y - radius, size, size, size * styleConfig.sizing.dieCornerRadius);
	ctx.fill();
	ctx.stroke();

	// Pip positions (relative to center)
	const offsets = [
		[-0.3, -0.3],
		[ 0.3,  0.3],
		[ 0.3, -0.3],
		[-0.3,  0.3],
		[-0.3,  0],
		[ 0.3,  0],
		[ 0,    0]
	];

	const pipMap: Record<number, number[][]> = {
		1: [[6]],
		2: [[0], [1]],
		3: [[0], [1], [6]],
		4: [[0], [1], [2], [3]],
		5: [[0], [1], [2], [3], [6]],
		6: [[0], [1], [2], [3], [4], [5]],
	};

	if(value != 0)
	{
		// Draw pips
		ctx.fillStyle = color === styleConfig.colors.checkerWhite ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite ;
		for (const group of pipMap[dieValue]) {
			for (const i of group) {
				const [dx, dy] = offsets[i];
				ctx.beginPath();
				ctx.arc(x + dx * size, y + dy * size, pipRadius, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}
}

/**
 * Draws a single checker at the specified position.
 * 
 * @param ctx - 2D canvas rendering context
 * @param xPos - X coordinate for checker center
 * @param yPos - Y coordinate for checker center
 * @param color - Color of the checker
 */
function drawCheckerAtPosition(ctx: CanvasRenderingContext2D, xPos:number, yPos:number, color:string)
{
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(xPos, yPos, styleConfig.checkerRadius, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.strokeStyle = styleConfig.colors.boardBorder;
	ctx.stroke();		
}

/**
 * Draws all checkers on the board based on the current board state.
 * 
 * Renders checkers for all 26 points (including bar positions 0 and 25),
 * handles stacking of multiple checkers, and draws borne-off checkers
 * in the bearoff areas with count labels.
 * 
 * @param ctx - 2D canvas rendering context
 * @param boardData - Complete board state containing checker positions
 */
/**
 * Renders point numbers on the board for all 24 points.
 * 
 * Point numbers are displayed at the bottom of each triangle point, using the 
 * standard backgammon numbering system (1-24). Numbers are positioned to avoid
 * overlapping with checkers and triangles.
 * 
 * @param ctx - 2D canvas rendering context
 */
function renderPointNumbers(ctx: CanvasRenderingContext2D): void {
	// Helper to get x-position from point number (1–24)
	const getPointX = (pointNumber: number): number => {
		let index = 0;
		const centerOfPoint = (styleConfig.pointWidth / 2);
		
		if (pointNumber > 12) {
			index = pointNumber - 12;
		} else {
			index = 13 - pointNumber;
		}
		
		// Account for the bar
		if (index > 6) {
			index++;
		}
		
		// Account for leftmost bearoff tray
		index++;
		
		return (index * styleConfig.pointWidth) - centerOfPoint;
	};

	ctx.font = styleConfig.fonts.pointNumber;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = styleConfig.colors.pointNumber;

	// Draw point numbers 1-24
	for (let pointNumber = 1; pointNumber <= 24; pointNumber++) {
		const x = getPointX(pointNumber);
		
		// Position numbers outside the board area
		const isTopRow = pointNumber > 12;
		const y = isTopRow ? 
			10 : // Above the board
			styleConfig.boardHeight - 10; // Below the board
		
		ctx.fillText(pointNumber.toString(), x, y);
	}
}

export function drawCheckers(ctx: CanvasRenderingContext2D, boardData: BoardData): void {

	// Helper to get x-position from point number (1–24)
	const getPointX = (absolutePointNumber: number): number => {
		let index=0;
		const centerOfPoint = (styleConfig.pointWidth / 2);
		if(absolutePointNumber == 0 || absolutePointNumber == 25)
			return (8 * styleConfig.pointWidth) - centerOfPoint;

		if(absolutePointNumber > 12)
			index = absolutePointNumber - 12;
		else
			index = 13 - absolutePointNumber;
		
		//account for the bar
		if(index > 6)
			index++;		
		
		// account for leftmost bearoff tray
		index++;		
		
		
		return (index * styleConfig.pointWidth) - centerOfPoint;
	};

	for (let i = 0; i < boardData.points.length; i++)
	{
		let point = boardData.points[i];
		if (!point.player || point.checkerCount === 0) 
			continue;
		
		let absolutePointNumber = i;
		let playerPointNumber = 24 - i;
		if(point.player==='O')
			playerPointNumber = i;
		
		const isTop = absolutePointNumber <= 12;
		const onBar = absolutePointNumber === 0 || absolutePointNumber === 25;
		const x = getPointX(absolutePointNumber);
		let margin = styleConfig.checkerMargin;
		if(onBar)
			margin += styleConfig.checkerRadius;
		const boardTop = 20;
		const boardBottom = styleConfig.boardHeight - 20;
		const yStart = isTop ? boardTop + margin : boardBottom - margin;
		
		const direction = isTop ? 1 : -1;
		ctx.lineWidth = 1;

		for (let j = 0; j < point.checkerCount; j++) {
			let checkerColor = point.player === 'X' ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite;
			let xPos = x;
			let yPos = yStart + direction * j * styleConfig.checkerRadius*2;
			drawCheckerAtPosition(ctx, xPos, yPos, checkerColor);
			//drawCheckerLabel(ctx, xPos, yPos, absolutePointNumber.toString(), point.player === 'X' ? 'black' : 'white');
		}
	};

	
	if(boardData.borneOffX > 0)
	{
		const xPos = (styleConfig.boardColumns * styleConfig.columnWidth) - styleConfig.columnWidth * .5;
		const boardBottom = styleConfig.boardHeight - 20;
		const yPos = boardBottom - (styleConfig.checkerMargin + styleConfig.checkerRadius);
		drawCheckerAtPosition(ctx, xPos, yPos, styleConfig.colors.checkerBlack);
		drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffX.toString(), styleConfig.colors.checkerWhite);
	}
	if(boardData.borneOffO > 0)
	{
		const xPos = (styleConfig.boardColumns * styleConfig.columnWidth) - styleConfig.columnWidth * .5;
		const boardTop = 20;
		const yPos = boardTop + styleConfig.checkerMargin + styleConfig.checkerRadius;
		drawCheckerAtPosition(ctx, xPos, yPos, styleConfig.colors.checkerWhite);
		drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffO.toString(), styleConfig.colors.checkerBlack);
	}
}


