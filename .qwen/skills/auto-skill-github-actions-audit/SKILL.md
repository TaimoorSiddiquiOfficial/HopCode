---
name: github-actions-audit
description: Audit GitHub Actions workflows for version pinning, Node.js consistency, missing setup steps, divergent composite actions, and remediation planning — especially triage/release pipelines.
source: auto-skill
extracted_at: '2026-07-06T15:59:25.029Z'
---

# GitHub Actions Audit Skill

## When to use
- User asks to debug GitHub Actions workflow failures.
- User wants a list/plan of workflow errors, misconfigurations, or improvements.
- Need to enforce repo-wide conventions (Node version, action versions, cache setup) across `.github/workflows/*.yml`.

## Procedure

### 1. Inventory
- Glob `.github/workflows/*.yml`.
- Glob `.github/actions/**/action.yml` for composite actions.
- Read every workflow file. Do not skim — these files are small enough to read in full.

### 2. Establish policy baseline from the repo itself
- Read `.nvmrc` for the canonical Node major.
- Read root `package.json` (and `packages/*/package.json` if needed) for `engines.node`.
- Note the repo’s standard `actions/setup-node` version (SHA or tag) from a known-good workflow (e.g. `release.yml`, `ci.yml`).

### 3. Per-workflow checks

For each workflow, verify:
- `actions/setup-node` usage:
  - Is it present?
  - Is the action version pinned (SHA preferred, not major tag)?
  - Does `node-version` match the baseline (or use `node-version-file: '.nvmrc'`)?
  - Is `cache: 'npm'` + `cache-dependency-path: 'package-lock.json'` set where applicable?
- Runner image: do self-hosted runners (`ecs-*`) need explicit Node setup, or do they bake Node in? If self-hosted, flag as intentional.
- External composite actions:
  - Does the workflow call `owner/repo-action@sha`?
  - Can the external action’s Node version be determined from its source? If not, mark as **opacity risk**.
- Composite actions inside the repo:
  - Read `.github/actions/*/action.yml`.
  - Verify they match the repo-wide policy (same `setup-node` SHA, same Node version).

### 4. Error taxonomy
Use these labels consistently:

| Label | Meaning |
|-------|---------|
| **CRITICAL** | Wrong Node major / missing setup-node / security misconfig. Blocks correctness. |
| **CONFIRMED DIVERGENT** | Repo composite action uses different setup-node SHA or Node version than the repo baseline. |
| **CRITICAL GAP** | Workflow has no `actions/setup-node` at all, relying on runner defaults. |
| **MEDIUM (opacity risk)** | External composite action hides Node setup details. |
| **NO ERRORS** | Compliant with current policy. |

### 5. Verify before reporting
- Do not claim a setting is missing until you have read the full file.
- For workflows you have not yet read, mark them `UNREAD` and continue reading before finalizing the report.

### 6. Deliver the plan

Produce a prioritized, actionable list:

1. **Fix now** — direct errors (e.g. `hopcode-scheduled-issue-triage.yml` still uses Node 20 + v4).
2. **Fix now** — composite-action divergence (`npm-setup` using Node 24 + v4).
3. **Fix now** — missing setup-node (`hopcode-issue-followup-bot.yml`).
4. **Reduce risk** — external action opacity (`hopcode-triage.yml`, `hopcode-automated-issue-triage.yml`, `hopcode-autofix.yml` all call `TaimoorSiddiquiOfficial/HopCode-action@sha`).
5. **Stabilize** — workflow-specific improvements (e.g. add full-matrix test gate in `hopcode-autofix.yml`, tighten retries in release jobs).
6. **Optional** — consolidation or naming conventions for overlapping triage workflows.

For each item:
- State the file and line/section affected.
- State the current (wrong) value.
- State the desired value.
- Include the one-line `edit` command or PR summary line when possible.

## Notes / gotchas
- Self-hosted runners (`ecs-hopcode`, `ecs-qwen`) often have Node pre-baked; do not flag missing setup-node there unless the image tag is unknown.
- `actions/stale`, `docker/*`, CodeQL, Jekyll, and bash-only workflows do not need Node setup — do not flag them.
- `sync-cua-driver-to-oss.yml` can be intentionally a no-op; treat comments in the file as authoritative.
- Composite actions under `.github/actions/` are part of the repo and must conform to the same policy as workflows.