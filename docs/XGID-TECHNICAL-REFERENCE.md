# XGID Technical Reference

## Quick Reference

### Format Pattern
```regex
^(XGID=)?[a-zA-Z-]{26}:[0-9]+:[-0-9]+:[-0-9]+:[a-zA-Z0-9]{2}:[0-9]+:[0-9]+:[0-9]+:[0-9]+$
```

### Field Index Map
```javascript
const fields = xgid.replace(/^XGID=/, '').split(':');
// fields[0] = position (26 chars)
// fields[1] = cube_value (0-10) 
// fields[2] = cube_owner (-1,0,1)
// fields[3] = turn (-1,0,1+)
// fields[4] = dice (2 chars)
// fields[5] = score_x (int)
// fields[6] = score_o (int) 
// fields[7] = rules (bitfield)
// fields[8] = match_length (int)
```

## Position Encoding Reference

### Character to Value Mapping
```javascript
function charToCheckerCount(char) {
    if (char >= 'a' && char <= 'z') {
        return [char.charCodeAt(0) - 'a'.charCodeAt(0) + 1, 'O'];
    }
    if (char >= 'A' && char <= 'Z') {
        return [char.charCodeAt(0) - 'A'.charCodeAt(0) + 1, 'X'];
    }
    return [0, null]; // dash or invalid
}
```

### Position Array Layout
```javascript
// XGID position string maps to board positions as:
const positionMap = [
    24, 23, 22, 21, 20, 19,  // Points 24-19 (O home board)
    0,                       // O bar (special position)
    18, 17, 16, 15, 14, 13,  // Points 18-13 (O outer board)
    12, 11, 10, 9, 8, 7,     // Points 12-7 (X outer board)
    6, 5, 4, 3, 2, 1,        // Points 6-1 (X home board)
    25                       // X bar (special position)
];

// Result array has 26 elements: [0-25] where 0=O_bar, 25=X_bar, 1-24=points
```

## Parsing Algorithm

### Step-by-Step Implementation
```javascript
function parseXGID(xgid) {
    // 1. Input validation
    if (!xgid || typeof xgid !== 'string') {
        throw new Error('Invalid XGID: input must be a non-empty string');
    }
    
    // 2. Clean and split
    const cleanXgid = xgid.trim().replace(/^XGID=/, '');
    const parts = cleanXgid.split(':');
    
    if (parts.length < 9) {
        throw new Error(`Invalid XGID format: expected 9 parts, got ${parts.length}`);
    }
    
    // 3. Parse position (field 0)
    const pointString = parts[0];
    if (pointString.length !== 26) {
        throw new Error(`Invalid position length: expected 26 chars, got ${pointString.length}`);
    }
    
    const points = pointString
        .split('')
        .map(charToCheckerCount)
        .reverse() // Important: reverse the array!
        .map(([count, player]) => ({ checkerCount: count, player }));
    
    // 4. Parse cube (fields 1-2)
    const cubeValueExp = parseInt(parts[1], 10);
    const cubeOwnerCode = parseInt(parts[2], 10);
    const cubeValue = Math.pow(2, cubeValueExp);
    const cubeOwner = cubeOwnerCode === 0 ? 'Center' : 
                     cubeOwnerCode === 1 ? 'X' : 'O';
    
    // 5. Parse turn (field 3)
    const turnCode = parseInt(parts[3], 10);
    const turn = turnCode === -1 ? 'O' : 'X';
    
    // 6. Parse dice (field 4)
    const diceStr = parts[4];
    let die1 = parseInt(diceStr[0], 10) || 0;
    let die2 = parseInt(diceStr[1], 10) || 0;
    
    // 7. Parse scores (fields 5-6)
    const scoreX = parseInt(parts[5], 10);
    const scoreO = parseInt(parts[6], 10);
    
    // 8. Parse rules (field 7)
    const rulesFlags = parseInt(parts[7], 10);
    const jacoby = (rulesFlags & 1) === 1;
    const beaver = (rulesFlags & 1) === 1; // Same bit in this implementation
    
    // 9. Parse match length (field 8)
    const matchLength = parseInt(parts[8], 10);
    const crawford = matchLength > 0 && jacoby;
    
    // 10. Calculate derived values
    const checkersOnBoardX = points.filter(p => p.player === 'X')
                                  .reduce((sum, p) => sum + p.checkerCount, 0);
    const checkersOnBoardO = points.filter(p => p.player === 'O')
                                  .reduce((sum, p) => sum + p.checkerCount, 0);
    const borneOffX = 15 - checkersOnBoardX;
    const borneOffO = 15 - checkersOnBoardO;
    
    return {
        points,
        borneOffX,
        borneOffO,
        turn,
        die1,
        die2,
        cubeOwner,
        cubeValue: cubeOwner === 'Center' ? 64 : cubeValue,
        scoreX,
        scoreO,
        beaver,
        jacoby,
        matchLength,
        crawford
    };
}
```

## Validation Rules

### Position String Validation
```javascript
const POSITION_REGEX = /^[a-zA-Z-]{26}$/;
const FULL_XGID_REGEX = /^(XGID=)?[a-zA-Z-]{26}:[0-9]+:[-0-9]+:[-0-9]+:[a-zA-Z0-9]{2}:[0-9]+:[0-9]+:[0-9]+:[0-9]+$/;

function validateXGID(xgid) {
    const cleanXgid = xgid.replace(/^XGID=/, '');
    
    if (!FULL_XGID_REGEX.test(xgid)) {
        throw new Error('XGID does not match expected format');
    }
    
    const parts = cleanXgid.split(':');
    
    // Validate position
    if (!POSITION_REGEX.test(parts[0])) {
        throw new Error('Invalid position string format');
    }
    
    // Validate numeric ranges
    const cubeValue = parseInt(parts[1], 10);
    if (cubeValue < 0 || cubeValue > 10) {
        throw new Error('Cube value must be 0-10');
    }
    
    const cubeOwner = parseInt(parts[2], 10);
    if (![-1, 0, 1].includes(cubeOwner)) {
        throw new Error('Cube owner must be -1, 0, or 1');
    }
    
    // Validate dice format
    if (!/^[0-9a-zA-Z]{2}$/.test(parts[4])) {
        throw new Error('Dice field must be 2 characters');
    }
    
    return true;
}
```

## Edge Cases and Special Handling

### Cube Value Display Logic
```javascript
function getCubeDisplayValue(cubeOwner, cubeValue, crawford) {
    if (crawford) {
        return "Cr";
    } else if (cubeOwner === 'Center') {
        return 64;
    } else {
        return cubeValue;
    }
}
```

### Dice State Interpretation
```javascript
function interpretDiceState(diceStr) {
    const special_codes = {
        'DD': 'double_offered',
        'BB': 'beaver',
        'RR': 'raccoon',
        '00': 'no_dice'
    };
    
    if (special_codes[diceStr]) {
        return { state: special_codes[diceStr], die1: 0, die2: 0 };
    }
    
    const die1 = parseInt(diceStr[0], 10) || 0;
    const die2 = parseInt(diceStr[1], 10) || 0;
    
    return { state: 'normal', die1, die2 };
}
```

### Pip Count Calculation
```javascript
function calculatePipCount(points, player) {
    let pipCount = 0;
    
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (point.player === player && point.checkerCount > 0) {
            let distance;
            
            if (i === 0 || i === 25) {
                distance = 25; // Bar positions
            } else if (player === 'X') {
                distance = i; // For X: point number = distance
            } else {
                distance = 25 - i; // For O: reverse distance
            }
            
            pipCount += distance * point.checkerCount;
        }
    }
    
    return pipCount;
}
```

## Common Implementation Errors

### 1. Position Array Ordering
❌ **Wrong**: Using position string directly as points 1-24
```javascript
// DON'T DO THIS
const points = positionString.split('').map(charToCount);
```

✅ **Correct**: Reverse the array after parsing
```javascript
const points = positionString.split('')
    .map(charToCount)
    .reverse(); // Essential!
```

### 2. Cube Value Calculation
❌ **Wrong**: Using field value directly
```javascript
const cubeValue = parseInt(parts[1], 10); // Wrong!
```

✅ **Correct**: Using power of 2, with center override
```javascript
const cubeValue = cubeOwner === 'Center' ? 64 : Math.pow(2, parseInt(parts[1], 10));
```

### 3. Turn Logic
❌ **Wrong**: Treating 1 as O player's turn
```javascript
const turn = parseInt(parts[3], 10) === 1 ? 'O' : 'X'; // Wrong!
```

✅ **Correct**: Only -1 means O player's turn
```javascript
const turn = parseInt(parts[3], 10) === -1 ? 'O' : 'X';
```

## Test Cases for Validation

### Valid XGIDs
```javascript
const validXGIDs = [
    'XGID=-a----E-C---eE---c-e----B-:1:0:-1:11:0:0:1:7',
    '--b-C-E----bB-Bb-c----A--:2:1:0:63:2:1:0:7',
    'abcdefghijklmnopqrstuvwxyz:0:0:0:00:0:0:0:0'
];
```

### Invalid XGIDs  
```javascript
const invalidXGIDs = [
    '', // Empty
    'invalid-format', // Wrong format
    'XGID=short:1:0:0:00:0:0:0:0', // Position too short
    'XGID=abcdefghijklmnopqrstuvwxyz:1:0', // Too few fields
    'XGID=abcdefghijklmnopqrstuvwxyz:15:0:0:00:0:0:0:0' // Cube value too high
];
```

This technical reference provides the implementation details needed to correctly parse and validate XGID strings in any programming language.