# Feature Specification: Quiz Performance Statistics

**Feature Branch**: `001-quiz-performance-stats`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "As a user I want to be able to see statistics about my quizz performance so I can select quizzes where I am not good at. I want to be able to see for each theme : my answer correctness rate."

## Clarifications

### Session 2026-03-08

- Q: Which quiz history window should theme correctness rates use? → A: Use all completed quiz history for each theme.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Theme Performance Overview (Priority: P1)

A returning user opens the app and reviews a performance overview that shows how well they have answered questions in each quiz theme. For every theme they have attempted, they can see their answer correctness rate and the amount of quiz history behind that rate so they can quickly spot weak areas.

**Why this priority**: This is the core user value in the request. Without a clear per-theme performance view, users cannot understand where they are struggling.

**Independent Test**: Can be fully tested by completing quizzes in multiple themes, opening the performance view, and confirming that each attempted theme shows the correct correctness rate and supporting attempt volume.

**Acceptance Scenarios**:

1. **Given** the user has completed quizzes in more than one theme, **When** they open their performance statistics, **Then** the system shows a correctness rate for each attempted theme.
2. **Given** the user has completed multiple quizzes in the same theme, **When** they view that theme's statistics, **Then** the correctness rate reflects all submitted answers included in the user's history for that theme.
3. **Given** the user has not completed any quizzes yet, **When** they open the performance statistics, **Then** the system shows an empty state explaining that statistics will appear after quiz completion.

---

### User Story 2 - Choose a Weak Theme for the Next Quiz (Priority: P2)

While deciding what to practice next, the user can review each theme's correctness rate at the point where they choose quiz themes. This helps them intentionally select themes where their past performance is weakest.

**Why this priority**: The purpose of the feature is not only to report history but to help users make a better quiz choice immediately afterward.

**Independent Test**: Can be tested by opening quiz theme selection after building quiz history and verifying that the user can see per-theme performance information while choosing the next quiz.

**Acceptance Scenarios**:

1. **Given** the user is choosing themes for a new quiz, **When** theme options are displayed, **Then** each theme shows its current correctness rate or a clear no-history state.
2. **Given** the user has a lower correctness rate in one theme than another, **When** they compare the available themes, **Then** they can identify the weaker theme without leaving the quiz selection flow.

---

### User Story 3 - Understand Themes With Limited or No History (Priority: P3)

The user can distinguish between a theme where they are performing poorly and a theme they have barely or never practiced. Themes with no history or very little history are labeled clearly so the statistics are not misleading.

**Why this priority**: Performance statistics lose trust if users cannot tell whether a low rate comes from meaningful practice or almost no data.

**Independent Test**: Can be tested by viewing statistics for themes with no attempts and themes with only a small number of answered questions, then confirming the display is accurate and not misleading.

**Acceptance Scenarios**:

1. **Given** a theme has never been attempted, **When** the user views theme statistics, **Then** the system shows that the theme has no quiz history instead of displaying a 0% correctness rate.
2. **Given** a theme has only a small number of answered questions, **When** the user views its statistics, **Then** the system shows the correctness rate together with the amount of data behind it.

---

### Edge Cases

- A theme has never appeared in a completed quiz for the user.
- The user completed mixed-theme quizzes, so answers from one quiz contribute to multiple theme statistics.
- The user abandons a quiz before finishing it.
- A theme has only one or two answered questions, making the rate highly volatile.
- The user improves or declines sharply in a theme after several past attempts, and the updated rate must reflect the latest completed quiz history.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide a way for a user to view performance statistics for quiz themes.
- **FR-002**: The system MUST calculate a correctness rate for each theme using the user's correct answers divided by the user's submitted answers for that theme across all completed quiz history for that user.
- **FR-003**: The system MUST show a theme-level statistic for every available quiz theme.
- **FR-004**: The system MUST display a clear no-history state for any theme with no completed quiz data instead of showing a misleading correctness rate.
- **FR-005**: The system MUST display the number of answered questions contributing to each theme's correctness rate.
- **FR-006**: The system MUST update the affected theme statistics after each completed quiz so future quiz selection uses current data.
- **FR-007**: The system MUST make each theme's correctness rate visible while the user is choosing themes for a new quiz.
- **FR-008**: The system MUST allow the user to compare theme performance without opening a separate detail view for each theme.
- **FR-009**: The system MUST exclude unanswered questions from correctness-rate calculations.
- **FR-010**: The system MUST calculate theme statistics from the theme assigned to each answered question, even when a completed quiz contains multiple themes.
- **FR-011**: The system MUST preserve a user's historical theme statistics across multiple visits so returning users can track performance over time.
- **FR-012**: The system MUST keep statistics scoped to the same user so one user's performance does not appear as another user's statistics.

**Assumptions**:

- The feature extends the app's current anonymous usage model; cross-device account synchronization is out of scope.
- Only submitted answers from completed quizzes contribute to theme statistics.
- Theme correctness rates use the user's full completed quiz history rather than a limited recent window.
- Each quiz question belongs to exactly one theme for reporting purposes.
- One overall correctness rate per theme is sufficient for this feature; difficulty-specific breakdowns are out of scope.

### Key Entities _(include if feature involves data)_

- **Theme Performance Statistic**: A per-theme summary of a user's past quiz performance, including correctness rate, answered-question count, and whether the user has any completed history for that theme.
- **Completed Quiz Attempt**: A finished quiz session whose submitted answers are eligible to contribute to performance statistics.
- **Answered Question Record**: A record of a user's submitted answer for a specific question, including the theme it belongs to and whether the answer was correct.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of themes with completed quiz history display a correctness rate and answered-question count.
- **SC-002**: 100% of themes without completed quiz history display a no-history state rather than a 0% correctness rate.
- **SC-003**: Returning users can identify a lower-performing theme and begin a new targeted quiz in under 20 seconds.
- **SC-004**: After a user completes a quiz, the affected theme statistics are updated before the user starts their next quiz.
- **SC-005**: In acceptance testing, at least 90% of users correctly identify their weakest attempted theme from the statistics display on their first try.
