---
name: quran-guidance-package
description: Reusable verification and scope discipline for changes touching the @hopcode/quran-guidance package.
source: auto-skill
extracted_at: '2026-06-12T12:00:58.542Z'
---

# Quran Guidance Package Workflow

When working on `@hopcode/quran-guidance`, keep the package narrowly focused on
behavior prompts, classification, guidance resolution, and Izn gate helpers.
Do not add speculative features or abstractions for one-off behavior.

## Scope Discipline

- Prefer the smallest source change that fixes the current issue.
- Keep Quran guidance as a behavior framework, not as decoration or extra
  religious content.
- Do not invent new Quran meanings or tafsir in prompts/data.
- If touching Izn gate behavior, remember the gate is a pre-execution
  verification workflow, not a hard-blocking mechanism.
- The Izn gate should only apply to `run_shell_command`; file/edit/search tools
  should not be treated as destructive execution.

## Root Build Order

If core integration depends on generated or compiled `@hopcode/quran-guidance`
outputs, ensure root build order builds `packages/quran-guidance` before
`packages/core`. This matters for clean CI flows where `npm ci` does not reuse
existing `dist/` artifacts.

Verify with the root build after touching this dependency boundary:

```bash
npm run build
```

If you only need package-level verification, use the package checks below.

## Verification Order

Run package-level checks from the package directory, not from the repo root:

```bash
cd packages/quran-guidance
npm test
npm run build
```

Expected package behavior:

- Tests should pass without changing fixtures.
- Build should produce no TypeScript errors.
- Data validation tests should catch invalid Quranic angle names and duplicate
  ayah references.

If the change affects core integration, run the targeted core Izn gate test:

```bash
cd packages/core
npx vitest run src/confirmation-bus/iznGateHandler.test.ts
```

Then confirm the workspace is clean unless intentional source changes are
expected:

```bash
git status --short
```

## Test Selection

Use focused tests first:

- `src/tests/izn-gate.test.ts` for Izn gate category detection, escalation, and
  scope reports.
- `src/tests/evaluation-cases.test.ts` for high-level behavioral expectations.
- `src/tests/compose-agent-behavior.test.ts` for prompt formatting.
- `src/tests/data-validation.test.ts` for curated data integrity.
- `packages/core/src/confirmation-bus/iznGateHandler.test.ts` when core uses
  `checkIznGate` or `reportIznScope`.

Avoid running the entire monorepo suite unless a broad integration change
requires it.

## Common Pitfalls

- Do not retry a blocked Izn command without completing the gate's verification
  plan and intent clarification.
- Do not change command text when retrying a hash-based Izn gate bypass; the
  retry must match the blocked command.
- Do not assume a behavior prompt should include ayah text unless MCP enrichment
  is explicitly part of the path.
- Do not add new package dependencies unless the behavior cannot be implemented
  with existing utilities.

## Completion Signal

A Quran guidance change is ready when:

- Package tests pass.
- Package build passes.
- Targeted core tests pass if core integration was touched.
- `git status` is clean or only contains the intended source/test changes.
