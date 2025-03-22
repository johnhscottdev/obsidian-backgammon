"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => BackgammonPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var BackgammonPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("backgammon", (source, el) => {
      const boardData = this.parsePosition(source);
      this.renderBoard(el, boardData);
    });
  }
  parsePosition(source) {
    return {
      X: [{ point: 13, count: 2 }, { point: 6, count: 5 }],
      O: [{ point: 24, count: 2 }, { point: 8, count: 3 }]
    };
  }
  renderBoard(el, boardData) {
    const canvas = document.createElement("canvas");
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const baseWidth = 500;
    const baseHeight = 300;
    let scaleFactor = 1;
    const getCanvasContainerWidth = () => {
      return canvas.parentElement?.clientWidth || window.innerWidth;
    };
    const resizeCanvas = () => {
      const unexplainedScaleError = 1;
      let noteWidth = getCanvasContainerWidth();
      scaleFactor = noteWidth / baseWidth;
      scaleFactor *= unexplainedScaleError;
      scaleFactor = Math.min(scaleFactor, 1);
      canvas.width = baseWidth * scaleFactor;
      canvas.height = baseHeight * scaleFactor;
      ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBoard(ctx);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }
  drawBoard(ctx) {
    const boardWidth = 500;
    const boardHeight = 300;
    const barWidth = boardWidth / 12;
    const pointWidth = (boardWidth - barWidth) / 12;
    const triangleHeight = boardHeight / 2;
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, 0, boardWidth, boardHeight);
    ctx.fillStyle = "#654321";
    ctx.fillRect(boardWidth / 2 - barWidth / 2, 0, barWidth, boardHeight);
    const colors = [
      ["#FFD700", "#FF4500"],
      // Left-bottom (gold, red-orange)
      ["#8A2BE2", "#00CED1"],
      // Right-bottom (blue-violet, turquoise)
      ["#32CD32", "#DC143C"],
      // Right-top (lime green, crimson)
      ["#1E90FF", "#FF8C00"]
      // Left-top (dodger blue, dark orange)
    ];
    const drawTriangle = (x, isBottomHalf, color) => {
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
  drawCheckers(ctx, boardData) {
    const pointWidth = (500 - 20) / 14;
    const checkerRadius = 15;
    boardData.X.forEach((checker) => {
      const x = checker.point < 12 ? checker.point * pointWidth + pointWidth / 2 : (checker.point + 1) * pointWidth + pointWidth / 2;
      const yStart = checker.point < 12 ? 280 : 20;
      for (let i = 0; i < checker.count; i++) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, yStart - i * 30, checkerRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    boardData.O.forEach((checker) => {
      const x = checker.point < 12 ? checker.point * pointWidth + pointWidth / 2 : (checker.point + 1) * pointWidth + pointWidth / 2;
      const yStart = checker.point < 12 ? 20 : 280;
      for (let i = 0; i < checker.count; i++) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, yStart + i * 30, checkerRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
  onunload() {
    console.log("Unloading Backgammon Plugin");
  }
};
