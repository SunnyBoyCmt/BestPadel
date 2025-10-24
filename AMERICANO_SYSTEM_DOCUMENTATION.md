# Americano System Documentation

## Overview
The Americano system is a Padel tournament format where every player partners with every other player exactly once. This ensures maximum fairness and equal opportunity for all participants.

## How It Works

### Basic Rules
1. **8 Players = 7 Rounds**: Each player partners with 7 different players (8-1 = 7)
2. **2v2 Matches**: Each match is 2 players vs 2 players
3. **40 Points Per Match**: Each match must total exactly 40 points (20 penpr team)
4. **Point Accumulation**: Both players in each team get the same points

### Tournament Structure
- **Round 1**: 4 teams, 2 matches on 2 courts
- **Round 2**: New partnerships, 2 matches on 2 courts
- **Continue**: Until all 7 rounds complete
- **Final Ranking**: Based on total points accumulated

## Technical Implementation

### Match Generation
```javascript
// For 8 players, 2 courts:
// Round 1: [Player1, Player2] vs [Player3, Player4] on Court 1
//          [Player5, Player6] vs [Player7, Player8] on Court 2
// Round 2: [Player1, Player3] vs [Player2, Player4] on Court 1
//          [Player5, Player7] vs [Player6, Player8] on Court 2
// ... and so on for 7 rounds
```

### Scoring System
- **Team A Score**: 15 points
- **Team B Score**: 25 points
- **Total**: 40 points ✓
- **Player Points**: Both players in Team A get 15 points, both in Team B get 25 points

### Validation Logic
```javascript
// Each match must total exactly 40 points
if (teamAScore + teamBScore === 40) {
    // Valid match
} else {
    // Invalid - show error
}
```

## User Interface Flow

### 1. Tournament Setup
- Select number of players (4, 6, 8, 10, 12, 14, 16)
- Select number of courts (1, 2, 3, 4)
- Click "Generate Tournament"

### 2. Player Names
- Modal opens with default names pre-filled
- Names are auto-generated (Alex, Blake, Casey, Drew, etc.)
- Click "Start Tournament" to begin

### 3. Tournament Play
- Shows current round (e.g., "Round 1 of 7")
- Displays matches for current round
- Each match shows: "Alex & Blake" vs "Casey & Drew"
- Score inputs for each team (must total 40 per match)

### 4. Scoring
- Enter scores for each team
- System validates each match totals 40 points
- "Confirm Round & Continue" button enables when valid
- Click to advance to next round

### 5. Completion
- After 7 rounds, tournament is complete
- Final leaderboard shows total points
- Winner is player with most points

## Current Issues & Solutions

### Issue 1: Validation Not Working
**Problem**: Button stays disabled even with correct 40 points
**Solution**: Debug the validation logic to ensure it's checking the right elements

### Issue 2: Match Count Wrong
**Problem**: Showing 14 games instead of 7 rounds
**Solution**: Fix match generation to create rounds, not individual matches

### Issue 3: UI Clutter
**Problem**: Blue pills, confusing buttons
**Solution**: Clean interface with only essential elements

## Expected Behavior

### Round 1 Example (8 players, 2 courts):
```
Round 1 of 7

Court 1:
Alex & Blake vs Casey & Drew
Score: [15] vs [25] = 40 ✓

Court 2:
Emery & Finley vs Gray & Harper
Score: [20] vs [20] = 40 ✓

[Confirm Round & Continue] ← Enabled when both matches = 40
```

### Validation Rules:
1. Each match must total exactly 40 points
2. All matches in current round must be valid
3. Button only enables when all conditions met

## Debugging Steps

1. **Check Console**: Open browser dev tools, look for validation logs
2. **Verify Inputs**: Ensure score inputs have correct data attributes
3. **Test Manually**: Enter 20 + 20 = 40, check if button enables
4. **Check Elements**: Verify match IDs and team IDs are correct

## Success Criteria

- ✅ 7 rounds for 8 players (not 14 games)
- ✅ 40 points per match validation
- ✅ Clean, professional interface
- ✅ Working score inputs
- ✅ Proper round progression
- ✅ Accurate leaderboard

## Next Steps

1. Fix validation logic
2. Test with 8 players, 2 courts
3. Verify 7 rounds are generated
4. Ensure 40-point validation works
5. Test complete tournament flow
