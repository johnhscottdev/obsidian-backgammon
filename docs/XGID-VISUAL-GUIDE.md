# XGID Visual Guide

## Backgammon Board Layout

```
                 O HOME BOARD          O OUTER BOARD
                ┌─────────────────────┬─────────────────────┐
             OFF│24 23 22 21 20 19   │18 17 16 15 14 13   │OFF
                │▼  ▼  ▼  ▼  ▼  ▼    │▼  ▼  ▼  ▼  ▼  ▼    │
                │2              5     │            5       │
                │○              ○     │            ●       │
                │○              ○     │            ●       │
                │               ○     │            ●       │
                │               ○  B  │            ●       │
                │               ○  A  │            ●       │
                │                  R  │                    │
                │                     │                    │
                │                     │                    │
                │                     │  3                 │
                │▲  ▲  ▲  ▲  ▲  ▲    │▲  ●  ▲  ▲  ▲  ▲    │
             OFF│1  2  3  4  5  6     │7  ●  9 10 11 12    │OFF
                └─────────────────────┴─────────────────────┘
                 X HOME BOARD          X OUTER BOARD
                                      
                Starting Position:
                X: 2 on point 24, 5 on point 13, 3 on point 8, 5 on point 6
                O: 2 on point 1, 5 on point 12, 3 on point 17, 5 on point 19

Direction of travel:
X player: Points 1→24 (counterclockwise, ● pieces)
O player: Points 24→1 (clockwise, ○ pieces)
```

## XGID Position String Mapping

### Character Position to Board Point Mapping

```
XGID Position String: "abcdefg-hijklmn-opqrstuvwxyz"
                       ↓↓↓↓↓↓↓ ↓↓↓↓↓↓↓ ↓↓↓↓↓↓↓↓↓↓↓↓
Board Position:       24232221201918171615141312111098765432 1
                                 ↑                     ↑
                              O BAR                 X BAR
```

### Detailed Position Mapping Table

| XGID Index | Character | Board Position | Player Zone |
|------------|-----------|----------------|-------------|
| 0          | char[0]   | Point 24       | O Home      |
| 1          | char[1]   | Point 23       | O Home      |
| 2          | char[2]   | Point 22       | O Home      |
| 3          | char[3]   | Point 21       | O Home      |
| 4          | char[4]   | Point 20       | O Home      |
| 5          | char[5]   | Point 19       | O Home      |
| **6**      | **char[6]** | **O Bar**    | **Bar**     |
| 7          | char[7]   | Point 18       | O Outer     |
| 8          | char[8]   | Point 17       | O Outer     |
| 9          | char[9]   | Point 16       | O Outer     |
| 10         | char[10]  | Point 15       | O Outer     |
| 11         | char[11]  | Point 14       | O Outer     |
| 12         | char[12]  | Point 13       | O Outer     |
| 13         | char[13]  | Point 12       | X Outer     |
| 14         | char[14]  | Point 11       | X Outer     |
| 15         | char[15]  | Point 10       | X Outer     |
| 16         | char[16]  | Point 9        | X Outer     |
| 17         | char[17]  | Point 8        | X Outer     |
| 18         | char[18]  | Point 7        | X Outer     |
| 19         | char[19]  | Point 6        | X Home      |
| 20         | char[20]  | Point 5        | X Home      |
| 21         | char[21]  | Point 4        | X Home      |
| 22         | char[22]  | Point 3        | X Home      |
| 23         | char[23]  | Point 2        | X Home      |
| 24         | char[24]  | Point 1        | X Home      |
| **25**     | **char[25]** | **X Bar**   | **Bar**     |

## Example Position Breakdown

### Starting Position XGID
```
XGID=-a----E-C---eE---c-e----B-
```

#### Visual Representation
```
Board Point:  24 23 22 21 20 19 |BAR| 18 17 16 15 14 13 12 11 10  9  8  7  6  5  4  3  2  1 |BAR|
XGID Char:    -  a  -  -  -  - |  -|  E  -  C  -  -  - e  E  -  -  - c  -  e  -  -  -  -  B |  -|
Array Index:  0  1  2  3  4  5    6   7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
```

#### Decoded Checkers
- **Point 24** (char[0] = `-`): Empty
- **Point 23** (char[1] = `a`): 1 O checker 
- **Point 18** (char[7] = `E`): 5 X checkers
- **Point 16** (char[9] = `C`): 3 X checkers
- **Point 13** (char[12] = `-`): Empty
- **Point 12** (char[13] = `e`): 5 O checkers
- **Point 11** (char[14] = `E`): 5 X checkers
- **Point 7** (char[18] = `c`): 3 O checkers
- **Point 5** (char[20] = `e`): 5 O checkers
- **Point 1** (char[24] = `B`): 2 X checkers
- **O Bar** (char[6] = `-`): No O checkers on bar
- **X Bar** (char[25] = `-`): No X checkers on bar

## Array Processing Algorithm

### Input String to Board Array
```javascript
// Input: "-a----E-C---eE---c-e----B-"
// Output: points[0-25] where points[i] = {checkerCount, player}

const positionString = "-a----E-C---eE---c-e----B-";

// Step 1: Split into character array
const chars = positionString.split('');
// Result: ['-','a','-','-','-','-','E','-','C',...,'B','-']

// Step 2: Convert each character to {count, player}
const parsed = chars.map(char => {
    if (char >= 'a' && char <= 'z') {
        return [char.charCodeAt(0) - 97 + 1, 'O'];
    } else if (char >= 'A' && char <= 'Z') {
        return [char.charCodeAt(0) - 65 + 1, 'X'];
    } else {
        return [0, null];
    }
});

// Step 3: CRITICAL - Reverse the array!
const reversed = parsed.reverse();

// Step 4: Convert to object format
const points = reversed.map(([count, player]) => ({
    checkerCount: count,
    player: player
}));

// Final result: points[0] = X Bar, points[1] = Point 1, ..., points[24] = Point 24, points[25] = O Bar
```

## Common Visualization Errors

### ❌ Wrong: Direct Mapping
```
XGID String:  "-a----E-C---eE---c-e----B-"
              ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
Array Index:  0 1 2 3 4 5 6 7 8 9...........24 25
Board Point:  24 23 22 21 20 19 O_BAR 18 17 16...1 X_BAR
```
**Problem**: This maps correctly but many implementations forget to reverse!

### ✅ Correct: After Reversal
```
XGID String:  "-a----E-C---eE---c-e----B-"
              (parse and reverse)
              ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
Array Index:  0 1 2 3 4 5 6 7 8 9...........24 25
Board Point:  X_BAR 1 2 3 4 5 6 7 8 9...24 O_BAR
```

## Board Rendering Guidelines

### Point Numbering Display
```
Standard Board Layout (as viewed by X player):
Points 1-6:   X Home Board (bottom right quadrant)
Points 7-12:  X Outer Board (bottom left quadrant)  
Points 13-18: O Outer Board (top left quadrant)
Points 19-24: O Home Board (top right quadrant)

Home Boards (6 points each):
- X Home: Points 1-6 (where X bears off)
- O Home: Points 19-24 (where O bears off)

Outer Boards (6 points each):
- X Outer: Points 7-12 
- O Outer: Points 13-18

Movement Direction:
- X moves from 1→24 (counterclockwise)
- O moves from 24→1 (clockwise)

Total: 24 points + 2 bar positions = 26 XGID positions
```

### Checker Stack Visualization
```
Point with 5 checkers (character 'e' or 'E'):
┌─────┐
│  ●  │ ← 5th checker
│  ●  │ ← 4th checker  
│  ●  │ ← 3rd checker
│  ●  │ ← 2nd checker
│  ●  │ ← 1st checker
└─────┘

Point with many checkers (>5), show count:
┌─────┐
│  15 │ ← Display number
│  ●  │
│  ●  │
│  ●  │
│  ●  │
│  ●  │
└─────┘
```

### Bar Representation
```
Center Bar Area:
┌─────────┐
│         │
│    ●    │ ← X checker on bar
│         │
│ ======= │ ← Bar divider
│         │  
│    ○    │ ← O checker on bar
│         │
└─────────┘
```

This visual guide helps understand how the linear XGID position string maps to the two-dimensional backgammon board layout.