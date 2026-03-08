# Feature Specification: Tech Quiz App

**Feature Branch**: `001-tech-quiz-app`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "I want to build a web app that makes technical software engineer theme quizzes. The user will be able to choose a few themes he likes, (domain driven design, tdd...). There will be a menu and in this menu you will a quizz item. You will be able to launch a quizz. The quizz will generate questions based on the themes the user selected. When he answers the UI will display if he was right or wrong with an explanation on the answer. The quizz will be maximum 10 questions long so it can be completed fast."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Themes and Launch a Quiz (Priority: P1)

A user opens the web app and sees a menu with a "Quiz" item. They navigate to the quiz section, where they are presented with a difficulty selector (beginner, intermediate, advanced) and a list of software engineering themes (e.g., Domain-Driven Design, Test-Driven Development, SOLID Principles, Design Patterns, Clean Architecture, CI/CD, Microservices, Refactoring). The user picks a difficulty level, selects one or more themes they want to be quizzed on, then launches the quiz. The system selects up to 10 multiple-choice questions from a static question bank based on the selected themes. The user answers each question one at a time.

**Why this priority**: This is the core experience of the application. Without theme selection and quiz generation, there is no product. This single story delivers a complete, usable MVP.

**Independent Test**: Can be fully tested by selecting themes, launching a quiz, and verifying that questions are generated matching the selected themes. Delivers the primary value of the app.

**Acceptance Scenarios**:

1. **Given** the user is on the quiz page, **When** they select "Domain-Driven Design" and "TDD" as themes and press "Start Quiz", **Then** the system generates up to 10 multiple-choice questions related to those themes.
2. **Given** no themes are selected, **When** the user attempts to start a quiz, **Then** the system displays a message asking the user to select at least one theme.
3. **Given** the user selects a single theme, **When** they launch the quiz, **Then** all generated questions are relevant to that theme.
4. **Given** the user selects multiple themes, **When** they launch the quiz, **Then** questions are distributed across the selected themes.

---

### User Story 2 - Answer Questions with Instant Feedback (Priority: P2)

During an active quiz, the user sees one question at a time with multiple answer options. After selecting an answer and confirming, the system immediately reveals whether the answer was correct or incorrect, along with a clear explanation of the correct answer. The user then proceeds to the next question until the quiz is complete.

**Why this priority**: Feedback and explanations are what make the quiz educational rather than just a test. This is the second most critical piece because it transforms the experience from "checking knowledge" to "learning."

**Independent Test**: Can be tested by answering a question in an active quiz and verifying that correct/incorrect feedback with explanation is displayed before moving to the next question.

**Acceptance Scenarios**:

1. **Given** the user is viewing a quiz question, **When** they select an answer and confirm, **Then** the system displays whether the answer is correct or incorrect.
2. **Given** the user has submitted an answer, **When** the result is displayed, **Then** an explanation of the correct answer is shown regardless of whether the user answered correctly or incorrectly.
3. **Given** the user has seen the feedback for a question, **When** they proceed to the next question, **Then** the previous question's feedback is no longer visible and the next question is displayed.
4. **Given** the user has not yet confirmed their answer, **When** they change their selection, **Then** the system allows changing the answer before confirmation.

---

### User Story 3 - View Quiz Results Summary (Priority: P3)

After answering the last question, the user sees a summary screen showing their overall score (e.g., "7/10 correct"), a breakdown of which questions they got right and wrong, and the ability to review the explanations. The user can then choose to start a new quiz or return to theme selection.

**Why this priority**: The results summary provides closure and a sense of accomplishment. It is valuable for tracking learning progress but the app is still usable without it (users get feedback per question in US2).

**Independent Test**: Can be tested by completing a quiz and verifying the summary screen displays accurate score, per-question results, and navigation options.

**Acceptance Scenarios**:

1. **Given** the user has answered all questions in the quiz, **When** the last answer feedback is dismissed, **Then** a results summary screen is displayed with the total score.
2. **Given** the results summary is displayed, **When** the user reviews the breakdown, **Then** each question shows whether the user answered correctly or incorrectly.
3. **Given** the results summary is displayed, **When** the user chooses "New Quiz", **Then** they are returned to the theme selection screen.

---

### User Story 4 - Code Snippet Questions (Priority: P4)

During a quiz, some questions present a code snippet instead of (or alongside) a text prompt. The user reads the code and selects the answer that best describes what the code does, what pattern it implements, what is wrong with it, or what improvement applies. Code snippets are displayed in a formatted, readable code block with syntax highlighting.

**Why this priority**: Code-based questions bridge theory and practice. They make the quiz more engaging for engineers who learn best by reading real code, and they test applied knowledge rather than rote memorization. This builds on top of the core quiz flow (US1-US3).

**Independent Test**: Can be tested by launching a quiz that includes at least one code snippet question and verifying the snippet renders in a formatted code block with syntax highlighting, and that the question is answerable based on the code shown.

**Acceptance Scenarios**:

1. **Given** a quiz contains a code snippet question, **When** the question is displayed, **Then** the code snippet is shown in a formatted block with syntax highlighting appropriate to the language.
2. **Given** a code snippet question, **When** the user reads the snippet and selects an answer, **Then** the feedback explanation references the specific code shown and explains why the answer is correct.
3. **Given** the question bank has a mix of text-only and code snippet questions for a theme, **When** a quiz is generated, **Then** code snippet questions are included naturally alongside text questions (no separate mode needed).

---

### User Story 5 - "Did You Know?" Bonus Facts (Priority: P5)

After answering a question and viewing the correct/incorrect feedback, the user sees a "Did you know?" bonus fact related to the question's topic. This fact provides an interesting, surprising, or lesser-known insight that goes beyond the explanation. It encourages curiosity and makes each question a mini-learning moment.

**Why this priority**: Bonus facts add delight and educational depth at minimal cost. They transform the feedback screen from a pass/fail moment into a discovery moment. This is a low-effort, high-engagement enhancement that layers on top of the existing feedback flow (US2).

**Independent Test**: Can be tested by answering any question and verifying that a "Did you know?" fact is displayed alongside the answer explanation on the feedback screen.

**Acceptance Scenarios**:

1. **Given** the user has answered a question, **When** the feedback is displayed, **Then** a "Did you know?" bonus fact is shown alongside the explanation.
2. **Given** a question in the bank has a bonus fact, **When** the feedback is displayed, **Then** the bonus fact is visually distinct from the main explanation (e.g., different styling or section).
3. **Given** a question does not have a bonus fact in the bank, **When** the feedback is displayed, **Then** the feedback shows normally without an empty "Did you know?" section.

---

### Edge Cases

- What happens when the question bank has fewer than 10 questions for the selected themes and difficulty? The quiz runs with fewer questions (minimum 1) and informs the user of the actual count.
- What happens when the user closes the browser mid-quiz? The quiz state is not preserved; the user starts fresh on return. (Assumption: no session persistence required for MVP.)
- What happens when the user selects all available themes? The system generates a mixed quiz drawing from all themes, still capped at 10 questions.
- What happens if a user rapidly double-clicks the confirm button? The system MUST process only one answer submission per question.
- What happens if the user navigates away from the quiz via the menu? The current quiz is abandoned without saving.
- What happens when a code snippet is too long to fit on screen? The code block MUST be scrollable; it MUST NOT break the page layout.
- What happens when a question has no "Did you know?" fact? The bonus fact area is simply not displayed; no empty placeholder is shown.
- What happens when a theme has 0 questions for the selected difficulty? The theme is disabled (greyed out) and cannot be selected for that difficulty.
- What happens when a user navigates directly to `/quiz/play` without selecting themes? The system redirects to the quiz setup page.
- What happens when a user navigates directly to `/quiz/results` without completing a quiz? The system redirects to the home page.

## Clarifications

### Session 2026-03-07

- Q: How are quiz questions generated -- AI via LLM API, static pre-authored bank, or hybrid? → A: Static pre-authored question bank stored in the app (no external dependency).
- Q: Do questions have difficulty levels? → A: Yes, user chooses difficulty (beginner, intermediate, advanced) before starting a quiz.
- Q: Are questions randomized across retakes? → A: Yes, both question selection and answer option order are randomized each time.

### Session 2026-03-08

- Q: What does the home page show? → A: Simple "Start Quiz" call-to-action with theme previews (cards showing available themes).
- Q: Should the app be responsive? → A: Yes, must work on both phones and desktops.
- Q: What happens when a theme has 0 questions for a difficulty? → A: The theme is disabled (greyed out, not selectable) for that difficulty.
- Q: What is the minimum question bank size for launch? → A: At least 10 questions per theme per difficulty.
- Q: Should routes be protected? → A: Yes, navigation guards prevent accessing quiz/play without theme selection and quiz/results without completing a quiz.
- Q: What other items appear in the sidebar besides Quiz? → A: Home, Quiz, and placeholders for future features: Themes and History.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a navigation menu containing at minimum a "Quiz" item.
- **FR-002**: System MUST present a list of software engineering themes for the user to select before starting a quiz.
- **FR-003**: System MUST require at least one theme to be selected before allowing a quiz to start.
- **FR-003a**: System MUST allow the user to choose a difficulty level (beginner, intermediate, or advanced) before starting a quiz.
- **FR-003b**: System MUST filter questions from the bank matching both the selected themes and the chosen difficulty level.
- **FR-003c**: System MUST randomize both the selection of questions and the order of answer options for each quiz session.
- **FR-004**: System MUST select up to 10 multiple-choice questions from the static question bank based on the user's selected themes.
- **FR-005**: Each generated question MUST have exactly one correct answer and at least two incorrect answers.
- **FR-006**: System MUST present questions one at a time during the quiz.
- **FR-007**: System MUST allow the user to select and confirm an answer for each question.
- **FR-008**: System MUST display correct/incorrect feedback immediately after answer confirmation.
- **FR-009**: System MUST display a paragraph-length explanation of the correct answer after each question is answered.
- **FR-010**: System MUST display a results summary after the last question, showing the total score and per-question breakdown.
- **FR-011**: System MUST allow the user to start a new quiz from the results screen.
- **FR-012**: System MUST prevent duplicate answer submissions for the same question (e.g., double-click protection).
- **FR-013**: Questions MUST be distributed across selected themes when multiple themes are chosen.
- **FR-014**: The question bank MUST support a "code snippet" question type where the prompt includes a block of source code.
- **FR-015**: Code snippets MUST be displayed in a formatted, scrollable code block with syntax highlighting.
- **FR-016**: Code snippet questions MUST be mixed naturally with text-only questions in a quiz (no separate mode).
- **FR-017**: Each question in the bank MAY include an optional "Did you know?" bonus fact.
- **FR-018**: When a bonus fact exists for a question, the system MUST display it on the feedback screen alongside the explanation, visually distinct from the explanation.
- **FR-019**: When a question has no bonus fact, the feedback screen MUST NOT show an empty bonus fact section.
- **FR-020**: The home page MUST display a "Start Quiz" call-to-action and preview cards for available themes.
- **FR-021**: The app MUST be fully responsive and usable on both desktop and mobile devices.
- **FR-022**: Themes with 0 questions for the selected difficulty MUST be disabled (greyed out, not selectable).
- **FR-023**: The system MUST prevent direct navigation to the quiz play screen without first selecting themes and difficulty.
- **FR-024**: The system MUST prevent direct navigation to the results screen without first completing a quiz.
- **FR-025**: The navigation menu MUST include: Home, Quiz, and placeholder items for future features (Themes, History).

### Question Bank Quality Criteria

Every question in the bank MUST meet the following standards:

- **Plausible distractors**: Incorrect answer options MUST be real concepts or approaches used incorrectly, not obviously absurd choices.
- **Teaching explanations**: Each explanation MUST be a full paragraph that teaches the underlying concept, not just restate which answer is correct.
- **Understanding over trivia**: Questions MUST test comprehension and applied knowledge (e.g., "What problem does the Repository pattern solve?"), not memorization of names, dates, or authors.
- **No duplicate concepts**: No two questions within the same theme and difficulty level MUST test the exact same concept.
- **Self-contained code snippets**: Code snippet questions MUST include code that is readable and understandable without external context or additional files.
- **Bonus fact length**: "Did you know?" facts MUST NOT exceed 100 characters.
- **Factual accuracy**: All questions, answers, explanations, and bonus facts MUST be factually correct and reflect current industry understanding.

**Assumptions**:
- No user authentication is required for MVP; the app is anonymous.
- Questions are drawn from a static pre-authored question bank stored within the app. There is no external API dependency for question generation.
- The available themes are curated by the system (not user-created).
- Each question has 4 answer options (1 correct, 3 incorrect) as a reasonable default for multiple-choice.

### Key Entities

- **Theme**: A software engineering topic the user can select (e.g., "Domain-Driven Design", "TDD"). Has a name and description. A quiz can be based on one or more themes.
- **Quiz**: A session consisting of up to 10 questions generated from selected themes. Tracks which themes were selected and the user's progress.
- **Question**: A single quiz item with a prompt, a list of answer options, one correct answer, an explanation, a difficulty level (beginner, intermediate, or advanced), an optional code snippet (with language indicator for syntax highlighting), and an optional "Did you know?" bonus fact. Belongs to one theme. Has a type: "text" (default) or "code-snippet".
- **Answer Option**: A possible response to a question. Has display text and a flag indicating whether it is the correct answer.
- **Quiz Result**: The outcome of a completed quiz. Contains the total score, per-question correctness, and references to the original questions and user's chosen answers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can select themes and start a quiz in under 30 seconds from first page load.
- **SC-002**: Users receive correct/incorrect feedback with explanation within 1 second of confirming an answer.
- **SC-003**: A complete quiz of 10 questions can be finished in under 5 minutes.
- **SC-004**: 90% of users successfully complete a quiz on their first attempt without confusion or errors.
- **SC-005**: The results summary accurately reflects 100% of the answers given during the quiz.
- **SC-006**: Questions generated are factually accurate and relevant to the selected themes.
