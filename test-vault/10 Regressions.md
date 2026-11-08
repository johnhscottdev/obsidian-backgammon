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
Cubeful equities: No redouble +0.791 (-0.099), Redouble/Take +0.889, Redouble/Pass +1.000 (+0.111).
"Best cube action: Redouble / Take".
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

## Redouble analysis dropped (fixed 2026-11-07)
When the cube is already owned, XG writes "No redouble" / "Redouble/Take" / "Redouble/Pass" (and
"Redouble/Beaver" in money play). Only the "double" wording was parsed, so the cubeful equities were
missing below the board. The split-XGID entry above was affected too.
Jest: `tests/redoubleAnalysis.test.ts` (also covers Redouble/Beaver, with constructed text until a
real XG copy is available).
**Expect:** Below the board, "Cubeful equities:" with three rows in XG's wording:
No redouble +0.582, Redouble/Take +0.449 (-0.133), Redouble/Pass +1.000 (+0.418).
"Best cube action: No redouble / Take". Board as in [[04 Cube analysis]] → "Redouble / No redouble".

```xgid
XGID=--a--CCBCa---C---d-bb-cbA-:1:1:1:00:0:0:0:9:10
X:Jeremy Ly   O:John Scott

Score is X:0 O:0 9 pt.(s) match.
 +13-14-15-16-17-18------19-20-21-22-23-24-+
 | X           O    |   | O  O     O  O  X |
 | X           O    |   | O  O     O  O    |
 | X           O    |   |          O       |
 |             O    |   |                  |
 |                  |   |                  |
 |                  |BAR|                  |
 |                  |   |                  |
 |                  |   |                  |
 |             X    |   | X  X             | +---+
 |             X  X |   | X  X             | | 2 |
 |          O  X  X |   | X  X        O    | +---+
 +12-11-10--9--8--7-------6--5--4--3--2--1-+
Pip count  X: 134  O: 106 X-O: 0-0/9
Cube: 2, X own cube
X on roll, cube action

Analyzed in XG Roller+
Player Winning Chances:   64.84% (G:12.13% B:0.47%)
Opponent Winning Chances: 35.16% (G:10.10% B:0.21%)

Cubeless Equities: No Double=+0.321, Double=+0.652

Cubeful Equities:
       No redouble:     +0.582
       Redouble/Take:   +0.449 (-0.133)
       Redouble/Pass:   +1.000 (+0.418)

Best Cube action: No redouble / Take
Percentage of wrong pass needed to make the double decision right: 19.5%

eXtreme Gammon Version: 2.10, MET: Kazaross XG2
```

## Rules flags decoded wrongly (fixed 2026-11-07)
The XGID rules field is a bit field in money play (1 = Jacoby, 2 = Beaver; XG writes 3 for
"Jacoby Beaver") and means "Crawford game" in match play. The beaver flag was tested with
`% 4 === 1`, so "Jacoby Beaver" gave no beaver, and match games could report Jacoby.
Not visible on the board: neither flag is drawn yet, and Crawford ("Cr" on the cube) was already
right. This entry is here so it stays that way once the rules are shown.
Jest: `tests/rulesFlags.test.ts`.
**Expect:** Money game, opening position, Black on roll - cube decision. Cube 64 in the middle of the
left tray (not "Cr"). No score boxes. Pip counts 167 / 167.

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10
```

Same position as the Crawford game of a 7-point match.
**Expect:** Cube shows "Cr". Score boxes White 4, Length 7, Black 6. Black to play 31.

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:31:6:4:1:7:10
```

## Position length and checker counts not validated (fixed 2026-11-08)
A position that wasn't 26 characters drew a shifted board, and a side with more than 15 checkers
drew a negative borne-off count. Both now show the error box. The test entries are in
[[05 Invalid input]] ("Position too short", "Position too long", "Black has 16 checkers",
"White has 16 checkers"), because that note expects errors.
Jest: `tests/positionValidation.test.ts`.
**Expect:** All 15 checkers a side is still fine: Black and White each have 15 on their 6-point,
drawn as 5 labelled "15". No error.

```xgid
XGID=------O------------o------:0:0:1:21:0:0:3:0:10
```

