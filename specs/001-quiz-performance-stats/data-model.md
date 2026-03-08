# Data Model: Quiz Performance Statistics

## Entities

### `QuizAttempt`
A record of a single completed quiz session.
- `id` (string): Unique UUID for the attempt.
- `timestamp` (number): Unix epoch time when the quiz was completed.
- `themes` (string[]): List of theme IDs that were selected for this quiz.
- `answers` (AnsweredQuestion[]): The answers submitted during the session.

### `AnsweredQuestion`
A record of a single answered question within a quiz.
- `questionId` (string): Unique identifier of the question.
- `theme` (string): The theme this question falls under.
- `isCorrect` (boolean): `true` if the answer was correct, `false` otherwise.

### `ThemePerformanceStatistic`
Computed view model representing performance.
- `theme` (string): The theme identifier.
- `totalAnswers` (number): Total number of questions answered in this theme.
- `correctAnswers` (number): Total number of correctly answered questions in this theme.
- `correctnessRate` (number): Ratio of `correctAnswers / totalAnswers` (0.0 to 1.0).

## Storage Format (LocalStorage)
- **Key**: `tech_quizz_history`
- **Value**: JSON serialized array of `QuizAttempt` objects.
