# Implementation Tasks: Quiz Performance Statistics

**Feature**: Quiz Performance Statistics
**Branch**: `001-quiz-performance-stats`

## Phase 1: Setup

- [x] T001 Create storage contract interface file in `frontend/src/services/QuizHistoryRepository.ts` based on `contracts/storage.ts`
- [x] T002 [P] Create history entity types in `frontend/src/types/history.ts` based on `data-model.md`
- [x] T003 [P] Create UI views and components skeleton in `frontend/src/views/StatisticsView.vue` and `frontend/src/components/statistics/StatOverview.vue`

## Phase 2: Foundational

- [x] T004 Implement LocalStorage backend class `LocalStorageQuizHistory` in `frontend/src/services/LocalStorageQuizHistory.ts` that implements `QuizHistoryRepository`
- [x] T005 Write unit tests for `LocalStorageQuizHistory` in `frontend/tests/unit/LocalStorageQuizHistory.spec.ts`

## Phase 3: User Story 1 - View Theme Performance Overview (Priority: P1)

**Goal**: Display performance statistics per theme based on completed quiz history.
**Independent Test**: Complete quizzes in multiple themes, open the performance view, and confirm that each attempted theme shows the correct correctness rate and supporting attempt volume.

- [x] T006 [US1] Create composable `useQuizHistory` in `frontend/src/composables/useQuizHistory.ts` that interacts with `QuizHistoryRepository`
- [x] T007 [P] [US1] Write unit tests for `useQuizHistory` in `frontend/tests/unit/useQuizHistory.spec.ts`
- [x] T008 [US1] Implement `ThemeStatCard.vue` component in `frontend/src/components/statistics/ThemeStatCard.vue` to display rate and count
- [x] T009 [US1] Implement `StatOverview.vue` in `frontend/src/components/statistics/StatOverview.vue` to fetch data via `useQuizHistory` and map to `ThemeStatCard`s
- [x] T010 [US1] Update `StatisticsView.vue` to render `StatOverview.vue` and handle empty states
- [x] T011 [US1] Add a route for `StatisticsView` in `frontend/src/router/index.ts`
- [x] T012 [US1] Add an entry to the application navigation menu in `frontend/src/App.vue` or relevant layout component to point to the Statistics route

## Phase 4: User Story 2 - Choose a Weak Theme for the Next Quiz (Priority: P2)

**Goal**: Display theme correctness rates at the point where users choose themes for a new quiz.
**Independent Test**: Open quiz theme selection after building quiz history and verify that the user can see per-theme performance information.

- [x] T013 [US2] Update the theme selection view (e.g., `frontend/src/views/SetupView.vue` or similar) to fetch `getThemeStatistics` using `useQuizHistory`
- [x] T014 [US2] Modify the theme selector component to display the correctness rate inline next to the theme name

## Phase 5: User Story 3 - Understand Themes With Limited or No History (Priority: P3)

**Goal**: Ensure themes with no history or very little history are clearly labeled and not misleading.
**Independent Test**: View statistics for themes with no attempts and confirm the display shows a clear no-history state instead of 0%.

- [x] T015 [US3] Update `ThemeStatCard.vue` in `frontend/src/components/statistics/ThemeStatCard.vue` to explicitly show a distinct UI state when `totalAnswers` is 0
- [x] T016 [US3] Update the inline theme selector component (from US2) to conditionally hide the rate or show a "No history" badge when `totalAnswers` is 0

## Phase 6: Polish & Cross-Cutting

- [x] T017 Write E2E test `statistics.spec.ts` in `frontend/e2e/statistics.spec.ts` covering stat generation after a completed quiz and navigating to the view
- [x] T018 Integrate the hook to save a new `QuizAttempt` upon quiz completion in the quiz engine (`frontend/src/views/ResultsView.vue` or relevant component)
- [x] T019 Run project linting and format checks, fixing any outstanding issues.

## Dependencies

- **Phase 1** must complete before **Phase 2**.
- **Phase 2** (Storage Engine) must complete before **Phase 3** (UI and Composables).
- **Phase 4** and **Phase 5** depend on the composable built in **Phase 3** (specifically T006).

## Implementation Strategy

**Suggested MVP**: Complete Phase 1 through Phase 3 (plus T018 to ensure data is actually saved), which fully covers the core value proposition of viewing the performance overview. The inline stats in US2 and no-history edge cases in US3 can follow iteratively.
