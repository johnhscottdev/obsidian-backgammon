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
      } else if (player === "O") {
        distance = i;
      } else {
        distance = 25 - i;
      }
      pipCount += distance * point.checkerCount;
    }
  }
  return pipCount;
}

// src/utils/parseAnalysis.ts
function extractAnalysisText(content) {
  const lines = content.split("\n");
  const xgidIndex = lines.findIndex((line) => line.trim().startsWith("XGID="));
  if (xgidIndex === -1) return null;
  let analysisStart = -1;
  for (let i = xgidIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\d+\.\s+/) || line.includes("Player Winning Chances:")) {
      analysisStart = i;
      break;
    }
  }
  if (analysisStart === -1) return null;
  return lines.slice(analysisStart).join("\n");
}
function parseAnalysis(analysisText) {
  if (!analysisText) return null;
  if (analysisText.includes("Player Winning Chances:")) {
    return parseCubeAnalysis(analysisText);
  } else if (analysisText.match(/^\s*\d+\.\s+/m)) {
    return parseMoveAnalysis(analysisText);
  }
  return null;
}
function parseMoveAnalysis(text) {
  const moves = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const moveMatch = line.match(/^(\d+)\.\s+(.+?)\s+eq:([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
    if (moveMatch) {
      const [, rank, remainder, equity, equityDiff] = moveMatch;
      const parts = remainder.trim().split(/\s+/);
      let analysisLevel = "";
      let move = "";
      let moveStartIndex = -1;
      for (let j = 0; j < parts.length; j++) {
        if (parts[j].includes("/") || parts[j].includes("(") || /^\d/.test(parts[j])) {
          moveStartIndex = j;
          break;
        }
      }
      if (moveStartIndex > 0) {
        analysisLevel = parts.slice(0, moveStartIndex).join(" ");
        move = parts.slice(moveStartIndex).join(" ");
      } else {
        analysisLevel = parts[0];
        move = parts.slice(1).join(" ");
      }
      let playerStats = null;
      let opponentStats = null;
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const playerMatch = nextLine.match(/Player:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
        if (playerMatch) {
          playerStats = {
            win: parseFloat(playerMatch[1]),
            gammon: parseFloat(playerMatch[2]),
            backgammon: parseFloat(playerMatch[3])
          };
        }
      }
      if (i + 2 < lines.length) {
        const opponentLine = lines[i + 2].trim();
        const opponentMatch = opponentLine.match(/Opponent:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
        if (opponentMatch) {
          opponentStats = {
            win: parseFloat(opponentMatch[1]),
            gammon: parseFloat(opponentMatch[2]),
            backgammon: parseFloat(opponentMatch[3])
          };
        }
      }
      moves.push({
        rank: parseInt(rank),
        move: move.trim(),
        equity: parseFloat(equity),
        equityDiff: equityDiff ? parseFloat(equityDiff) : 0,
        analysisLevel: analysisLevel.trim(),
        playerStats,
        opponentStats
      });
    }
  }
  return {
    type: "move",
    moves
  };
}
function parseCubeAnalysis(text) {
  const lines = text.split("\n");
  let playerWinning = null;
  let opponentWinning = null;
  let cubelessEquities = null;
  let cubefulEquities = {};
  let bestAction = null;
  for (const line of lines) {
    const trimmed = line.trim();
    const playerMatch = trimmed.match(/Player Winning Chances:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
    if (playerMatch) {
      playerWinning = {
        win: parseFloat(playerMatch[1]),
        gammon: parseFloat(playerMatch[2]),
        backgammon: parseFloat(playerMatch[3])
      };
    }
    const opponentMatch = trimmed.match(/Opponent Winning Chances:\s+([\d.]+)%\s+\(G:([\d.]+)%\s+B:([\d.]+)%\)/);
    if (opponentMatch) {
      opponentWinning = {
        win: parseFloat(opponentMatch[1]),
        gammon: parseFloat(opponentMatch[2]),
        backgammon: parseFloat(opponentMatch[3])
      };
    }
    const cubelessMatch = trimmed.match(/Cubeless Equities:\s+No Double=([\+\-]\d+\.\d+),\s+Double=([\+\-]\d+\.\d+)/);
    if (cubelessMatch) {
      cubelessEquities = {
        noDouble: parseFloat(cubelessMatch[1]),
        double: parseFloat(cubelessMatch[2])
      };
    }
    if (trimmed.includes("No double:")) {
      const noDoubleMatch = trimmed.match(/No double:\s+([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
      if (noDoubleMatch) {
        cubefulEquities = {
          ...cubefulEquities,
          noDouble: parseFloat(noDoubleMatch[1]),
          noDoubleDiff: noDoubleMatch[2] ? parseFloat(noDoubleMatch[2]) : void 0
        };
      }
    }
    if (trimmed.includes("Double/Take:")) {
      const takeMatch = trimmed.match(/Double\/Take:\s+([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
      if (takeMatch) {
        cubefulEquities = {
          ...cubefulEquities,
          doubleTake: parseFloat(takeMatch[1]),
          doubleTakeDiff: takeMatch[2] ? parseFloat(takeMatch[2]) : void 0
        };
      }
    }
    if (trimmed.includes("Double/Beaver:")) {
      const beaverMatch = trimmed.match(/Double\/Beaver:\s+([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
      if (beaverMatch) {
        cubefulEquities = {
          ...cubefulEquities,
          doubleBeaver: parseFloat(beaverMatch[1]),
          doubleBeaverDiff: beaverMatch[2] ? parseFloat(beaverMatch[2]) : void 0
        };
      }
    }
    if (trimmed.includes("Double/Pass:")) {
      const passMatch = trimmed.match(/Double\/Pass:\s+([\+\-]\d+\.\d+)(?:\s+\(([\+\-]\d+\.\d+)\))?/);
      if (passMatch) {
        cubefulEquities = {
          ...cubefulEquities,
          doublePass: parseFloat(passMatch[1]),
          doublePassDiff: passMatch[2] ? parseFloat(passMatch[2]) : void 0
        };
      }
    }
    const actionMatch = trimmed.match(/Best Cube action:\s+(.+)/);
    if (actionMatch) {
      bestAction = actionMatch[1];
    }
  }
  return {
    type: "cube",
    playerWinning,
    opponentWinning,
    cubelessEquities,
    cubefulEquities: Object.keys(cubefulEquities).length > 0 ? cubefulEquities : null,
    bestAction
  };
}

// src/utils/renderAnalysis.ts
function getMoveColor(equityDiff) {
  const absEquityDiff = Math.abs(equityDiff);
  if (absEquityDiff < 0.2) {
    return "#000000";
  } else if (absEquityDiff < 0.8) {
    return "#008000";
  } else {
    return "#ff0000";
  }
}
function renderAnalysis(analysis) {
  const container = document.createElement("div");
  container.className = "backgammon-analysis";
  const style = document.createElement("style");
  style.textContent = `
        .backgammon-analysis {
            margin-top: 20px;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.4;
            background: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
        }
        
        .analysis-move {
            margin-bottom: 8px;
        }
        
        .move-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2px;
        }
        
        .move-text {
            font-weight: bold;
        }
        
        .move-equity {
            font-weight: bold;
            text-align: right;
        }
        
        .move-stats {
            font-size: 10px;
            color: #666;
            margin-left: 20px;
        }
        
        .cube-analysis {
            margin-bottom: 12px;
        }
        
        .cube-section {
            margin-bottom: 8px;
        }
        
        .cube-title {
            font-weight: bold;
            margin-bottom: 4px;
        }
        
        .cube-line {
            margin-bottom: 2px;
        }
        
        .winning-chances {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            flex-wrap: wrap;
        }
        
        .winning-label {
            flex: 0 0 auto;
            min-width: 180px;
        }
        
        .winning-stats {
            flex: 1;
            text-align: right;
            font-family: monospace;
            min-width: 200px;
        }
        
        @media (max-width: 400px) {
            .winning-chances {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .winning-label {
                min-width: auto;
                margin-bottom: 2px;
            }
            
            .winning-stats {
                text-align: left;
                min-width: auto;
                margin-left: 20px;
            }
        }
        
        .equity-table {
            margin: 8px 0;
        }
        
        .equity-row {
            font-family: monospace;
            white-space: pre;
            margin-bottom: 2px;
        }
        
        .best-action {
            font-weight: bold;
            color: #0066cc;
            margin-top: 8px;
        }
    `;
  container.appendChild(style);
  if (analysis.type === "move") {
    renderMoveAnalysis(container, analysis);
  } else {
    renderCubeAnalysis(container, analysis);
  }
  return container;
}
function renderMoveAnalysis(container, analysis) {
  analysis.moves.forEach((move) => {
    const moveDiv = document.createElement("div");
    moveDiv.className = "analysis-move";
    const moveLine = document.createElement("div");
    moveLine.className = "move-line";
    const moveText = document.createElement("span");
    moveText.className = "move-text";
    moveText.style.color = getMoveColor(move.equityDiff);
    const moveNotation = `${move.rank}. ${move.move}`;
    moveText.textContent = moveNotation;
    const equityText = document.createElement("span");
    equityText.className = "move-equity";
    equityText.style.color = getMoveColor(move.equityDiff);
    let equityDisplay = move.equity >= 0 ? `+${move.equity.toFixed(3)}` : move.equity.toFixed(3);
    if (move.equityDiff !== 0) {
      const diffDisplay = move.equityDiff >= 0 ? `+${move.equityDiff.toFixed(3)}` : move.equityDiff.toFixed(3);
      equityDisplay += ` (${diffDisplay})`;
    }
    equityText.textContent = equityDisplay;
    moveLine.appendChild(moveText);
    moveLine.appendChild(equityText);
    moveDiv.appendChild(moveLine);
    if (move.playerStats) {
      const playerStats = document.createElement("div");
      playerStats.className = "move-stats";
      playerStats.innerHTML = `P: ${move.playerStats.win.toFixed(1)} ${move.playerStats.gammon.toFixed(1)} ${move.playerStats.backgammon.toFixed(1)} &nbsp;&nbsp; O: ${move.opponentStats?.win.toFixed(1) || "0.0"} ${move.opponentStats?.gammon.toFixed(1) || "0.0"} ${move.opponentStats?.backgammon.toFixed(1) || "0.0"}`;
      moveDiv.appendChild(playerStats);
    }
    container.appendChild(moveDiv);
  });
}
function renderCubeAnalysis(container, analysis) {
  const cubeDiv = document.createElement("div");
  cubeDiv.className = "cube-analysis";
  if (analysis.playerWinning && analysis.opponentWinning) {
    const winningDiv = document.createElement("div");
    winningDiv.className = "cube-section";
    const playerLine = document.createElement("div");
    playerLine.className = "cube-line winning-chances";
    const playerLabel = document.createElement("span");
    playerLabel.className = "winning-label";
    playerLabel.textContent = "Player Winning Chances:";
    const playerStats = document.createElement("span");
    playerStats.className = "winning-stats";
    playerStats.textContent = `${analysis.playerWinning.win.toFixed(2)}% (G:${analysis.playerWinning.gammon.toFixed(2)}% B:${analysis.playerWinning.backgammon.toFixed(2)}%)`;
    playerLine.appendChild(playerLabel);
    playerLine.appendChild(playerStats);
    const opponentLine = document.createElement("div");
    opponentLine.className = "cube-line winning-chances";
    const opponentLabel = document.createElement("span");
    opponentLabel.className = "winning-label";
    opponentLabel.textContent = "Opponent Winning Chances:";
    const opponentStats = document.createElement("span");
    opponentStats.className = "winning-stats";
    opponentStats.textContent = `${analysis.opponentWinning.win.toFixed(2)}% (G:${analysis.opponentWinning.gammon.toFixed(2)}% B:${analysis.opponentWinning.backgammon.toFixed(2)}%)`;
    opponentLine.appendChild(opponentLabel);
    opponentLine.appendChild(opponentStats);
    winningDiv.appendChild(playerLine);
    winningDiv.appendChild(opponentLine);
    cubeDiv.appendChild(winningDiv);
  }
  if (analysis.cubefulEquities) {
    const cubefulDiv = document.createElement("div");
    cubefulDiv.className = "cube-section";
    const title = document.createElement("div");
    title.className = "cube-title";
    title.textContent = "Cubeful Equities:";
    const equityTable = document.createElement("div");
    equityTable.className = "equity-table";
    if (analysis.cubefulEquities.noDouble !== void 0) {
      const row = document.createElement("div");
      row.className = "equity-row";
      let baseValue = analysis.cubefulEquities.noDouble >= 0 ? `+${analysis.cubefulEquities.noDouble.toFixed(3)}` : analysis.cubefulEquities.noDouble.toFixed(3);
      let diffValue = "";
      if (analysis.cubefulEquities.noDoubleDiff !== void 0) {
        const diff = analysis.cubefulEquities.noDoubleDiff >= 0 ? `+${analysis.cubefulEquities.noDoubleDiff.toFixed(3)}` : analysis.cubefulEquities.noDoubleDiff.toFixed(3);
        diffValue = ` (${diff})`;
      }
      row.textContent = "No double:".padEnd(20) + baseValue + diffValue;
      equityTable.appendChild(row);
    }
    if (analysis.cubefulEquities.doubleTake !== void 0) {
      const row = document.createElement("div");
      row.className = "equity-row";
      let baseValue = analysis.cubefulEquities.doubleTake >= 0 ? `+${analysis.cubefulEquities.doubleTake.toFixed(3)}` : analysis.cubefulEquities.doubleTake.toFixed(3);
      let diffValue = "";
      if (analysis.cubefulEquities.doubleTakeDiff !== void 0) {
        const diff = analysis.cubefulEquities.doubleTakeDiff >= 0 ? `+${analysis.cubefulEquities.doubleTakeDiff.toFixed(3)}` : analysis.cubefulEquities.doubleTakeDiff.toFixed(3);
        diffValue = ` (${diff})`;
      }
      row.textContent = "Double/Take:".padEnd(20) + baseValue + diffValue;
      equityTable.appendChild(row);
    }
    if (analysis.cubefulEquities.doubleBeaver !== void 0) {
      const row = document.createElement("div");
      row.className = "equity-row";
      let baseValue = analysis.cubefulEquities.doubleBeaver >= 0 ? `+${analysis.cubefulEquities.doubleBeaver.toFixed(3)}` : analysis.cubefulEquities.doubleBeaver.toFixed(3);
      let diffValue = "";
      if (analysis.cubefulEquities.doubleBeaverDiff !== void 0) {
        const diff = analysis.cubefulEquities.doubleBeaverDiff >= 0 ? `+${analysis.cubefulEquities.doubleBeaverDiff.toFixed(3)}` : analysis.cubefulEquities.doubleBeaverDiff.toFixed(3);
        diffValue = ` (${diff})`;
      }
      row.textContent = "Double/Beaver:".padEnd(20) + baseValue + diffValue;
      equityTable.appendChild(row);
    }
    if (analysis.cubefulEquities.doublePass !== void 0) {
      const row = document.createElement("div");
      row.className = "equity-row";
      let baseValue = analysis.cubefulEquities.doublePass >= 0 ? `+${analysis.cubefulEquities.doublePass.toFixed(3)}` : analysis.cubefulEquities.doublePass.toFixed(3);
      let diffValue = "";
      if (analysis.cubefulEquities.doublePassDiff !== void 0) {
        const diff = analysis.cubefulEquities.doublePassDiff >= 0 ? `+${analysis.cubefulEquities.doublePassDiff.toFixed(3)}` : analysis.cubefulEquities.doublePassDiff.toFixed(3);
        diffValue = ` (${diff})`;
      }
      row.textContent = "Double/Pass:".padEnd(20) + baseValue + diffValue;
      equityTable.appendChild(row);
    }
    cubefulDiv.appendChild(title);
    cubefulDiv.appendChild(equityTable);
    cubeDiv.appendChild(cubefulDiv);
  }
  if (analysis.bestAction) {
    const actionDiv = document.createElement("div");
    actionDiv.className = "best-action";
    actionDiv.textContent = `Best Cube action: ${analysis.bestAction}`;
    cubeDiv.appendChild(actionDiv);
  }
  container.appendChild(cubeDiv);
}

// src/main.ts
var BackgammonPlugin = class extends import_obsidian.Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("xgid", (source, el) => {
      try {
        const lines = source.split("\n");
        const xgidLine = lines.find((line) => line.trim().startsWith("XGID="));
        if (!xgidLine) {
          throw new Error("No XGID found in code block");
        }
        const boardData = parseXGID(xgidLine);
        renderBoard(el, boardData);
        const xgidContainer = el.createDiv({ cls: "xgid-display" });
        xgidContainer.style.cssText = "margin-top: 10px; padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; color: #333;";
        xgidContainer.setText(xgidLine);
        const analysisText = extractAnalysisText(source);
        if (analysisText) {
          const analysis = parseAnalysis(analysisText);
          if (analysis) {
            const analysisElement = renderAnalysis(analysis);
            el.appendChild(analysisElement);
          }
        }
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
