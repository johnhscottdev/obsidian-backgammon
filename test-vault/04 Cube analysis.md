---
expect: analysis
---
# Cube analysis

## Double / Pass (9-point match)
**Expect:** Header "Black on roll - cube decision". Score boxes White 0, Length 9, Black 0. Below the
board: Player winning chances 67.98% (G:30.15% B:0.89%), Opponent 32.02% (G:5.78% B:0.19%).
Cubeful equities: No double +0.828 (-0.172), Double/Take +1.005 (+0.005), Double/Pass +1.000.
"Best cube action: Double / Pass" in blue.

```xgid
XGID=a--B-BCbB---cD-a-cAe---A--:0:0:1:00:0:0:0:9:10
X:John   O:Bodger Millerd

Score is X:0 O:0 9 pt.(s) match.
 +13-14-15-16-17-18------19-20-21-22-23-24-+
 | X     O     O  X |   | O           X    |
 | X           O    |   | O                |
 | X           O    |   | O                |
 | X                |   | O                |
 |                  |   | O                |
 |                  |BAR|                  |
 |                  | O |                  |
 |                  |   |                  |
 | O                |   | X                |
 | O           X  O |   | X  X     X       |
 | O           X  O |   | X  X     X       |
 +12-11-10--9--8--7-------6--5--4--3--2--1-+
Pip count  X: 143  O: 164 X-O: 0-0/9
Cube: 1
X on roll, cube action

Analyzed in XG Roller+
Player Winning Chances:   67.98% (G:30.15% B:0.89%)
Opponent Winning Chances: 32.02% (G:5.78% B:0.19%)

Cubeless Equities: No Double=+0.610, Double=+1.262

Cubeful Equities:
       No double:     +0.828 (-0.172)
       Double/Take:   +1.005 (+0.005)
       Double/Pass:   +1.000

Best Cube action: Double / Pass

eXtreme Gammon Version: 2.10, MET: Kazaross XG2
```

## No double / Beaver (money)
**Expect:** Starting position, cube decision. Player 52.63%, Opponent 47.37%. Cubeful equities:
No double +0.119, Double/Beaver -0.361 (-0.480), Double/Pass +1.000 (+0.881).
"Best cube action: No double / Beaver".

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10
X:Player 1   O:Player 2

Score is X:0 O:0. Unlimited Game, Jacoby Beaver
 +13-14-15-16-17-18------19-20-21-22-23-24-+
 | X           O    |   | O              X |
 | X           O    |   | O              X |
 | X           O    |   | O                |
 | X                |   | O                |
 | X                |   | O                |
 |                  |BAR|                  |
 | O                |   | X                |
 | O                |   | X                |
 | O           X    |   | X                |
 | O           X    |   | X              O |
 | O           X    |   | X              O |
 +12-11-10--9--8--7-------6--5--4--3--2--1-+
Pip count  X: 167  O: 167 X-O: 0-0
Cube: 1
X on roll, cube action

Analyzed in XG Roller+
Player Winning Chances:   52.63% (G:14.77% B:0.69%)
Opponent Winning Chances: 47.37% (G:11.99% B:0.51%)

Cubeless Equities: No Double=+0.082, Double=+0.159

Cubeful Equities:
       No double:     +0.119
       Double/Beaver: -0.361 (-0.480)
       Double/Pass:   +1.000 (+0.881)

Best Cube action: No double / Beaver
Percentage of wrong pass needed to make the double decision right: 26.1%

eXtreme Gammon Version: 2.10
```

## Redouble / No redouble (9-point match, Black owns the cube)
**Expect:** Cube shows 2 at the **bottom** of the left tray. Score boxes White 0, Length 9, Black 0.
Pip counts 134 (Black) / 106 (White). Header "Black on roll - cube decision". Below the board:
Player winning chances 64.84% (G:12.13% B:0.47%), Opponent 35.16% (G:10.10% B:0.21%).
Cubeful equities: No redouble +0.582, Redouble/Take +0.449 (-0.133), Redouble/Pass +1.000 (+0.418).
"Best cube action: No redouble / Take".

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
