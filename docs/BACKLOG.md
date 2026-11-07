# Backlog

Known bugs and ideas from the code review on 2026-11-07. When fixing a bug, follow the
regression rule in `CLAUDE.md` (add a `test-vault/10 Regressions.md` entry and a Jest test),
then tick it off here.

## Bugs

- [ ] **Tall stacks overflow their point.** No cap on checkers drawn per point. The 6th checker
  crosses the center line and the 7th+ overlap the opposite stack (`renderBoard.ts`, `drawCheckers`).
  Fix: draw at most 5 and label the top checker with the total.
  Vault: `01 Board positions` → "15 checkers on one point" and "Bear-off with 7 on the 6-point".
- [ ] **Redouble analysis is dropped.** Cube analysis only matches `No double:` / `Double/Take:` /
  `Double/Pass:`. When the cube is owned XG prints `No redouble:` / `Redouble/Take:` / `Redouble/Pass:`,
  so the cubeful equities are missing (`parseAnalysis.ts`).
  Vault: `04 Cube analysis` → "Redouble / No redouble" (real XG copy).
- [ ] **Beaver flag parsed backwards.** `rulesFlags % 4 === 1` should be `(rulesFlags & 2) !== 0`.
  Also, in match play the flag means Crawford, so `jacoby` should be false there (`parseXGID.ts`).
  Not visible today because neither flag is drawn.
- [ ] **Doubled / beavered / raccooned dice states (`D`, `B`, `R`) show the wrong header.** They
  parse as dice 0 and the header says "on roll - cube decision" instead of "take or pass".
  Needs a real XGID copied from XG for each state to confirm the exact format.
- [ ] **Position length isn't validated.** A position that isn't 26 characters, or a side with
  more than 15 checkers, is accepted and draws garbage (borne-off count can go negative).
  Should show the error box instead.

## Docs and housekeeping

- [ ] `README.md` usage example 1 uses a 23-character position
  (`XGID=-a-bE-D---cD---c-b-a-E-:...`), which draws a shifted board. Replace with a real XG copy.
  Many examples in `docs/XGID-EXAMPLES.md` and `docs/XGID-FORMAT.md` have the same problem, and the
  docs describe the field order differently from what XG actually writes.
- [ ] `coverage/` and `dist/` are in `.gitignore` but still tracked. Run `git rm -r --cached coverage dist`.
- [ ] `extractMoveBlocks` in `parseXGID.ts` is unused.
- [ ] `renderCubeAnalysis` repeats the same row-formatting block four times; pull out a helper.
- [ ] Stale comments: `main.ts` header says the block is `backgammon` (it's `xgid`); XGID field
  comments in `parseXGID.ts` say cube owner `2` = O and turn `0` = X (XG uses `-1` / `1`).
- [ ] `obsidian` should be a devDependency in `package.json`.
- [ ] No `versions.json` (Obsidian uses it to map plugin versions to minimum app versions).
- [ ] `npm audit` reports issues; `npm audit fix` should clear them.

## Ideas

- [ ] **Sharper board on iPhone / high-DPI screens.** See the design decision in `CLAUDE.md`:
  resolution is fixed on purpose; any change must be checked on iPhone.
- [ ] Checkers are slightly oval: the 8px internal margin scales X only (`setTransform(scaleX, 0, 0, 1, ...)`).
- [ ] Dark-mode board and analysis colors (use Obsidian CSS variables for the analysis panel).
- [ ] Show per-move win/gammon percentages if a clean design is found (parsing is already kept).
- [ ] Settings tab: player names instead of Black/White, board colors, toggle pip counts and point numbers.
- [ ] Copy-XGID button (commented-out XGID display code exists in `main.ts`).
