---
name: merge-upstream-with-conflict-resolution
description: Workflow command scaffold for merge-upstream-with-conflict-resolution in HopCode.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /merge-upstream-with-conflict-resolution

Use this workflow when working on **merge-upstream-with-conflict-resolution** in `HopCode`.

## Goal

Merges upstream changes into the current fork, applies conflict resolution, and ensures project-specific customizations (such as branding or architecture) are preserved.

## Common Files

- `.github/workflows/*.yml`
- `docs/plans/*.md`
- `package.json`
- `packages/*/src/**/*.ts`
- `packages/*/src/**/*.tsx`
- `packages/*/src/**/*.test.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Fetch and merge upstream branch
- Resolve file conflicts, especially in shared or heavily modified files
- Preserve local branding, architecture, and configuration
- Summarize merged features and conflict resolutions in commit message

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.