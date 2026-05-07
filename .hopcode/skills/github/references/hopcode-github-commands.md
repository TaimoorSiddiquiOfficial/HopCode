# HopCode GitHub Commands Reference

Full reference for the `hopcode github` command group.

## Command Tree

```
hopcode github
├── auth          — authenticate via OAuth Device Flow
├── status        — repo overview (branch, PR count, CI status)
├── commit        — AI-generated commit message
├── pr
│   ├── create    — AI-generated PR title + body
│   ├── list      — list pull requests
│   ├── review    — AI code review of PR diff
│   └── merge     — merge a PR
└── issues
    ├── list      — list issues
    ├── create    — create issue with AI description
    └── close     — close an issue
```

---

## `hopcode github auth`

Authenticates with GitHub using RFC 8628 Device Flow.

```bash
hopcode github auth                 # start device flow
hopcode github auth --logout        # clear saved token
```

Flow:

1. `POST /login/device/code` → receive `device_code` + `user_code`
2. User visits `https://github.com/login/device` and enters `user_code`
3. CLI polls `/login/oauth/access_token` until confirmed
4. Token saved to HopCode settings (`settings.env.GITHUB_TOKEN`)

Required OAuth scopes: `repo`, `workflow`, `read:org`, `read:user`

---

## `hopcode github status`

Shows current repo health overview:

- Current branch + upstream remote URL
- Open PR count (for current branch if applicable)
- Latest commit SHA + message
- CI status of HEAD commit
- Open issue count
- Auth status (logged in as `@login`)

```bash
hopcode github status
hopcode github status --json        # machine-readable output
```

---

## `hopcode github commit`

AI-generated commit message from staged diff.

```bash
hopcode github commit               # stage nothing extra, use current staged diff
hopcode github commit --all         # git add -A first
hopcode github commit --push        # commit + push to upstream
hopcode github commit --dry-run     # print message only, no commit
hopcode github commit --sign        # GPG-sign the commit
```

Generates Conventional Commits format:

```
feat(core): add GitHub MCP client for structured API access

Adds GitHubMCPClient wrapping REST endpoints for issues, PRs,
workflows, and check runs. Uses GitHubAppAuth for installation-
level token management with automatic retry on 401.
```

---

## `hopcode github pr list`

```bash
hopcode github pr list
hopcode github pr list --state all
hopcode github pr list --state closed --limit 20
hopcode github pr list --json               # JSON array output
```

Fields shown: number, title, author, branch, state, created_at, CI status.

---

## `hopcode github pr create`

AI-generated PR based on `git diff HEAD..$(git rev-parse --abbrev-ref --symbolic-full-name @{u})`.

```bash
hopcode github pr create
hopcode github pr create --draft
hopcode github pr create --base main
hopcode github pr create --title "override title"    # skip AI title generation
hopcode github pr create --no-body                   # skip AI body generation
```

Uses `.github/pull_request_template.md` if present to structure the body.
Posts `POST /repos/:owner/:repo/pulls` after user confirmation.

---

## `hopcode github pr review <number>`

AI code review of a PR's diff.

```bash
hopcode github pr review 42
hopcode github pr review 42 --post      # post review comments via API
hopcode github pr review 42 --approve   # post approval after review
hopcode github pr review 42 --output json
```

Fetches diff + file list, runs model analysis for:

- Correctness and logic bugs
- Security vulnerabilities (OWASP)
- Performance concerns
- Test coverage gaps
- Style and convention adherence

---

## `hopcode github pr merge <number>`

```bash
hopcode github pr merge 42              # default: merge commit
hopcode github pr merge 42 --squash     # squash all commits
hopcode github pr merge 42 --rebase     # rebase onto base branch
hopcode github pr merge 42 --delete-branch   # delete head branch after merge
```

Checks that all required status checks pass before merging.

---

## `hopcode github issues list`

```bash
hopcode github issues list
hopcode github issues list --state closed
hopcode github issues list --label bug --label "good first issue"
hopcode github issues list --assignee @me
hopcode github issues list --json
```

---

## `hopcode github issues create`

AI generates body from `--title` + repo context.

```bash
hopcode github issues create --title "Button click handler throws on Safari"
hopcode github issues create --title "..." --label bug --label safari
hopcode github issues create --title "..." --no-ai    # blank body template
```

---

## `hopcode github issues close <number>`

```bash
hopcode github issues close 123
hopcode github issues close 123 --comment "Fixed in #456"
hopcode github issues close 123 --reason not_planned
```

---

## Environment Variables

| Variable                   | Description                               |
| -------------------------- | ----------------------------------------- |
| `GITHUB_TOKEN`             | Personal access token (PAT)               |
| `HOPCODE_GITHUB_TOKEN`     | HopCode-specific token (takes precedence) |
| `HOPCODE_GITHUB_CLIENT_ID` | GitHub App Client ID for device flow      |
| `GITHUB_APP_ID`            | GitHub App ID for app-level auth          |
| `GITHUB_APP_PRIVATE_KEY`   | GitHub App private key (PEM string)       |
| `GITHUB_CLIENT_ID`         | OAuth app client ID                       |
| `GITHUB_CLIENT_SECRET`     | OAuth app client secret                   |

---

## Token Storage

Tokens are saved in HopCode project settings:

```json
// .hopcode/settings.json
{
  "env": {
    "GITHUB_TOKEN": "ghp_..."
  }
}
```

Or in user-level settings: `~/.hopcode/settings.json`
