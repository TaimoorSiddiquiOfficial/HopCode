---
name: github
description: >
  Full GitHub integration skill — issues, pull requests, code review, CI/CD
  monitoring, releases, security scanning, and code search. Use when asked to
  interact with GitHub repositories: create or review PRs, triage issues, check
  workflow runs, search code, manage releases, or scan for security alerts.
  Triggers on: "open PR", "review PR", "create issue", "check CI", "list issues",
  "merge PR", "GitHub Actions", "workflow failed", "release", "code search",
  "security alerts", "dependabot", "gh", "GitHub API", "hopcode github".
when_to_use: >
  Use when the user's request involves any GitHub operation: pull requests,
  issues, CI/CD workflows, releases, code search, repository management, or
  GitHub security features.
---

## GitHub Integration in HopCode

HopCode ships full GitHub integration across three layers:

1. **`gh` CLI** — the primary tool for all GitHub operations
2. **GitHub MCP Server** — structured tool API via `hopcode mcp add github`
3. **Built-in commands** — `hopcode github auth|status|commit|pr|issues`
4. **Subagents** — specialist agents for review, triage, CI, releases, security

---

## Tool Selection Guide

| Task                                   | Preferred Tool             |
| -------------------------------------- | -------------------------- |
| PR review, issue management, CI checks | `gh` CLI via Shell tool    |
| Structured API calls with schema       | GitHub MCP server          |
| Auth setup                             | `hopcode github auth`      |
| AI-generated commit messages           | `hopcode github commit`    |
| PR creation with AI body               | `hopcode github pr create` |
| Delegation to specialist               | Spawn subagent             |

---

## Authentication

```bash
# Device flow — no browser redirect needed
hopcode github auth

# Or export token directly
export GITHUB_TOKEN=ghp_...

# Verify
gh auth status
gh api user --jq .login
```

---

## Pull Requests

### List and inspect

```bash
gh pr list                                  # open PRs in current repo
gh pr list --state all --limit 20
gh pr view <number>                         # PR details
gh pr view <number> --json title,body,state,mergeable,additions,deletions
gh pr diff <number>                         # full diff
gh pr checks <number>                       # CI check status
gh pr review-requests                       # PRs waiting for your review
```

### Create

```bash
# AI-generated title + body from current branch diff
hopcode github pr create

# Manual
gh pr create --title "feat: add X" --body "..." --base main --draft
gh pr create --fill   # title+body from commits
```

### Review and merge

```bash
gh pr review <number> --approve
gh pr review <number> --request-changes --body "Please fix..."
gh pr review <number> --comment --body "Looks good, one nit..."
gh pr merge <number> --squash --delete-branch
gh pr merge <number> --rebase
```

---

## Issues

### List and triage

```bash
gh issue list                               # open issues
gh issue list --label bug --assignee @me
gh issue list --state all --limit 50 --json number,title,labels,assignees
gh issue view <number>
gh issue view <number> --json title,body,comments,labels
```

### Create and update

```bash
# AI-generated description
hopcode github issues create

# Manual
gh issue create --title "Bug: ..." --body "..." --label bug
gh issue edit <number> --add-label "good first issue"
gh issue edit <number> --add-assignee @me
gh issue close <number> --comment "Fixed in #<pr>"
```

---

## CI/CD — GitHub Actions

```bash
# Workflow runs
gh run list                                 # recent runs
gh run list --workflow ci.yml --branch main
gh run view <run-id>                        # run details
gh run view <run-id> --log                  # full logs
gh run view <run-id> --log-failed           # only failed steps

# Trigger and cancel
gh workflow run ci.yml --ref main
gh run cancel <run-id>
gh run rerun <run-id> --failed-only

# Check specific jobs
gh run view <run-id> --json jobs --jq '.jobs[] | {name, conclusion, steps: [.steps[] | select(.conclusion == "failure")]}'
```

---

## Code Search

```bash
# Search code across GitHub (requires gh extension or API)
gh api search/code -f q='repo:owner/repo pattern' --jq '.items[].path'

# Search within current repo using grep/ripgrep
grep -r "pattern" --include="*.ts" src/

# Search commits
gh api repos/:owner/:repo/commits --jq '.[].commit.message' | grep "pattern"
```

---

## Releases and Tags

```bash
# List releases
gh release list

# Create release with auto-generated notes
gh release create v1.2.3 --generate-notes --latest

# Create draft release
gh release create v1.2.3 --draft --notes "## Changes..."

# Upload assets
gh release upload v1.2.3 dist/app-linux.tar.gz dist/app-macos.tar.gz

# Delete release
gh release delete v1.2.3 --yes
```

---

## Repository Management

```bash
# Repo info
gh repo view
gh repo view owner/repo --json name,description,topics,stargazers_count

# Clone, fork, create
gh repo clone owner/repo
gh repo fork owner/repo --clone
gh repo create my-new-repo --public --source=.

# Branch management
gh api repos/:owner/:repo/branches --jq '.[].name'
gh api repos/:owner/:repo/branches/:branch/protection  # check protection rules

# Secrets and variables
gh secret set API_KEY --body "value"
gh variable set ENV --body "production"
gh secret list
```

---

## Security

```bash
# Dependabot alerts
gh api repos/:owner/:repo/dependabot/alerts --jq '.[] | {number, severity: .security_advisory.severity, package: .dependency.package.name}'

# Code scanning alerts
gh api repos/:owner/:repo/code-scanning/alerts --jq '.[] | {number, rule_id: .rule.id, severity: .rule.severity, path: .most_recent_instance.location.path}'

# Secret scanning alerts
gh api repos/:owner/:repo/secret-scanning/alerts --jq '.[] | {number, secret_type, state}'
```

---

## HopCode Subagents for GitHub

Delegate to specialist agents for complex tasks:

```
Spawn github-reviewer    → deep PR review with structured feedback
Spawn github-triager     → issue triage, labeling, duplicate detection
Spawn github-ci-monitor  → CI failure analysis, log parsing, fix suggestions
Spawn github-releaser    → changelog generation, semantic versioning, release coordination
Spawn github-security-scanner → Dependabot + code scanning + secret scanning review
```

---

## GitHub MCP Server (Structured API)

Add the GitHub MCP server for schema-validated tool calls:

```bash
hopcode mcp add github npx -- -y @modelcontextprotocol/server-github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=<your-token>
```

Once added, the model can call GitHub operations as structured tool calls
(create_issue, list_pull_requests, search_code, etc.) without shell invocation.

See `references/github-mcp.md` for full tool listing.

---

## Repo Context Auto-Detection

HopCode detects the current repo owner/repo from `git remote get-url origin`.
Most commands work without specifying owner/repo when run inside a git repo.

```bash
# Current repo detection
git remote get-url origin
# → https://github.com/owner/repo.git or git@github.com:owner/repo.git
```

See `references/github-cli.md` for full `gh` CLI reference.
See `references/github-actions.md` for GitHub Actions patterns.
