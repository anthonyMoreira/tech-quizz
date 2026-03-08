# Research: Storage Abstraction

## Decision
We will use the Repository Pattern with a defined TypeScript interface (`QuizHistoryRepository`). The application will depend on the interface, and we will provide a `LocalStorageQuizHistoryRepository` implementation. This allows easily swapping in an `ApiQuizHistoryRepository` later.

## Rationale
This perfectly satisfies the requirement: 'build stuff in a way that is easy to plugin a backend if needed'. The UI components and composables will only know about the interface.

## Alternatives considered
- Direct `localStorage` calls in components: Hard to refactor later.
- Vuex/Pinia with plugins: Overkill for this simple state and couples storage tightly to the state management library.
