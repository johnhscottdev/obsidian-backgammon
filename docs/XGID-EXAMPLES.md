# XGID Examples and Use Cases

## Standard Game Positions

### 1. Opening Position (Starting Game)
```
XGID=-a-bE-D---cD---c-b-a-E-:-1:0:0:00:0:0:0:0
```
**Description**: Standard backgammon starting position
- **Position**: Each player has 15 checkers in starting positions
  - X: 2 on point 24, 5 on point 13, 3 on point 8, 5 on point 6
  - O: 2 on point 1, 5 on point 12, 3 on point 17, 5 on point 19
- **Cube**: Value 1 (2^-1), centered
- **Turn**: No current player (game not started)
- **Dice**: None shown
- **Game Type**: Money game

### 2. After Opening Roll
```
XGID=-a-bE-D---cD---c-b-a-E-:0:0:1:63:0:0:0:0
```
**Description**: First move of the game
- **Turn**: X player to move (value 1)
- **Dice**: 6-3 roll
- **Everything else**: Same as starting position

### 3. Early Game Development
```
XGID=-a-bE-D--bcC---c-b---E-:0:0:-1:41:0:0:0:0
```
**Description**: After a few moves
- **Changes**: Some checkers moved from starting positions
- **Turn**: O player to move (-1)
- **Dice**: 4-1 roll

## Match Play Examples

### 4. Match Game Opening
```
XGID=-a-bE-D---cD---c-b-a-E-:0:0:1:55:0:0:1:7
```
**Description**: First move in a 7-point match
- **Dice**: Double 5s (55)
- **Rules**: Jacoby rule enabled (1)
- **Match**: Playing to 7 points
- **Scores**: 0-0

### 5. Mid-Match Position
```
XGID=--b-C-E----bB-Bb-c----A--:2:1:0:63:2:1:0:7
```
**Description**: Complex mid-game position in match play
- **Cube**: Value 4 (2^2), owned by X player
- **Turn**: X player to move
- **Dice**: 6-3
- **Scores**: X has 2, O has 1 point
- **Match**: 7-point match

### 6. Crawford Game
```
XGID=------D---------D------:1:1:0:33:6:2:1:7
```
**Description**: Crawford game (one player 1 away)
- **Cube**: Owned by X, but Crawford rule active
- **Scores**: X has 6, O has 2 (X is 1 away from winning 7-point match)
- **Dice**: Double 3s
- **Display**: Cube shows "Cr" instead of value

## Special Situations

### 7. Gammon Position
```
XGID=------L---------L------:0:0:0:00:0:0:0:0
```
**Description**: One player has borne off significant checkers
- **Position**: Many checkers removed (L = 12 checkers on single point)
- **Potential**: Gammon/backgammon situation developing

### 8. Doubling Situation
```
XGID=-a-bE-D---cD---c-b-a-E-:1:0:0:DD:0:0:1:5
```
**Description**: Double has been offered
- **Cube**: Value 2 (2^1), currently centered
- **Dice**: "DD" = double offered
- **Turn**: Opponent must accept or drop
- **Match**: 5-point match with Jacoby rule

### 9. Beaver Accepted
```
XGID=-a-bE-D---cD---c-b-a-E-:2:1:0:BB:0:0:3:5  
```
**Description**: Double was beavered
- **Cube**: Value 4 (2^2), owned by X (who accepted and redoubled)
- **Dice**: "BB" = beaver situation
- **Rules**: Jacoby + Beaver rules enabled (3 = 1+2)

### 10. End Game - Bearing Off
```
XGID=------D------D--defabc-:0:0:1:52:0:0:0:0
```
**Description**: Race position, bearing off
- **Position**: Both players in home boards, bearing off
- **Checkers**: Multiple checkers on points 1-6 for O player
- **Dice**: 5-2 roll
- **Phase**: Pure race to bear off all checkers

## Money Game Examples

### 11. High-Stakes Money Game
```
XGID=-a-bE-D---cD---c-b-a-E-:3:2:0:61:0:0:1:0
```
**Description**: Money game with high cube
- **Cube**: Value 8 (2^3), owned by O player
- **Dice**: 6-1
- **Match Length**: 0 = money game
- **Stakes**: Potentially high-value game

### 12. Jacoby Rule Money Game
```
XGID=------D---------D------:0:0:1:44:0:0:1:0
```
**Description**: Money game with Jacoby rule
- **Rules**: Jacoby rule prevents gammon/backgammon without cube
- **Dice**: Double 4s
- **Cube**: Still centered (value 64 display)

## Error and Edge Cases

### 13. Maximum Checkers on Point
```
XGID=Z-------------------------:0:0:0:00:0:0:0:0
```
**Description**: Theoretical maximum (26 checkers on one point)
- **Position**: All X checkers on point 24
- **Note**: Not possible in real game (only 15 checkers per player)

### 14. Bar Position
```
XGID=------e---------E------:0:0:1:11:0:0:0:0
```
**Description**: Checkers on the bar
- **Bar**: O has 5 checkers on bar (char[6] = 'e')
- **Bar**: X has 5 checkers on bar (char[25] = 'E')
- **Turn**: X must enter checkers from bar
- **Dice**: 1-1 (good for entering)

### 15. Complex Pip Race
```
XGID=abcdef-ghijklm-nopqrstu--:0:0:0:65:0:0:0:0
```
**Description**: Theoretical distribution test
- **Position**: Alphabetical distribution of checkers
- **Use**: Testing position parsing algorithms
- **Dice**: 6-5 (racing dice)

## Position Analysis Examples

### 16. Blitz Position
```
XGID=--B---C---------c-b----:1:1:0:42:0:0:0:7
```
**Description**: Attacking/blitzing strategy
- **Position**: X has attacking position
- **Cube**: X owns cube (value 2)
- **Dice**: 4-2 (potential hitting dice)
- **Strategy**: Aggressive play style

### 17. Priming Game
```
XGID=----BBB-B---------b----:0:0:1:31:0:0:0:0
```
**Description**: Prime-building strategy  
- **Position**: Multiple consecutive points controlled
- **Strategy**: Contain opponent's back checkers
- **Dice**: 3-1 (good for prime extension)

### 18. Back Game
```
XGID=-a-b--D---------D-ca-E-:0:0:-1:22:0:0:0:0
```
**Description**: Back game strategy
- **Position**: Anchors on opponent's home board
- **Turn**: O player (back game player)
- **Dice**: 2-2 (potentially awkward)
- **Strategy**: Wait for shots while holding anchors

## Tournament Examples

### 19. Sudden Death Match Point
```
XGID=------D---------D------:2:1:0:66:6:6:0:7
```
**Description**: Both players at match point
- **Scores**: Both players have 6 points in 7-point match
- **Cube**: Value 4, owned by X
- **Dice**: Double 6s (powerful roll)
- **Situation**: Winner takes match

### 20. Complex Crawford Decision
```
XGID=--b-C-E----bB-Bb-c----A--:1:2:0:54:6:5:1:7
```
**Description**: Crawford game with cube decision
- **Scores**: X has 6, O has 5 (Crawford game)
- **Cube**: Owned by O, but Crawford rule active
- **Dice**: 5-4
- **Decision**: Last chance for cube action before post-Crawford

## Implementation Test Cases

### 21. All Empty Points
```
XGID=--------------------------:0:0:0:00:0:0:0:0
```
**Description**: Edge case - no checkers on board
- **Use**: Testing borne-off calculation (15-0=15 for both)
- **Position**: All points empty
- **Validation**: Should calculate 15 borne off for each player

### 22. Single Checker Positions
```
XGID=a-a-a-a-a-a-a-a-a-a-a-a-A-:0:0:0:00:0:0:0:0
```
**Description**: One checker per point test
- **Pattern**: Alternating single checkers
- **Use**: Testing position parsing accuracy
- **Total**: 12 O checkers + 1 X checker on board

### 23. Mixed Case Stress Test
```
XGID=AaBbCcDdEeFfGgHhIiJjKkLlMm:0:0:0:00:0:0:0:0
```
**Description**: Alternating case pattern
- **Pattern**: Mixed upper/lower case throughout
- **Use**: Testing character parsing robustness
- **Validation**: Should handle case sensitivity correctly

These examples provide comprehensive test cases for XGID parsing and demonstrate the format's flexibility in representing any backgammon position.