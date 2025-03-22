import type { BoardData } from '../types/board';

export function renderBoard(el: HTMLElement, boardData: BoardData): void {
	const canvas: HTMLCanvasElement = document.createElement('canvas');
	el.appendChild(canvas);
	const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

	if (!ctx) return;

	const baseWidth = 500;
	const baseHeight = 300;
	let scaleFactor = 1;

	const getCanvasContainerWidth = (): number => {
		return canvas.parentElement?.clientWidth || window.innerWidth;
	};

	const resizeCanvas = () => {
		const unexplainedScaleError = 1.0;
		let noteWidth = getCanvasContainerWidth();

		scaleFactor = noteWidth / baseWidth;
		scaleFactor *= unexplainedScaleError;
		scaleFactor = Math.min(scaleFactor, 1);

		canvas.width = baseWidth * scaleFactor;
		canvas.height = baseHeight * scaleFactor;

		ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBoard(ctx); // draw triangles/background
		drawCheckers(ctx, boardData); // now using points[]
	};

	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
}

function drawBoard(ctx: CanvasRenderingContext2D): void {
	const boardWidth = 500;
	const boardHeight = 300;
	const barWidth = boardWidth / 12;
	const pointWidth = (boardWidth - barWidth) / 12;
	const triangleHeight = boardHeight / 2;

	ctx.fillStyle = "#cccccc";
	ctx.fillRect(0, 0, boardWidth, boardHeight);

	ctx.fillStyle = "#654321";
	ctx.fillRect(boardWidth / 2 - barWidth / 2, 0, barWidth, boardHeight);

	const colors = [
		["#44aa44", "#aaffaa"],
		["#aaffaa", "#229922"],
		["#229922", "#aaffaa"],
		["#aaffaa", "#229922"],
	];

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
		ctx.fill();
	};

	for (let i = 0; i < 12; i++) {
		let x = i * pointWidth;
		if (i >= 6) x += barWidth;
		let quadrantIndex = i < 6 ? 0 : 1;
		let color = colors[quadrantIndex][i % 2];
		drawTriangle(x, true, color);
	}

	for (let i = 0; i < 12; i++) {
		let x = i * pointWidth;
		if (i >= 6) x += barWidth;
		let quadrantIndex = i < 6 ? 3 : 2;
		let color = colors[quadrantIndex][i % 2];
		drawTriangle(x, false, color);
	}
}

export function drawCheckers(ctx: CanvasRenderingContext2D, boardData: BoardData): void {
	const checkerRadius = 15;
	const boardWidth = 500;
	const barWidth = boardWidth / 12;
	const pointWidth = (boardWidth - barWidth) / 12;
	const barX = boardWidth / 2;

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

		const pointNumber = 24 - i;
		const isTop = pointNumber >= 13;

		const x = getPointX(pointNumber);
		const yStart = isTop ? 20 : 280;
		const direction = isTop ? 1 : -1;

		for (let j = 0; j < point.checkerCount; j++) {
			ctx.beginPath();
			ctx.fillStyle = point.player === 'X' ? 'black' : 'white';
			ctx.arc(x, yStart + direction * j * 30, checkerRadius, 0, Math.PI * 2);
			ctx.fill();
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
			ctx.arc(barX, yStart + direction * j * 30, checkerRadius, 0, Math.PI * 2);
			ctx.fill();
		}
	};

	drawBarCheckers('X', boardData.bar.X);
	drawBarCheckers('O', boardData.bar.O);
}


