# GitHub Subagents Reference

HopCode ships five built-in GitHub specialist subagents registered in
`packages/core/src/agents/github-agents.ts`. Each has a focused system prompt,
constrained tool set, and an appropriate approval mode.

---

## `github-reviewer`

**Purpose**: Deep pull request review  
**Approval mode**: `auto-edit`  
**Tools**: Shell, ReadFile, Grep, Glob

### Capabilities

- Reads PR diff via `gh pr diff <number>`
- Reads changed files for full context
- Checks CI status via `gh pr checks <number>`
- Analyzes for: logic bugs, security issues (OWASP), performance, test gaps,
  convention adherence
- Returns structured review: summary → critical → important → suggestions

### Invocation

```
"Review PR #42"
"Do a full code review of pull request 88"
"Check PR 15 for security vulnerabilities"
```

### Output format

```
## Summary
[2-3 sentence overview of the change]

## Critical Issues
- [issue]: [file:line] — [explanation and fix]

## Important Issues
- ...

## Suggestions
- ...

## Overall: [Approve / Request Changes / Comment]
```

---

## `github-triager`

**Purpose**: Issue triage and initial response  
**Approval mode**: `auto-edit`  
**Tools**: Shell, Grep

### Capabilities

- Categorizes issue type: bug, enhancement, question, documentation, duplicate
- Searches existing issues for duplicates via Grep + `gh issue list`
- Applies appropriate labels via `gh issue edit --add-label`
- Suggests assignees based on codebase ownership patterns
- Writes an initial response comment via `gh issue comment`
- Determines priority: P0 (blocker) → P3 (low)

### Invocation

```
"Triage issue #78"
"Label and respond to all unlabeled issues"
"Find duplicate issues for bug report #99"
```

---

## `github-ci-monitor`

**Purpose**: CI/CD failure diagnosis  
**Approval mode**: `plan`  
**Tools**: Shell, ReadFile

### Capabilities

- Lists recent workflow runs via `gh run list`
- Reads full logs: `gh run view <id> --log-failed`
- Parses error messages, stack traces, test failures
- Identifies root cause categories:
  - Dependency / lockfile issues
  - TypeScript compilation errors
  - Test assertion failures
  - Network/timeout issues
  - Secret or permission issues
- Suggests fix steps (does NOT auto-apply — approval mode: plan)

### Invocation

```
"Why is CI failing on main?"
"Check the latest workflow run and explain the failure"
"What's wrong with the e2e tests in run 12345?"
```

---

## `github-releaser`

**Purpose**: Release coordination  
**Approval mode**: `plan`  
**Tools**: Shell, ReadFile, Edit

### Capabilities

- Lists merged PRs since last tag via `gh pr list --state merged`
- Groups by type: breaking changes, features, fixes, docs
- Generates changelog in Keep a Changelog format
- Bumps version in `package.json` (major/minor/patch per SemVer)
- Creates git tag + `gh release create` with release notes
- Manages draft → published release flow

### Invocation

```
"Cut a v1.5.0 release"
"Generate a changelog for all PRs merged since v1.4.0"
"Create a patch release fixing the auth bug"
```

---

## `github-security-scanner`

**Purpose**: Security alert review and remediation  
**Approval mode**: `plan`  
**Tools**: Shell, Grep, ReadFile

### Capabilities

- Dependabot vulnerability alerts: `gh api repos/:owner/:repo/dependabot/alerts`
- Code scanning alerts (CodeQL, Semgrep): `gh api repos/:owner/:repo/code-scanning/alerts`
- Secret scanning alerts: `gh api repos/:owner/:repo/secret-scanning/alerts`
- Groups by severity: critical, high, medium, low
- Recommends: upgrade commands, code fixes, or suppressions with justification

### Invocation

```
"Show all high-severity security alerts"
"Check if there are any exposed secrets in the repo"
"Review the Dependabot alerts and suggest fixes"
```

---

## Subagent Architecture

All GitHub subagents:

1. Use the `Shell` tool exclusively for GitHub API calls (via `gh` CLI)
2. Do NOT use the `GitHubMCPClient` directly (that's for CLI commands)
3. Follow the read-first principle: gather data before making changes
4. Avoid emojis in output (per system prompt convention)
5. Are registered via `GitHubSubagentRegistry` in `github-agents.ts`

### Registration

```typescript
// packages/core/src/agents/github-agents.ts
GitHubSubagentRegistry.getGitHubAgents(); // all 5 agents
GitHubSubagentRegistry.getGitHubAgent('github-reviewer'); // by name
GitHubSubagentRegistry.isGitHubAgent('github-ci-monitor'); // boolean check
GitHubSubagentRegistry.getGitHubAgentNames(); // string[]
```

### Adding a new GitHub subagent

1. Add entry to `GITHUB_AGENTS` array in `github-agents.ts`
2. Give it: `name`, `description`, `systemPrompt`, `tools`, `approvalMode`
3. Available tools: `ToolNames.SHELL`, `ToolNames.READ_FILE`, `ToolNames.GREP`,
   `ToolNames.GLOB`, `ToolNames.EDIT`
4. Approval modes: `'auto-edit'` (runs freely), `'plan'` (presents plan first),
   `'default'` (asks per-write-operation)
