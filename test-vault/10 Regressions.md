---
expect: board
---
# Regressions

One entry per bug that has been fixed, so it stays fixed. Each entry also has a Jest test.
Newest at the bottom.

Template:

````markdown
## <Short name of the bug> (fixed YYYY-MM-DD)
What went wrong, in one sentence.
**Expect:** What correct looks like.

```xgid
XGID=...
```
````

If the bug needs an error box rather than a board, put the entry in [[05 Invalid input]] instead
(and mention it here with a link).

---

## XGID line split by the player-names line (fixed 2026-11-07)
XG produced a copy where "X:Amy Trudeau   O:John Scott" was spliced into the middle of the XGID
line, with the rest of the XGID on the next line. The plugin showed "Invalid XGID format".
**Expect:** No error. Board drawn as `XGID=--CAABD-------------cdbba-:1:-1:-1:00:1:0:0:9:10`:
White on roll (header "White on roll - cube decision"), point numbers in White's view. Cube 2 at the
**top** of the left tray (White owns it). Score boxes White 0, Length 9, Black 1. Pip counts
Black 47 / White 42. Borne off: Black 4, White 3. Below the board: winning chances 74.36% / 25.64%
and "Best cube action: Redouble / Take". (The redouble cubeful equities are missing until the
redouble-parsing bug in `docs/BACKLOG.md` is fixed.)
Note: XG's text calls the player on roll "X", so XG's X (Amy, 42 pips) is the plugin's White here.
Confirmed: XG's Ctrl+Shift+C copy of this position is exactly the repaired XGID above, and Ctrl+C
reproduces the split every time.
Jest: `tests/splitXgidLine.test.ts`.

```xgid
XGID=--CAABD-------------cdbba-:1:-1:-X:Amy Trudeau   O:John Scott
1:00:1:0:0:9:10

Score is X:0 O:1 9 pt.(s) match.
 +13-14-15-16-17-18------19-20-21-22-23-24-+
 |                  |   | O  O  O  O  O    |
 |                  |   | O  O        O    |
 |                  |   | O           O    |
 |                  |   | O                |
 |                  |   |                  |
 |                  |BAR|                  |
 |                  |   |                  |
 |                  |   |       X          |
 |                  |   |    X  X          | +---+
 |                  |   |    X  X  X  X    | | 2 |
 |                  |   |    X  X  X  X  X | +---+
 +12-11-10--9--8--7-------6--5--4--3--2--1-+
Pip count  X: 42  O: 47 X-O: 0-1/9
Cube: 2, X own cube
X on roll, cube action

Analyzed in XG Roller+
Player Winning Chances:   74.36% (G:0.00% B:0.00%)
Opponent Winning Chances: 25.64% (G:0.00% B:0.00%)

Cubeless Equities: No Double=+0.487, Double=+1.029

Cubeful Equities:
       No redouble:     +0.791 (-0.099)
       Redouble/Take:   +0.889
       Redouble/Pass:   +1.000 (+0.111)

Best Cube action: Redouble / Take

eXtreme Gammon Version: 2.10, MET: Kazaross XG2
```

## Same position, copied with Ctrl+Shift+C (XGID only)
**Expect:** Exactly the same board as the entry above (no analysis panel).

```xgid
XGID=--CAABD-------------cdbba-:1:-1:-1:00:1:0:0:9:10
```

## Invalid turn field shown as "Black on roll" (fixed 2026-11-07)
XG produced this XGID after a broken copy was pasted back into it. The turn field is `0`, which
isn't valid (it must be 1 or -1), but the plugin silently showed "Black on roll".
**Expect:** Header "Unknown player on roll - cube decision". A yellow warning bar under the header
saying the turn field is 0 and the XGID may be corrupted. Board still drawn: cube 2 at the top of the
left tray, pip counts 111 / 42, no score boxes.
Jest: `tests/turnField.test.ts`.

```xgid
XGID=--CAABD---------D---cdbba-:1:-1:0:00:0:0:0:0:10
```

## Tall stacks overflowed their point (fixed 2026-11-07)
There was no cap on checkers drawn per point, so the 6th checker crossed the centre line and the
7th and later overlapped the opposite stack. Now at most 5 are drawn on a point (4 on the bar,
which starts further in) and the first checker (nearest the board edge) is labelled with the total.
See also "15 checkers on one point", "Bear-off with 7 on the 6-point" and "9 checkers on the bar for each player" in [[01 Board positions]].
Jest: `tests/tallStacks.test.ts`.

**Expect:** Black: 9 on its 6-point, drawn as 5 with the first one (nearest the edge) labelled "9" in white, and 6 on
the bar (top half), drawn as 4 with the first one labelled "6" in white. White mirrored: 9 on its
6-point and 6 on the bar (bottom half), labels in black. No stack reaches the centre line or the
opposite stack. Pip counts 204 / 204.

```xgid
XGID=f-----I------------i-----F:0:0:1:00:0:0:3:0:10
```
