# Quickstart: Tech Quiz App

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ (or equivalent package manager)

## Setup

```bash
# Clone and enter the project
git clone <repo-url>
cd tech-quizz
git checkout 001-tech-quiz-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Commands

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start Vite dev server with HMR           |
| `npm run build`   | Production build to `dist/`              |
| `npm run preview` | Preview production build locally         |
| `npm run test`    | Run all tests with Vitest                |
| `npm run test:ui` | Run tests with Vitest UI                 |
| `npm run coverage`| Run tests with coverage report           |
| `npm run lint`    | Run ESLint                               |
| `npm run lint:fix`| Run ESLint with auto-fix                 |
| `npm run format`  | Run Prettier on all files                |
| `npm run format:check` | Check formatting without writing    |
| `npm run prepare` | Install Husky git hooks (auto on install)|

## Walkthrough

1. **Home page** (`/`): Landing page with app branding and a "Start Quiz" call-to-action.
2. **Quiz setup** (`/quiz/setup`): Select one or more themes from the grid, pick a difficulty level, and press "Start Quiz."
3. **Quiz play** (`/quiz/play`): Answer questions one at a time. Each question shows a prompt (with optional code snippet), 4 answer options, and a progress indicator. After confirming an answer, see correct/incorrect feedback, an explanation paragraph, and an optional "Did you know?" bonus fact. Press "Next" to continue.
4. **Results** (`/quiz/results`): View your score (e.g., "7/10"), a per-question breakdown, and options to start a new quiz or return to setup.

## Project Structure Overview

```text
src/
├── components/    # Reusable Vue components (layout, quiz, results)
├── composables/   # Business logic (useQuiz, useQuestionBank)
├── data/          # Static JSON question bank (one file per theme)
├── router/        # Vue Router config (4 routes)
├── views/         # Page-level components
├── assets/        # CSS variables and static assets
├── App.vue        # Root component
└── main.js        # Entry point

tests/
├── unit/          # Component and composable unit tests
└── integration/   # Full quiz flow tests
```

## Generating Questions

Use the Claude Code custom command to generate questions:

```bash
# In Claude Code, run:
/generate-questions ddd beginner 10
/generate-questions tdd intermediate 5
/generate-questions solid advanced 10
```

This reads the schema and quality criteria, checks existing questions to avoid duplicates, generates new questions, and writes them to the appropriate JSON file (e.g., `src/data/questions/ddd.json`). Review the output before committing.

### Manual Addition

Each theme has a JSON file in `src/data/questions/` (e.g., `ddd.json`). To add a question manually:

1. Open the relevant theme file.
2. Add a new object following the schema in `data-model.md`.
3. Ensure the `id` is unique (format: `{themeId}-{difficulty[0:3]}-{number}`).
4. Verify: exactly 4 options, exactly 1 correct, explanation is a full paragraph, bonus fact <= 100 chars (if present).

## Verification Checklist

After implementation, verify:

- [ ] `npm run dev` starts without errors
- [ ] Home page loads at `/`
- [ ] Can select themes and difficulty, start a quiz
- [ ] Questions display correctly (text and code snippet types)
- [ ] Feedback shows correct/incorrect + explanation + bonus fact
- [ ] Results summary shows accurate score and breakdown
- [ ] `npm run test` passes with >= 80% coverage
- [ ] `npm run lint` reports zero warnings/errors
- [ ] `npm run build` produces a working production bundle
