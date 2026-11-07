---
expect: board
---
# Board positions

## Starting position, cube decision
**Expect:** Black: 2 on the 24-point (top right), 5 on 13, 3 on 8, 5 on 6. White mirrored. Pip counts 167 / 167 on the bar. No dice. Cube shows 64 in the middle of the left tray. Header: "Black on roll - cube decision". Point numbers 1–12 along the bottom, right to left.

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10
```

## Black to play 31
**Expect:** Same position. Two black dice showing 3 and 1 on the right half of the board. Header: "Black to play 31".

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:31:0:0:3:0:10
```

## Black to play doubles (66)
**Expect:** Two black dice, both 6. Header: "Black to play 66".

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:66:0:0:3:0:10
```

## White to play 43
**Expect:** Two white dice (3 and 4) on the **left** half. Point numbers are flipped to White's view: White's 1-point is top right (top row reads 12…1 left to right) and the bottom row reads 13…24 left to right. Header: "White to play 43".

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:-1:43:0:0:3:0:10
```

## One checker each on the bar
**Expect:** One black and one white checker on the bar (middle column), clear of the dice and pip counts. Each side has only 1 checker left on its 24-point. Pip counts 168 / 168.

```xgid
XGID=aa----E-C---eE---c-e----AA:0:0:1:52:0:0:3:0:10
```

## Three checkers each on the bar
**Expect:** Three black and three white checkers stacked on the bar, not overlapping the dice or each other. Pip counts 181 / 181.

```xgid
XGID=c-----E-C---dD---c-e-----C:0:0:1:31:0:0:3:0:10
```

## 15 checkers on one point
**Known bug** (stacks overflow, see `docs/BACKLOG.md`).
**Expect:** All 15 black checkers on Black's 6-point and all 15 white on White's 6-point. At most 5 checkers drawn per point with the top one labelled "15". Nothing crosses the centre line. Pip counts 90 / 90.

```xgid
XGID=------O------------o------:0:0:1:21:0:0:3:0:10
```

## Bear-off with 7 on the 6-point
**Known bug** (stacks overflow, see `docs/BACKLOG.md`).
**Expect:** Black: 7 on 6, 4 on 5, 4 on 4. White mirrored. The 7-stacks don't reach the centre or touch the opposite stack (max 5 drawn, labelled "7"). Pip counts 78 / 78.

```xgid
XGID=----DDG------------gdd----:0:0:1:64:0:0:3:0:10
```

## Checkers borne off
**Expect:** Black: 2 on 6, 3 on 4, 2 on 2, and a black checker labelled "8" in the bottom of the right-hand tray. White: 3 on 5, 2 on 3, 1 on 1, and a white checker labelled "9" at the top of the right-hand tray. Pip counts: Black 28, White 22.

```xgid
XGID=--B-C-B-------------c-b-a-:0:0:1:31:0:0:3:0:10
```

## Last checkers
**Expect:** One black checker on Black's 1-point (bottom right), 14 borne off. Two white checkers on White's 1-point (top right), 13 borne off. White to play 21. Pip counts: Black 1, White 2.

```xgid
XGID=-A----------------------b-:0:0:-1:21:0:0:3:0:10
```
