import type { BoardData } from '../types/board';



const scale = 1;
const boardWidth = 500 * scale;
const boardHeight = 400 * scale;
const boardColumns = 6 + 6 + 3; // all 12 points, the bar, and the bear off trays
const columnWidth = boardWidth / boardColumns
const barWidth = columnWidth;
const pointWidth = columnWidth;
const triangleHeight = (boardHeight / 2) * 0.9;
const checkerRadius = (columnWidth / 2);
const checkerMargin = boardWidth * 0.04;
const barX = boardWidth / 2;

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
		const unexplainedScaleError = 1.0;
		let noteWidth = getCanvasContainerWidth();

		scaleFactor = noteWidth / boardWidth;
		scaleFactor *= unexplainedScaleError;
		scaleFactor = Math.min(scaleFactor, 1);

		canvas.width = boardWidth * scaleFactor;
		canvas.height = boardHeight * scaleFactor;

		ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBoard(ctx); // draw triangles/background
		drawCheckers(ctx, boardData); // now using points[]
	};

	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
}

function drawBoard(ctx: CanvasRenderingContext2D): void {
	// clear the canvas
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;
	ctx.fillRect(0, 0, boardWidth, boardHeight);

	// draw the bar
	ctx.fillStyle = "#000000";
	ctx.strokeRect(boardWidth / 2 - barWidth / 2, 0, barWidth, boardHeight);
	ctx.strokeRect(0, 0, barWidth, boardHeight);
	ctx.strokeRect(boardWidth-columnWidth, 0, barWidth, boardHeight);

	const colors = ["#cccccc", "#ffffff"];

	const drawTriangle = (x: number, isBottomHalf: boolean, color: string) => {
		ctx.beginPath();
		if (isBottomHalf) {
			ctx.moveTo(x, boardHeight);
			ctx.lineTo(x + pointWidth / 2, boardHeight - triangleHeight);
			ctx.lineTo(x + pointWidth, boardHeight);
		} else {
			ctx.moveTo(x, 0);
			ctx.lineTo(x + pointWidth / 2, triangleHeight);
			ctx.lineTo(x + pointWidth, 0);
		}
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fill();
	};

	for (let i = 0; i < 12; i++) {
		let x = i * pointWidth;
		x += columnWidth; // offset for bear off tray
		if (i >= 6) x += barWidth;
		let quadrantIndex = i < 6 ? 0 : 1;
		let color = colors[(i+1) % 2];
		drawTriangle(x, true, color);
	}

	for (let i = 0; i < 12; i++) {
		let x = i * pointWidth;
		x += columnWidth; // offset for bear off tray
		if (i >= 6) x += barWidth;
		let quadrantIndex = i < 6 ? 3 : 2;
		let color = colors[i % 2];
		drawTriangle(x, false, color);
	}

	ctx.lineWidth = 3;
	ctx.strokeRect(0, 0, boardWidth, boardHeight);
}

function drawCheckerLabel(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, checkerColor: 'black' | 'white'): void {
	ctx.font = '12px sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = checkerColor === 'black' ? 'white' : 'black';
	ctx.fillText(text, x, y);
}

function drawCheckerAtPosition(ctx: CanvasRenderingContext2D, xPos:number, yPos:number, color:string)
{
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc(xPos, yPos, checkerRadius, 0, Math.PI * 2);
	ctx.fill();
	
	ctx.strokeStyle = 'black';
	ctx.stroke();		
}

export function drawCheckers(ctx: CanvasRenderingContext2D, boardData: BoardData): void {

	// Helper to get x-position from point number (1–24)
	const getPointX = (absolutePointNumber: number, isTop:boolean): number => {
		let index=0;
		const centerOfPoint = (pointWidth / 2);
		if(absolutePointNumber == 0 || absolutePointNumber == 25)
			return (8 * pointWidth) - centerOfPoint;

		if(absolutePointNumber > 12)
			index = absolutePointNumber - 12;
		else
			index = 13 - absolutePointNumber;
		
		//account for the bar
		if(index > 6)
			index++;		
		
		// account for leftmost bearoff tray
		index++;		
		
		
		return (index * pointWidth) - centerOfPoint;
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
		const x = getPointX(absolutePointNumber, isTop);
		let margin = checkerMargin;
		if(onBar)
			margin += checkerRadius;
		const yStart = isTop ? margin : boardHeight - margin;
		
		const direction = isTop ? 1 : -1;
		ctx.lineWidth = 1;

		for (let j = 0; j < point.checkerCount; j++) {
			let checkerColor = point.player === 'X' ? 'black' : 'white';
			let xPos = x;
			let yPos = yStart + direction * j * checkerRadius*2;
			drawCheckerAtPosition(ctx, xPos, yPos, checkerColor);
			//drawCheckerLabel(ctx, xPos, yPos, absolutePointNumber.toString(), point.player === 'X' ? 'black' : 'white');
		}
	};
}


