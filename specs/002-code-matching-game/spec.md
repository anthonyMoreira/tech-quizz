# Feature Specification: Code Matching Mini Game

**Feature Branch**: `002-code-matching-game`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Add code matching mini game for code snippet questions"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Interactive Code Fragment Matching (Priority: P1)

When a user encounters a code-snippet type question, they can optionally play a code matching mini game where they drag-and-drop code fragments to match them with their correct descriptions, outputs, or functional outcomes. This transforms passive code reading into active learning through hands-on interaction.

**Why this priority**: This is the core MVP functionality. Code snippet questions are already a fundamental question type in the quiz, and this mini game directly enhances comprehension by requiring users to actively analyze and match code elements rather than just reading and selecting an answer.

**Independent Test**: Can be fully tested by loading any code-snippet question, activating the code matching game mode, dragging code fragments to description zones, and verifying correct/incorrect matches are properly validated and provide feedback.

**Acceptance Scenarios**:

1. **Given** a user is viewing a code-snippet question, **When** they click "Play Code Matching Game" button, **Then** the question transforms into a game interface with draggable code fragments and description drop zones
2. **Given** code fragments are displayed, **When** the user drags a code fragment to a drop zone, **Then** the fragment snaps into place with visual hover feedback
3. **Given** the user has matched all fragments, **When** they click "Check Matches", **Then** correct matches turn green with checkmarks and incorrect matches turn red with X marks
4. **Given** the user completes the matching game successfully, **When** all matches are correct, **Then** they receive a success message and the standard multiple choice question is revealed with a bonus point indicator

---

### User Story 2 - Opt-in/Opt-out Game Mode (Priority: P1)

Users can choose whether to play the code matching game or skip directly to the standard multiple choice format. This ensures the game enhances but doesn't block the quiz flow.

**Why this priority**: User choice is critical for accessibility and user experience. Some users may prefer traditional quiz format, have time constraints, or need to skip for accessibility reasons. This must be part of the MVP.

**Independent Test**: Can be tested by verifying the "Play Code Matching Game" button and "Skip to Question" button both work correctly, allowing users to switch between game and standard mode without losing progress.

**Acceptance Scenarios**:

1. **Given** a code-snippet question is displayed, **When** the user sees the question, **Then** both "Play Code Matching Game" and "Skip to Question" buttons are visible
2. **Given** the user is in game mode, **When** they click "Skip to Question", **Then** the game closes and the standard multiple choice format appears
3. **Given** the user completes the game successfully, **When** the multiple choice question appears, **Then** their game completion is tracked but they still must answer the question normally

---

### User Story 3 - Retry After Incorrect Matches (Priority: P2)

When a user makes incorrect matches in the code matching game, they can retry the game or choose to skip to the standard question format. This provides learning opportunity without frustration.

**Why this priority**: Allows users to learn from mistakes without being stuck. Lower priority than P1 because the minimum viable experience can simply show correct answers after first attempt, but retry adds educational value.

**Independent Test**: Can be tested by deliberately making incorrect matches, verifying the retry button appears, clicking it, and confirming the game resets with fragments in new positions.

**Acceptance Scenarios**:

1. **Given** a user submits matches with at least one incorrect, **When** the results are shown, **Then** "Try Again" and "Skip to Question" buttons appear
2. **Given** incorrect matches are displayed, **When** the user clicks "Try Again", **Then** all fragments reset to their starting positions and can be dragged again
3. **Given** the user retries, **When** they make correct matches on the second attempt, **Then** they still receive positive feedback but with a "Completed on 2nd try" indicator

---

### Edge Cases

- What happens when a user starts dragging a fragment but navigates away from the page? The game state should be saved in the quiz session so it can be restored when returning.
- How does the system handle code matching on mobile devices with touch interactions? Touch drag-and-drop must work smoothly with proper touch event handlers and visual feedback.
- What if a user with keyboard-only navigation or screen reader needs to play? The game must provide keyboard alternatives (Tab to focus, Arrow keys to move, Enter to place) with ARIA labels.
- How does the system handle very long code fragments that don't fit in the drag zones? Fragments should have a maximum height with scroll, and drop zones should accommodate various sizes.
- What if there are more than 4 code fragments to match? The game should support flexible numbers of fragments (2-6) with responsive layout adjustments.
- Can users undo a placement before checking all matches? Yes, clicking on a placed fragment should return it to the available fragments pool.
- What happens if users try to drop multiple fragments in the same zone? Only the most recent drop should be accepted, and previous fragments return to the pool.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a "Play Code Matching Game" button on all code-snippet type questions
- **FR-002**: System MUST provide a "Skip to Question" button that allows users to bypass the game and proceed directly to standard multiple choice format
- **FR-003**: System MUST break down code snippets into 3-5 draggable code fragments with corresponding description drop zones
- **FR-004**: System MUST enable drag-and-drop functionality for code fragments on both desktop (mouse) and mobile (touch) devices
- **FR-005**: System MUST provide visual feedback during drag operations (highlight on hover, cursor changes, drop zone indicators)
- **FR-006**: System MUST validate all matches when user clicks "Check Matches" and display correct/incorrect indicators
- **FR-007**: System MUST show correct answers for any incorrect matches after validation
- **FR-008**: System MUST provide a "Try Again" button when matches are incorrect, resetting the game to initial state
- **FR-009**: System MUST save game state in the quiz session so users can resume if they navigate away
- **FR-010**: System MUST track whether user completed the matching game and how many attempts it took
- **FR-011**: System MUST be keyboard-navigable with Tab, Arrow keys, and Enter for accessibility
- **FR-012**: System MUST include ARIA labels and roles for screen reader compatibility
- **FR-013**: System MUST display the standard multiple choice question after successful game completion
- **FR-014**: System MUST show a bonus point indicator when user completes the game on first try before answering the question
- **FR-015**: System MUST allow users to undo fragment placements by clicking on placed fragments to return them to the available pool

### Key Entities

- **CodeMatchingGame**: Represents a game instance for a code-snippet question, with properties for fragment-description pairs, user placements, validation status, attempt count, and completion state
- **CodeFragment**: Represents a draggable code element with properties for code text, unique ID, current position (unplaced/placed), and associated description ID
- **DescriptionZone**: Represents a drop zone for code fragments with properties for description text, unique ID, accepted fragment ID, and validation status
- **GameState**: Tracks the current state of the game including which fragments are placed, number of attempts, whether game is complete, and whether user earned bonus points

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the code matching game and see validation results within 3 seconds of clicking "Check Matches"
- **SC-002**: At least 70% of users who start the code matching game complete it successfully within 2 attempts
- **SC-003**: Drag-and-drop interactions respond within 100ms of user input on both desktop and mobile devices
- **SC-004**: Users can understand how to play the game within 20 seconds using visual cues alone (no written instructions needed)
- **SC-005**: The code matching game is fully playable using keyboard-only navigation, passing WCAG 2.1 AA compliance tests
- **SC-006**: Users who complete the matching game score 15% higher on code-snippet questions compared to users who skip directly to multiple choice
- **SC-007**: At least 60% of users who encounter code-snippet questions choose to play the matching game rather than skip
- **SC-008**: Zero reports of lost game progress when users navigate away and return to the same question
