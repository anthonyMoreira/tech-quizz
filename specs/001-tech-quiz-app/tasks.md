# Tasks: Tech Quiz App

**Input**: Design documents from `/specs/001-tech-quiz-app/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Included -- constitution principle III mandates 80% coverage minimum.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Vue 3 + TypeScript project with all tooling configured

- [X] T001 Initialize Vite project with Vue 3 + TypeScript template, install core dependencies (vue, vue-router, prismjs) in package.json
- [X] T002 Configure TypeScript strict mode in tsconfig.json: `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`; create tsconfig.node.json and env.d.ts
- [X] T003 [P] Configure ESLint flat config in eslint.config.ts: `@typescript-eslint/strict-type-checked`, `@typescript-eslint/stylistic-type-checked`, `plugin:vue/vue3-recommended`, `eslint-config-prettier` with all strict rules from plan.md; add test file overrides
- [X] T004 [P] Create Prettier config in .prettierrc with standard TS conventions (semi, singleQuote, trailingComma: all, printWidth: 80, vueIndentScriptAndStyle: true)
- [X] T005 [P] Setup Husky + lint-staged: install packages, create .husky/pre-commit hook, create .lintstagedrc.json (`*.{ts,vue}` → prettier + eslint, `*.{json,css,md}` → prettier), add `prepare` script to package.json
- [X] T006 [P] Configure Vitest in vite.config.ts: jsdom environment, coverage reporter (istanbul or v8), 80% threshold, Vue Test Utils setup file; add test/coverage/lint npm scripts to package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, layout, routing, composables, and question bank structure that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete. Types in src/types/quiz.ts MUST be frozen before Phase 3+.

- [X] T007 Define all shared TypeScript types in src/types/quiz.ts: Theme, Difficulty, QuestionType, CodeSnippet, AnswerOption, Question, QuizSession, UserAnswer, QuizResult, BreakdownItem (per data-model.md)
- [X] T008 [P] Create CSS custom properties in src/assets/styles/variables.css: dark theme colors (#0d0d0d, #1a1a2e, #ff6b6b, #ee5a9d, #4ecdc4, #ffffff, #a0a0b0, #252540), spacing scale, border-radius (16px), font families (Inter/system), breakpoints (768px), transitions (300ms), glass effect variables
- [X] T009 [P] Create AppLayout.vue in src/components/layout/AppLayout.vue: responsive wrapper with sidebar slot (desktop) and bottom nav slot (mobile), main content area, imports variables.css, scoped CSS with media queries at 768px breakpoint
- [X] T010 [P] Create AppSidebar.vue in src/components/layout/AppSidebar.vue: vertical icon nav (desktop) / horizontal bottom bar (mobile), nav items: Home (active), Quiz, Themes (disabled placeholder with "Coming soon" tooltip), History (disabled placeholder with "Coming soon" tooltip), responsive show/hide at 768px, scoped CSS with dark panel styling
- [X] T011 Create question bank data index in src/data/questions/index.ts: import all 8 theme JSON files, export themes array (Theme[]) with id, name, description, icon for each theme, export function to get all questions
- [X] T012 [P] Create 8 empty JSON question files: src/data/questions/ddd.json, tdd.json, solid.json, design-patterns.json, clean-architecture.json, ci-cd.json, microservices.json, refactoring.json (each containing `[]`)
- [X] T013 Implement useQuestionBank composable in src/composables/useQuestionBank.ts: filter questions by theme IDs + difficulty, randomize question selection (up to 10), randomize answer option order, return available question count per theme+difficulty for disabling empty themes, handle edge case of fewer than 10 questions
- [X] T014 Implement useQuiz composable in src/composables/useQuiz.ts: manage QuizSession state (selectedThemes, difficulty, questions, currentIndex, answers, isComplete), expose startQuiz(), submitAnswer() with double-click protection, nextQuestion(), getResult() → QuizResult, resetQuiz(), expose isActive and isComplete as computed refs for route guards
- [X] T015 Configure Vue Router in src/router/index.ts: 4 routes (/ → HomeView, /quiz/setup → QuizSetupView, /quiz/play → QuizPlayView, /quiz/results → QuizResultsView), placeholder routes for /themes and /history that redirect to / with "Coming soon", lazy-load views with dynamic imports for code splitting
- [X] T016 Implement navigation guards in src/router/guards.ts: beforeEach guard — /quiz/play requires active quiz session (redirect to /quiz/setup if missing), /quiz/results requires completed quiz (redirect to / if missing), placeholder routes redirect to / ; export and register in router/index.ts
- [X] T017 Create App.vue root component in src/App.vue: import AppLayout, render router-view inside layout, import global CSS variables
- [X] T018 Create main.ts entry point in src/main.ts: create Vue app, install router plugin, mount to #app

### Foundational Tests

- [X] T019 [P] Unit tests for useQuestionBank in tests/unit/composables/useQuestionBank.test.ts: filters by theme + difficulty, randomizes selection, limits to 10 questions, handles empty bank, returns correct available counts, distributes across themes
- [X] T020 [P] Unit tests for useQuiz in tests/unit/composables/useQuiz.test.ts: starts quiz with selected themes/difficulty, tracks current question index, records answers correctly, prevents double submission, marks quiz complete after last question, computes QuizResult with accurate score, resets state
- [X] T021 [P] Unit tests for navigation guards in tests/unit/router/guards.test.ts: redirects /quiz/play to /quiz/setup when no active session, redirects /quiz/results to / when no completed quiz, allows /quiz/play when session active, allows /quiz/results when quiz complete, placeholder routes redirect to /

**Checkpoint**: Foundation ready — types frozen, layout rendered, routing works, composables tested. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Select Themes and Launch a Quiz (Priority: P1) MVP

**Goal**: Users can open the app, see themes on the home page, navigate to quiz setup, select themes + difficulty, and start a quiz that loads questions from the bank.

**Independent Test**: Select 2 themes + beginner difficulty → press Start Quiz → verify questions load matching the selection.

### Tests for User Story 1

- [X] T022 [P] [US1] Unit test for ThemePreviewCard in tests/unit/components/ThemePreviewCard.test.ts: renders theme name, description, icon; links to quiz setup
- [X] T023 [P] [US1] Unit test for ThemeSelector in tests/unit/components/ThemeSelector.test.ts: renders all themes, toggles selection on click, disables themes with 0 questions for selected difficulty, shows disabled tooltip, emits selected theme IDs, requires at least one selected
- [X] T024 [P] [US1] Unit test for DifficultySelector in tests/unit/components/DifficultySelector.test.ts: renders 3 difficulty options, highlights selected, emits difficulty value, defaults to beginner
- [X] T025 [P] [US1] Integration test for theme filtering in tests/integration/themeFiltering.test.ts: select themes + difficulty → verify correct questions returned from bank, verify randomization, verify distribution across themes

### Implementation for User Story 1

- [X] T026 [P] [US1] Create ThemePreviewCard.vue in src/components/home/ThemePreviewCard.vue: glassmorphism card showing theme icon, name, description; links to /quiz/setup; responsive (3-4 column desktop, 1-2 column mobile); scoped CSS
- [X] T027 [P] [US1] Create DifficultySelector.vue in src/components/quiz/DifficultySelector.vue: 3 buttons (beginner, intermediate, advanced) with accent highlight on selected; emits selected difficulty; keyboard navigable; scoped CSS
- [X] T028 [US1] Create ThemeSelector.vue in src/components/quiz/ThemeSelector.vue: grid of selectable theme cards, toggle selection on click, visually disable (grey out) themes with 0 questions for current difficulty using useQuestionBank available counts, show "Coming soon" tooltip on disabled themes, require at least 1 selected, responsive grid (3 col desktop, 2 col mobile); scoped CSS
- [X] T029 [US1] Create HomeView.vue in src/views/HomeView.vue: "Start Quiz" hero CTA button linking to /quiz/setup, grid of ThemePreviewCard components for all themes, responsive layout; scoped CSS
- [X] T030 [US1] Create QuizSetupView.vue in src/views/QuizSetupView.vue: DifficultySelector + ThemeSelector + "Start Quiz" button, validate at least 1 theme selected, on start call useQuiz.startQuiz() then router.push to /quiz/play, show validation message if no themes selected; scoped CSS
- [X] T031 [US1] Create seed question data: use /generate-questions command to generate at least 10 beginner questions for ddd.json and tdd.json (minimum viable for testing the quiz flow)

**Checkpoint**: User Story 1 complete — users can visit home, navigate to setup, select themes/difficulty, and start a quiz. Questions load from bank.

---

## Phase 4: User Story 2 — Answer Questions with Instant Feedback (Priority: P2)

**Goal**: During an active quiz, users see one question at a time, select an answer, confirm, and receive instant correct/incorrect feedback with a paragraph explanation.

**Independent Test**: Start a quiz → answer a question → verify feedback shows correct/incorrect with explanation → proceed to next question.

### Tests for User Story 2

- [X] T032 [P] [US2] Unit test for QuizQuestion in tests/unit/components/QuizQuestion.test.ts: renders prompt text, renders 4 answer options, does not show feedback before confirmation
- [X] T033 [P] [US2] Unit test for AnswerOption in tests/unit/components/AnswerOption.test.ts: renders option text, highlights on selection, emits selection event, disabled after confirmation, shows correct/incorrect styling after answer
- [X] T034 [P] [US2] Unit test for AnswerFeedback in tests/unit/components/AnswerFeedback.test.ts: shows correct icon/text when correct, shows incorrect icon/text when wrong, displays paragraph explanation, shows "Next" button
- [X] T035 [P] [US2] Unit test for QuizProgress in tests/unit/components/QuizProgress.test.ts: displays current question number and total (e.g., "3/10"), updates on navigation
- [X] T036 [US2] Integration test for quiz answer flow in tests/integration/quizFlow.test.ts: start quiz → answer question → see feedback → next question → answer all → verify session completes

### Implementation for User Story 2

- [X] T037 [P] [US2] Create AnswerOption.vue in src/components/quiz/AnswerOption.vue: button displaying option text, selectable state, disabled after confirm, correct/incorrect styling (green #4ecdc4 / coral #ff6b6b) after answer, 44px min touch target, keyboard navigable; scoped CSS
- [X] T038 [P] [US2] Create QuizProgress.vue in src/components/quiz/QuizProgress.vue: displays "Question X of Y" text, progress bar with accent gradient fill; scoped CSS
- [X] T039 [US2] Create AnswerFeedback.vue in src/components/quiz/AnswerFeedback.vue: correct/incorrect banner with icon, paragraph explanation text, "Next Question" button (or "See Results" on last question), smooth slide-in transition; scoped CSS
- [X] T040 [US2] Create QuizQuestion.vue in src/components/quiz/QuizQuestion.vue: renders question prompt, renders 4 AnswerOption components, "Confirm" button (disabled until option selected, prevents double-click), after confirm shows AnswerFeedback, emits answer submission to useQuiz; scoped CSS
- [X] T041 [US2] Create QuizPlayView.vue in src/views/QuizPlayView.vue: displays QuizProgress + QuizQuestion for current question from useQuiz, handles nextQuestion navigation, on last question navigates to /quiz/results, fade/slide transition between questions (300ms); scoped CSS

**Checkpoint**: User Story 2 complete — users answer questions one by one with instant feedback and explanations.

---

## Phase 5: User Story 3 — View Quiz Results Summary (Priority: P3)

**Goal**: After the last question, users see their score, a per-question breakdown, and can start a new quiz.

**Independent Test**: Complete a quiz → verify results screen shows correct score (e.g., "7/10"), per-question breakdown, and "New Quiz" button returns to setup.

### Tests for User Story 3

- [X] T042 [P] [US3] Unit test for ResultsSummary in tests/unit/components/ResultsSummary.test.ts: displays score fraction and percentage, shows theme names and difficulty, displays "New Quiz" button
- [X] T043 [P] [US3] Unit test for ResultsBreakdown in tests/unit/components/ResultsBreakdown.test.ts: lists all questions with correct/incorrect indicator, shows user's answer and correct answer for wrong ones, expandable explanation

### Implementation for User Story 3

- [X] T044 [P] [US3] Create ResultsSummary.vue in src/components/results/ResultsSummary.vue: glassmorphism card with score (e.g., "7/10"), percentage, accent gradient for score display, theme names and difficulty shown, "New Quiz" button linking to /quiz/setup; scoped CSS
- [X] T045 [P] [US3] Create ResultsBreakdown.vue in src/components/results/ResultsBreakdown.vue: list of all questions, each showing question prompt (truncated), correct/incorrect icon, user's selected answer vs correct answer if wrong, expandable to show full explanation; scoped CSS
- [X] T046 [US3] Create QuizResultsView.vue in src/views/QuizResultsView.vue: gets QuizResult from useQuiz, renders ResultsSummary + ResultsBreakdown, responsive layout (side-by-side desktop, stacked mobile), "New Quiz" calls resetQuiz() and navigates to /quiz/setup; scoped CSS

**Checkpoint**: User Story 3 complete — full quiz loop works: setup → play → results → new quiz.

---

## Phase 6: User Story 4 — Code Snippet Questions (Priority: P4)

**Goal**: Questions with code snippets render with syntax-highlighted, scrollable code blocks alongside the question prompt.

**Independent Test**: Start a quiz containing a code-snippet question → verify code block renders with syntax highlighting, is scrollable, and question is answerable.

### Tests for User Story 4

- [X] T047 [P] [US4] Unit test for CodeSnippet in tests/unit/components/CodeSnippet.test.ts: renders code with Prism.js highlighting, applies correct language class, scrollable container, does not break layout with long lines

### Implementation for User Story 4

- [X] T048 [US4] Create CodeSnippet.vue in src/components/quiz/CodeSnippet.vue: accepts language and code props, renders `<pre><code>` block, applies Prism.js syntax highlighting on mount, dark code block background (#252540), horizontal scroll for long lines, max-height with vertical scroll, monospace font; scoped CSS
- [X] T049 [US4] Update QuizQuestion.vue in src/components/quiz/QuizQuestion.vue: conditionally render CodeSnippet component when question.type === "code-snippet" and question.codeSnippet is present, display code snippet above answer options
- [X] T050 [US4] Generate seed code-snippet questions: use /generate-questions to add at least 3 code-snippet questions to ddd.json and tdd.json (beginner difficulty)

**Checkpoint**: User Story 4 complete — code snippet questions render with syntax highlighting in the quiz flow.

---

## Phase 7: User Story 5 — "Did You Know?" Bonus Facts (Priority: P5)

**Goal**: After answering a question, a bonus fact is displayed alongside the explanation when available.

**Independent Test**: Answer a question that has a bonus fact → verify "Did you know?" section appears below explanation with distinct styling. Answer a question without a bonus fact → verify no empty section.

### Tests for User Story 5

- [X] T051 [US5] Update AnswerFeedback tests in tests/unit/components/AnswerFeedback.test.ts: add cases for bonus fact displayed with distinct styling when present, no bonus fact section when null/absent

### Implementation for User Story 5

- [X] T052 [US5] Update AnswerFeedback.vue in src/components/quiz/AnswerFeedback.vue: conditionally render "Did you know?" section when question.bonusFact is present, lightbulb/sparkle icon, distinct card with subtle accent border, visually separated from explanation; scoped CSS
- [X] T053 [US5] Ensure seed questions include bonus facts: verify/update existing seed questions in ddd.json and tdd.json to include bonusFact field (max 100 chars) on at least 50% of questions

**Checkpoint**: User Story 5 complete — bonus facts display when available, gracefully hidden when absent.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design review, question bank population, performance, accessibility, and final validation

- [X] T054 [P] Responsive design audit: test all views on mobile (<768px) and desktop (>=768px), verify touch targets are 44px+, verify sidebar/bottom-nav toggle, fix any layout issues across all views
- [X] T055 [P] Accessibility audit: verify keyboard navigation through quiz flow (Tab, Enter, Arrow keys), verify screen reader compatibility on all interactive elements, add aria-labels where missing
- [X] T056 [P] Generate remaining question bank: use /generate-questions to populate all 8 themes x 3 difficulties with at least 10 questions each (240+ total, ~30% code-snippet ratio)
- [X] T057 [P] Create .claude/commands/generate-questions.md command file with full prompt embedding schema, quality criteria, concept distribution rules, type ratio, ID generation, and two-step review flow per plan.md
- [X] T058 Performance audit: run `npm run build`, verify bundle < 500KB gzipped, verify route-level code splitting works (lazy-loaded views), check first load < 2s
- [X] T059 Run quickstart.md validation: execute all checklist items from specs/001-tech-quiz-app/quickstart.md verification section
- [X] T060 Final linting pass: run `npm run lint` and `npm run format:check`, fix any remaining issues, verify pre-commit hook works on a test commit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1): No story dependencies — can start immediately after Phase 2
  - US2 (P2): Depends on US1 (needs QuizPlayView and question rendering)
  - US3 (P3): Depends on US2 (needs completed quiz session to show results)
  - US4 (P4): Depends on US2 (extends QuizQuestion component with code snippets)
  - US5 (P5): Depends on US2 (extends AnswerFeedback component with bonus facts)
  - US4 and US5 can run in parallel (touch different components)
- **Polish (Phase 8)**: Depends on all user stories being complete

### Within Each User Story

- Tests MUST be written first and FAIL before implementation
- Components before views (views compose components)
- Core rendering before integration with composables
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T003, T004, T005, T006 can all run in parallel (after T001+T002)
- Phase 2: T008, T009, T010 can run in parallel (after T007 types). T012 parallel with anything. T019, T020, T021 parallel with each other.
- Phase 3 (US1): T022-T025 tests parallel. T026, T027 parallel. T028 depends on T027 (uses DifficultySelector for available counts).
- Phase 4 (US2): T032-T035 tests parallel. T037, T038 parallel. T039 after T037. T040 after T037+T039.
- Phase 5 (US3): T042, T043 parallel. T044, T045 parallel. T046 after T044+T045.
- Phase 6 (US4) and Phase 7 (US5): Can run in parallel with each other (different files).
- Phase 8: T054, T055, T056, T057 all parallel.

---

## Parallel Example: Phase 2 (Foundational)

```text
# After T007 (types) is complete, launch in parallel:
Agent A: T008 (CSS variables) + T009 (AppLayout) + T010 (AppSidebar)
Agent B: T013 (useQuestionBank) + T019 (useQuestionBank tests)
Agent C: T014 (useQuiz) + T020 (useQuiz tests)
Agent D: T011 (router) + T012 (empty JSONs) + T016 (guards) + T021 (guards tests)
```

## Parallel Example: Phase 6+7 (US4 + US5 in parallel)

```text
# After Phase 5 is complete:
Agent A: T047 → T048 → T049 → T050 (US4: code snippets)
Agent B: T051 → T052 → T053 (US5: bonus facts)
# No file conflicts: US4 touches CodeSnippet.vue + QuizQuestion.vue
# US5 touches AnswerFeedback.vue (different files)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Users can select themes, pick difficulty, and start a quiz

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Theme selection + quiz launch (MVP!)
3. US2 → Answer questions with feedback (core learning experience)
4. US3 → Results summary (complete quiz loop)
5. US4 + US5 in parallel → Code snippets + bonus facts (engagement features)
6. Polish → Responsive audit, accessibility, full question bank, performance

### Parallel Agent Strategy

With multiple agents after Foundational phase:

1. All agents complete Setup + Foundational together
2. Agent A: US1 (P1) → US2 (P2) → US3 (P3) — sequential due to dependencies
3. After US2 complete: Agent B: US4, Agent C: US5 — parallel, no file conflicts
4. All agents: Polish phase tasks in parallel

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable at its checkpoint
- Tests MUST be written and FAIL before implementation (constitution principle III)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- File ownership per task — no two concurrent tasks touch the same file
- Types in src/types/quiz.ts MUST be frozen after T007 before any story work begins
