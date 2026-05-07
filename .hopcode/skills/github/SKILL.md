---
name: github
description: >
  HopCode GitHub integration skill — covers the full `hopcode github` command
  suite (auth, status, commit, pr, issues), the built-in GitHub MCP client,
  and the five specialist GitHub subagents. Use when the user wants to interact
  with GitHub via HopCode: authenticate, create AI-generated commits or PRs,
  manage issues, trigger CI, review PRs, triage issues, cut releases, or scan
  for security alerts. Triggers on: "hopcode github", "auth", "commit",
  "create PR", "open issue", "github status", "github review", "CI failed",
  "release", "security scan", "github subagent".
when_to_use: >
  Use when the user asks about or wants to execute any GitHub workflow through
  HopCode: authentication, AI commits, PR creation/review, issue management,
  CI monitoring, release management, or security scanning.
---

## HopCode GitHub Integration

HopCode ships end-to-end GitHub support across three layers:

1. **CLI commands** — `hopcode github <subcommand>`
2. **MCP client** — `packages/core/src/mcp/github-mcp-client.ts`
3. **Subagents** — specialist AI agents for GitHub workflows

---

## Authentication

```bash
# OAuth Device Flow — no browser redirect, no callback URL
hopcode github auth

# After auth, token is saved to settings.env.GITHUB_TOKEN
# Verify
hopcode github status

# Clear saved token
hopcode github auth --logout
```

The device flow requires the `HopCode CLI` GitHub App client ID
(`HOPCODE_GITHUB_CLIENT_ID` env, fallback to the registered app ID).
Required app permissions: Contents R/W, Issues R/W, Pull Requests R/W,
Metadata R, Workflows R/W.

---

## Repository Status

```bash
hopcode github status
```

Shows: current branch, upstream repo, open PR count, latest commit, CI status,
issue count.

---

## AI-Generated Commits

```bash
hopcode github commit
```

Generates a Conventional Commits message from `git diff --staged`, with scope
and body inferred from the diff. Options:

- `--push` — commit and push in one step
- `--all` — stage all changes before committing (`git add -A`)
- `--dry-run` — preview message without committing

---

## Pull Request Management

```bash
# List open PRs
hopcode github pr list [--state open|closed|all]

# Create PR with AI-generated title + body
hopcode github pr create [--draft] [--base main]

# Review PR — AI analysis of diff, checks, suggestions
hopcode github pr review <number>

# Merge
hopcode github pr merge <number> [--squash|--rebase|--merge]
```

`hopcode github pr create` reads `git diff HEAD..origin/main`, calls the model
to draft a title and body following the `.github/pull_request_template.md`, then
calls the GitHub API (`POST /repos/:owner/:repo/pulls`).

---

## Issue Management

```bash
# List open issues
hopcode github issues list [--state open|closed|all] [--label NAME]

# Create issue with AI-generated description
hopcode github issues create --title "Short title"

# Close an issue
hopcode github issues close <number> [--comment "Fixed in #<pr>"]
```

---

## GitHub Subagents

Delegate complex GitHub workflows to specialist agents. These are registered in
`packages/core/src/agents/github-agents.ts`.

### `github-reviewer`

AI-powered PR reviewer. Runs full diff analysis, checks CI, identifies bugs,
security issues, and style violations, then returns structured feedback.

```
"Review PR #42 and leave comments"
→ Spawns github-reviewer
```

### `github-triager`

Issue triage specialist. Categorizes by type, finds duplicates, applies labels,
suggests assignees, writes initial responses.

```
"Triage all open issues without labels"
→ Spawns github-triager
```

### `github-ci-monitor`

CI/CD failure analyst. Reads workflow logs, identifies root causes, suggests
fixes for common build/test failures.

```
"Why is CI failing on main?"
→ Spawns github-ci-monitor
```

### `github-releaser`

Release coordinator. Generates changelogs from merged PRs, bumps version,
creates git tags, drafts GitHub releases with release notes.

```
"Cut a v1.5.0 release"
→ Spawns github-releaser
```

### `github-security-scanner`

Security reviewer. Checks Dependabot alerts, code scanning results, secret
scanning alerts, and recommends remediation.

```
"Show me all high-severity security alerts"
→ Spawns github-security-scanner
```

---

## MCP Server (GitHub API via MCP protocol)

For structured, schema-validated GitHub API calls, add the official MCP server:

```bash
hopcode mcp add github npx -- -y @modelcontextprotocol/server-github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=<your-token>

# List presets
hopcode mcp presets --category "Developer Tools"
```

Once connected, HopCode can call GitHub operations as typed MCP tools:
`create_issue`, `list_pull_requests`, `search_code`, `merge_pull_request`, etc.

See `references/hopcode-github-commands.md` for full command details.
See `references/github-subagents.md` for subagent system prompt details.

---

## Internal MCP Client

`packages/core/src/mcp/github-mcp-client.ts` (`GitHubMCPClient`) wraps the
GitHub REST API with typed methods. Used by the CLI commands internally:

- Auth via `GitHubAppAuth` (App + PAT support)
- Issues: `listIssues`, `createIssue`, `updateIssue`, `addIssueComment`
- PRs: `listPullRequests`, `createPullRequest`, `mergePullRequest`, `getPullRequestFiles`
- Workflows: `listWorkflows`, `triggerWorkflow`, `listWorkflowRuns`, `cancelWorkflowRun`
- Checks: `listCheckRuns`, `createCheckRun`, `updateCheckRun`

Env vars:

- `GITHUB_APP_ID` — GitHub App ID for installation-level auth
- `GITHUB_APP_PRIVATE_KEY` — GitHub App private key (PEM)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — OAuth app credentials
- `GITHUB_TOKEN` / `HOPCODE_GITHUB_TOKEN` — PAT for direct auth
