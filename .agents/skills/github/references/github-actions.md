# GitHub Actions Reference

Patterns for working with GitHub Actions CI/CD from HopCode.

## Checking CI Status

```bash
# Status for current branch's latest run
BRANCH=$(git rev-parse --abbrev-ref HEAD)
gh run list --branch "$BRANCH" --limit 1 \
  --json status,conclusion,databaseId,workflowName,startedAt

# All failing runs today
gh run list --status failure --limit 20 \
  --json databaseId,name,headBranch,conclusion,startedAt

# Check PR checks
gh pr checks <PR_NUMBER>
gh pr checks <PR_NUMBER> --json name,state,conclusion,link
```

## Reading Logs

```bash
# Full logs for a run
gh run view <RUN_ID> --log

# Only failed steps (most useful)
gh run view <RUN_ID> --log-failed

# Specific job logs
gh run view <RUN_ID> --json jobs \
  --jq '.jobs[] | select(.conclusion == "failure") | {name, steps: [.steps[] | select(.conclusion == "failure") | {name, number}]}'

# Download logs as files
gh run download <RUN_ID> --dir ./logs
```

## Triggering and Managing

```bash
# Trigger workflow_dispatch
gh workflow run ci.yml --ref main
gh workflow run release.yml --ref main -f version=v1.2.3

# Cancel stuck runs
gh run cancel <RUN_ID>

# Rerun only failed jobs (faster than full rerun)
gh run rerun <RUN_ID> --failed-only

# Rerun specific job
gh run view <RUN_ID> --json jobs --jq '.jobs[].databaseId'  # get job ID
gh run rerun <RUN_ID> --job <JOB_ID>
```

## Workflow File Patterns

### Standard CI workflow (HopCode pattern)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/npm-setup # HopCode composite action
      - run: npm run build
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
```

### Matrix strategy (test across Node versions)

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: ['20', '22']
        os: [ubuntu-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci && npm test
```

### Caching dependencies

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Release workflow (build → publish → release)

```yaml
name: Release
on:
  push:
    tags: ['v*.*.*']
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/npm-setup
      - run: npm run build && npm run bundle
      - run: npm publish --provenance
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - run: gh release create ${{ github.ref_name }} --generate-notes --latest
        env:
          GH_TOKEN: ${{ github.token }}
```

## Common Failure Patterns

| Failure                | Diagnosis                          | Fix                                  |
| ---------------------- | ---------------------------------- | ------------------------------------ |
| `npm ci` fails         | `package-lock.json` out of sync    | Run `npm install` and commit lock    |
| TypeScript errors      | `npm run typecheck` fails          | Fix type errors locally first        |
| Test timeout           | Test hangs or network call         | Add timeout, mock external deps      |
| Publish 403            | Missing `NPM_TOKEN` secret         | Set secret in repo settings          |
| Workflow not triggered | Branch protection / event mismatch | Check `on:` trigger and branch names |
| Concurrency cancel     | PR pushed twice quickly            | Expected — rerun if needed           |

## Security Best Practices

```yaml
# Pin actions to commit SHAs
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2

# Minimal permissions
permissions:
  contents: read        # default: restrict write
  pull-requests: write  # only what's needed

# No secrets in env at job level — pass per-step
- run: ./deploy.sh
  env:
    DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

# Prevent script injection from PR titles
- run: echo "PR title: $PR_TITLE"
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}   # via env, NOT ${{ }} inline
```

## Useful API Queries

```bash
# Get artifact download URL
gh api repos/:owner/:repo/actions/runs/<RUN_ID>/artifacts \
  --jq '.artifacts[] | {name, archive_download_url}'

# Get runner utilization
gh api repos/:owner/:repo/actions/runners \
  --jq '.runners[] | {name, status, busy}'

# List secrets (names only — values never returned)
gh secret list

# Check billing minutes used
gh api /repos/:owner/:repo/actions/billing/usage \
  --jq '{total_minutes_used, paid_minutes_used}'
```

## HopCode Workflows Overview

| Workflow                             | Trigger           | Purpose                              |
| ------------------------------------ | ----------------- | ------------------------------------ |
| `ci.yml`                             | push/PR           | Build, typecheck, lint, test         |
| `e2e.yml`                            | push/PR           | End-to-end integration tests         |
| `release.yml`                        | tag push          | Build + publish npm + GitHub release |
| `publish-npm.yml`                    | manual/tag        | Publish to npm registry              |
| `hopcode-pr-review.yml`              | PR events         | AI-powered PR review automation      |
| `hopcode-automated-issue-triage.yml` | issue created     | AI issue triage and labeling         |
| `hopcode-scheduled-issue-triage.yml` | schedule (weekly) | Batch issue maintenance              |
| `stale.yml`                          | schedule          | Close stale issues/PRs               |
| `terminal-bench.yml`                 | manual            | Performance benchmarks               |
