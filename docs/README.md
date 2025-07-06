# XGID Documentation

Complete documentation for the XGID (eXtreme Gammon ID) format used by this Obsidian plugin to represent backgammon positions.

## 📚 Documentation Index

### Core Documentation
- **[XGID Format](./XGID-FORMAT.md)** - Complete format specification for humans and AI systems
- **[Technical Reference](./XGID-TECHNICAL-REFERENCE.md)** - Implementation details and algorithms  
- **[Visual Guide](./XGID-VISUAL-GUIDE.md)** - Board mapping and position visualization
- **[Examples](./XGID-EXAMPLES.md)** - Real-world XGIDs and test cases

## 🎯 Quick Start

### What is XGID?
XGID is a compact string format that encodes complete backgammon game positions, including:
- Checker positions on all 24 points and bars
- Doubling cube state and ownership
- Current player turn and dice
- Match scores and rules
- Game type (match/money)

### Basic Format
```
[XGID=]position:cube_value:cube_owner:turn:dice:score_x:score_o:rules:match_length
```

### Simple Example
```
XGID=-a----E-C---eE---c-e----B-:1:0:-1:11:0:0:1:7
```
This represents an opening position in a 7-point match where O player has rolled double 1s.

## 🔧 For Developers

### Implementation Checklist
- [ ] Parse 9 colon-separated fields
- [ ] Handle optional "XGID=" prefix
- [ ] Convert 26-character position string correctly
- [ ] **Remember to reverse the position array!**
- [ ] Apply cube value formula: `Math.pow(2, field1)` 
- [ ] Handle center cube special case (display as 64)
- [ ] Implement turn logic: `-1` = O player, else X player
- [ ] Parse dice with special codes (DD, BB, RR)
- [ ] Calculate borne-off checkers: `15 - checkers_on_board`

### Common Pitfalls
1. **Position Array Order**: Must reverse after parsing character string
2. **Cube Display**: Center cube shows 64, not the power of 2 value
3. **Turn Logic**: Only `-1` means O player's turn
4. **Bar Positions**: Located at array indices 0 and 25

### Validation Rules
```javascript
// Position string must be exactly 26 characters
/^[a-zA-Z-]{26}$/

// Full XGID pattern
/^(XGID=)?[a-zA-Z-]{26}:[0-9]+:[-0-9]+:[-0-9]+:[a-zA-Z0-9]{2}:[0-9]+:[0-9]+:[0-9]+:[0-9]+$/
```

## 🧪 Testing

### Test Categories
- **Input Validation**: Empty strings, invalid formats, wrong field counts
- **Position Parsing**: Character encoding, array reversal, checker counts
- **Game State**: Cube values, turn logic, dice interpretation
- **Real Examples**: Opening positions, mid-game, end-game scenarios
- **Edge Cases**: Maximum checkers, bar positions, special dice codes

### Sample Test XGIDs
```javascript
// Valid starting position
"XGID=-a-bE-D---cD---c-b-a-E-:0:0:0:00:0:0:0:0"

// Mid-game with cube action  
"XGID=--b-C-E----bB-Bb-c----A--:2:1:0:63:2:1:0:7"

// Invalid examples
"" // Empty
"invalid-format" // Wrong structure
"XGID=short:1:0:0:00:0:0:0:0" // Position too short
```

## 🎲 Usage in Plugin

This plugin uses XGID format in Obsidian markdown code blocks:

````markdown
```xgid
XGID=-a----E-C---eE---c-e----B-:1:0:-1:11:0:0:1:7

1. 24/23 13/11  
   Player: -0.052
   Opponent: +0.052
```
````

The plugin will:
1. Parse the XGID string
2. Render the backgammon board visually
3. Display any analysis blocks below the board
4. Show error messages for invalid XGIDs

## 📖 Further Reading

### External Resources
- [GNU Backgammon XGID Documentation](https://www.gnu.org/software/gnubg/)
- [eXtreme Gammon Official Site](http://www.extremegammon.com/)
- [Backgammon Position ID Formats](https://bkgm.com/rgb/rgb.cgi?view+610)

### Related Formats
- **GNUbg ID**: Alternative position encoding used by GNU Backgammon
- **BGBlitz ID**: Another position format used by BGBlitz software
- **Snowie ID**: Format used by Snowie backgammon software

## 🤝 Contributing

When adding XGID support to other systems:

1. **Start with the [Technical Reference](./XGID-TECHNICAL-REFERENCE.md)** for implementation details
2. **Use the [Examples](./XGID-EXAMPLES.md)** for comprehensive test cases
3. **Reference the [Visual Guide](./XGID-VISUAL-GUIDE.md)** for position mapping
4. **Validate against the [Format Specification](./XGID-FORMAT.md)**

### AI System Instructions
For AI systems parsing XGIDs:
- The position string encodes 26 locations in a specific order
- **Critical**: The string must be reversed after character parsing
- Bar positions are at string indices 6 and 25
- Cube logic has special cases for center ownership and Crawford rule
- Turn field uses -1 for O player, not 1

This documentation provides everything needed to understand, implement, and test XGID format support in any backgammon application.