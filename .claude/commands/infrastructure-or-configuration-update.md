---
name: infrastructure-or-configuration-update
description: Workflow command scaffold for infrastructure-or-configuration-update in HopCode.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /infrastructure-or-configuration-update

Use this workflow when working on **infrastructure-or-configuration-update** in `HopCode`.

## Goal

Updates build scripts, CI/CD workflows, or project configuration to improve build reliability, compatibility, or automation (e.g., updating how scripts are invoked, changing workflow policies).

## Common Files

- `package.json`
- `.github/workflows/*.yml`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit configuration or workflow files (e.g., package.json, .github/workflows/*.yml)
- Test changes locally or in CI
- Document rationale in commit message

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.