# Implementation Plan: Quiz Performance Statistics

**Branch**: `001-quiz-performance-stats` | **Date**: 2026-03-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-quiz-performance-stats/spec.md`

## Summary

Track the user's quiz performance locally in the browser to provide a per-theme correctness rate, helping users identify their weak areas. The statistics are saved in `localStorage` behind an abstraction layer (Repository Pattern) to easily allow switching to a real backend in the future. The UI will surface these statistics on an overview page and inline during theme selection.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3 (Composition API)  
**Primary Dependencies**: Vue 3, Vue Router, Vite  
**Storage**: Browser `localStorage` (via a pluggable `QuizHistoryRepository` interface)  
**Testing**: Vitest (unit/components), Playwright (E2E)  
**Target Platform**: Web (Desktop & Mobile)  
**Project Type**: SPA (Single Page Application) Web App  
**Performance Goals**: <100ms visual feedback on clicks, fast client-side stat computation  
**Constraints**: Needs to be highly modular for future backend integration. Anonymous data only.  
**Scale/Scope**: Single user, stored locally. Bounded by standard `localStorage` limits (5MB) which is more than enough for simple JSON quiz history.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. User Experience First**: Handled. UI must clearly distinguish between 0% correct and "no history".
- **II. Performance by Design**: Computing stats on the client is fast. Reading/writing from localStorage is synchronous and fast. Will keep payloads small by only storing attempt ID, theme, and correctness (no full question text).
- **III. Comprehensive Test Coverage**: All repository logic and stat calculation MUST have unit tests. The history overview page will need component/E2E tests.
- **IV. Clean Code**: The storage will be abstracted behind a TypeScript interface `QuizHistoryRepository`. The UI won't know about `localStorage`.
- **V. Parallel-Safe Collaboration**: Distinct files are planned. The Repository interface will be implemented first as a frozen contract.

## Project Structure

### Documentation (this feature)

```text
specs/001-quiz-performance-stats/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   └── statistics/
│   │       ├── ThemeStatCard.vue
│   │       └── StatOverview.vue
│   ├── composables/
│   │   └── useQuizHistory.ts
│   ├── services/
│   │   ├── QuizHistoryRepository.ts (Interface)
│   │   └── LocalStorageQuizHistory.ts (Implementation)
│   ├── types/
│   │   └── history.ts
│   └── views/
│       └── StatisticsView.vue
└── tests/
    ├── unit/
    │   ├── useQuizHistory.spec.ts
    │   └── LocalStorageQuizHistory.spec.ts
    └── e2e/
        └── statistics.spec.ts
```

**Structure Decision**: Extending the existing frontend Vue SPA structure. A new `services` directory is introduced to house the repository pattern implementations, isolating storage logic from the Vue `composables`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| (None)    | N/A        | N/A                                  |
