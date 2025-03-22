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

		drawBoard(ctx);
		drawCheckers(ctx, boardData);
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
		["#229922", "#aaffaa"],
		["#229922", "#aaffaa"],
		["#229922", "#aaffaa"],
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

function drawCheckers(ctx: CanvasRenderingContext2D, boardData: BoardData): void {
	const pointWidth = (500 - 20) / 14;
	const checkerRadius = 15;

	boardData.X.forEach(checker => {
		const x = (checker.point < 12)
			? checker.point * pointWidth + pointWidth / 2
			: (checker.point + 1) * pointWidth + pointWidth / 2;
		const yStart = (checker.point < 12) ? 280 : 20;

		for (let i = 0; i < checker.count; i++) {
			ctx.fillStyle = 'black';
			ctx.beginPath();
			ctx.arc(x, yStart - i * 30, checkerRadius, 0, Math.PI * 2);
			ctx.fill();
		}
	});

	boardData.O.forEach(checker => {
		const x = (checker.point < 12)
			? checker.point * pointWidth + pointWidth / 2
			: (checker.point + 1) * pointWidth + pointWidth / 2;
		const yStart = (checker.point < 12) ? 20 : 280;

		for (let i = 0; i < checker.count; i++) {
			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.arc(x, yStart + i * 30, checkerRadius, 0, Math.PI * 2);
			ctx.fill();
		}
	});
}
