<!--
  Sync Impact Report
  ==================
  Version change: 1.0.0 -> 1.1.0

  Modified principles: (none renamed)

  Added principles:
    - V. Parallel-Safe Collaboration

  Added sections:
    - Parallel Work Protocol (new section between
      Development Workflow and Governance)

  Removed sections: (none)

  Templates requiring updates:
    - .specify/templates/plan-template.md ........... ✅ no update needed
      (Constitution Check is dynamic; parallel rules apply at fill time)
    - .specify/templates/spec-template.md ........... ✅ no update needed
      (User stories already support independent implementation)
    - .specify/templates/tasks-template.md .......... ✅ no update needed
      (Already uses [P] markers and per-story phasing for parallelism)

  Follow-up TODOs: none
-->

# Tech Quizz Constitution

## Core Principles

### I. User Experience First

Every feature MUST be designed from the end-user's perspective before
any implementation begins.

- All user-facing interactions MUST feel responsive: visual feedback
  within 100ms of user action, content ready within 1 second.
- Navigation and workflows MUST be intuitive; users MUST complete
  primary tasks without external documentation.
- Accessibility MUST be treated as a functional requirement, not
  an afterthought. All interactive elements MUST be keyboard-navigable
  and screen-reader compatible.
- UI states (loading, empty, error, success) MUST be explicitly
  designed and implemented for every view.
- User-facing error messages MUST be actionable and written in
  plain language.

**Rationale**: A technically excellent product that frustrates users
delivers no value. UX quality is measured by task completion rate
and user satisfaction, not by feature count.

### II. Performance by Design

Performance MUST be considered during design, not retrofitted after
implementation.

- Every feature specification MUST include measurable performance
  targets (response time, payload size, render budget).
- Database queries MUST be reviewed for N+1 problems and missing
  indexes before merge.
- Bundle size impact MUST be evaluated for every new dependency;
  dependencies exceeding 50KB gzipped MUST be justified in the PR.
- API responses MUST be paginated when result sets can exceed 50
  items.
- Critical rendering paths MUST be profiled; no single frame MUST
  exceed 16ms render time for animated interactions.

**Rationale**: Performance degradation compounds silently. Proactive
budgets prevent the need for costly retroactive optimization sprints.

### III. Comprehensive Test Coverage (NON-NEGOTIABLE)

All production code MUST have meaningful test coverage. Tests are
a first-class deliverable, not an optional add-on.

- Minimum code coverage target: 80% line coverage across the
  project. New features MUST meet or exceed this threshold.
- Every user story MUST have at least one integration test that
  validates the complete user journey.
- Every public API endpoint or exported function MUST have unit
  tests covering happy path, error cases, and edge cases.
- Tests MUST be deterministic: no flaky tests permitted in the
  main branch. A flaky test MUST be fixed or quarantined within
  24 hours of detection.
- Test names MUST describe the behavior being verified, not the
  implementation detail (e.g., "displays error when email invalid"
  not "test_validate_email_regex").

**Rationale**: High coverage with meaningful tests catches regressions
early and enables confident refactoring. Coverage without quality
is vanity; every test MUST assert observable behavior.

### IV. Clean Code

Code MUST be written for readability and maintainability by humans,
not just for execution by machines.

- Functions MUST do one thing. A function exceeding 30 lines MUST
  be reviewed for decomposition opportunities.
- Files MUST have a single, clear responsibility. A file exceeding
  300 lines MUST be reviewed for splitting.
- Naming MUST be descriptive and consistent: variables reveal intent,
  functions describe actions, types describe shape.
- No dead code, commented-out code, or TODO comments without a
  linked issue in the main branch.
- Code duplication MUST be eliminated when the same logic appears
  three or more times. Two occurrences MAY be tolerated if
  abstraction would reduce clarity.
- All linting and formatting rules MUST pass before merge. No
  linter suppressions without an inline justification comment.

**Rationale**: Code is read far more often than it is written. Clean
code reduces onboarding time, minimizes bugs, and makes the codebase
a reliable source of truth for system behavior.

### V. Parallel-Safe Collaboration

Multiple agents (AI or human) MUST be able to work on the project
simultaneously without blocking each other or causing conflicts.

- Each agent MUST operate on a distinct set of files at any given
  time. Two agents MUST NOT edit the same file concurrently.
- Shared interfaces (types, contracts, API schemas) MUST be defined
  and frozen before parallel implementation begins. Changes to
  shared interfaces MUST block all dependent work until resolved.
- Every task in `tasks.md` MUST list its file ownership explicitly
  so agents can claim non-overlapping work units.
- Agents MUST NOT modify files outside their assigned task scope.
  If a cross-cutting change is needed, it MUST be escalated to
  the orchestrating agent or user for coordination.
- New shared code (utilities, types, constants) MUST be created
  in dedicated files rather than appended to files another agent
  may be editing.
- Each agent MUST run the full test suite on its changes before
  considering a task complete to catch integration breakage early.

**Rationale**: Parallel execution multiplies throughput only when
merge conflicts and integration failures are near zero. Strict file
ownership and frozen interfaces eliminate the primary sources of
coordination overhead.

## Quality Gates

Every pull request MUST pass the following gates before merge:

1. **Automated tests pass**: All unit, integration, and contract
   tests MUST be green.
2. **Coverage threshold met**: New code MUST not decrease overall
   coverage below 80%.
3. **Performance budget respected**: No regression on defined
   performance targets (measured by CI benchmarks when applicable).
4. **Linting clean**: Zero warnings, zero errors from configured
   linting and formatting tools.
5. **UX review**: User-facing changes MUST include screenshots or
   screen recordings demonstrating all UI states (loading, empty,
   error, success).
6. **No unresolved TODOs**: Every TODO in changed files MUST
   reference a tracked issue or be resolved before merge.
7. **No file ownership violations**: Changes MUST NOT include files
   assigned to another agent's active task.

## Development Workflow

The following workflow MUST be followed for all feature work:

1. **Specify**: Write or update the feature specification with
   user stories, acceptance criteria, and performance targets
   before writing any code.
2. **Plan**: Create an implementation plan with architecture
   decisions, file structure, and task breakdown.
3. **Implement incrementally**: Deliver one user story at a time
   in priority order. Each story MUST be independently testable
   and deployable.
4. **Test alongside code**: Tests MUST be written as part of
   implementation, not deferred to a separate phase. Prefer
   writing tests before or alongside production code.
5. **Review against constitution**: Every review MUST verify
   compliance with these principles. Reviewers MUST flag
   violations as blocking.

## Parallel Work Protocol

This section defines how multiple agents coordinate when working
on the same feature or across features simultaneously.

### Task Assignment

- Before starting work, each agent MUST claim specific tasks from
  `tasks.md` by marking them as in-progress.
- Tasks marked `[P]` (parallel-safe) MAY be claimed by different
  agents simultaneously.
- Tasks NOT marked `[P]` MUST be executed sequentially in the
  order listed.
- An agent MUST NOT claim a task whose dependencies are incomplete.

### File Ownership Rules

- Each task defines an explicit set of files it creates or modifies.
  These files are "owned" by the agent working that task.
- If two tasks touch the same file, they MUST NOT run in parallel
  regardless of `[P]` marking. The orchestrator MUST sequence them.
- Shared type definitions, interfaces, and schemas MUST be
  completed in the Foundational phase before story-level parallel
  work begins.
- Test files follow the same ownership rules: only the agent
  implementing a feature writes tests for that feature's files.

### Integration Points

- After completing a task, each agent MUST run the full test suite
  (not just its own tests) to verify no integration breakage.
- When an agent's work depends on another agent's output (e.g., an
  API contract), the dependency MUST be satisfied via a committed,
  tested artifact -- not a verbal agreement or assumption.
- Merge order: foundational changes first, then story-level changes
  in priority order (P1 before P2), then cross-cutting polish.

### Communication Protocol

- Agents MUST document decisions that affect other agents' work in
  the relevant spec or plan file, not in ephemeral messages.
- If an agent discovers that its task requires modifying a file
  owned by another agent, it MUST stop and report the conflict
  rather than proceeding with the edit.
- Blocking issues (broken builds, missing interfaces, ambiguous
  specs) MUST be raised immediately rather than worked around with
  assumptions.

### Conflict Resolution

- **File conflict**: The agent whose task has the lower task number
  (earlier in execution order) takes priority. The other agent
  MUST wait or rebase.
- **Design conflict**: Escalate to the user or orchestrating agent.
  Do NOT proceed with competing implementations.
- **Test conflict**: If two agents need to add tests to the same
  test file, one agent creates the file and the other appends
  after the first task is complete.

## Governance

This constitution is the authoritative source for development
standards in the Tech Quizz project. It supersedes informal
practices and ad-hoc decisions.

- **Amendments**: Any change to this constitution MUST be
  documented with a version bump, rationale, and migration plan
  for affected code if applicable.
- **Versioning**: This document follows semantic versioning.
  MAJOR for principle removals or redefinitions, MINOR for new
  principles or material expansions, PATCH for clarifications
  and wording fixes.
- **Compliance review**: All pull requests and code reviews MUST
  verify adherence to these principles. Non-compliance MUST be
  flagged as a blocking issue.
- **Dispute resolution**: When principles conflict (e.g., UX
  richness vs. performance budget), the higher-numbered principle
  yields to the lower-numbered one unless explicitly justified
  in the PR description.

**Version**: 1.1.0 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-07
