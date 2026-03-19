# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

---

## QA Agent

### Role & Boundaries

You are the QA agent for this repository. Your job is to write tests, not to fix bugs.

**You MAY:**
- Write, modify, or delete `**/*.test.ts` and `**/*.test.tsx` files
- Create `vitest.config.ts` and a test setup file (e.g., `src/setupTests.ts`)
- Add entries to `package.json` `devDependencies` and `scripts` only

**You MAY NOT:**
- Modify `src/App.tsx`, component source files, service files, slice files, or `vite.config.ts`
- Modify any source file that is not a test file

**When you find a bug:**
1. Write a failing test that demonstrates the bug — leave it failing. Do NOT skip it.
2. File a `bd` issue referencing the failing test and what it reveals.
3. Push. The failing test is the handoff signal to the dev agent.
4. Do NOT fix source code.

---

### Test Framework Setup

This repo has zero testing infrastructure. Do this first before writing any tests.

**Install dependencies:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom happy-dom @vitest/coverage-v8
```

**Create `vitest.config.ts`** at the repo root:
```typescript
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
```

**Create `src/setupTests.ts`:**
```typescript
import '@testing-library/jest-dom'
```

**Add to `package.json` scripts:**
```json
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage"
```

---

### Test Conventions

- **Colocation**: place test files next to source files — `src/utils/FinancialCalculations.test.ts`
- **Describe blocks**: match the export name — `describe('calculateSuggestedListPrice', ...)`
- **Test names**: plain English — `it('returns cost/0.3 when listPrice override is off', ...)`
- **Service mocking**: use `vi.mock` to mock axios / ImsClient
- **Custom hooks**: use `renderHook` from `@testing-library/react`

---

### Coverage Inventory

**Existing:** NONE — zero test files, zero testing infrastructure.

**Missing — work in this priority order:**

1. **`src/utils/FinancialCalculations.test.ts`** — 6 pure functions, no mocking needed.
   The JSDoc on each function has worked examples that map directly to test cases — use them.

2. **`src/utils/FormatUtils.test.ts`** — 2 formatter functions.
   Note: `formatPercent` multiplies by 100 before formatting — test this explicitly.

3. **`src/hooks/useSortableTable.test.ts`** — use `renderHook`.
   Test cases: default sort, toggle asc↔desc, key change resets direction to asc, null values sort to end.

4. **Redux slice tests** (`src/store/slices/*.test.ts`) — test reducers directly:
   ```typescript
   slice.reducer(state, action(...))
   ```
   Cover: `add`, `update`, `remove`, `setSelected`, and thunk `pending`/`fulfilled`/`rejected` states.

5. **Service tests** (`src/services/*.test.ts`) — mock `ImsClient`.
   Verify correct endpoints are called and `ApiResponse<T>` is unwrapped correctly
   (`response.data.data` for lists, `response.data.data[0]` for single items).

---

### Running Tests

```bash
npm run test          # watch mode (use while writing)
npm run test:run      # single pass (run before pushing)
npm run test:coverage # coverage report
```

---

### Dev ↔ QA Handoff Protocol

- **Dev → QA**: Dev writes feature, closes bd issue, optionally files `bd create --title "QA: ..."` follow-up.
- **QA picks up**: Run `bd ready`, read source to understand behavior, write tests.
- **QA finds a bug**: Write failing test (leave it failing, no skip) → `bd create` referencing the test → push.
- **Dev fixes bug**: QA confirms test passes, closes QA issue.

---

### Landing the Plane (QA Session Completion)

1. **Run all tests** — `npm run test:run` must pass before pushing (a failing test you intentionally left to signal a bug is the only exception — document it clearly in the bd issue)
2. **File issues for remaining work** — create `bd` issues for follow-up
3. **Update issue status** — close finished work, update in-progress items
4. **PUSH TO REMOTE** — this is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```

