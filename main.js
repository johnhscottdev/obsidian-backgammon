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

// src/utils/styleConfig.ts
var styleConfig = {
  scale: 1,
  boardWidth: 500,
  boardHeight: 440,
  // Expanded to accommodate point numbers outside board
  boardColumns: 6 + 6 + 3,
  // all 12 points, the bar, and the bear off trays
  get columnWidth() {
    return this.boardWidth / this.boardColumns;
  },
  get barWidth() {
    return this.columnWidth;
  },
  get pointWidth() {
    return this.columnWidth;
  },
  get triangleHeight() {
    return this.boardHeight / 2 * 0.9;
  },
  get checkerRadius() {
    return this.columnWidth / 2;
  },
  get checkerMargin() {
    return this.boardWidth * 0.04;
  },
  get barX() {
    return this.boardWidth / 2;
  },
  colors: {
    background: "#ffffff",
    boardBorder: "black",
    bar: "#000000",
    triangleLight: "#ffffff",
    triangleDark: "#cccccc",
    checkerBlack: "black",
    checkerWhite: "white",
    cubeBackground: "white",
    cubeBorder: "black",
    scoreBackground: "white",
    scoreBorder: "black",
    text: "black",
    pointNumber: "black",
    pipCount: "black"
  },
  fonts: {
    checkerLabel: "bold 16px sans-serif",
    scoreHeader: "bold 8px sans-serif",
    scoreValue: "bold 16px sans-serif",
    cubeValue: "bold 16px sans-serif",
    pointNumber: "bold 16px sans-serif",
    pipCount: "bold 14px sans-serif"
  },
  sizing: {
    borderWidth: 3,
    strokeWidth: 2,
    cubeSize: 5,
    scoreMargin: 6,
    dieCornerRadius: 0.15,
    diePipRadius: 0.1,
    unexplainedScaleError: 1
  },
  spacing: {
    dieOffset: 2.5,
    dieSpacing: 1.2
  }
};

// src/utils/renderBoard.ts
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
    let noteWidth = getCanvasContainerWidth();
    scaleFactor = noteWidth / styleConfig.boardWidth;
    scaleFactor *= styleConfig.sizing.unexplainedScaleError;
    scaleFactor = Math.min(scaleFactor, 1);
    canvas.width = styleConfig.boardWidth * scaleFactor;
    canvas.height = styleConfig.boardHeight * scaleFactor;
    ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard(ctx);
    renderPointNumbers(ctx, boardData);
    renderPipCounts(ctx, boardData);
    drawCheckers(ctx, boardData);
    const boardTop = 20;
    const boardBottom = styleConfig.boardHeight - 20;
    const boardHeight = boardBottom - boardTop;
    let cubeY = boardTop + boardHeight / 2;
    if (boardData.cubeOwner === "X")
      cubeY = boardBottom - styleConfig.checkerMargin;
    else if (boardData.cubeOwner === "O")
      cubeY = boardTop + styleConfig.checkerMargin;
    let cubeValue = boardData.cubeValue.toString();
    if (boardData.crawford)
      cubeValue = "Cr";
    drawCubeAtPosition(ctx, styleConfig.columnWidth / 2, cubeY, cubeValue);
    const dieColor = boardData.turn === "X" ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite;
    {
      let dieOffset = styleConfig.columnWidth * styleConfig.spacing.dieOffset;
      let dieSpacing = styleConfig.spacing.dieSpacing;
      if (boardData.turn === "O") {
        dieOffset *= -1;
        dieSpacing *= -1;
      }
      let dieSize = styleConfig.checkerRadius * 2;
      drawDieAtPosition(ctx, styleConfig.boardWidth / 2 + dieOffset, boardTop + boardHeight / 2, dieSize, boardData.die1, dieColor);
      drawDieAtPosition(ctx, styleConfig.boardWidth / 2 + dieOffset + dieSize * dieSpacing, boardTop + boardHeight / 2, dieSize, boardData.die2, dieColor);
    }
    if (boardData.matchLength > 0) {
      const scoreX = styleConfig.boardWidth - styleConfig.columnWidth / 2;
      drawScoreAtPosition(ctx, scoreX, boardTop + styleConfig.checkerRadius * styleConfig.sizing.scoreMargin, boardData.scoreO, "White");
      drawScoreAtPosition(ctx, scoreX, boardBottom - styleConfig.checkerRadius * styleConfig.sizing.scoreMargin, boardData.scoreX, "Black");
      drawScoreAtPosition(ctx, scoreX, boardTop + boardHeight / 2, boardData.matchLength, "Length");
    }
  };
  const observer = new ResizeObserver(() => {
    resizeCanvas();
  });
  observer.observe(canvas.parentElement);
}
function drawBoard(ctx) {
  ctx.fillStyle = styleConfig.colors.background;
  ctx.strokeStyle = styleConfig.colors.boardBorder;
  ctx.lineWidth = 1;
  ctx.fillRect(0, 0, styleConfig.boardWidth, styleConfig.boardHeight);
  const boardTop = 20;
  const boardBottom = styleConfig.boardHeight - 20;
  const boardHeight = boardBottom - boardTop;
  ctx.fillStyle = styleConfig.colors.bar;
  ctx.strokeRect(styleConfig.boardWidth / 2 - styleConfig.barWidth / 2, boardTop, styleConfig.barWidth, boardHeight);
  ctx.strokeRect(0, boardTop, styleConfig.barWidth, boardHeight);
  ctx.strokeRect(styleConfig.boardWidth - styleConfig.columnWidth, boardTop, styleConfig.barWidth, boardHeight);
  const colors = [styleConfig.colors.triangleDark, styleConfig.colors.triangleLight];
  const drawTriangle = (x, isBottomHalf, color) => {
    ctx.beginPath();
    if (isBottomHalf) {
      ctx.moveTo(x, boardBottom);
      ctx.lineTo(x + styleConfig.pointWidth / 2, boardBottom - styleConfig.triangleHeight);
      ctx.lineTo(x + styleConfig.pointWidth, boardBottom);
    } else {
      ctx.moveTo(x, boardTop);
      ctx.lineTo(x + styleConfig.pointWidth / 2, boardTop + styleConfig.triangleHeight);
      ctx.lineTo(x + styleConfig.pointWidth, boardTop);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = styleConfig.colors.boardBorder;
    ctx.lineWidth = styleConfig.sizing.strokeWidth;
    ctx.stroke();
    ctx.fill();
  };
  for (let i = 0; i < 12; i++) {
    let x = i * styleConfig.pointWidth;
    x += styleConfig.columnWidth;
    if (i >= 6) x += styleConfig.barWidth;
    let quadrantIndex = i < 6 ? 0 : 1;
    let color = colors[(i + 1) % 2];
    drawTriangle(x, true, color);
  }
  for (let i = 0; i < 12; i++) {
    let x = i * styleConfig.pointWidth;
    x += styleConfig.columnWidth;
    if (i >= 6) x += styleConfig.barWidth;
    let quadrantIndex = i < 6 ? 3 : 2;
    let color = colors[i % 2];
    drawTriangle(x, false, color);
  }
  ctx.lineWidth = styleConfig.sizing.borderWidth;
  ctx.strokeRect(0, boardTop, styleConfig.boardWidth, boardHeight);
}
function drawCheckerLabel(ctx, x, y, text, checkerColor) {
  ctx.font = styleConfig.fonts.checkerLabel;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = checkerColor;
  ctx.fillText(text, x, y);
}
function drawScoreAtPosition(ctx, xPos, yPos, score, header) {
  const sizeX = styleConfig.columnWidth;
  const sizeY = sizeX + styleConfig.checkerRadius;
  ctx.fillStyle = styleConfig.colors.scoreBackground;
  ctx.strokeStyle = styleConfig.colors.scoreBorder;
  ctx.fillRect(xPos - sizeX / 2, yPos - sizeY / 2, sizeX, sizeY);
  ctx.lineWidth = 1;
  ctx.strokeRect(xPos - sizeX / 2, yPos - sizeY / 2, sizeX, sizeY);
  ctx.font = styleConfig.fonts.scoreHeader;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = styleConfig.colors.text;
  ctx.fillText(header, xPos, yPos - styleConfig.checkerRadius * 0.5);
  ctx.font = styleConfig.fonts.scoreValue;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = styleConfig.colors.text;
  ctx.fillText(score.toString(), xPos, yPos + styleConfig.checkerRadius * 0.5);
}
function drawCubeAtPosition(ctx, xPos, yPos, cubeValue) {
  const size = styleConfig.columnWidth - styleConfig.sizing.cubeSize;
  ctx.fillStyle = styleConfig.colors.cubeBackground;
  ctx.strokeStyle = styleConfig.colors.cubeBorder;
  ctx.fillRect(xPos - size / 2, yPos - size / 2, size, size);
  ctx.strokeRect(xPos - size / 2, yPos - size / 2, size, size);
  ctx.font = styleConfig.fonts.cubeValue;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = styleConfig.colors.text;
  ctx.fillText(cubeValue, xPos, yPos);
}
function drawDieAtPosition(ctx, x, y, size, value, color) {
  const dieValue = Math.max(1, Math.min(value, 6));
  const radius = size / 2;
  const pipRadius = size * styleConfig.sizing.diePipRadius;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.strokeStyle = color === styleConfig.colors.checkerWhite ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite;
  ctx.lineWidth = styleConfig.sizing.strokeWidth;
  ctx.roundRect(x - radius, y - radius, size, size, size * styleConfig.sizing.dieCornerRadius);
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
    ctx.fillStyle = color === styleConfig.colors.checkerWhite ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite;
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
  ctx.arc(xPos, yPos, styleConfig.checkerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = styleConfig.colors.boardBorder;
  ctx.stroke();
}
function renderPointNumbers(ctx, boardData) {
  const getPointX = (pointNumber) => {
    let index = 0;
    const centerOfPoint = styleConfig.pointWidth / 2;
    if (pointNumber > 12) {
      index = pointNumber - 12;
    } else {
      index = 13 - pointNumber;
    }
    if (index > 6) {
      index++;
    }
    index++;
    return index * styleConfig.pointWidth - centerOfPoint;
  };
  ctx.font = styleConfig.fonts.pointNumber;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = styleConfig.colors.pointNumber;
  for (let pointNumber = 1; pointNumber <= 24; pointNumber++) {
    const x = getPointX(pointNumber);
    let displayNumber = pointNumber;
    if (boardData.turn === "O") {
      displayNumber = 25 - pointNumber;
    }
    const isTopRow = pointNumber > 12;
    const y = isTopRow ? 10 : (
      // Above the board
      styleConfig.boardHeight - 8
    );
    ctx.fillText(displayNumber.toString(), x, y);
  }
}
function renderPipCounts(ctx, boardData) {
  ctx.font = styleConfig.fonts.pipCount;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = styleConfig.colors.pipCount;
  const boardTop = 20;
  const boardBottom = styleConfig.boardHeight - 20;
  const barCenterX = styleConfig.boardWidth / 2;
  const margin = 15;
  ctx.fillText(`${boardData.pipCountX}`, barCenterX, boardBottom - margin);
  ctx.fillText(`${boardData.pipCountO}`, barCenterX, boardTop + margin);
}
function drawCheckers(ctx, boardData) {
  const getPointX = (absolutePointNumber) => {
    let index = 0;
    const centerOfPoint = styleConfig.pointWidth / 2;
    if (absolutePointNumber == 0 || absolutePointNumber == 25)
      return 8 * styleConfig.pointWidth - centerOfPoint;
    if (absolutePointNumber > 12)
      index = absolutePointNumber - 12;
    else
      index = 13 - absolutePointNumber;
    if (index > 6)
      index++;
    index++;
    return index * styleConfig.pointWidth - centerOfPoint;
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
    let margin = styleConfig.checkerMargin;
    if (onBar)
      margin += styleConfig.checkerRadius * 2;
    const boardTop = 20;
    const boardBottom = styleConfig.boardHeight - 20;
    const yStart = isTop ? boardTop + margin : boardBottom - margin;
    const direction = isTop ? 1 : -1;
    ctx.lineWidth = 1;
    for (let j = 0; j < point.checkerCount; j++) {
      let checkerColor = point.player === "X" ? styleConfig.colors.checkerBlack : styleConfig.colors.checkerWhite;
      let xPos = x;
      let yPos = yStart + direction * j * styleConfig.checkerRadius * 2;
      drawCheckerAtPosition(ctx, xPos, yPos, checkerColor);
    }
  }
  ;
  if (boardData.borneOffX > 0) {
    const xPos = styleConfig.boardColumns * styleConfig.columnWidth - styleConfig.columnWidth * 0.5;
    const boardBottom = styleConfig.boardHeight - 20;
    const yPos = boardBottom - (styleConfig.checkerMargin + styleConfig.checkerRadius);
    drawCheckerAtPosition(ctx, xPos, yPos, styleConfig.colors.checkerBlack);
    drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffX.toString(), styleConfig.colors.checkerWhite);
  }
  if (boardData.borneOffO > 0) {
    const xPos = styleConfig.boardColumns * styleConfig.columnWidth - styleConfig.columnWidth * 0.5;
    const boardTop = 20;
    const yPos = boardTop + styleConfig.checkerMargin + styleConfig.checkerRadius;
    drawCheckerAtPosition(ctx, xPos, yPos, styleConfig.colors.checkerWhite);
    drawCheckerLabel(ctx, xPos, yPos, boardData.borneOffO.toString(), styleConfig.colors.checkerBlack);
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
  const lines = xgid.trim().split("\n");
  const xgidLine = lines.find((line) => line.trim().startsWith("XGID="));
  if (!xgidLine) {
    throw new Error('No line found starting with "XGID="');
  }
  const cleanXgid = xgidLine.trim();
  if (!cleanXgid.match(/^XGID=[a-zA-Z\-]+:[0-9]+:-?[0-9]+:-?[0-9]+:/)) {
    throw new Error("Invalid XGID format: does not match expected pattern");
  }
  const xgidString = cleanXgid;
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
    crawford,
    xgid: xgidString,
    pipCountX: 0,
    pipCountO: 0
  };
  boardData.pipCountX = calculatePipCount(boardData, "X");
  boardData.pipCountO = calculatePipCount(boardData, "O");
  return boardData;
}
function calculatePipCount(boardData, player) {
  let pipCount = 0;
  for (let i = 0; i < boardData.points.length; i++) {
    const point = boardData.points[i];
    if (point.player === player && point.checkerCount > 0) {
      let distance = 0;
      if (i === 0 || i === 25) {
        distance = 25;
      } else if (player === "X") {
        distance = i;
      } else {
        distance = 25 - i;
      }
      pipCount += distance * point.checkerCount;
    }
  }
  return pipCount;
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
        const xgidContainer = el.createDiv({ cls: "xgid-display" });
        xgidContainer.style.cssText = "margin-top: 10px; padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; color: #333;";
        xgidContainer.setText(`XGID=${xgid}`);
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
