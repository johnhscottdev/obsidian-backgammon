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
