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
var scale = 1;
var boardWidth = 500 * scale;
var boardHeight = 400 * scale;
var boardColumns = 6 + 6 + 3;
var columnWidth = boardWidth / boardColumns;
var barWidth = columnWidth;
var pointWidth = columnWidth;
var triangleHeight = boardHeight / 2 * 0.9;
var checkerRadius = columnWidth / 2;
var checkerMargin = boardWidth * 0.04;
var barX = boardWidth / 2;
function renderBoard(el, boardData) {
  const canvas = document.createElement("canvas");
  el.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let scaleFactor = 1;
  const getCanvasContainerWidth = () => {
    return canvas.parentElement?.clientWidth || window.innerWidth;
  };
  const resizeCanvas = () => {
    const unexplainedScaleError = 1;
    let noteWidth = getCanvasContainerWidth();
    scaleFactor = noteWidth / boardWidth;
    scaleFactor *= unexplainedScaleError;
    scaleFactor = Math.min(scaleFactor, 1);
    canvas.width = boardWidth * scaleFactor;
    canvas.height = boardHeight * scaleFactor;
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(ctx);
    drawCheckers(ctx, boardData);
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}
function drawBoard(ctx) {
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.fillRect(0, 0, boardWidth, boardHeight);
  ctx.fillStyle = "#000000";
  ctx.strokeRect(boardWidth / 2 - barWidth / 2, 0, barWidth, boardHeight);
  ctx.strokeRect(0, 0, barWidth, boardHeight);
  ctx.strokeRect(boardWidth - columnWidth, 0, barWidth, boardHeight);
  const colors = ["#cccccc", "#ffffff"];
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
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
  };
  for (let i = 0; i < 12; i++) {
    let x = i * pointWidth;
    x += columnWidth;
    if (i >= 6) x += barWidth;
    let quadrantIndex = i < 6 ? 0 : 1;
    let color = colors[(i + 1) % 2];
    drawTriangle(x, true, color);
  }
  for (let i = 0; i < 12; i++) {
    let x = i * pointWidth;
    x += columnWidth;
    if (i >= 6) x += barWidth;
    let quadrantIndex = i < 6 ? 3 : 2;
    let color = colors[i % 2];
    drawTriangle(x, false, color);
  }
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, boardWidth, boardHeight);
}
function drawCheckerAtPosition(ctx, xPos, yPos, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(xPos, yPos, checkerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();
}
function drawCheckers(ctx, boardData) {
  const getPointX = (absolutePointNumber, isTop) => {
    let index = 0;
    if (absolutePointNumber > 12)
      index = absolutePointNumber - 12;
    else
      index = 13 - absolutePointNumber;
    if (index >= 6)
      index++;
    index++;
    let centerOfPoint = pointWidth / 2;
    return index * pointWidth - centerOfPoint;
  };
  for (let i = 0; i < boardData.points.length; i++) {
    let point = boardData.points[i];
    if (!point.player || point.checkerCount === 0)
      continue;
    let absolutePointNumber = i;
    let playerPointNumber = 24 - i;
    if (point.player === "O")
      playerPointNumber = i;
    const isTop = absolutePointNumber <= 12;
    const x = getPointX(absolutePointNumber, isTop);
    const yStart = isTop ? checkerMargin : boardHeight - checkerMargin;
    const direction = isTop ? 1 : -1;
    ctx.lineWidth = 1;
    for (let j = 0; j < point.checkerCount; j++) {
      let checkerColor = point.player === "X" ? "black" : "white";
      let xPos = x;
      let yPos = yStart + direction * j * checkerRadius * 2;
      drawCheckerAtPosition(ctx, xPos, yPos, checkerColor);
    }
  }
  ;
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
  return {
    points
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
