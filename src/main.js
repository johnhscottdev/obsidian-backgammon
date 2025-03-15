"use strict";
/**
 * Obsidian Backgammon Plugin
 * This plugin detects a code block with the language 'backgammon',
 * parses the position string, and renders a visualization inline.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
class BackgammonPlugin extends obsidian_1.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.registerMarkdownCodeBlockProcessor('backgammon', (source, el) => {
                const boardData = this.parsePosition(source);
                this.renderBoard(el, boardData);
            });
        });
    }
    parsePosition(source) {
        // TODO: Implement parsing logic
        // Example input format: "X: 13(2) 6(5) O: 24(2) 8(3)"
        return {
            X: [{ point: 13, count: 2 }, { point: 6, count: 5 }],
            O: [{ point: 24, count: 2 }, { point: 8, count: 3 }]
        };
    }
    renderBoard(el, boardData) {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 300;
        el.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Draw the board
        this.drawBoard(ctx);
        this.drawCheckers(ctx, boardData);
    }
    drawBoard(ctx) {
        const width = 500;
        const height = 300;
        const barWidth = 20;
        const pointWidth = (width - barWidth) / 14;
        // Background
        ctx.fillStyle = '#deb887'; // Wood-like color
        ctx.fillRect(0, 0, width, height);
        // Draw points
        for (let i = 0; i < 24; i++) {
            const x = (i < 12) ? i * pointWidth : (i + 1) * pointWidth;
            const y = (i < 12) ? height : 0;
            const heightFactor = (i < 12) ? -1 : 1;
            ctx.fillStyle = (i % 2 === 0) ? '#8b4513' : '#d2691e'; // Alternating colors
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + pointWidth / 2, y + (height / 2 * heightFactor));
            ctx.lineTo(x + pointWidth, y);
            ctx.closePath();
            ctx.fill();
        }
    }
    drawCheckers(ctx, boardData) {
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
    onunload() {
        console.log('Unloading Backgammon Plugin');
    }
}
exports.default = BackgammonPlugin;
