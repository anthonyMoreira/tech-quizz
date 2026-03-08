# Implementation Plan: Tech Quiz App

**Branch**: `001-tech-quiz-app` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-tech-quiz-app/spec.md`

## Summary

Build a Vue 3 single-page application for technical software engineering quizzes. Users select themes and difficulty, answer up to 10 multiple-choice questions (including code snippet questions) from a static question bank, receive instant feedback with explanations and "Did you know?" bonus facts, and view a results summary. No backend -- all data is bundled at build time. Dark-themed UI inspired by modern dashboard design with glassmorphism cards and coral/pink accent gradients.

## Technical Context

**Language/Version**: TypeScript 5.x with Vue 3 Composition API (`<script setup lang="ts">`)
**Primary Dependencies**: Vue 3, Vue Router, Vite, Prism.js
**Linting**: ESLint (`@typescript-eslint/strict-type-checked` + `plugin:vue/vue3-recommended`) + Prettier -- strictest practical config
**Formatting**: Prettier (auto-run on pre-commit via Husky + lint-staged)
**Storage**: N/A -- static JSON question bank bundled at build time
**Testing**: Vitest + Vue Test Utils
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge -- latest 2 versions)
**Project Type**: Single-page web application (SPA)
**Performance Goals**: First page load < 2s, feedback render < 100ms, full bundle < 500KB gzipped
**TypeScript Strictness**: `strict: true` + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`
**Constraints**: No backend, no authentication, no external API calls at runtime, scoped CSS only
**Scale/Scope**: ~8 themes x 3 difficulties x ~10 questions = ~240 questions in bank, 4 main views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. UX First | PASS | All UI states designed (loading, empty, error, success, feedback). Responsive within 100ms. Keyboard-navigable quiz flow. |
| II. Performance by Design | PASS | Bundle budget < 500KB gzipped. No external API calls. Static assets only. Code splitting per route. |
| III. Test Coverage (NON-NEGOTIABLE) | PASS | Vitest for unit tests. Vue Test Utils for component tests. 80% coverage target. Behavior-descriptive test names. |
| IV. Clean Code | PASS | TypeScript for type safety. Single-responsibility components. Scoped CSS. Composables for shared logic. ESLint + Prettier configured. |
| V. Parallel-Safe Collaboration | PASS | File ownership per task. Shared types defined in foundational phase. Components in separate files. |

## Project Structure

### Documentation (this feature)

```text
specs/001-tech-quiz-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── types/
│   └── quiz.ts                    # Shared types: Theme, Question, AnswerOption, QuizSession, etc.
├── assets/
│   └── styles/
│       └── variables.css          # CSS custom properties (colors, spacing, fonts)
├── components/
│   ├── layout/
│   │   ├── AppSidebar.vue         # Left sidebar (desktop) / bottom nav (mobile)
│   │   └── AppLayout.vue          # Main layout wrapper (responsive)
│   ├── home/
│   │   └── ThemePreviewCard.vue   # Theme preview card for home page
│   ├── quiz/
│   │   ├── ThemeSelector.vue      # Theme selection grid
│   │   ├── DifficultySelector.vue # Difficulty picker (beginner/intermediate/advanced)
│   │   ├── QuizQuestion.vue       # Question display (text + code snippet)
│   │   ├── AnswerOption.vue       # Single answer option button
│   │   ├── AnswerFeedback.vue     # Correct/incorrect + explanation + bonus fact
│   │   ├── QuizProgress.vue       # Progress indicator (e.g., "3/10")
│   │   └── CodeSnippet.vue        # Formatted code block with syntax highlighting
│   └── results/
│       ├── ResultsSummary.vue     # Score overview card
│       └── ResultsBreakdown.vue   # Per-question breakdown list
├── composables/
│   ├── useQuiz.ts                 # Quiz session state management
│   └── useQuestionBank.ts         # Question filtering, randomization, selection
├── data/
│   └── questions/
│       ├── index.ts               # Aggregates all theme question files
│       ├── ddd.json               # Domain-Driven Design questions
│       ├── tdd.json               # Test-Driven Development questions
│       ├── solid.json             # SOLID Principles questions
│       ├── design-patterns.json   # Design Patterns questions
│       ├── clean-architecture.json# Clean Architecture questions
│       ├── ci-cd.json             # CI/CD questions
│       ├── microservices.json     # Microservices questions
│       └── refactoring.json       # Refactoring questions
├── router/
│   ├── index.ts                   # Vue Router configuration
│   └── guards.ts                  # Navigation guards (quiz session validation)
├── views/
│   ├── HomeView.vue               # Landing page: "Start Quiz" CTA + theme preview cards
│   ├── QuizSetupView.vue          # Theme + difficulty selection
│   ├── QuizPlayView.vue           # Active quiz (question by question)
│   └── QuizResultsView.vue        # Results summary after completion
├── App.vue                        # Root component with layout
└── main.ts                        # App entry point

tsconfig.json                      # TypeScript config (strict mode)
tsconfig.node.json                 # TypeScript config for Vite/Node tooling
env.d.ts                           # Vite env type declarations

tests/
├── unit/
│   ├── composables/
│   │   ├── useQuiz.test.ts
│   │   └── useQuestionBank.test.ts
│   └── components/
│       ├── ThemeSelector.test.ts
│       ├── DifficultySelector.test.ts
│       ├── QuizQuestion.test.ts
│       ├── AnswerOption.test.ts
│       ├── AnswerFeedback.test.ts
│       ├── CodeSnippet.test.ts
│       ├── ThemePreviewCard.test.ts
│       ├── ResultsSummary.test.ts
│       └── ResultsBreakdown.test.ts
│   └── router/
│       └── guards.test.ts
└── integration/
    ├── quizFlow.test.ts           # Full quiz journey: setup → play → results
    ├── themeFiltering.test.ts     # Theme + difficulty filtering logic
    └── routeGuards.test.ts        # Navigation guard redirects
```

### Tooling

```text
.claude/commands/
└── generate-questions.md    # Claude Code command to generate questions

.husky/
└── pre-commit               # Runs lint-staged before every commit
eslint.config.ts             # ESLint flat config (strictest settings)
.prettierrc                  # Prettier config
.lintstagedrc.json           # lint-staged config (format + lint on staged files)
```

**Structure Decision**: Single project (no backend). Vue 3 + TypeScript SPA with Vite. All question data as static JSON imported at build time. Component-based architecture with typed composables for business logic. Shared types in `src/types/quiz.ts` (frozen before parallel work). Question bank content generated via Claude Code command (`/generate-questions`).

## Design Language

Adapted from the fitness dashboard reference:

- **Background**: Dark (#0d0d0d to #1a1a2e gradient)
- **Cards**: Dark glass effect (#1a1a2e with 0.6 opacity, backdrop-blur, subtle border)
- **Accent gradient**: Coral-to-pink (#ff6b6b to #ee5a9d) for primary actions, correct answers, highlights
- **Text**: White (#ffffff) for headings, muted (#a0a0b0) for secondary text
- **Success**: Green (#4ecdc4) for correct answers
- **Error**: Coral (#ff6b6b) for incorrect answers
- **Left sidebar (desktop)**: Vertical icon navigation, dark panel, active state with accent highlight. Items: Home, Quiz, Themes (placeholder, disabled), History (placeholder, disabled)
- **Bottom nav (mobile)**: Horizontal icon bar at bottom of screen, same items as sidebar. Sidebar hidden on mobile breakpoint (<768px)
- **Cards**: Rounded corners (16px), subtle shadow, glass blur
- **Typography**: Clean sans-serif (Inter or system font stack), clear hierarchy
- **Code blocks**: Slightly lighter dark background (#252540) with monospace font, scrollable
- **Bonus facts**: Distinct card with a lightbulb or sparkle icon, subtle accent border
- **Transitions**: Smooth fade/slide between questions (300ms)

## Responsive Design

- **Breakpoints**: Mobile (<768px), Desktop (>=768px)
- **Desktop**: Left sidebar visible, content area fills remaining width, cards in multi-column grid
- **Mobile**: Sidebar hidden, bottom navigation bar shown, cards stack vertically in single column, theme selector uses 2-column grid, quiz question and options use full width
- **Home page**: Desktop shows theme preview cards in 3-4 column grid; mobile shows 1-2 column stack
- **Quiz setup**: Desktop shows themes + difficulty side by side; mobile stacks them vertically
- **Quiz play**: Full-width on both; code snippets get horizontal scroll on mobile
- **Results**: Desktop shows summary card + breakdown side by side; mobile stacks vertically
- **Touch targets**: All interactive elements MUST be at least 44x44px on mobile (Apple HIG / WCAG standard)

## Navigation Guards

Vue Router `beforeEach` guards in `src/router/guards.ts`:

- `/quiz/play` → requires active quiz session (themes selected + difficulty chosen). If missing, redirect to `/quiz/setup`.
- `/quiz/results` → requires completed quiz session. If missing, redirect to `/`.
- `/quiz/setup` → always accessible.
- `/` → always accessible.
- Placeholder routes (Themes, History) → redirect to `/` with a "Coming soon" toast/notification.

## Minimum Question Bank Requirements

The app is considered shippable when:

- All 8 themes have at least **10 questions per difficulty level** (10 x 3 = 30 per theme, 240 total minimum)
- Each theme has at least **3 code-snippet questions per difficulty** (to meet the ~30% ratio)
- Themes with 0 questions for a given difficulty are disabled in the UI (greyed out, tooltip: "Coming soon")

## Linting Configuration

ESLint flat config (`eslint.config.ts`) with the strictest practical settings:

- **TypeScript**: `@typescript-eslint/strict-type-checked` (strictest preset -- enables all type-aware rules including `no-unsafe-*`, `no-explicit-any`, `strict-boolean-expressions`, etc.) + `@typescript-eslint/stylistic-type-checked`.
- **Vue**: `plugin:vue/vue3-recommended` (strictest Vue ruleset -- enforces attribute ordering, component naming, template expression complexity, etc.)
- **Parser**: `vue-eslint-parser` with `@typescript-eslint/parser` for `<script lang="ts">` blocks.
- **Key strict rules**:
  - `@typescript-eslint/no-explicit-any: "error"` -- no `any` type allowed
  - `@typescript-eslint/strict-boolean-expressions: "error"` -- no implicit boolean coercion
  - `@typescript-eslint/no-unused-vars: "error"` -- zero tolerance for dead code
  - `@typescript-eslint/explicit-function-return-type: "error"` -- all functions must declare return types
  - `@typescript-eslint/no-floating-promises: "error"` -- all promises must be handled
  - `@typescript-eslint/no-misused-promises: "error"`
  - `no-console: "error"` -- no console.log in production code
  - `no-debugger: "error"`
  - `eqeqeq: "error"` -- strict equality only
  - `prefer-const: "error"`
  - `curly: "error"` -- always require braces
  - `@typescript-eslint/no-magic-numbers: "warn"` -- flag magic numbers (allow 0, 1)
  - `complexity: ["error", 10]` -- max cyclomatic complexity per function
  - `max-lines-per-function: ["warn", 30]` -- aligns with constitution IV (30-line limit)
  - `max-lines: ["warn", 300]` -- aligns with constitution IV (300-line file limit)
  - `vue/component-name-in-template-casing: ["error", "PascalCase"]`
  - `vue/no-unused-components: "error"`
  - `vue/no-unused-vars: "error"`
  - `vue/require-default-prop: "error"`
  - `vue/require-prop-types: "error"`
  - `vue/define-macros-order: "error"`
- **Prettier integration**: `eslint-config-prettier` to disable formatting rules that conflict.
- **Overrides**: Test files (`tests/**`) relax `no-magic-numbers`, `max-lines-per-function`, and `explicit-function-return-type`.

## Code Formatting & Pre-Commit Hook

Prettier runs automatically on every commit via Husky + lint-staged. No unformatted code can reach the repository.

**Prettier config** (`.prettierrc`) -- standard TypeScript/JS community conventions:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": true
}
```

**Pre-commit pipeline**:

1. **Husky**: Installs a Git pre-commit hook via `husky` package. Runs on every `git commit`.
2. **lint-staged**: Only processes staged files (fast, no full-repo formatting). Config (`.lintstagedrc.json`):
   ```json
   {
     "*.{ts,vue}": ["prettier --write", "eslint --fix"],
     "*.{json,css,md}": ["prettier --write"]
   }
   ```
3. **Flow**: Developer stages files → runs `git commit` → Husky triggers lint-staged → Prettier formats + ESLint fixes staged files → if ESLint errors remain, commit is rejected.

**Setup**: `npm run prepare` (runs `husky`) is added to `package.json` `prepare` script so hooks are installed automatically after `npm install`.

## Question Generation Command

A Claude Code custom command at `.claude/commands/generate-questions.md` that generates quiz questions directly into the JSON bank.

**Usage**: `/generate-questions <theme> <difficulty> <count>`
Example: `/generate-questions ddd beginner 10`

### Execution Flow (two-step: generate → review → write)

1. **Load context**:
   - Read the Question JSON schema from `specs/001-tech-quiz-app/data-model.md`
   - Read the quality criteria from `specs/001-tech-quiz-app/spec.md`
   - Read the existing questions in the target file (e.g., `src/data/questions/ddd.json`) to identify existing concepts and the highest ID number
   - If the target file does not exist, create it with an empty array `[]`

2. **Generate questions**:
   - Generate `<count>` new questions matching the schema, theme, and difficulty
   - Apply concept distribution rules (see below)
   - Apply question type ratio (see below)
   - Auto-generate IDs starting from the next available number (highest existing ID + 1, or 1 if file is new/empty)

3. **Self-validate every question**:
   - Exactly 4 options with exactly 1 correct
   - Explanation is a full paragraph (3+ sentences)
   - Bonus fact is <= 100 characters (if present)
   - Code snippet has a language tag and is <= 15 lines (if present)
   - ID follows format `{theme}-{difficulty[0:3]}-{number}` and is unique
   - No concept duplication against existing questions at the same difficulty

4. **Present for review**:
   - Display all generated questions in a numbered summary table (ID, type, prompt preview, concept tested)
   - Flag any validation warnings
   - Ask: "Approve all, reject specific numbers, or regenerate?"

5. **Handle user response**:
   - "Approve all" → append all to the JSON file
   - "Reject 3, 7" → remove those, append the rest
   - "Regenerate 3, 7" → generate replacements for rejected questions, re-validate, present again
   - "Reject all" → discard, do not write

6. **Write to file**:
   - Append approved questions to the existing JSON array
   - Report final count and updated file path

### Concept Distribution Rules

- Each theme has subtopics (e.g., DDD has Bounded Context, Aggregates, Value Objects, Entities, Repositories, Domain Events, Ubiquitous Language, etc.)
- In a batch of 10 questions, no more than 2 questions may cover the same subtopic
- The command MUST spread questions across as many subtopics as possible
- Before generating, the command MUST list the subtopics it plans to cover and verify distribution

### Question Type Ratio

- Target: ~30% code-snippet questions, ~70% text questions
- For a batch of 10: 3 code-snippet + 7 text (approximate, +-1 is acceptable)
- For smaller batches: at least 1 code-snippet question if count >= 3
- Code snippets MUST be self-contained, max 15 lines, and include a language tag

### Cross-Difficulty Deduplication Policy

- Same concept at different difficulty levels is **allowed and encouraged** (tests progressive understanding)
- Example: beginner asks "What is a Bounded Context?", intermediate asks "How do you identify Bounded Context boundaries?", advanced asks "How do you handle communication between Bounded Contexts?"
- Same concept at the **same** difficulty level is **forbidden** (checked against existing questions in file)

### ID Generation

- Format: `{theme}-{difficulty[0:3]}-{number}` (e.g., `ddd-beg-001`, `ddd-int-015`, `tdd-adv-003`)
- Number is zero-padded to 3 digits
- The command reads the existing file, finds the highest number for the given theme+difficulty prefix, and continues from there
- If file is empty or missing, start from 001

### Command Prompt Embeds

- The full Question JSON schema
- All quality criteria (plausible distractors, teaching explanations, understanding over trivia, etc.)
- Concept distribution and type ratio rules
- Instructions to read existing questions first for deduplication and ID continuation
- Validation rules for self-checking before presenting to user

## Complexity Tracking

No constitution violations. No complexity justifications needed.
