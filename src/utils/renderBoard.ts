import type { BoardData } from '../types/board';



const boardWidth = 500;
const boardHeight = 300;
const boardColumns = 6 + 6 + 3; // all 12 points, the bar, and the bear off trays
const columnWidth = boardWidth / boardColumns
const barWidth = columnWidth;
const pointWidth = columnWidth;
const triangleHeight = (boardHeight / 2) * 0.9;
const checkerRadius = (columnWidth / 2);
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

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, boardWidth, boardHeight);

	ctx.fillStyle = "#000000";
	ctx.strokeRect(boardWidth / 2 - barWidth / 2, 0, barWidth, boardHeight);

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
}

function drawCheckerLabel(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, checkerColor: 'black' | 'white'): void {
	ctx.font = '12px sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = checkerColor === 'black' ? 'white' : 'black';
	ctx.fillText(text, x, y);
}

export function drawCheckers(ctx: CanvasRenderingContext2D, boardData: BoardData): void {

	// Helper to get x-position from point number (1–24)
	const getPointX = (point: number): number => {
		let posInRow = (point - 1) % 12;
		let x = posInRow * pointWidth;
		if (posInRow >= 6) x += barWidth;
		return x + pointWidth / 2;
	};

	// Regular points (1–24)
	boardData.points.forEach((point, i) => {
		if (!point.player || point.checkerCount === 0) return;

		let pointNumber = 24 - i;
		if(point.player==='O')
			pointNumber = i;
		let isTop = pointNumber >= 13;
		if(point.player==='O')
			isTop = !isTop;

		const x = getPointX(pointNumber);
		const yStart = isTop ? 20 : 280;
		const direction = isTop ? 1 : -1;

		for (let j = 0; j < point.checkerCount; j++) {
			ctx.beginPath();
			ctx.fillStyle = point.player === 'X' ? 'black' : 'white';
			ctx.arc(x, yStart + direction * j * checkerRadius*2, checkerRadius, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = 'black';
			ctx.stroke();	

			drawCheckerLabel(ctx, x, yStart + direction * j * checkerRadius*2, pointNumber.toString(), point.player === 'X' ? 'black' : 'white')
		}
	});

	// Checkers on the bar
	const drawBarCheckers = (player: 'X' | 'O', count: number) => {
		if (count === 0) return;

		const isTop = player === 'O'; // O is at top, X at bottom
		const yStart = isTop ? 20 : 280;
		const direction = isTop ? 1 : -1;

		for (let j = 0; j < count; j++) {
			ctx.beginPath();
			ctx.fillStyle = player === 'X' ? 'black' : 'white';			
			ctx.arc(barX, yStart + direction * j * checkerRadius*2, checkerRadius, 0, Math.PI * 2);			
			ctx.fill();	

			ctx.strokeStyle = 'black';
			ctx.lineWidth = 8;
			ctx.stroke();			
		}
	};

	drawBarCheckers('X', boardData.bar.X);
	drawBarCheckers('O', boardData.bar.O);
}


