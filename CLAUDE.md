# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

- **Build**: `npm run build` - Uses esbuild to compile TypeScript to main.js
- **Install dependencies**: `npm install`
- **Clean build**: Delete main.js and run `npm run build`

## Plugin Installation for Testing

1. Build the plugin with `npm run build`
2. Copy the entire plugin folder to your Obsidian vault's `.obsidian/plugins/` directory
3. Enable "Backgammon XGID Display" in Settings → Community plugins
4. Test with `xgid` code blocks in your notes

## Architecture Overview

This is an Obsidian plugin that renders backgammon positions from XGID (eXtreme Gammon ID) format using HTML5 Canvas.

### Core Components

- **main.ts**: Plugin entry point, registers 'xgid' code block processor
- **parseXGID.ts**: Converts XGID strings to structured BoardData
- **renderBoard.ts**: Canvas-based visual rendering with responsive scaling
- **board.ts**: Type definitions for game state and board data

### Data Flow

```
XGID Code Block → parseXGID() → BackgammonPosition → renderBoard() → Canvas Display
                              ↓
                    extractMoveBlocks() → XG Analysis Text
```

### XGID Format Structure

XGID strings are colon-separated: `position:cube:turn:dice:scores:rules`

- **Position**: Character encoding (a-z = O player, A-Z = X player, dash = empty)
- **Cube**: `owner:value` (0=center, 1=X, 2=O)
- **Turn**: 0=X, 1=O
- **Dice**: Two digits (or special values for non-numeric states)
- **Scores**: `X:O` format
- **Rules**: Flags like Crawford, Jacoby, etc.

### Canvas Rendering Architecture

- Uses ResizeObserver for responsive scaling
- 15-column layout: bearoff + 6 points + bar + 6 points + bearoff
- Point numbering follows 24-point backgammon system
- Renders checkers, dice, doubling cube, and match scores

### Key Technical Decisions

- **Canvas over SVG**: Chosen for performance and pixel-perfect control
- **Character encoding**: Efficient position storage using a-z/A-Z mapping
- **Responsive design**: Dynamic scaling based on container width
- **Type safety**: Comprehensive TypeScript types for game state

## File Structure

```
src/
├── main.ts              # Plugin registration and orchestration
├── types/
│   ├── index.ts         # Type exports
│   └── board.ts         # Core game data types
└── utils/
    ├── index.ts         # Utility exports
    ├── parseXGID.ts     # XGID parsing logic
    └── renderBoard.ts   # Canvas rendering logic
```

## Important Notes

- The plugin registers for 'xgid' code blocks (changed from 'backgammon')
- All rendering is done via Canvas API for performance
- BackgammonPosition interface represents complete game state including cube, scores, and rules
- XG analysis blocks are extracted and displayed as formatted text below the board