# Quickstart Guide: Code Matching Mini Game

**Feature**: 002-code-matching-game
**Date**: 2026-03-10
**For**: Developers implementing or extending the code matching game

## Overview

This guide helps developers quickly understand and work with the code matching mini game feature. Read this before starting implementation or making changes.

## What Is This Feature?

An interactive drag-and-drop mini game for code-snippet quiz questions where users match code fragments with their descriptions. The game is optional, keyboard-accessible, mobile-friendly, and awards bonus points for completion.

## Quick Architecture Overview

```
User Flow:
QuizQuestion → "Play Game" button → CodeMatchingGame
                                    ↓ (drag & drop)
                                    ↓ (validate)
                                    ↓ (complete/retry)
                                    ↓ ("Continue")
                                    QuizQuestion (standard quiz)

Component Hierarchy:
CodeMatchingGame (container)
├── CodeFragment (draggable, repeats 3-5x)
├── DescriptionZone (drop target, repeats 3-5x)
└── MatchValidationResult (feedback overlay)

State Management:
useCodeMatchingGame composable
├── Drag/drop handlers
├── Validation logic
├── Session persistence
└── Bonus calculation
```

## File Locations

### New Files to Create
```
frontend/src/
├── components/quiz/
│   ├── CodeMatchingGame.vue           # Main game container
│   ├── CodeFragment.vue               # Draggable code fragment
│   ├── DescriptionZone.vue            # Drop zone
│   └── MatchValidationResult.vue      # Validation feedback
├── composables/
│   └── useCodeMatchingGame.ts         # Game logic
└── types/
    └── codeMatching.ts                # Game-specific types

frontend/tests/
├── unit/composables/
│   └── useCodeMatchingGame.spec.ts    # Composable tests
├── unit/components/quiz/
│   ├── CodeMatchingGame.spec.ts       # Component tests
│   ├── CodeFragment.spec.ts
│   └── DescriptionZone.spec.ts
├── integration/
│   └── code-matching-flow.spec.ts     # Integration test
└── e2e/
    └── code-matching-game.spec.ts     # E2E test
```

### Files to Modify
```
frontend/src/
├── components/quiz/
│   └── QuizQuestion.vue               # Add game activation UI
├── composables/
│   └── useQuiz.ts                     # Track game state/bonus
├── types/
│   └── quiz.ts                        # Extend Question, UserAnswer
└── views/
    └── QuizResultsView.vue            # Display bonus points

frontend/src/data/questions/
├── ddd.json                           # Add matchingGame data
└── tdd.json                           # Add matchingGame data
```

## Key Type Definitions

### Core Game Types
```typescript
// From contracts/CodeMatchingTypes.ts

interface CodeFragment {
  id: string                 // "frag-1", "frag-2", etc.
  code: string               // Code text (1-5 lines)
  descriptionId: string      // ID of matching description
}

interface DescriptionZone {
  id: string                 // "desc-1", "desc-2", etc.
  text: string               // What the code does
}

interface CodeMatchingGameState {
  fragments: CodeFragment[]
  zones: DescriptionZone[]
  placements: Record<string, string>  // zoneId → fragmentId
  draggedFragmentId: string | null
  attemptCount: number
  isValidated: boolean
  validationResults: Record<string, boolean> | null
  isComplete: boolean
}
```

### Quiz Extensions
```typescript
// From contracts/QuizExtensions.ts

interface Question {
  // ... existing fields
  matchingGame?: {           // NEW: Optional game data
    fragments: CodeFragment[]
    descriptions: DescriptionZone[]
  }
}

interface UserAnswer {
  // ... existing fields
  gameBonus?: number         // NEW: 0-10 bonus points
  gameAttempts?: number      // NEW: Attempt count
}

interface QuizSession {
  // ... existing fields
  codeMatchingStates?: Record<string, CodeMatchingSession>  // NEW: Game persistence
}
```

## Development Workflow

### 1. Set Up Environment
```bash
cd /home/runner/work/tech-quizz/tech-quizz/frontend

# Install dependencies (already done, but for reference)
npm install

# Start dev server
npm run dev

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e
```

### 2. Implement in Order (from tasks.md)

**Phase 0: Foundational**
1. Create type definitions (`types/codeMatching.ts`)
2. Extend existing types (`types/quiz.ts`)
3. Set up test files
4. Add game data to 2-3 questions

**Phase 1: Core Game (P1)**
5. Implement `useCodeMatchingGame` composable
6. Build `CodeFragment` component
7. Build `DescriptionZone` component
8. Build `CodeMatchingGame` container
9. Integrate into `QuizQuestion`
10. Add session persistence

**Phase 2: Retry & Polish (P2)**
11. Add validation feedback component
12. Implement retry functionality
13. Add keyboard navigation
14. Add touch support
15. Performance optimization

### 3. Testing Strategy

**Unit Tests** (Vitest):
```typescript
// tests/unit/composables/useCodeMatchingGame.spec.ts
describe('useCodeMatchingGame', () => {
  it('places fragment in zone', () => { ... })
  it('validates matches correctly', () => { ... })
  it('calculates bonus based on attempts', () => { ... })
})
```

**Component Tests** (@vue/test-utils):
```typescript
// tests/unit/components/quiz/CodeFragment.spec.ts
describe('CodeFragment', () => {
  it('emits dragstart event', () => { ... })
  it('shows dragging state', () => { ... })
  it('applies syntax highlighting', () => { ... })
})
```

**E2E Tests** (Playwright):
```typescript
// tests/e2e/code-matching-game.spec.ts
test('complete game flow', async ({ page }) => {
  // Load quiz with matching game
  // Click "Play Game"
  // Drag fragments to zones
  // Click "Check Matches"
  // Verify feedback
  // Answer standard question
  // Check bonus points in results
})
```

### 4. Run Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix lint issues
npm run lint -- --fix

# Format code
npm run format

# Run all tests
npm test

# Check coverage (must be ≥80%)
npm run coverage

# E2E tests
npm run test:e2e
```

## Adding Matching Game Data to Questions

Edit question JSON files (e.g., `frontend/src/data/questions/ddd.json`):

```json
{
  "id": "ddd-001",
  "themeId": "ddd",
  "difficulty": "beginner",
  "type": "code-snippet",
  "prompt": "Match each code fragment to what it does:",
  "codeSnippet": {
    "language": "typescript",
    "code": "// Full context code here"
  },
  "options": [
    { "id": "a", "text": "Option A", "isCorrect": true },
    { "id": "b", "text": "Option B", "isCorrect": false },
    { "id": "c", "text": "Option C", "isCorrect": false },
    { "id": "d", "text": "Option D", "isCorrect": false }
  ],
  "explanation": "Explanation of correct answer",
  "bonusFact": null,
  "matchingGame": {
    "fragments": [
      {
        "id": "frag-1",
        "code": "return items.filter(x => x.active)",
        "descriptionId": "desc-1"
      },
      {
        "id": "frag-2",
        "code": "return items.map(x => x.name)",
        "descriptionId": "desc-2"
      },
      {
        "id": "frag-3",
        "code": "return items.reduce((sum, x) => sum + x.value, 0)",
        "descriptionId": "desc-3"
      }
    ],
    "descriptions": [
      { "id": "desc-1", "text": "Filters array to include only active items" },
      { "id": "desc-2", "text": "Extracts names from all items" },
      { "id": "desc-3", "text": "Calculates sum of all item values" }
    ]
  }
}
```

**Guidelines**:
- Use 3-5 fragments (FR-003)
- Keep code fragments short (1-5 lines, 20-150 chars)
- Make descriptions clear and specific (5-15 words)
- Ensure bijective mapping (each fragment matches exactly one description)
- Test manually after adding to verify gameplay

## Component Implementation Patterns

### Vue 3 Composition API Pattern
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CodeFragment } from '@/types/codeMatching'

// Props with types
interface Props {
  fragment: CodeFragment
  isDragging: boolean
}
const props = defineProps<Props>()

// Emits with types
interface Emits {
  (e: 'dragstart', fragmentId: string): void
}
const emit = defineEmits<Emits>()

// Local state
const isHovered = ref(false)

// Computed
const cssClasses = computed(() => ({
  'is-dragging': props.isDragging,
  'is-hovered': isHovered.value
}))

// Methods
function handleDragStart(event: DragEvent) {
  emit('dragstart', props.fragment.id)
}
</script>

<template>
  <div
    class="code-fragment"
    :class="cssClasses"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <code>{{ fragment.code }}</code>
  </div>
</template>

<style scoped>
.code-fragment {
  /* Styles here */
}
</style>
```

### Composable Pattern
```typescript
// composables/useCodeMatchingGame.ts
import { ref, computed } from 'vue'
import type { CodeMatchingGameState } from '@/types/codeMatching'

export function useCodeMatchingGame(initialData: CodeMatchingGameData) {
  // State
  const state = ref<CodeMatchingGameState>({
    fragments: initialData.fragments,
    zones: initialData.descriptions,
    placements: {},
    draggedFragmentId: null,
    attemptCount: 0,
    isValidated: false,
    validationResults: null,
    isComplete: false
  })

  // Computed
  const availableFragments = computed(() => {
    const placedIds = Object.values(state.value.placements)
    return state.value.fragments.filter(f => !placedIds.includes(f.id))
  })

  // Actions
  function placeFragment(zoneId: string, fragmentId: string) {
    state.value.placements[zoneId] = fragmentId
  }

  function validateMatches() {
    state.value.attemptCount++
    state.value.isValidated = true
    // ... validation logic
  }

  return {
    state,
    availableFragments,
    placeFragment,
    validateMatches
  }
}
```

## Debugging Tips

### Check Game State
```javascript
// In browser console
const gameState = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.appRecords[0]
  .componentInstance.setupState

console.log('Placements:', gameState.placements)
console.log('Validation:', gameState.validationResults)
```

### Test Drag and Drop
```typescript
// In component test
const fragment = wrapper.find('[data-testid="fragment-1"]')
await fragment.trigger('dragstart')
const zone = wrapper.find('[data-testid="zone-1"]')
await zone.trigger('drop')
expect(wrapper.emitted('placeFragment')).toBeTruthy()
```

### Check Session Persistence
```javascript
// In browser console
const session = JSON.parse(localStorage.getItem('quiz-session') || '{}')
console.log('Matching states:', session.codeMatchingStates)
```

## Common Issues & Solutions

### Issue: Drag doesn't work on mobile
**Solution**: Implement touch event handlers in addition to drag events. See `research.md` section 6 for implementation pattern.

### Issue: Validation is slow
**Solution**: Use `computed()` for validation results. Ensure O(1) lookups with Record<> instead of array.find().

### Issue: State not persisting
**Solution**: Call `saveMatchingSession()` from QuizExtensions after every placement. Debounce with 500ms delay.

### Issue: Keyboard navigation confusing
**Solution**: Add clear visual focus indicators and ARIA live regions for state announcements.

### Issue: Tests flaky
**Solution**: Use `await nextTick()` after state changes. Mock drag events deterministically.

## Performance Checklist

- [ ] Game component lazy-loaded (dynamic import)
- [ ] Drag handlers use `will-change` CSS hints
- [ ] Validation uses memoized computed properties
- [ ] Fragment lookups are O(1) with Record<>
- [ ] LocalStorage writes are debounced (500ms)
- [ ] Animations stay under 16ms per frame
- [ ] No unnecessary re-renders (check with Vue Devtools)

## Accessibility Checklist

- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works (Tab/Arrow/Enter/Escape)
- [ ] Screen reader announces drag state changes
- [ ] Focus indicators visible on all elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Touch targets ≥44x44px
- [ ] Tested with NVDA/JAWS (Windows) or VoiceOver (Mac/iOS)

## Next Steps

1. Review [spec.md](./spec.md) for user stories and requirements
2. Review [research.md](./research.md) for technical decisions
3. Review [data-model.md](./data-model.md) for entity definitions
4. Review contracts in `contracts/` directory
5. Run `/speckit.tasks` to generate detailed task breakdown
6. Start with Foundational phase tasks
7. Implement P1 user stories first, then P2
8. Run tests continuously during development
9. Submit PR with all quality gates passing

## Resources

- **Vue 3 Docs**: https://vuejs.org/guide/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
- **Vitest Docs**: https://vitest.dev/
- **Playwright Docs**: https://playwright.dev/
- **HTML5 Drag and Drop**: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Project Constitution**: `/.specify/memory/constitution.md`

## Questions?

If you encounter issues or need clarification:
1. Check the research.md for technical decisions
2. Review data-model.md for entity relationships
3. Look at existing quiz components for patterns
4. Check the constitution for quality standards
5. Ask the team or create a GitHub issue

Happy coding! 🚀
