---
expect: board
---
# Cube and match

## Money game, centred cube
**Expect:** Cube shows 64, centred vertically in the left tray. No score boxes on the right.

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10
```

## Black owns the cube at 2
**Expect:** Cube shows 2 at the **bottom** of the left tray (Black's side).

```xgid
XGID=-b----E-C---eE---c-e----B-:1:1:1:00:0:0:3:0:10
```

## White owns the cube at 4
**Expect:** Cube shows 4 at the **top** of the left tray (White's side). Black to play 43.

```xgid
XGID=-b----E-C---eE---c-e----B-:2:-1:1:43:0:0:3:0:10
```

## 7-point match, Black 3 – White 2
**Expect:** Three score boxes in the right tray: "White 2" at the top, "Length 7" in the middle, "Black 3" at the bottom. Cube 64 centred.

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:00:3:2:0:7:10
```

## Crawford game, Black 6 – White 4 (7-point match)
**Expect:** Cube shows "Cr" instead of a number. Score boxes: White 4, Length 7, Black 6. Black to play 31.

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:31:6:4:1:7:10
```

## Post-Crawford, Black 6 – White 5 (7-point match)
**Expect:** Normal cube (64), not "Cr". Score boxes: White 5, Length 7, Black 6. White on roll: header "White on roll - cube decision".

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:-1:00:6:5:0:7:10
```
