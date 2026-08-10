# Implementation Plan: Code Matching Mini Game

**Branch**: `002-code-matching-game` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-code-matching-game/spec.md`

## Summary

Add an interactive code matching mini game for code-snippet quiz questions where users drag-and-drop code fragments to match with their descriptions/outcomes. The game is optional (users can skip to standard quiz), keyboard-accessible, mobile-friendly with touch support, and awards bonus points for first-try completion. Built using Vue 3 Composition API with HTML5 Drag-and-Drop API (desktop) and Touch Events (mobile), integrated into existing quiz flow without external dependencies.

## Technical Context

**Language/Version**: TypeScript 5.9.3 (strict mode) with Vue 3.5.25 Composition API
**Primary Dependencies**: Vue 3, Vue Router, Vite 7.3.1, Prism.js 1.30.0 (code highlighting)
**Storage**: localStorage via existing `LocalStorageQuizHistory` service (quiz session persistence)
**Testing**: Vitest 4.0.18 (unit/component), @vue/test-utils 2.4.6, Playwright 1.58.2 (E2E), 80% coverage threshold
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) on desktop and mobile
**Project Type**: Single-page web application (Vue 3 SPA)
**Performance Goals**: <100ms drag response, <200ms validation feedback, <500ms game load, 60fps animations
**Constraints**: No new npm dependencies, WCAG 2.1 AA accessibility, responsive mobile design (768px breakpoint)
**Scale/Scope**: 8 quiz themes, ~50-100 questions with optional game data, single game component with 4 sub-components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. User Experience First ✅ PASS

- **Responsive feedback**: Drag operations provide visual feedback within 100ms (CSS transitions + cursor changes)
- **Intuitive navigation**: Game includes visual cues (drag cursors, drop zone highlights, button labels)
- **Accessibility**: Keyboard navigation (Tab/Arrow/Enter) + ARIA labels for screen readers
- **UI states**: All states designed (idle, dragging, placed, validating, correct/incorrect, complete)
- **Actionable errors**: "Try Again" button with clear feedback on which matches are incorrect

### II. Performance by Design ✅ PASS

- **Measurable targets**: <100ms drag response, <200ms validation, <500ms load (documented in research.md)
- **No N+1 queries**: Static question data, no database queries
- **Bundle impact**: Zero new dependencies, game component lazy-loaded
- **Pagination**: N/A (single game per question, 3-5 fragments)
- **Render budget**: CSS transitions optimized for 60fps, `will-change` hints for transforms

### III. Comprehensive Test Coverage ✅ PASS (commitment)

- **80% coverage target**: Will be met through unit tests (composable logic), component tests (interactions), E2E tests (full flow)
- **Integration tests**: Full user journey from game start → drag → validate → retry/skip → answer question
- **Unit tests**: All public functions in `useCodeMatchingGame.ts` (placement, validation, undo, retry)
- **Deterministic**: No flaky tests (drag-drop mocked in unit tests, Playwright stabilizers for E2E)
- **Behavior-focused names**: e.g., "allows user to undo fragment placement by clicking placed fragment"

### IV. Clean Code ✅ PASS

- **Single responsibility**: Each component <200 lines, composable functions <30 lines
- **File organization**: Game components in `components/quiz/`, composable in `composables/`
- **Descriptive naming**: `CodeMatchingGame`, `useCodeMatchingGame`, `handleFragmentDrop`
- **No dead code**: Linting enforced via ESLint with no suppressions
- **DRY principle**: Drag logic centralized in composable, reused by both desktop and mobile event handlers

### V. Parallel-Safe Collaboration ✅ PASS

- **File ownership**: Clear file list in tasks.md (Phase 2), no overlaps with existing features
- **Frozen interfaces**: TypeScript interfaces defined in Phase 1 contracts before implementation
- **Explicit scope**: Only modifies files in game component directory + extends existing types
- **No cross-cutting changes**: Integrates via existing extension points (QuizQuestion component, useQuiz composable)
- **Test isolation**: Game tests independent of other quiz tests

**Gate Result**: ✅ ALL CHECKS PASS - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-code-matching-game/
├── spec.md              # Feature specification (user stories, requirements, success criteria)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0: Technical decisions and rationale
├── data-model.md        # Phase 1: Entity definitions and relationships
├── quickstart.md        # Phase 1: Developer onboarding guide
├── contracts/           # Phase 1: TypeScript interface definitions
│   ├── CodeMatchingTypes.ts    # Game-specific type definitions
│   └── QuizExtensions.ts       # Extensions to existing Quiz types
└── tasks.md             # Phase 2: Actionable task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   └── quiz/
│   │       ├── [EXISTING] QuizQuestion.vue         # ⚙️ Modified: Add game activation UI
│   │       ├── [EXISTING] AnswerOption.vue         # Unchanged
│   │       ├── [EXISTING] AnswerFeedback.vue       # Unchanged
│   │       ├── [EXISTING] CodeSnippet.vue          # Unchanged
│   │       ├── [NEW] CodeMatchingGame.vue          # Main game container
│   │       ├── [NEW] CodeFragment.vue              # Draggable code fragment
│   │       ├── [NEW] DescriptionZone.vue           # Drop zone for fragments
│   │       └── [NEW] MatchValidationResult.vue     # Validation feedback UI
│   ├── composables/
│   │   ├── [EXISTING] useQuiz.ts                   # ⚙️ Modified: Track game state/bonus points
│   │   ├── [EXISTING] useQuestionBank.ts           # Unchanged
│   │   ├── [EXISTING] useQuizHistory.ts            # Unchanged
│   │   └── [NEW] useCodeMatchingGame.ts            # Game state and logic
│   ├── types/
│   │   ├── [EXISTING] quiz.ts                      # ⚙️ Modified: Extend Question, UserAnswer types
│   │   ├── [EXISTING] history.ts                   # Unchanged
│   │   └── [NEW] codeMatching.ts                   # Game-specific types
│   ├── data/
│   │   └── questions/
│   │       ├── [EXISTING] ddd.json                 # ⚙️ Modified: Add matchingGame data to 2-3 questions
│   │       ├── [EXISTING] tdd.json                 # ⚙️ Modified: Add matchingGame data to 2-3 questions
│   │       └── [EXISTING] *.json                   # Other theme files (can add game data later)
│   └── views/
│       └── [EXISTING] QuizResultsView.vue          # ⚙️ Modified: Display game bonus points
├── tests/
│   ├── unit/
│   │   ├── composables/
│   │   │   └── [NEW] useCodeMatchingGame.spec.ts   # Unit tests for game logic
│   │   └── components/
│   │       └── quiz/
│   │           ├── [NEW] CodeMatchingGame.spec.ts  # Component tests
│   │           ├── [NEW] CodeFragment.spec.ts
│   │           └── [NEW] DescriptionZone.spec.ts
│   └── integration/
│       └── [NEW] code-matching-flow.spec.ts        # Full game flow integration test
└── e2e/
    └── [NEW] code-matching-game.spec.ts            # Playwright E2E test
```

**Structure Decision**: Single project frontend (Vue 3 SPA). Game components added to existing `components/quiz/` directory alongside QuizQuestion, AnswerOption, etc. Game composable follows established pattern in `composables/`. No backend changes needed (static question data).

**File Modification Summary**:
- **7 new files**: 4 game components, 1 composable, 1 types file, 1 integration test
- **5 modified files**: QuizQuestion.vue, useQuiz.ts, quiz.ts types, 2 question JSON files
- **Test files**: 5 new test files (unit, component, integration, E2E)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations detected. All complexity is justified by feature requirements and aligns with constitution principles.*

## Phase 0: Research (Completed)

See [research.md](./research.md) for detailed technical decisions including:
- Drag-and-drop implementation strategy (HTML5 DnD + Touch Events)
- Game state management approach (Vue 3 composable pattern)
- Data structure for matching games in question JSON
- Visual feedback and animation techniques
- Accessibility implementation (ARIA + keyboard navigation)
- Mobile touch support strategy
- Session persistence approach
- Testing strategy and performance optimizations

## Phase 1: Design & Contracts (In Progress)

### Deliverables

1. **data-model.md** - Entity definitions and relationships
2. **contracts/** - TypeScript interface definitions
   - `CodeMatchingTypes.ts` - Game-specific types (CodeFragment, DescriptionZone, GameState)
   - `QuizExtensions.ts` - Extensions to existing Quiz types
3. **quickstart.md** - Developer onboarding guide

### Status

- ✅ research.md completed
- 🔄 data-model.md in progress
- ⏳ contracts/ pending
- ⏳ quickstart.md pending
- ⏳ Agent context update pending

## Phase 2: Task Breakdown

Will be generated by `/speckit.tasks` command after Phase 1 completion.

Expected task structure:
- **Foundational Phase**: Type definitions, data model updates, test setup
- **P1 User Stories**: Core matching game (drag-drop, validation), opt-in/opt-out flow
- **P2 User Stories**: Retry functionality
- **Polish Phase**: Performance optimization, accessibility audit, documentation

## Success Metrics

From spec.md Success Criteria:
- SC-001: Validation results within 3 seconds ✓ (target: <200ms)
- SC-002: 70% completion rate within 2 attempts ✓ (track via analytics)
- SC-003: <100ms drag response ✓ (CSS transition budget)
- SC-004: 20-second learning curve ✓ (user testing)
- SC-005: WCAG 2.1 AA compliance ✓ (automated + manual testing)
- SC-006: 15% score improvement ✓ (A/B testing)
- SC-007: 60% opt-in rate ✓ (analytics tracking)
- SC-008: Zero lost progress reports ✓ (session persistence testing)

## Next Steps

1. Complete data-model.md with entity diagrams
2. Define TypeScript contracts in contracts/ directory
3. Generate quickstart.md for feature development
4. Update CLAUDE.md agent context with new patterns
5. Run `/speckit.tasks` to generate actionable task breakdown
6. Begin implementation with Foundational phase tasks
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
