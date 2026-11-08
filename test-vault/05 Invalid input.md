---
expect: error
---
# Invalid input

Every block here should show the red error box with the original text and a "⚠️ Error:" message.
No board should be drawn.

## No XGID line
**Expect:** Error: "No XGID found in code block".

```xgid
This is just some text, not a position.
```

## Letter in the cube field
**Expect:** Error: "Invalid XGID format: does not match expected pattern".

```xgid
XGID=-b----E-C---eE---c-e----B-:x:0:1:00:0:0:3:0:10
```

## Invalid character in the position
**Expect:** Error: "Invalid XGID format: does not match expected pattern".

```xgid
XGID=-b----E-C---eE---c-e----B!:0:0:1:00:0:0:3:0:10
```

## Too few fields
**Expect:** Error: "Invalid XGID format: expected at least 9 parts, got 7".

```xgid
XGID=-b----E-C---eE---c-e----B-:0:0:1:00:0:0
```

## Position too short (23 characters)
The position from README usage example 1. It used to draw a shifted board.
**Expect:** Error: "Invalid XGID position: position must be 26 characters, got 23".

```xgid
XGID=-a-bE-D---cD---c-b-a-E-:0:0:1:63:0:0:0:0
```

## Position too long (27 characters)
**Expect:** Error: "Invalid XGID position: position must be 26 characters, got 27".

```xgid
XGID=-b----E-C---eE---c-e----B--:0:0:1:00:0:0:3:0:10
```

## Black has 16 checkers
The opening position with an extra black checker on the 6-point. It used to draw a board with a
borne-off count of -1.
**Expect:** Error: "Invalid XGID position: Black has 16 checkers (maximum 15)".

```xgid
XGID=-b----F-C---eE---c-e----B-:0:0:1:00:0:0:3:0:10
```

## White has 16 checkers
**Expect:** Error: "Invalid XGID position: White has 16 checkers (maximum 15)".

```xgid
XGID=-b----E-C---eE---c-f----B-:0:0:1:00:0:0:3:0:10
```
