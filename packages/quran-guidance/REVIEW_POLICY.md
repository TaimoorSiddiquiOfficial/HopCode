# Review Policy

This document defines the review process for contributions to the
guidance system data files in this package.

## Why review is required

The guidance data files (`ayah-guidance.ts`, `situation-angle-map.ts`,
`response-patterns.ts`, `izn-behavior-rules.ts`) shape agent behavior
for all HopCode users. Incorrect or poorly-calibrated guidance can
degrade the agent experience and, in the case of Izn mode safety rules,
compromise user trust.

## What requires review

| Change                           | Review level                    | Who                           |
| -------------------------------- | ------------------------------- | ----------------------------- |
| New ayah or guidance entry       | Full technical + content review | 2 maintainers                 |
| Modified strategy or angle       | Full technical + content review | 2 maintainers                 |
| Modified situation-angle mapping | Content + impact assessment     | 2 maintainers                 |
| Modified Izn gate categories     | Full security review            | 2 maintainers, security-aware |
| Typo fixes, formatting           | Changelog-only                  | 1 maintainer                  |
| Test-only changes                | Standard PR review              | 1 maintainer                  |

## Review checklist

### For guidance data changes

- [ ] Source citation is present and verifiable (surah:ayah or canonical reference)
- [ ] Translation is accurate and attributed to a recognized translation
- [ ] The `strategy` and `tone` fields are appropriate for the mapped situation
- [ ] `useWhen` conditions are correctly scoped (not overly broad or narrow)
- [ ] New entries do not duplicate existing guidance
- [ ] Tests pass (`npx vitest run`)
- [ ] No regressions: existing snapshot tests still pass

### For Izn gate changes

- [ ] Each added destructive category has a clear, well-defined scope
- [ ] False positives are minimized (normal operations not flagged)
- [ ] False negatives are unacceptable (destructive actions not missed)
- [ ] The `selfVerify` prompt for each category is clear and actionable
- [ ] Test coverage exists for both gate-pass and gate-fail paths

## Process

1. Open a PR with the proposed data change
2. Request review from at least the required number of maintainers
3. Address all review comments
4. CI must be green (build + typecheck + tests)
5. Merge after approval

## Prohibited contributions

- Guidance entries without a canonical source reference
- Invented or paraphrased content presented as canonical
- Guidance that shames, mocks, or belittles users
- Guidance that recommends harmful or illegal actions
- Izn gate modifications that weaken safety without documented justification
