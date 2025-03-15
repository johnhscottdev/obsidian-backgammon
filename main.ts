/**
 * Obsidian Backgammon Plugin
 * This plugin detects a code block with the language 'backgammon',
 * parses the position string, and renders a visualization inline.
 */

import { Plugin } from 'obsidian';

interface CheckerPosition {
    point: number;
    count: number;
}

interface BoardData {
    X: CheckerPosition[];
    O: CheckerPosition[];
}

export default class BackgammonPlugin extends Plugin {
    async onload(): Promise<void> {
        this.registerMarkdownCodeBlockProcessor('backgammon', (source: string, el: HTMLElement) => {
            const boardData: BoardData = this.parsePosition(source);
            this.renderBoard(el, boardData);
        });
    }

    parsePosition(source: string): BoardData {
        // TODO: Implement parsing logic
        // Example input format: "X: 13(2) 6(5) O: 24(2) 8(3)"
        return {
            X: [{ point: 13, count: 2 }, { point: 6, count: 5 }],
            O: [{ point: 24, count: 2 }, { point: 8, count: 3 }]
        };
    }

    renderBoard(el: HTMLElement, boardData: BoardData): void {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 300;
        el.appendChild(canvas);
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Draw the board
        this.drawBoard(ctx);
        this.drawCheckers(ctx, boardData);
    }

    drawBoard(ctx: CanvasRenderingContext2D): void {
        const boardWidth = 500;
        const boardHeight = 300;
        const barWidth = boardWidth / 14; // Bar width is the same as a point width
        const pointWidth = (boardWidth - barWidth) / 12; // Ensure all 12 points fit properly
        const triangleHeight = boardHeight / 2; // Half the board height for points
    
        // Board background
        ctx.fillStyle = "#8B4513"; // Wood color
        ctx.fillRect(0, 0, boardWidth, boardHeight);
    
        // Draw the bar in the center
        ctx.fillStyle = "#654321"; // Darker brown for the bar
        ctx.fillRect(boardWidth / 2 - barWidth / 2, 0, barWidth, boardHeight);
    
        // Define colors for quadrants
        const colors = [
            ["#FFD700", "#FF4500"], // Left-bottom (gold, red-orange)
            ["#8A2BE2", "#00CED1"], // Right-bottom (blue-violet, turquoise)
            ["#32CD32", "#DC143C"], // Right-top (lime green, crimson)
            ["#1E90FF", "#FF8C00"], // Left-top (dodger blue, dark orange)
        ];
    
        // Function to draw a triangle
        const drawTriangle = (x: number, isBottomHalf: boolean, color: string) => {
            ctx.beginPath();
            if (isBottomHalf) {
                // Bottom triangles (point up)
                ctx.moveTo(x, boardHeight); // Bottom-left corner
                ctx.lineTo(x + pointWidth / 2, boardHeight - triangleHeight); // Peak
                ctx.lineTo(x + pointWidth, boardHeight); // Bottom-right corner
            } else {
                // Top triangles (point down)
                ctx.moveTo(x, 0); // Top-left corner
                ctx.lineTo(x + pointWidth / 2, triangleHeight); // Peak
                ctx.lineTo(x + pointWidth, 0); // Top-right corner
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        };
    
        // Draw bottom half (quadrants 1 & 2)
        for (let i = 0; i < 12; i++) {
            let x = i * pointWidth;
            if (i >= 6) x += barWidth; // Skip the bar
            let quadrantIndex = i < 6 ? 0 : 1;
            let color = colors[quadrantIndex][i % 2];
    
            drawTriangle(x, true, color);
        }
    
        // Draw top half (quadrants 3 & 4)
        for (let i = 0; i < 12; i++) {
            let x = i * pointWidth;
            if (i >= 6) x += barWidth; // Skip the bar
            let quadrantIndex = i < 6 ? 3 : 2;
            let color = colors[quadrantIndex][i % 2];
    
            drawTriangle(x, false, color);
        }
    }
    
    
    
    
    drawCheckers(ctx: CanvasRenderingContext2D, boardData: BoardData): void {
        const pointWidth = (500 - 20) / 14;
        const checkerRadius = 15;

        boardData.X.forEach(checker => {
            const x = (checker.point < 12) ? checker.point * pointWidth + pointWidth / 2 : (checker.point + 1) * pointWidth + pointWidth / 2;
            const yStart = (checker.point < 12) ? 280 : 20;
            for (let i = 0; i < checker.count; i++) {
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(x, yStart - i * 30, checkerRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        boardData.O.forEach(checker => {
            const x = (checker.point < 12) ? checker.point * pointWidth + pointWidth / 2 : (checker.point + 1) * pointWidth + pointWidth / 2;
            const yStart = (checker.point < 12) ? 20 : 280;
            for (let i = 0; i < checker.count; i++) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x, yStart + i * 30, checkerRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    onunload(): void {
        console.log('Unloading Backgammon Plugin');
    }
}
