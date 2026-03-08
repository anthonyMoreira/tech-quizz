# Research: Tech Quiz App

## Decision Log

### 0. TypeScript

**Decision**: Use TypeScript 5.x with maximum strict mode in `tsconfig.json`: `strict: true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noPropertyAccessFromIndexSignature`. All `.ts` files, Vue components use `<script setup lang="ts">`.

**Rationale**: TypeScript catches type errors at compile time, improving code quality and enabling confident refactoring. Aligns with constitution principle IV (clean code) and III (test coverage -- types reduce the surface area that tests must cover). Vite has native TypeScript support. The Vue 3 Composition API has excellent TypeScript integration with inferred types for `ref`, `computed`, and props.

**Alternatives considered**:
- Plain JavaScript: No compile-time type checking. Relies entirely on tests and runtime behavior to catch type mismatches. User confirmed TypeScript is preferred.
- JSDoc type annotations: Provides type checking without a build step but is more verbose, less powerful (no generics, no discriminated unions), and not well-supported by ESLint TypeScript rules.

### 1. Syntax Highlighting for Code Snippets

**Decision**: Use Prism.js via `prismjs` package for syntax highlighting.

**Rationale**: Prism.js is lightweight (~2KB core + language grammars), supports all common languages needed for software engineering questions (JavaScript, TypeScript, Java, Python, C#), and works well with Vue 3. It can be imported selectively to keep bundle size small.

**Alternatives considered**:
- highlight.js: Heavier bundle size (~40KB), auto-detection feature unnecessary since we specify language per question.
- Shiki: Uses TextMate grammars for VS Code-accurate highlighting but requires WASM runtime, adding complexity and bundle size. Overkill for short code snippets.
- No library (plain `<pre><code>`): Loses syntax coloring which significantly reduces readability of code questions.

### 2. State Management

**Decision**: Use Vue 3 Composition API composables (`useQuiz`, `useQuestionBank`) with reactive refs. No external state management library.

**Rationale**: The app has simple, localized state (current quiz session). No cross-cutting global state needed. Composables with `ref`/`reactive` are sufficient and avoid the overhead of Vuex/Pinia for this scope.

**Alternatives considered**:
- Pinia: Industry standard for Vue state management, but adds a dependency for state that lives entirely within a single user session and doesn't persist. Overhead not justified.
- Provide/inject: Works but less testable and harder to reason about than explicit composables.

### 3. Routing Strategy

**Decision**: Vue Router with 4 routes: `/` (home), `/quiz/setup` (theme/difficulty selection), `/quiz/play` (active quiz), `/quiz/results` (summary).

**Rationale**: Clean URL structure, browser back/forward support, and route-level code splitting via dynamic imports for performance.

**Alternatives considered**:
- Single component with conditional rendering: Simpler but loses URL history, deep linking, and code splitting benefits.
- Hash mode routing: Not needed; modern hosting supports history mode.

### 4. Question Bank Format

**Decision**: Static JSON files per theme, imported at build time via Vite's JSON import. Each file contains an array of question objects.

**Rationale**: JSON is natively supported by Vite with tree-shaking. Per-theme files keep content organized and enable parallel authoring by different agents. No runtime fetch needed.

**Alternatives considered**:
- Single large JSON file: Works but harder to maintain and author in parallel (file ownership conflicts).
- JavaScript modules with exported arrays: Marginally more flexible but JSON is cleaner for pure data and easier to validate/generate with tooling.
- YAML/TOML: Requires build-time transformation plugin, adds complexity for no benefit.

### 5. CSS Strategy

**Decision**: Scoped component CSS with CSS custom properties (variables) in a shared `variables.css` file for design tokens (colors, spacing, radii, fonts).

**Rationale**: User specified scoped CSS. CSS custom properties provide theming consistency without a preprocessor. No Sass/Less dependency needed.

**Alternatives considered**:
- Tailwind CSS: Powerful but adds build complexity and a learning curve. The design reference uses specific custom styles better expressed with plain CSS.
- CSS Modules: Similar scoping to Vue scoped styles but with different naming conventions. Vue's built-in scoped attribute is simpler.
- Sass/SCSS: Nesting and mixins are convenient but CSS nesting is now natively supported in modern browsers, reducing the need.

### 6. Testing Strategy

**Decision**: Vitest for all tests. Vue Test Utils for component mounting. jsdom environment for DOM simulation.

**Rationale**: User specified Vitest. It integrates natively with Vite (shared config, transforms, HMR). Vue Test Utils is the official testing utility for Vue components.

**Alternatives considered**:
- Jest: Would require separate Babel/transform configuration since project uses Vite. Vitest is the natural fit.
- Cypress Component Testing: Good for visual testing but heavier setup, better suited for E2E. Not needed for unit/integration scope.

### 7. Linting & Formatting

**Decision**: ESLint with `eslint-plugin-vue` (recommended config) + Prettier for formatting.

**Rationale**: Industry standard for Vue 3 projects. Catches common bugs and enforces consistent style. Constitution requires zero linting warnings before merge.

**Alternatives considered**:
- Biome: Faster alternative to ESLint+Prettier but less mature Vue support.
- ESLint only (with formatting rules): Mixing linting and formatting in ESLint is discouraged; Prettier handles formatting better.

### 8. ESLint Strictness Level

**Decision**: Use `@typescript-eslint/strict-type-checked` + `@typescript-eslint/stylistic-type-checked` as the TypeScript base (strictest presets with type-aware rules), combined with `plugin:vue/vue3-recommended` (strictest Vue ruleset). `vue-eslint-parser` with `@typescript-eslint/parser` for Vue SFC support.

**Rationale**: User requested the most restrictive settings. `strict-type-checked` enables all type-aware rules including `no-unsafe-*`, `no-explicit-any`, `strict-boolean-expressions`, and `no-floating-promises`. This is stricter than `strict` (non-type-checked) and far stricter than `recommended`. Combined with `vue3-recommended`, this gives maximum coverage for both TypeScript and Vue.

**Alternatives considered**:
- `eslint:all` + JS rules: Not applicable since project uses TypeScript. `@typescript-eslint` rules supersede many built-in ESLint rules.
- `@typescript-eslint/recommended`: The typical "strict" setup, but leaves many type-aware rules disabled. Not strict enough per user request.
- `@typescript-eslint/strict` (without type-checked): Misses type-aware rules like `no-floating-promises` and `strict-boolean-expressions` which require type information.
- Biome: Doesn't support Vue SFC templates well enough yet.

### 9. Question Generation Approach

**Decision**: Claude Code custom command (`.claude/commands/generate-questions.md`) invoked as `/generate-questions <theme> <difficulty> <count>`. Claude Code reads the schema, quality criteria, and existing questions, then generates and writes directly to the JSON file.

**Rationale**: User explicitly wants no API calls and wants to use Claude Code directly. A custom command keeps the workflow inside the existing toolchain. The command prompt embeds all validation rules so Claude Code self-checks output before writing. The human reviews and commits the generated questions.

**Alternatives considered**:
- Node.js script calling Claude API: Requires API key setup, a separate dependency (`@anthropic-ai/sdk`), and more infrastructure. User explicitly rejected this approach.
- Manual authoring: Time-consuming for ~240 questions. AI generation with human review is the right balance.
- External tool/service: Adds dependency and complexity. Keeping it in Claude Code is simpler.

### 10. Pre-Commit Formatting Enforcement

**Decision**: Husky + lint-staged to run Prettier and ESLint automatically on staged files before every commit.

**Rationale**: Ensures no unformatted or unlinted code reaches the repository. lint-staged only processes staged files, keeping the hook fast (<5s). This is the industry standard for JS/Vue projects and aligns with constitution principle IV (all linting/formatting rules MUST pass before merge).

**Alternatives considered**:
- Git hooks without Husky (manual `.git/hooks/pre-commit`): Fragile, not version-controlled, not auto-installed for new clones.
- simple-git-hooks: Lighter alternative to Husky but less ecosystem support and no lint-staged integration out of the box.
- CI-only enforcement (no pre-commit): Allows broken code to be committed locally and only caught in CI. Slower feedback loop, wastes CI time.
- Pre-push hook instead of pre-commit: Allows multiple bad commits locally before catching issues. Pre-commit gives tighter feedback.

### 11. Prettier Configuration

**Decision**: Standard TypeScript/JS community conventions: semicolons, single quotes, trailing commas, 80-char print width, 2-space indent, LF line endings.

**Rationale**: These are the most common settings across popular open-source TypeScript and JavaScript projects. Single quotes and trailing commas are the de facto standard in the Vue/React ecosystem. 80-char width improves readability in side-by-side diffs and split editors.

**Alternatives considered**:
- No semicolons (ASI style): Popular in some communities but can cause subtle bugs with line-starting brackets/parens. Semicolons are safer.
- Double quotes: Less common in the JS ecosystem (more common in JSON/HTML). Single quotes reduce visual noise.
- 100 or 120 print width: Wider lines reduce wrapping but hurt readability in code review and narrow terminals. 80 is the safest default.
