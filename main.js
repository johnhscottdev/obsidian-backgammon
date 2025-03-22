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

// src/utils/renderBoard.ts
function renderBoard(el, boardData) {
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
    drawBoard(ctx);
    drawCheckers(ctx, boardData);
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}
function drawBoard(ctx) {
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
    ["#aaffaa", "#229922"]
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
function drawCheckers(ctx, boardData) {
  const checkerRadius = 15;
  const boardWidth = 500;
  const barWidth = boardWidth / 12;
  const pointWidth = (boardWidth - barWidth) / 12;
  const barX = boardWidth / 2;
  const getPointX = (point) => {
    let posInRow = (point - 1) % 12;
    let x = posInRow * pointWidth;
    if (posInRow >= 6) x += barWidth;
    return x + pointWidth / 2;
  };
  boardData.points.forEach((point, i) => {
    if (!point.player || point.checkerCount === 0) return;
    const pointNumber = 24 - i;
    const isTop = pointNumber >= 13;
    const x = getPointX(pointNumber);
    const yStart = isTop ? 20 : 280;
    const direction = isTop ? 1 : -1;
    for (let j = 0; j < point.checkerCount; j++) {
      ctx.beginPath();
      ctx.fillStyle = point.player === "X" ? "black" : "white";
      ctx.arc(x, yStart + direction * j * 30, checkerRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  const drawBarCheckers = (player, count) => {
    if (count === 0) return;
    const isTop = player === "O";
    const yStart = isTop ? 20 : 280;
    const direction = isTop ? 1 : -1;
    for (let j = 0; j < count; j++) {
      ctx.beginPath();
      ctx.fillStyle = player === "X" ? "black" : "white";
      ctx.arc(barX, yStart + direction * j * 30, checkerRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  drawBarCheckers("X", boardData.bar.X);
  drawBarCheckers("O", boardData.bar.O);
}

// src/utils/parseXGID.ts
function charToCount(c) {
  if (c >= "a" && c <= "z") {
    return [c.charCodeAt(0) - "a".charCodeAt(0) + 1, "O"];
  }
  if (c >= "A" && c <= "Z") {
    return [c.charCodeAt(0) - "A".charCodeAt(0) + 1, "X"];
  }
  return [0, null];
}
function parseXGID(xgid) {
  const parts = xgid.split(":");
  const pointString = parts[0].slice(5);
  const points = pointString.split("").map(charToCount).reverse().map(([count, player]) => ({
    checkerCount: count,
    player
  }));
  while (points.length < 24) {
    points.push({ checkerCount: 0, player: null });
  }
  return {
    points,
    bar: { X: 0, O: 0 },
    off: { X: 0, O: 0 }
  };
}

// src/main.ts
var BackgammonPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("backgammon", (source, el) => {
      const xgid = source.trim();
      const boardData = parseXGID(xgid);
      console.log("[Processor] Parsed boardData:", boardData);
      renderBoard(el, boardData);
    });
  }
  onunload() {
    console.log("Unloading Backgammon Plugin");
  }
};
