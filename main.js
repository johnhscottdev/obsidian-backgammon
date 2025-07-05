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
    let cubeY = boardHeight / 2;
    if (boardData.cubeOwner === "X")
      cubeY = boardHeight - checkerMargin;
    else if (boardData.cubeOwner === "O")
      cubeY = checkerMargin;
    let cubeValue = boardData.cubeValue.toString();
    if (boardData.crawford)
      cubeValue = "Cr";
    drawCubeAtPosition(ctx, columnWidth / 2, cubeY, cubeValue);
    const dieColor = boardData.turn === "X" ? "black" : "white";
    {
      let dieOffset = columnWidth * 2.5;
      let dieSpacing = 1.2;
      if (boardData.turn === "O") {
        dieOffset *= -1;
        dieSpacing *= -1;
      }
      let dieSize = checkerRadius * 2;
      drawDieAtPosition(ctx, boardWidth / 2 + dieOffset, boardHeight / 2, dieSize, boardData.die1, dieColor);
      drawDieAtPosition(ctx, boardWidth / 2 + dieOffset + dieSize * dieSpacing, boardHeight / 2, dieSize, boardData.die2, dieColor);
    }
    if (boardData.matchLength > 0) {
      const scoreMargin = 6;
      const scoreX = boardWidth - columnWidth / 2;
      drawScoreAtPosition(ctx, scoreX, checkerRadius * scoreMargin, boardData.scoreO, "White");
      drawScoreAtPosition(ctx, scoreX, boardHeight - checkerRadius * scoreMargin, boardData.scoreX, "Black");
      drawScoreAtPosition(ctx, scoreX, boardHeight / 2, boardData.matchLength, "Length");
    }
  };
  const observer = new ResizeObserver(() => {
    resizeCanvas();
  });
  observer.observe(canvas.parentElement);
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
function drawCheckerLabel(ctx, x, y, text, checkerColor) {
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = checkerColor;
  ctx.fillText(text, x, y);
}
function drawScoreAtPosition(ctx, xPos, yPos, score, header) {
  const sizeX = columnWidth;
  const sizeY = sizeX + checkerRadius;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.fillRect(xPos - sizeX / 2, yPos - sizeY / 2, sizeX, sizeY);
  ctx.lineWidth = 1;
  ctx.strokeRect(xPos - sizeX / 2, yPos - sizeY / 2, sizeX, sizeY);
  ctx.font = "bold 8px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.fillText(header, xPos, yPos - checkerRadius * 0.5);
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.fillText(score.toString(), xPos, yPos + checkerRadius * 0.5);
}
function drawCubeAtPosition(ctx, xPos, yPos, cubeValue) {
  const size = columnWidth - 5;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.fillRect(xPos - size / 2, yPos - size / 2, size, size);
  ctx.strokeRect(xPos - size / 2, yPos - size / 2, size, size);
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "black";
  ctx.fillText(cubeValue, xPos, yPos);
}
function drawDieAtPosition(ctx, x, y, size, value, color) {
  const dieValue = Math.max(1, Math.min(value, 6));
  const radius = size / 2;
  const pipRadius = size * 0.1;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.strokeStyle = color === "white" ? "black" : "white";
  ctx.lineWidth = 2;
  ctx.roundRect(x - radius, y - radius, size, size, size * 0.15);
  ctx.fill();
  ctx.stroke();
  const offsets = [
    [-0.3, -0.3],
    [0.3, 0.3],
    [0.3, -0.3],
    [-0.3, 0.3],
    [-0.3, 0],
    [0.3, 0],
    [0, 0]
  ];
  const pipMap = {
    1: [[6]],
    2: [[0], [1]],
    3: [[0], [1], [6]],
    4: [[0], [1], [2], [3]],
    5: [[0], [1], [2], [3], [6]],
    6: [[0], [1], [2], [3], [4], [5]]
  };
  if (value != 0) {
    ctx.fillStyle = color === "white" ? "black" : "white";
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
function drawCheckerAtPosition(ctx, xPos, yPos, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(xPos, yPos, checkerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.stroke();
}
function drawCheckers(ctx, boardData) {
  const getPointX = (absolutePointNumber) => {
    let index = 0;
    const centerOfPoint = pointWidth / 2;
    if (absolutePointNumber == 0 || absolutePointNumber == 25)
      return 8 * pointWidth - centerOfPoint;
    if (absolutePointNumber > 12)
      index = absolutePointNumber - 12;
    else
      index = 13 - absolutePointNumber;
    if (index > 6)
      index++;
    index++;
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
    const onBar = absolutePointNumber === 0 || absolutePointNumber === 25;
    const x = getPointX(absolutePointNumber);
    let margin = checkerMargin;
    if (onBar)
      margin += checkerRadius;
    const yStart = isTop ? margin : boardHeight - margin;
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
  if (boardData.borneOffX > 0) {
    const xPos = boardColumns * columnWidth - columnWidth * 0.5;
    const yPos = boardHeight - (checkerMargin + checkerRadius);
    drawCheckerAtPosition(ctx, xPos, yPos, "black");
    drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffX.toString(), "white");
  }
  if (boardData.borneOffO > 0) {
    const xPos = boardColumns * columnWidth - columnWidth * 0.5;
    const yPos = checkerMargin + checkerRadius;
    drawCheckerAtPosition(ctx, xPos, yPos, "white");
    drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffO.toString(), "black");
  }
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
function countCheckers(points, player) {
  return points.filter((p) => p.player === player).reduce((sum, p) => sum + p.checkerCount, 0);
}
function parseXGID(xgid) {
  if (!xgid || typeof xgid !== "string") {
    throw new Error("Invalid XGID: input must be a non-empty string");
  }
  const cleanXgid = xgid.trim();
  if (!cleanXgid.match(/^(XGID=)?[a-zA-Z-]+:[0-9]+:[-0-9]+:[-0-9]+:/)) {
    throw new Error("Invalid XGID format: does not match expected pattern");
  }
  const parts = cleanXgid.replace(/^XGID=/, "").split(":");
  if (parts.length < 9) {
    throw new Error(`Invalid XGID format: expected at least 9 parts, got ${parts.length}`);
  }
  const pointString = parts[0];
  const cubeOwnerCode = parseInt(parts[2], 10);
  const cubeValue = Math.pow(2, parseInt(parts[1], 10));
  const turn = parseInt(parts[3], 10);
  let die1 = 0;
  let die2 = 0;
  die1 = parseInt(parts[4][0]);
  die2 = parseInt(parts[4][1]);
  if (isNaN(die1))
    die1 = 0;
  if (isNaN(die2))
    die2 = 0;
  const scoreX = parseInt(parts[5], 10);
  const scoreO = parseInt(parts[6], 10);
  const rulesFlags = parseInt(parts[7], 10);
  const matchLength = parseInt(parts[8], 10);
  const cubeOwner = cubeOwnerCode === 0 ? "Center" : cubeOwnerCode === 1 ? "X" : "O";
  const points = pointString.split("").map(charToCount).reverse().map(([count, player]) => ({
    checkerCount: count,
    player
  }));
  const jacoby = rulesFlags % 2 === 1;
  const beaver = rulesFlags % 4 === 1;
  const crawford = matchLength > 0 && jacoby;
  const checkersOnBoardX = countCheckers(points, "X");
  const checkersOnBoardO = countCheckers(points, "O");
  const borneOffX = 15 - checkersOnBoardX;
  const borneOffO = 15 - checkersOnBoardO;
  let boardData = {
    points,
    borneOffX,
    borneOffO,
    turn: turn === -1 ? "O" : "X",
    die1,
    die2,
    cubeOwner,
    cubeValue: cubeOwner === "Center" ? 64 : cubeValue,
    scoreX,
    scoreO,
    beaver,
    jacoby,
    matchLength,
    crawford
  };
  return boardData;
}
function extractMoveBlocks(text) {
  const moveBlockRegex = /^\s*\d+\..*?(?:\n\s{2,}Player:.*?\n\s{2,}Opponent:.*?)(?=\n\s*\d+\.|\n\n|$)/gms;
  const moveMatches = [...text.matchAll(moveBlockRegex)].map((m) => m[0].trim());
  if (moveMatches.length > 0) {
    return moveMatches;
  } else {
    const analysisRegex = /Analyzed in XG Roller\+([\s\S]*?)^\s*eXtreme Gammon Version:/m;
    const match = text.match(analysisRegex);
    if (match) {
      const cleaned = "Analyzed in XG Roller+" + match[1].trim();
      return [cleaned];
    }
  }
  return [];
}

// src/main.ts
var BackgammonPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("xgid", (source, el) => {
      try {
        const xgid = source.trim();
        const boardData = parseXGID(xgid);
        const decisions = extractMoveBlocks(source);
        renderBoard(el, boardData);
        const container = el.createDiv({ cls: "my-container" });
        decisions.forEach((item) => {
          const pre = container.createEl("pre");
          const code = pre.createEl("code");
          code.textContent = item;
        });
      } catch (error) {
        const errorDiv = el.createDiv({ cls: "backgammon-error" });
        errorDiv.style.cssText = "background-color: #ffe6e6; border: 1px solid #ffcccc; padding: 10px; border-radius: 4px; margin: 5px 0;";
        errorDiv.createDiv().setText(source);
        const errorMsg = errorDiv.createDiv();
        const message = error instanceof Error ? error.message : String(error);
        errorMsg.setText(`\u26A0\uFE0F Error: ${message}`);
        errorMsg.style.cssText = "color: #cc0000; font-weight: bold; margin-top: 5px;";
      }
    });
  }
  onunload() {
  }
};
