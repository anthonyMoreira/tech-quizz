# Data Model: Tech Quiz App

## Entities

### Theme

Represents a software engineering topic users can select for quizzes.

| Field       | Type   | Required | Description                           |
|-------------|--------|----------|---------------------------------------|
| id          | string | yes      | Unique identifier (slug, e.g., "ddd") |
| name        | string | yes      | Display name (e.g., "Domain-Driven Design") |
| description | string | yes      | Short description of the theme        |
| icon        | string | yes      | Icon identifier for the UI            |

**Identity**: `id` (unique slug)
**Source**: Hardcoded in `src/data/questions/index.js`

### Question

A single quiz item stored in the static question bank.

| Field       | Type             | Required | Description                                      |
|-------------|------------------|----------|--------------------------------------------------|
| id          | string           | yes      | Unique identifier (e.g., "ddd-beg-001")          |
| themeId     | string           | yes      | Reference to Theme.id                            |
| difficulty  | enum             | yes      | "beginner" \| "intermediate" \| "advanced"       |
| type        | enum             | yes      | "text" \| "code-snippet"                         |
| prompt      | string           | yes      | The question text                                |
| codeSnippet | object \| null   | no       | Code block for code-snippet type questions       |
| options     | AnswerOption[4]  | yes      | Exactly 4 answer options                         |
| explanation | string           | yes      | Paragraph-length explanation of the correct answer|
| bonusFact   | string \| null   | no       | "Did you know?" fact, max 100 characters         |

**Identity**: `id` (unique across the entire bank)
**Uniqueness rule**: No two questions with the same `themeId` + `difficulty` may test the exact same concept.

### CodeSnippet (embedded in Question)

| Field    | Type   | Required | Description                              |
|----------|--------|----------|------------------------------------------|
| language | string | yes      | Language for syntax highlighting (e.g., "javascript") |
| code     | string | yes      | The source code content                  |

### AnswerOption (embedded in Question)

| Field     | Type    | Required | Description                        |
|-----------|---------|----------|------------------------------------|
| id        | string  | yes      | Unique within the question (e.g., "a", "b", "c", "d") |
| text      | string  | yes      | Display text for this option       |
| isCorrect | boolean | yes      | True for exactly one option per question |

**Validation**: Exactly one option per question MUST have `isCorrect: true`.

### QuizSession (runtime state, not persisted)

Represents an active quiz in progress. Managed by the `useQuiz` composable.

| Field            | Type             | Required | Description                                  |
|------------------|------------------|----------|----------------------------------------------|
| selectedThemes   | string[]         | yes      | Array of Theme.id values selected by user    |
| difficulty       | enum             | yes      | "beginner" \| "intermediate" \| "advanced"   |
| questions        | Question[]       | yes      | The selected and randomized questions (up to 10) |
| currentIndex     | number           | yes      | Index of the current question (0-based)      |
| answers          | UserAnswer[]     | yes      | User's answers so far                        |
| isComplete       | boolean          | yes      | True when all questions answered             |

### UserAnswer (runtime state, not persisted)

| Field      | Type    | Required | Description                               |
|------------|---------|----------|-------------------------------------------|
| questionId | string  | yes      | Reference to Question.id                  |
| selectedId | string  | yes      | The AnswerOption.id the user chose        |
| isCorrect  | boolean | yes      | Whether the selected option was correct   |

### QuizResult (runtime state, not persisted)

Derived from a completed QuizSession for the results summary view.

| Field         | Type         | Required | Description                            |
|---------------|--------------|----------|----------------------------------------|
| totalQuestions | number      | yes      | Total number of questions in the quiz  |
| correctCount  | number       | yes      | Number of correct answers              |
| scorePercent  | number       | yes      | Percentage score (0-100)               |
| breakdown     | BreakdownItem[] | yes   | Per-question result details            |
| themes        | string[]     | yes      | Theme names used in this quiz          |
| difficulty    | string       | yes      | Difficulty level of the quiz           |

### BreakdownItem (embedded in QuizResult)

| Field        | Type    | Required | Description                             |
|--------------|---------|----------|-----------------------------------------|
| question     | Question| yes      | The original question                   |
| selectedId   | string  | yes      | The option the user selected            |
| isCorrect    | boolean | yes      | Whether the user's answer was correct   |

## Relationships

```text
Theme 1──* Question        (a theme has many questions)
Question 1──4 AnswerOption  (a question has exactly 4 options)
Question 0──1 CodeSnippet   (a question optionally has a code snippet)
QuizSession *──* Question   (a session contains up to 10 questions)
QuizSession 1──* UserAnswer (a session accumulates user answers)
QuizResult 1──* BreakdownItem (a result has one item per question)
```

## State Transitions

### QuizSession Lifecycle

```text
[No Session] ──(select themes + difficulty + start)──> [In Progress]
[In Progress] ──(answer question)──> [In Progress] (next question)
[In Progress] ──(answer last question)──> [Complete]
[Complete] ──(new quiz)──> [No Session]
[In Progress] ──(navigate away)──> [No Session] (abandoned)
```

## Question Bank JSON Schema (per-theme file)

```json
[
  {
    "id": "ddd-beg-001",
    "themeId": "ddd",
    "difficulty": "beginner",
    "type": "text",
    "prompt": "What is the primary purpose of a Bounded Context in DDD?",
    "codeSnippet": null,
    "options": [
      { "id": "a", "text": "To define clear boundaries...", "isCorrect": true },
      { "id": "b", "text": "To create database schemas...", "isCorrect": false },
      { "id": "c", "text": "To manage API endpoints...", "isCorrect": false },
      { "id": "d", "text": "To handle user authentication...", "isCorrect": false }
    ],
    "explanation": "A Bounded Context in Domain-Driven Design defines...",
    "bonusFact": "Eric Evans coined the term in his 2003 blue book."
  }
]
```
