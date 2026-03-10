# Data Model: Code Matching Mini Game

**Feature**: 002-code-matching-game
**Date**: 2026-03-10
**Phase**: Phase 1 - Data Model Definition

## Overview

This document defines the data entities, relationships, and state management for the code matching mini game feature. The data model extends existing quiz entities while maintaining backward compatibility.

## Entity Definitions

### 1. CodeFragment

Represents a draggable code snippet that must be matched with a description.

**Properties**:
- `id: string` - Unique identifier for the fragment (e.g., "frag-1", "frag-2")
- `code: string` - The code text to display (syntax-highlighted via Prism.js)
- `descriptionId: string` - ID of the correct DescriptionZone this fragment matches

**Business Rules**:
- ID must be unique within a game instance
- Code text should be 1-5 lines (20-150 characters recommended)
- descriptionId must reference a valid DescriptionZone in the same game

**Example**:
```typescript
{
  id: "frag-1",
  code: "return items.filter(x => x.active)",
  descriptionId: "desc-1"
}
```

### 2. DescriptionZone

Represents a drop zone where code fragments can be placed, with descriptive text explaining what the code should do.

**Properties**:
- `id: string` - Unique identifier for the zone (e.g., "desc-1", "desc-2")
- `text: string` - Description text explaining the expected code behavior

**Business Rules**:
- ID must be unique within a game instance
- Text should be clear, 5-15 words describing what the code does or returns
- One-to-one relationship with CodeFragment (each zone accepts exactly one fragment)

**Example**:
```typescript
{
  id: "desc-1",
  text: "Filters array to include only active items"
}
```

### 3. CodeMatchingGameData

Configuration data for a matching game, stored in question JSON files.

**Properties**:
- `fragments: CodeFragment[]` - Array of 3-5 code fragments
- `descriptions: DescriptionZone[]` - Array of 3-5 descriptions (same count as fragments)

**Business Rules**:
- fragments.length must equal descriptions.length
- All fragment.descriptionId values must exist in descriptions array
- Each descriptionId should be referenced by exactly one fragment (bijective mapping)

**Example**:
```typescript
{
  fragments: [
    { id: "frag-1", code: "return items.filter(x => x.active)", descriptionId: "desc-1" },
    { id: "frag-2", code: "return items.map(x => x.name)", descriptionId: "desc-2" },
    { id: "frag-3", code: "return items.reduce((sum, x) => sum + x.value, 0)", descriptionId: "desc-3" }
  ],
  descriptions: [
    { id: "desc-1", text: "Filters array to include only active items" },
    { id: "desc-2", text: "Extracts names from all items" },
    { id: "desc-3", text: "Calculates sum of all item values" }
  ]
}
```

### 4. FragmentPlacement

Tracks which code fragment has been placed in which description zone by the user.

**Properties**:
- `zoneId: string` - The description zone ID
- `fragmentId: string | null` - The fragment ID currently placed in this zone (null if empty)

**Business Rules**:
- A fragment can only be placed in one zone at a time
- A zone can only hold one fragment at a time
- Placing a new fragment in an occupied zone returns the previous fragment to the available pool

**Internal Representation**: Stored as `Record<string, string>` mapping zoneId → fragmentId

**Example**:
```typescript
{
  "desc-1": "frag-2",  // User placed fragment 2 in zone 1 (incorrect)
  "desc-2": "frag-1",  // User placed fragment 1 in zone 2 (incorrect)
  "desc-3": null       // Zone 3 is empty
}
```

### 5. ValidationResult

Result of checking whether user's fragment placements are correct.

**Properties**:
- `zoneId: string` - The zone being validated
- `isCorrect: boolean` - Whether the placed fragment matches the zone's expected fragment
- `placedFragmentId: string | null` - Which fragment is currently placed (null if empty)
- `expectedFragmentId: string` - Which fragment should be placed for correct answer

**Business Rules**:
- isCorrect = (placedFragmentId === expectedFragmentId)
- Empty zones (placedFragmentId === null) are always incorrect
- Validation only occurs when user clicks "Check Matches" button

**Internal Representation**: Stored as `Record<string, boolean>` mapping zoneId → isCorrect

**Example**:
```typescript
{
  "desc-1": false,  // Incorrect placement
  "desc-2": true,   // Correct placement
  "desc-3": false   // Empty zone
}
```

### 6. CodeMatchingGameState

Complete runtime state of an active game instance.

**Properties**:
- `fragments: CodeFragment[]` - All available fragments for this game
- `zones: DescriptionZone[]` - All drop zones for this game
- `placements: Record<string, string>` - Current fragment placements (zoneId → fragmentId)
- `draggedFragmentId: string | null` - ID of fragment currently being dragged (null when not dragging)
- `attemptCount: number` - Number of times user clicked "Check Matches" (starts at 0)
- `isValidated: boolean` - Whether user has clicked "Check Matches" at least once
- `validationResults: Record<string, boolean> | null` - Validation results (null before first validation)
- `isComplete: boolean` - Whether all placements are correct (game won)

**Business Rules**:
- Initial state: placements={}, draggedFragmentId=null, attemptCount=0, isValidated=false
- attemptCount increments only when user clicks "Check Matches"
- isComplete=true only when isValidated=true AND all validationResults values are true
- When user retries, isValidated resets to false, validationResults=null, but attemptCount persists

**State Transitions**:
```
IDLE → DRAGGING → PLACED → VALIDATING → (CORRECT | INCORRECT)
      ↑___________|          |                      |
                             |______(retry)_________|
```

**Example**:
```typescript
{
  fragments: [...],  // 3-5 fragments
  zones: [...],      // 3-5 zones
  placements: {
    "desc-1": "frag-1",
    "desc-2": "frag-2",
    "desc-3": "frag-3"
  },
  draggedFragmentId: null,
  attemptCount: 1,
  isValidated: true,
  validationResults: {
    "desc-1": true,
    "desc-2": true,
    "desc-3": false
  },
  isComplete: false  // Not all correct yet
}
```

### 7. CodeMatchingSession

Persistent state for a code matching game within a quiz session.

**Properties**:
- `questionId: string` - Which question this game belongs to
- `placements: Record<string, string>` - User's current placements (persisted across page refresh)
- `attemptCount: number` - Number of validation attempts (persisted)
- `isComplete: boolean` - Whether game was successfully completed (persisted)
- `earnedBonus: number` - Bonus points earned (0, 5, or 10)

**Business Rules**:
- Stored in QuizSession.codeMatchingStates[questionId]
- earnedBonus calculated on first successful completion: 10 if attemptCount=1, 5 if attemptCount=2, 0 otherwise
- Once isComplete=true, earnedBonus is final (no further changes)

**Example**:
```typescript
{
  questionId: "ddd-001",
  placements: {
    "desc-1": "frag-1",
    "desc-2": "frag-2"
  },
  attemptCount: 1,
  isComplete: false,
  earnedBonus: 0
}
```

## Extended Existing Entities

### Question (Extended)

Existing `Question` entity extended with optional matching game data.

**New Property**:
- `matchingGame?: CodeMatchingGameData` - Optional game configuration (only for code-snippet questions)

**Business Rules**:
- Only code-snippet type questions should have matchingGame data
- If matchingGame is present, "Play Code Matching Game" button appears
- If matchingGame is absent, only standard quiz interface shows

**Example Extension**:
```typescript
{
  id: "ddd-001",
  themeId: "ddd",
  difficulty: "beginner",
  type: "code-snippet",
  prompt: "Match each code fragment to what it does:",
  codeSnippet: {
    language: "typescript",
    code: "// Full context code here"
  },
  options: [...],  // Standard multiple choice options
  explanation: "...",
  bonusFact: "...",
  matchingGame: {  // NEW: Optional game data
    fragments: [...],
    descriptions: [...]
  }
}
```

### UserAnswer (Extended)

Existing `UserAnswer` entity extended with game bonus points.

**New Property**:
- `gameBonus?: number` - Bonus points earned from code matching game (0-10)
- `gameAttempts?: number` - Number of attempts to complete game (for statistics)

**Business Rules**:
- gameBonus only set if user played and completed the matching game
- If user skipped game, gameBonus is undefined (not 0)
- gameBonus does not affect isCorrect determination (still based on standard answer)

**Example Extension**:
```typescript
{
  questionId: "ddd-001",
  selectedId: "b",  // Standard answer selection
  isCorrect: true,  // Based on standard answer
  gameBonus: 10,    // NEW: Earned from completing game on first try
  gameAttempts: 1   // NEW: Completed game in 1 attempt
}
```

### QuizSession (Extended)

Existing `QuizSession` entity extended with game state persistence.

**New Property**:
- `codeMatchingStates?: Record<string, CodeMatchingSession>` - Map of questionId → game session

**Business Rules**:
- Stored in localStorage alongside existing session data
- Restored when user returns to quiz after page refresh
- Cleared when quiz is completed or abandoned

**Example Extension**:
```typescript
{
  selectedThemes: [...],
  difficulty: "beginner",
  questions: [...],
  currentIndex: 3,
  answers: [...],
  isComplete: false,
  codeMatchingStates: {  // NEW: Game state persistence
    "ddd-001": {
      placements: { "desc-1": "frag-1" },
      attemptCount: 0,
      isComplete: false,
      earnedBonus: 0
    }
  }
}
```

## Entity Relationships

```
Question (1) ----has-optional----> (0..1) CodeMatchingGameData
                                           |
                                           +--contains--> (3..5) CodeFragment
                                           +--contains--> (3..5) DescriptionZone

CodeFragment (1) ----matches----> (1) DescriptionZone
                                      [descriptionId references zone.id]

CodeMatchingGameState ----uses----> CodeMatchingGameData
                      |              [fragments and zones arrays]
                      |
                      +--tracks----> FragmentPlacement (0..many)
                      |              [placements Record]
                      |
                      +--produces----> ValidationResult (0..many)
                                      [validationResults Record]

QuizSession (1) ----persists----> (0..many) CodeMatchingSession
                                  [codeMatchingStates Record]

UserAnswer (1) ----earns----> (0..1) Bonus Points
                              [gameBonus field]
```

## Data Flow

### 1. Game Initialization
```
Question.matchingGame
  ↓ (load)
CodeMatchingGameState.fragments
CodeMatchingGameState.zones
  ↓ (restore from localStorage if exists)
QuizSession.codeMatchingStates[questionId]
  ↓ (apply)
CodeMatchingGameState.placements
Code MatchingGameState.attemptCount
```

### 2. Drag and Drop
```
User drags fragment
  ↓
CodeMatchingGameState.draggedFragmentId = fragmentId
  ↓
User drops on zone
  ↓
CodeMatchingGameState.placements[zoneId] = fragmentId
  ↓ (persist)
QuizSession.codeMatchingStates[questionId].placements
```

### 3. Validation
```
User clicks "Check Matches"
  ↓
CodeMatchingGameState.attemptCount++
  ↓ (for each zone)
ValidationResult.isCorrect = (placed === expected)
  ↓ (store results)
CodeMatchingGameState.validationResults
  ↓ (check if all correct)
CodeMatchingGameState.isComplete
  ↓ (if complete, calculate bonus)
CodeMatchingSession.earnedBonus = calculateBonus(attemptCount)
  ↓ (persist)
QuizSession.codeMatchingStates[questionId]
```

### 4. Game Completion
```
CodeMatchingGameState.isComplete = true
  ↓
User answers standard question
  ↓
UserAnswer.gameBonus = CodeMatchingSession.earnedBonus
UserAnswer.gameAttempts = CodeMatchingSession.attemptCount
  ↓ (save to history)
QuizHistory.attempts[].answers[].gameBonus
```

## Validation Rules

### Fragment-Zone Matching
```typescript
function isCorrect(placement: FragmentPlacement, fragment: CodeFragment): boolean {
  return placement.fragmentId === fragment.descriptionId
}
```

### Game Completion
```typescript
function isGameComplete(
  placements: Record<string, string>,
  zones: DescriptionZone[],
  fragments: CodeFragment[]
): boolean {
  // All zones must have a fragment
  if (Object.keys(placements).length !== zones.length) return false

  // All placements must be correct
  for (const zone of zones) {
    const placedFragmentId = placements[zone.id]
    if (!placedFragmentId) return false

    const fragment = fragments.find(f => f.id === placedFragmentId)
    if (!fragment || fragment.descriptionId !== zone.id) return false
  }

  return true
}
```

### Bonus Calculation
```typescript
function calculateBonus(attemptCount: number): number {
  if (attemptCount === 1) return 10  // First try bonus
  if (attemptCount === 2) return 5   // Second try bonus
  return 0                            // No bonus after 2 attempts
}
```

## Storage Schema

### Question JSON File (ddd.json example)
```json
{
  "id": "ddd-001",
  "themeId": "ddd",
  "difficulty": "beginner",
  "type": "code-snippet",
  "prompt": "Match each code fragment to its description:",
  "codeSnippet": {
    "language": "typescript",
    "code": "// Context code"
  },
  "options": [...],
  "explanation": "...",
  "bonusFact": null,
  "matchingGame": {
    "fragments": [
      { "id": "frag-1", "code": "return items.filter(x => x.active)", "descriptionId": "desc-1" },
      { "id": "frag-2", "code": "return items.map(x => x.name)", "descriptionId": "desc-2" },
      { "id": "frag-3", "code": "return items.reduce((sum, x) => sum + x.value, 0)", "descriptionId": "desc-3" }
    ],
    "descriptions": [
      { "id": "desc-1", "text": "Filters array to include only active items" },
      { "id": "desc-2", "text": "Extracts names from all items" },
      { "id": "desc-3", "text": "Calculates sum of all item values" }
    ]
  }
}
```

### localStorage (QuizSession)
```json
{
  "selectedThemes": ["ddd", "tdd"],
  "difficulty": "beginner",
  "questions": [...],
  "currentIndex": 2,
  "answers": [...],
  "isComplete": false,
  "codeMatchingStates": {
    "ddd-001": {
      "placements": {
        "desc-1": "frag-1",
        "desc-2": "frag-2"
      },
      "attemptCount": 1,
      "isComplete": false,
      "earnedBonus": 0
    }
  }
}
```

## Performance Considerations

- **Fragment lookup**: O(1) using Record<> instead of array.find()
- **Validation**: O(n) where n = number of zones (typically 3-5, negligible)
- **State updates**: Reactive Vue refs trigger minimal re-renders (only affected components)
- **Persistence**: Debounced writes to localStorage (max 1 write per 500ms)
- **Memory**: Single game state in memory (~1-2KB), garbage collected on unmount

## Future Extensions

Potential enhancements not included in MVP:

1. **Multi-match zones**: Allow one zone to accept multiple correct fragments
2. **Partial credit**: Award points for partially correct matches
3. **Hint system**: Reveal one correct match after failed attempt
4. **Timed challenges**: Add optional countdown timer for competitive mode
5. **Animation sequences**: Animate correct matches into final code display
6. **Difficulty scaling**: More fragments for advanced questions (6-8 instead of 3-5)

These are documented for future consideration but not part of current scope.

## Summary

The data model extends existing quiz entities with minimal changes:
- Question gets optional `matchingGame` field
- UserAnswer gets optional `gameBonus` and `gameAttempts` fields
- QuizSession gets optional `codeMatchingStates` field

All new entities (CodeFragment, DescriptionZone, CodeMatchingGameState) are self-contained and don't affect existing quiz functionality when game is not played.
