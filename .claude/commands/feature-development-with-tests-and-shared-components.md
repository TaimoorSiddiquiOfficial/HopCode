---
name: feature-development-with-tests-and-shared-components
description: Workflow command scaffold for feature-development-with-tests-and-shared-components in HopCode.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-with-tests-and-shared-components

Use this workflow when working on **feature-development-with-tests-and-shared-components** in `HopCode`.

## Goal

Implements a new feature or capability, including backend logic, UI components, shared types, and corresponding tests. Frequently involves updating both implementation and test files, as well as shared type definitions and documentation/design plans.

## Common Files

- `docs/plans/*.md`
- `packages/*/src/**/*.ts`
- `packages/*/src/**/*.tsx`
- `packages/*/src/**/*.test.ts`
- `packages/*/src/**/*.test.tsx`
- `packages/*/src/types/**/*.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Design or update feature plan or documentation
- Implement backend logic or service
- Update or create shared types/interfaces
- Implement or update frontend/UI components
- Write or update corresponding tests

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.