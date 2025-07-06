# XGID Format Documentation

## Overview

XGID (eXtreme Gammon ID) is a compact string format used to encode complete backgammon game positions. It was developed by Xavier Dufaure de Citres for eXtreme Gammon and has become a standard format for sharing backgammon positions.

## Format Structure

An XGID consists of 9 colon-separated fields:

```
[XGID=]position:cube_value:cube_owner:turn:dice:score_x:score_o:rules:match_length
```

### Optional Prefix
- `XGID=` - Optional prefix that can be included or omitted

## Field Breakdown

### 1. Position (Field 0)
**Format**: 26-character string using letters and dashes
**Purpose**: Encodes checker placement on all 26 positions (24 points + 2 bar positions)

#### Character Encoding
- **Lowercase letters (a-z)**: O player checkers (1-26 checkers)
  - `a` = 1 checker, `b` = 2 checkers, ..., `z` = 26 checkers
- **Uppercase letters (A-Z)**: X player checkers (1-26 checkers) 
  - `A` = 1 checker, `B` = 2 checkers, ..., `Z` = 26 checkers
- **Dash (-)**: Empty point (0 checkers)

#### Position Mapping
The 26 characters map to board positions as follows (reading left to right):

```
Character:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26
Board Pos: 24 23 22 21 20 19 BAR 18 17 16 15 14 13 12 11 10  9  8  7  6  5  4  3  2  1 BAR
Player:     O  O  O  O  O  O  O   O  O  O  O  O  O  X  X  X  X  X  X  X  X  X  X  X  X  X
```

**Important**: The position string is read from left to right, but represents the board from point 24 down to point 1, with bar positions at indices 0 and 25.

#### Example Position Breakdown
For position `"-a----E-C---eE---c-e----B-"`:
- Position 24 (char 1): `-` = empty
- Position 23 (char 2): `a` = 1 O checker  
- Position 22 (char 3): `-` = empty
- Position 19 (char 6): `-` = empty
- Position 18 (char 8): `E` = 5 X checkers
- Position 17 (char 9): `-` = empty
- Position 16 (char 10): `C` = 3 X checkers
- Bar O (char 7): `-` = no O checkers on bar
- Bar X (char 26): `-` = no X checkers on bar

### 2. Cube Value (Field 1)
**Format**: Integer (0-10)
**Purpose**: Encodes the doubling cube value as a power of 2

- `0` = 2^0 = 1 (initial cube value)
- `1` = 2^1 = 2 
- `2` = 2^2 = 4
- `3` = 2^3 = 8
- `4` = 2^4 = 16
- `5` = 2^5 = 32
- `6` = 2^6 = 64

### 3. Cube Owner (Field 2)
**Format**: Integer (-1, 0, 1)
**Purpose**: Indicates who owns the doubling cube

- `-1` = O player owns the cube
- `0` = Center (cube available to both players)
- `1` = X player owns the cube

**Special Case**: When cube owner is Center (0), the cube value is set to 64 regardless of field 1.

### 4. Turn (Field 3)
**Format**: Integer (-1, 0, 1, or other)
**Purpose**: Indicates whose turn it is to move

- `-1` = O player's turn
- Any other value = X player's turn (typically 0 or 1)

### 5. Dice (Field 4)
**Format**: 2-character string
**Purpose**: Encodes the current dice roll

#### Standard Dice Values
- `11` to `66` = Normal dice rolls (each digit represents one die)
- `00` = No dice shown (game not in rolling state)

#### Special Dice Codes
- `DD` = Double offered (player must accept/reject)
- `BB` = Beaver (redouble after accepting double)
- `RR` = Raccoon (redouble after beaver)

### 6. Score X (Field 5)
**Format**: Integer
**Purpose**: Current match score for X player

### 7. Score O (Field 6) 
**Format**: Integer
**Purpose**: Current match score for O player

### 8. Rules (Field 7)
**Format**: Integer (bit flags)
**Purpose**: Encodes game rules and settings

#### Bit Flag Meanings
- **Bit 0 (value 1)**: Jacoby rule enabled
- **Bit 1 (value 2)**: Beaver rule enabled
- **Additional bits**: Reserved for other rule variations

#### Common Values
- `0` = No special rules
- `1` = Jacoby rule only
- `2` = Beaver rule only  
- `3` = Both Jacoby and Beaver rules

### 9. Match Length (Field 8)
**Format**: Integer
**Purpose**: Total length of the match

- `0` = Money game (unlimited)
- `1-25` = Match to N points
- Common values: `3`, `5`, `7`, `9`, `11`, `15`, `21`

## Complete Examples

### Example 1: Opening Position
```
XGID=-a----E-C---eE---c-e----B-:1:0:-1:11:0:0:1:7
```

**Breakdown**:
- **Position**: `-a----E-C---eE---c-e----B-` (starting position with opening move)
- **Cube Value**: `1` = 2^1 = 2 (cube has been doubled)
- **Cube Owner**: `0` = Center (but overridden to 64)
- **Turn**: `-1` = O player to move
- **Dice**: `11` = Double 1s
- **Score X**: `0` points
- **Score O**: `0` points  
- **Rules**: `1` = Jacoby rule enabled
- **Match Length**: `7` = Match to 7 points

### Example 2: Mid-Game Position
```
XGID=--b-C-E----bB-Bb-c----A--:2:1:0:63:2:1:0:7
```

**Breakdown**:
- **Position**: `--b-C-E----bB-Bb-c----A--` (mid-game position)
- **Cube Value**: `2` = 2^2 = 4
- **Cube Owner**: `1` = X player owns cube
- **Turn**: `0` = X player to move
- **Dice**: `63` = 6 and 3
- **Score X**: `2` points
- **Score O**: `1` point
- **Rules**: `0` = No special rules
- **Match Length**: `7` = Match to 7 points

### Example 3: Money Game
```
XGID=abcdefghijklmnopqrstuvwxyz:0:0:0:00:0:0:1:0
```

**Breakdown**:
- **Position**: All lowercase = O checkers distributed across points
- **Cube Value**: `0` = 2^0 = 1 (initial value)
- **Cube Owner**: `0` = Center
- **Turn**: `0` = X player to move
- **Dice**: `00` = No dice displayed
- **Scores**: Both 0 (not applicable in money games)
- **Rules**: `1` = Jacoby rule
- **Match Length**: `0` = Money game

## Special Rules and Edge Cases

### Crawford Rule
The Crawford rule is automatically inferred when:
- Match length > 0 (not a money game)
- Jacoby rule is enabled (rules field has bit 0 set)
- One player is 1 point away from winning

When Crawford rule is active, the cube display shows "Cr" instead of the numeric value.

### Cube Value Display Logic
```javascript
if (cubeOwner === 'Center') {
    displayValue = 64;  // Always 64 when centered
} else if (crawfordRule) {
    displayValue = "Cr";  // Crawford game
} else {
    displayValue = Math.pow(2, cubeValueField);  // Normal cube value
}
```

### Pip Count Calculation
Each player's pip count is calculated by:
1. For each point with player's checkers: distance × checker_count
2. Distance for X player = point number (1-24, bar=25)
3. Distance for O player = 25 - point number (bar=25)

### Borne Off Calculation
```javascript
checkersOnBoard = sum of all player's checkers in position string
borneOff = 15 - checkersOnBoard
```

## Implementation Notes for AI Systems

### Parsing Strategy
1. Split XGID string on colons to get 9 fields
2. Remove optional "XGID=" prefix from field 0
3. Validate minimum field count (9 required)
4. Parse each field according to its type and rules
5. Apply special logic for cube display and Crawford rule

### Validation Checks
- Position string must be exactly 26 characters
- Only valid characters: a-z, A-Z, - (dash)
- Cube value must be 0-10
- Cube owner must be 0, 1, or 2
- Dice field must be 2 characters
- All numeric fields must parse correctly

### Common Pitfalls
- Position string is NOT in point order 1-24, it's reversed
- Center cube always displays as 64, not the power of 2
- Turn field uses -1 for O player, not 1
- Bar positions are at indices 0 and 25 in position array
- Crawford rule is inferred, not explicitly encoded

This format provides complete game state information in a compact, human-readable string that can be easily shared and parsed programmatically.