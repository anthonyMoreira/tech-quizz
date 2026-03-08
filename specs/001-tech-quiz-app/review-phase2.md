# Phase 2 Review Checklist (Adversarial)

## T007: TypeScript Types
- [ ] src/types/quiz.ts exists
- [ ] Exports: Theme, Difficulty, QuestionType, CodeSnippet, AnswerOption, Question, QuizSession, UserAnswer, QuizResult, BreakdownItem
- [ ] Difficulty = 'beginner' | 'intermediate' | 'advanced'
- [ ] QuestionType = 'text' | 'code-snippet'
- [ ] Question.options typed as readonly tuple of exactly 4 AnswerOption OR AnswerOption[] with validation
- [ ] No `any` types

## T008: CSS Variables
- [ ] src/assets/styles/variables.css exists
- [ ] Has --color-bg: #0d0d0d
- [ ] Has --color-surface: #1a1a2e
- [ ] Has --color-primary: #ff6b6b
- [ ] Has --color-secondary: #ee5a9d
- [ ] Has --color-accent: #4ecdc4
- [ ] Has --color-text: #ffffff
- [ ] Has --color-text-muted: #a0a0b0
- [ ] Has --color-code-bg: #252540
- [ ] Has --border-radius: 16px
- [ ] Has spacing scale variables
- [ ] Has breakpoint at 768px documented

## T009: AppLayout.vue
- [ ] src/components/layout/AppLayout.vue exists
- [ ] Uses <script setup lang="ts">
- [ ] Has slot for sidebar
- [ ] Has slot for main content
- [ ] Has scoped CSS
- [ ] Imports variables.css

## T010: AppSidebar.vue
- [ ] src/components/layout/AppSidebar.vue exists
- [ ] Shows vertical nav on desktop (>=768px)
- [ ] Shows horizontal bottom bar on mobile (<768px)
- [ ] Home nav item marked as active
- [ ] Themes and History items disabled with "Coming soon" tooltip
- [ ] Uses <script setup lang="ts">
- [ ] Scoped CSS

## T011: Question Bank Index
- [ ] src/data/questions/index.ts exists
- [ ] Imports all 8 theme JSON files
- [ ] Exports themes array with id, name, description, icon
- [ ] Exports function to get all questions

## T012: Empty JSON Files
- [ ] src/data/questions/ddd.json exists (contains [])
- [ ] src/data/questions/tdd.json exists (contains [])
- [ ] src/data/questions/solid.json exists (contains [])
- [ ] src/data/questions/design-patterns.json exists (contains [])
- [ ] src/data/questions/clean-architecture.json exists (contains [])
- [ ] src/data/questions/ci-cd.json exists (contains [])
- [ ] src/data/questions/microservices.json exists (contains [])
- [ ] src/data/questions/refactoring.json exists (contains [])

## T013: useQuestionBank
- [ ] src/composables/useQuestionBank.ts exists
- [ ] Filters by theme IDs array
- [ ] Filters by difficulty
- [ ] Randomizes selection
- [ ] Returns at most 10 questions
- [ ] Returns available count per theme+difficulty
- [ ] Handles empty bank gracefully (returns [])

## T014: useQuiz
- [ ] src/composables/useQuiz.ts exists
- [ ] startQuiz(themes, difficulty) initializes session
- [ ] submitAnswer() records answer and advances index
- [ ] submitAnswer() has double-click protection
- [ ] nextQuestion() advances to next
- [ ] getResult() returns QuizResult when complete
- [ ] resetQuiz() clears state
- [ ] isActive computed ref works
- [ ] isComplete computed ref works

## T015+T016: Router + Guards
- [ ] src/router/index.ts exists with 4 routes
- [ ] Routes: /, /quiz/setup, /quiz/play, /quiz/results
- [ ] Views lazy-loaded with dynamic imports
- [ ] Placeholder routes for /themes, /history redirect to /
- [ ] src/router/guards.ts exists
- [ ] /quiz/play redirects to /quiz/setup when no active session
- [ ] /quiz/results redirects to / when quiz not complete

## T019-T021: Tests
- [ ] tests/unit/composables/useQuestionBank.test.ts exists
- [ ] tests/unit/composables/useQuiz.test.ts exists
- [ ] tests/unit/router/guards.test.ts exists
- [ ] All tests pass (npm run test)
- [ ] Tests cover edge cases (empty bank, double-click prevention, redirects)
