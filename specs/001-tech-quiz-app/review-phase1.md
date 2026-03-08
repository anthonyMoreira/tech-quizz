# Phase 1 Review Checklist (Adversarial)

## T001: Vite Project Setup
- [ ] frontend/ directory exists
- [ ] frontend/package.json exists with "vue", "vue-router", "prismjs" in dependencies
- [ ] frontend/src/App.vue exists (template file)
- [ ] frontend/src/main.ts exists
- [ ] `npm run build` succeeds from frontend/

## T002: TypeScript Strict Mode
- [ ] tsconfig.app.json has `"strict": true`
- [ ] tsconfig.app.json has `"noUncheckedIndexedAccess": true`
- [ ] tsconfig.app.json has `"exactOptionalPropertyTypes": true`
- [ ] tsconfig.app.json has `"noPropertyAccessFromIndexSignature": true`
- [ ] frontend/src/vite-env.d.ts exists

## T003: ESLint Flat Config
- [ ] eslint.config.ts exists in frontend/
- [ ] Uses typescript-eslint strictTypeChecked config
- [ ] Uses eslint-plugin-vue recommended
- [ ] Uses eslint-config-prettier
- [ ] package.json has "lint" and "lint:fix" scripts
- [ ] `npm run lint` exits without errors on template files

## T004: Prettier Config
- [ ] .prettierrc exists in frontend/
- [ ] Has `"semi": true`
- [ ] Has `"singleQuote": true`
- [ ] Has `"trailingComma": "all"`
- [ ] Has `"vueIndentScriptAndStyle": true`
- [ ] .prettierignore exists
- [ ] package.json has "format" and "format:check" scripts

## T005: Husky + lint-staged
- [ ] .husky/pre-commit exists and is executable
- [ ] .lintstagedrc.json exists
- [ ] .lintstagedrc.json has rules for *.{ts,vue} and *.{json,css,md}
- [ ] package.json has "prepare": "husky"
- [ ] husky and lint-staged in devDependencies

## T006: Vitest
- [ ] vite.config.ts has test configuration
- [ ] test.environment === 'jsdom'
- [ ] Coverage thresholds set to 80%
- [ ] @vitest/coverage-v8 in devDependencies
- [ ] @vue/test-utils in devDependencies
- [ ] jsdom in devDependencies
- [ ] package.json has "test", "test:ui", "coverage" scripts
- [ ] tests/ directory exists with unit/ and integration/ subdirs
