import type { BoardData } from '../types/board';
import { styleConfig } from './styleConfig';

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
		drawCheckers(ctx, boardData); // now using points[]

		let cubeY = styleConfig.boardHeight/2;
		if(boardData.cubeOwner === 'X')
			cubeY = styleConfig.boardHeight - styleConfig.checkerMargin;
		else if (boardData.cubeOwner === 'O')
			cubeY = styleConfig.checkerMargin;

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
			drawDieAtPosition(ctx, styleConfig.boardWidth/2+dieOffset, styleConfig.boardHeight/2, dieSize, boardData.die1, dieColor);
			drawDieAtPosition(ctx, styleConfig.boardWidth/2+dieOffset + dieSize * dieSpacing, styleConfig.boardHeight/2, dieSize, boardData.die2, dieColor);
		}

		if(boardData.matchLength > 0)
		{
			const scoreX = styleConfig.boardWidth - styleConfig.columnWidth/2;
			drawScoreAtPosition(ctx, scoreX , styleConfig.checkerRadius*styleConfig.sizing.scoreMargin, boardData.scoreO, "White");
			drawScoreAtPosition(ctx, scoreX, styleConfig.boardHeight - styleConfig.checkerRadius*styleConfig.sizing.scoreMargin, boardData.scoreX, "Black");
			drawScoreAtPosition(ctx, scoreX, styleConfig.boardHeight/2, boardData.matchLength, "Length");
		}
	};

	const observer = new ResizeObserver(() => {
		resizeCanvas(); // your resize logic
	});
	observer.observe(canvas.parentElement!);
	//resizeCanvas();
}

function drawBoard(ctx: CanvasRenderingContext2D): void {
	// clear the canvas
	ctx.fillStyle = styleConfig.colors.background;
	ctx.strokeStyle = styleConfig.colors.boardBorder;
	ctx.lineWidth = 1;
	ctx.fillRect(0, 0, styleConfig.boardWidth, styleConfig.boardHeight);

	// draw the bar
	ctx.fillStyle = styleConfig.colors.bar;
	ctx.strokeRect(styleConfig.boardWidth / 2 - styleConfig.barWidth / 2, 0, styleConfig.barWidth, styleConfig.boardHeight);
	ctx.strokeRect(0, 0, styleConfig.barWidth, styleConfig.boardHeight);
	ctx.strokeRect(styleConfig.boardWidth-styleConfig.columnWidth, 0, styleConfig.barWidth, styleConfig.boardHeight);

	const colors = [styleConfig.colors.triangleDark, styleConfig.colors.triangleLight];

	const drawTriangle = (x: number, isBottomHalf: boolean, color: string) => {
		ctx.beginPath();
		if (isBottomHalf) {
			ctx.moveTo(x, styleConfig.boardHeight);
			ctx.lineTo(x + styleConfig.pointWidth / 2, styleConfig.boardHeight - styleConfig.triangleHeight);
			ctx.lineTo(x + styleConfig.pointWidth, styleConfig.boardHeight);
		} else {
			ctx.moveTo(x, 0);
			ctx.lineTo(x + styleConfig.pointWidth / 2, styleConfig.triangleHeight);
			ctx.lineTo(x + styleConfig.pointWidth, 0);
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
	ctx.strokeRect(0, 0, styleConfig.boardWidth, styleConfig.boardHeight);
}

function drawCheckerLabel(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, checkerColor: 'black' | 'white'): void {
	ctx.font = styleConfig.fonts.checkerLabel;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = checkerColor;
	ctx.fillText(text, x, y);
}
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

function drawCheckerAtPosition(ctx: CanvasRenderingContext2D, xPos:number, yPos:number, color:string)
{
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(xPos, yPos, styleConfig.checkerRadius, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.strokeStyle = styleConfig.colors.boardBorder;
	ctx.stroke();		
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
		const yStart = isTop ? margin : styleConfig.boardHeight - margin;
		
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
		const yPos = styleConfig.boardHeight - (styleConfig.checkerMargin + styleConfig.checkerRadius);
		drawCheckerAtPosition(ctx, xPos, yPos, styleConfig.colors.checkerBlack);
		drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffX.toString(), styleConfig.colors.checkerWhite);
	}
	if(boardData.borneOffO > 0)
	{
		const xPos = (styleConfig.boardColumns * styleConfig.columnWidth) - styleConfig.columnWidth * .5;
		const yPos = styleConfig.checkerMargin + styleConfig.checkerRadius;
		drawCheckerAtPosition(ctx, xPos, yPos, styleConfig.colors.checkerWhite);
		drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffO.toString(), styleConfig.colors.checkerBlack);
	}
}


