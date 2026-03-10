# Research: Code Matching Mini Game

**Feature**: 002-code-matching-game
**Date**: 2026-03-10
**Phase**: Phase 0 - Technical Research and Decision Making

## Executive Summary

This document consolidates technical research and architectural decisions for implementing the code matching mini game feature. The game will be built as a Vue 3 component using native HTML5 drag-and-drop APIs with touch event fallbacks for mobile devices.

## Key Technical Decisions

### 1. Drag-and-Drop Implementation

**Decision**: Use HTML5 Drag and Drop API with touch event polyfill

**Rationale**:
- Native HTML5 DnD provides excellent desktop browser support with minimal overhead
- Vue 3 reactive system integrates naturally with DnD event handlers
- Touch events can be layered on top for mobile device support
- No need for heavy third-party drag-drop libraries (e.g., Vue Draggable, Sortable.js)

**Alternatives Considered**:
- **Vue Draggable (Sortable.js wrapper)**: Adds ~50KB dependency, overkill for our simple use case
- **Pointer Events API**: Newer but requires more manual state management for drag operations
- **Pure Touch/Mouse Events**: Requires implementing all drag semantics from scratch

**Implementation Details**:
- Desktop: `dragstart`, `dragover`, `drop` events on fragment/zone elements
- Mobile: Touch event handlers (`touchstart`, `touchmove`, `touchend`) with position tracking
- Keyboard: Focus management with Arrow keys + Enter to place (ARIA live regions for feedback)

**Code Pattern**:
```typescript
// Composable: useCodeMatching.ts
const handleDragStart = (event: DragEvent, fragmentId: string) => {
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('fragmentId', fragmentId)
  draggedFragment.value = fragmentId
}

const handleDrop = (event: DragEvent, zoneId: string) => {
  event.preventDefault()
  const fragmentId = event.dataTransfer!.getData('fragmentId')
  placements.value[zoneId] = fragmentId
  draggedFragment.value = null
}
```

### 2. Game State Management

**Decision**: Use Vue 3 composable pattern (`useCodeMatchingGame.ts`)

**Rationale**:
- Consistent with existing codebase patterns (`useQuiz.ts`, `useQuestionBank.ts`)
- Reactive state with minimal boilerplate
- Easy to test in isolation
- No additional state management library needed

**Alternatives Considered**:
- **Pinia/Vuex**: Overkill for component-scoped state
- **Component-local state**: Harder to test and reuse logic

**State Structure**:
```typescript
interface CodeMatchingGameState {
  fragments: CodeFragment[]           // Available fragments
  zones: DescriptionZone[]           // Drop zones with descriptions
  placements: Record<string, string> // zoneId -> fragmentId mapping
  attemptCount: number               // Number of validation attempts
  isValidated: boolean               // Whether user clicked "Check Matches"
  validationResults: Record<string, boolean> // zoneId -> correct/incorrect
  isComplete: boolean                // All correct matches made
}
```

### 3. Game Data Structure in Questions

**Decision**: Extend existing Question type with optional `matchingGame` property

**Rationale**:
- Backwards compatible with existing questions
- Only code-snippet questions need matching data
- Keeps question bank JSON files maintainable

**Alternatives Considered**:
- **Separate game definitions file**: Adds complexity, harder to keep in sync
- **Auto-generate game from code**: Unreliable, requires NLP/code parsing

**Schema Extension**:
```typescript
interface Question {
  // ... existing fields
  matchingGame?: {
    fragments: Array<{
      id: string
      code: string           // Code fragment text
      descriptionId: string  // Links to correct description
    }>
    descriptions: Array<{
      id: string
      text: string          // What this fragment does/returns
    }>
  }
}
```

**Migration Strategy**:
- Start with 2-3 example questions per theme with matching game data
- Add `matchingGame` data to high-quality code-snippet questions over time
- Game component checks for presence of `matchingGame` before showing "Play" button

### 4. Visual Feedback and Animations

**Decision**: CSS transitions with Vue `<Transition>` components

**Rationale**:
- Lightweight, no animation library needed
- CSS transitions provide 60fps performance
- Vue transition hooks enable cleanup/setup logic

**Alternatives Considered**:
- **GSAP/Anime.js**: Heavy dependencies for simple slide/fade animations
- **Web Animations API**: Good but CSS transitions sufficient for our needs

**Animation Patterns**:
- Fragment drag: `opacity: 0.6`, `cursor: grabbing`, `transform: scale(1.05)`
- Drop zone hover: `border-color` change, `background` highlight
- Validation result: Green/red border pulse with checkmark/X icon fade-in
- State transitions: 150ms ease-out for responsive feel (per constitution <100ms)

### 5. Accessibility Implementation

**Decision**: ARIA live regions + keyboard navigation with visible focus indicators

**Rationale**:
- WCAG 2.1 AA compliance required by constitution
- Drag-drop not accessible by default, needs keyboard alternative
- Screen readers need state announcements

**Alternatives Considered**:
- **Drag-drop only**: Fails accessibility requirements
- **Separate accessible version**: Maintenance burden, stigmatizing

**Implementation Details**:
- Fragments: `role="button"`, `tabindex="0"`, `aria-grabbed` attribute
- Zones: `role="listbox"`, `aria-label` with description text
- Live region: `aria-live="polite"` announces "Fragment moved to [zone]"
- Keyboard pattern:
  - Tab: Focus next fragment/zone
  - Arrow keys: Move focus between items
  - Enter/Space: Pick up fragment or place in focused zone
  - Escape: Cancel drag operation

### 6. Mobile Touch Support

**Decision**: Touch event layer with visual drag proxy

**Rationale**:
- HTML5 DnD has inconsistent mobile browser support
- Touch events provide precise control over drag visuals
- Can show custom drag preview (floating fragment)

**Implementation Pattern**:
```typescript
const handleTouchStart = (event: TouchEvent, fragmentId: string) => {
  const touch = event.touches[0]
  dragState.value = {
    fragmentId,
    startX: touch.clientX,
    startY: touch.clientY,
    currentX: touch.clientX,
    currentY: touch.clientY
  }
}

const handleTouchMove = (event: TouchEvent) => {
  if (!dragState.value) return
  event.preventDefault() // Prevent scroll
  const touch = event.touches[0]
  dragState.value.currentX = touch.clientX
  dragState.value.currentY = touch.clientY
  // Update floating preview position
}
```

### 7. Session Persistence

**Decision**: Extend existing `QuizSession` to store game state

**Rationale**:
- Quiz session already persists to handle page refresh
- Game state is quiz-session scoped, not global
- Reuse existing localStorage service

**Data to Persist**:
```typescript
interface QuizSession {
  // ... existing fields
  codeMatchingStates?: Record<string, { // questionId -> game state
    placements: Record<string, string>
    attemptCount: number
    isComplete: boolean
  }>
}
```

### 8. Bonus Points Calculation

**Decision**: Simple multiplier based on first-attempt completion

**Rationale**:
- Clear incentive for engagement without complex scoring
- Easy to understand (1st try = 2x points, 2nd try = 1.5x, 3+ try = 1x)
- Aligns with success criterion SC-006 (15% higher scores)

**Formula**:
- Complete on 1st try: +10 bonus points (shown as "🎯 First Try Bonus")
- Complete on 2nd try: +5 bonus points (shown as "✅ Retry Success")
- Complete on 3+ tries or skip: +0 bonus points

**Storage**: Bonus points stored in `UserAnswer` as `gameBonus?: number`

### 9. Component Architecture

**Decision**: Four new components + one composable

**Components**:
1. `CodeMatchingGame.vue` - Main game container with layout
2. `CodeFragment.vue` - Draggable code fragment card
3. `DescriptionZone.vue` - Drop zone for fragments
4. `MatchValidationResult.vue` - Show correct/incorrect feedback

**Composable**:
- `useCodeMatchingGame.ts` - Game state and logic

**Rationale**:
- Single Responsibility: Each component has one clear job
- Testable: Components receive props, emit events
- Reusable: Fragment and Zone components can be styled independently

### 10. Testing Strategy

**Decision**: Unit tests for composable + component tests for interactions + E2E for full flow

**Test Coverage**:
- Unit (Vitest): `useCodeMatchingGame.ts` logic (placement, validation, undo, retry)
- Component (Vue Test Utils): Fragment drag events, zone drop acceptance, keyboard nav
- E2E (Playwright): Full user journey (play game → drag fragments → validate → see results → answer question)

**Key Test Scenarios**:
- All fragments matched correctly → success state
- Some fragments incorrect → validation shows errors, retry available
- Skip button → game closes, standard question appears
- Keyboard navigation → fragments placeable via Enter key
- Page refresh → game state restored

### 11. Performance Considerations

**Decision**: Lazy load game component, memoize validation calculations

**Optimizations**:
- Game component loaded only when user clicks "Play Code Matching Game" (dynamic import)
- Validation logic memoized with `computed()` for instant feedback
- Fragment positions tracked with efficient Record<> lookups (O(1) access)
- CSS `will-change` hints for transform properties during drag

**Performance Targets (from constitution)**:
- Initial game load: <500ms (component mount + render)
- Drag response: <100ms (visual feedback on drag start)
- Validation feedback: <200ms (check all matches + update UI)
- Animation frame budget: 16ms (60fps for smooth transitions)

## Open Questions Resolved

### Q: Should game data be in question JSON or generated?
**A**: In question JSON. Manual curation ensures quality. Start with 2-3 examples per theme.

### Q: How to handle questions without matching data?
**A**: "Play Game" button only appears if `question.matchingGame` exists. Otherwise, standard quiz flow.

### Q: What if user answers question without playing game?
**A**: Allowed. Game is optional. No bonus points awarded, but question still counts toward score.

### Q: How many fragments per game?
**A**: 3-5 fragments (per FR-003). Question authors decide based on code complexity.

## Dependencies and Tools

**No new npm dependencies required**. Feature built with:
- Vue 3 (existing)
- TypeScript (existing)
- HTML5 Drag and Drop API (native)
- Touch Events API (native)
- CSS Transitions (native)
- Prism.js (existing, for syntax highlighting fragments)

**Development Tools** (existing):
- Vitest for testing
- Playwright for E2E
- ESLint + Prettier for code quality

## Integration Points

1. **QuizQuestion.vue**: Add game activation UI (Play/Skip buttons)
2. **useQuiz.ts**: Track game completion and bonus points
3. **types/quiz.ts**: Extend `Question` and `UserAnswer` interfaces
4. **data/questions/*.json**: Add `matchingGame` data to select questions
5. **QuizResultsView.vue**: Display game bonus points in breakdown

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Touch events unreliable on some devices | Provide "Skip to Question" button, test on iOS Safari + Android Chrome |
| Users don't understand drag mechanic | Show 2-second tutorial animation on first play, clear visual cues (cursor, hover states) |
| Game takes too long, frustrates users | 2-minute timeout with "Taking too long? Skip to question" prompt |
| Accessibility gaps | Comprehensive keyboard nav + ARIA, test with screen reader (NVDA/VoiceOver) |
| Performance on low-end devices | Lazy load component, minimize animations on `prefers-reduced-motion` |

## Next Steps (Phase 1)

1. Create `data-model.md` with detailed entity definitions
2. Define TypeScript interfaces in `contracts/` directory
3. Generate `quickstart.md` for developer onboarding
4. Update agent context (CLAUDE.md) with new technologies/patterns
5. Proceed to Phase 2 task breakdown (`/speckit.tasks`)

## References

- HTML5 Drag and Drop API: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- Touch Events: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
- WCAG 2.1 Drag and Drop: https://www.w3.org/WAI/WCAG21/Understanding/dragging-movements
- Vue 3 Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Project Constitution: `.specify/memory/constitution.md`
