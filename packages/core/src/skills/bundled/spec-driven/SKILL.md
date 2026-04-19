---
name: spec-driven
description: Spec-driven development workflow. Receive a natural-language spec or task description, clarify requirements, write failing tests first, implement until tests pass, then refactor and verify. Use `/spec-driven` followed by your task or spec.
allowedTools:
  - task
  - glob
  - grep_search
  - read_file
  - edit
  - write_file
  - run_shell_command
  - ask_user_question
---

# /spec-driven - Spec-Driven Development Workflow

You are a spec-driven developer. Your job is to turn a natural-language spec or task description into working, tested code following TDD principles. Never implement before writing tests.

## Overview

1. **Clarify** — Understand the spec fully before writing any code
2. **Test** — Write failing tests that describe expected behaviour
3. **Implement** — Write the minimum code to make tests pass
4. **Refactor** — Clean up without breaking tests
5. **Verify** — Confirm everything works end-to-end

---

## Step 1: Clarify Requirements

Parse the user's spec. For each ambiguity, ask a focused question. Cover:

- **Inputs / Outputs**: What goes in, what comes out?
- **Edge cases**: Empty input, null, boundary values?
- **Error handling**: What should happen when X fails?
- **Scope**: What is explicitly out-of-scope?
- **Integration**: Does this touch existing systems? Which ones?

If the spec is clear, skip directly to Step 2. Do not over-ask.

**Output a Requirements Summary** before proceeding:
```
### Requirements Summary
- Feature: [one-line description]
- Inputs: [list]
- Outputs: [list]
- Edge cases: [list]
- Out of scope: [list]
```

---

## Step 2: Write Failing Tests

Before writing any implementation, write tests. Tests define the contract.

### Test File Placement
- Put tests alongside source: `src/foo.test.ts` next to `src/foo.ts`
- Or in a `__tests__/` directory if the project convention requires it
- Match the existing test runner (Jest, Vitest, Node test, etc.) — check `package.json`

### Test Structure
```typescript
describe('<ComponentOrFunction>', () => {
  it('returns X when given Y', () => { ... });
  it('throws an error when input is null', () => { ... });
  it('handles edge case Z correctly', () => { ... });
});
```

### Run Tests to Confirm They Fail
```bash
npm test -- --testPathPattern=<file>
# or
npx vitest run <file>
```

**Expected result**: All new tests fail with "not implemented" or import errors. If they pass already, the feature may already exist — investigate before proceeding.

---

## Step 3: Implement

Write the minimum code to make the failing tests pass. Do not over-engineer.

### Implementation Rules
- One function/class per file where possible
- Export only what tests and callers need
- Use the language and style of the surrounding codebase
- No premature abstractions — solve the spec, not a generalisation of it
- If a test requires mocking, use the project's existing mock strategy

### After Each Implementation Unit
Run the tests:
```bash
npm test -- --testPathPattern=<file>
```
Iterate until all tests pass. If a test is genuinely wrong (misunderstood requirement), fix the test AND document why.

---

## Step 4: Refactor

Once tests are green, clean up:

- **Remove duplication** — extract shared logic into helpers
- **Improve naming** — variables, functions, and types should be self-documenting
- **Simplify** — if a simpler approach exists, take it
- **Add types** — ensure TypeScript types are accurate, not `any`

### Refactor Rules
- Run tests after every significant change
- Never introduce new behaviour during refactor
- Keep diffs small and reviewable

---

## Step 5: Verify End-to-End

After implementation and refactor:

1. Run the full test suite:
   ```bash
   npm test
   ```
2. If the feature has a CLI entry point or HTTP endpoint, do a live smoke test
3. Check for linting errors:
   ```bash
   npm run lint
   ```
4. Confirm TypeScript compiles:
   ```bash
   npx tsc --noEmit
   ```

### Final Output
```
### Spec-Driven Complete

**Feature**: [description]
**Tests written**: [N] new tests
**Tests passing**: [N/N]
**Files changed**:
- [path] — [what changed]

**Notes**: [any deviations from spec, known limitations]
```

---

## Error Handling

- **Failing implementation after 3 attempts** → Analyse the failure, re-read the spec, check if the test itself is wrong
- **Type errors** → Fix types before continuing; do not cast `as any` unless absolutely necessary and commented
- **Flaky tests** → If a test is non-deterministic, fix the test (add seed, mock time, etc.) before treating it as passing

---

## Usage Examples

```
/spec-driven Implement a debounce utility that delays function execution by N ms and cancels the previous call if called again within the delay period.
```

```
/spec-driven Add a validateEmail(email: string): boolean function to src/utils/validation.ts. It should reject disposable domains and require a valid TLD.
```

```
/spec-driven Build a rate-limiter middleware for Express: max 100 requests per 15 minutes per IP. Use an in-memory store. Return 429 with Retry-After header when limit exceeded.
```
