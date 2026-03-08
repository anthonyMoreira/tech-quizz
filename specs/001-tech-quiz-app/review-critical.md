# Critical Implementation Requirements (Adversarial)

## Type Safety (MUST)
- No `any` types anywhere
- Exact optional properties (exactOptionalPropertyTypes = true)
- All Question.options must have exactly ONE isCorrect: true
- QuizSession.currentIndex must be 0-based

## Quiz Logic (MUST)
- submitAnswer() MUST be idempotent (double-click safe)
- isComplete must be true ONLY when all questions answered
- getResult() must only be callable when isComplete = true
- Score calculation: correct / total * 100

## Navigation Guards (MUST)
- /quiz/play must be inaccessible without active session
- /quiz/results must be inaccessible without completed quiz
- No infinite redirect loops

## Component Contracts (MUST)
- AnswerOption: disabled after answer confirmed (no re-selection)
- QuizQuestion: Confirm button disabled until option selected
- All interactive elements: 44px minimum touch target
- All touch targets must be keyboard navigable

## Question Bank (MUST)
- Exactly 4 options per question
- Exactly 1 isCorrect: true per question
- No duplicate question IDs
- ID format: {themeId}-{diff[0:3]}-{NNN}

## Test Requirements (MUST)
- 80% coverage threshold
- Tests must FAIL before implementation (TDD)
- Both unit and integration tests required
