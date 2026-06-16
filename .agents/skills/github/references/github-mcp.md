# GitHub MCP Server Reference

The GitHub MCP server provides structured, schema-validated tool calls for
GitHub operations. It wraps the GitHub REST/GraphQL API and exposes tools the
model can call directly — no shell invocation required.

## Setup

```bash
# Add to HopCode settings
hopcode mcp add github npx -- -y @modelcontextprotocol/server-github \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token

# Or set in .hopcode/settings.json
```

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      },
      "trust": true
    }
  }
}
```

Verify: `hopcode mcp list` should show `github` as connected.

---

## Available Tools

### Repository

| Tool                  | Description                                       |
| --------------------- | ------------------------------------------------- |
| `get_file_contents`   | Get file/directory contents (path, ref optional)  |
| `search_repositories` | Search repos by query                             |
| `create_repository`   | Create a new repository                           |
| `fork_repository`     | Fork a repo                                       |
| `list_branches`       | List branches in a repo                           |
| `list_commits`        | List commits (branch, path, since, until filters) |
| `get_commit`          | Get commit details + diff                         |

### Issues

| Tool                | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `list_issues`       | List issues (state, labels, assignee, since filters) |
| `get_issue`         | Get single issue details                             |
| `create_issue`      | Create issue (title, body, assignees, labels)        |
| `update_issue`      | Update issue (title, body, state, labels, assignees) |
| `add_issue_comment` | Add comment to issue                                 |
| `search_issues`     | Search issues/PRs with GitHub search syntax          |

### Pull Requests

| Tool                              | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `list_pull_requests`              | List PRs (state, head, base, sort filters)      |
| `get_pull_request`                | Get PR details                                  |
| `get_pull_request_files`          | List files changed in PR                        |
| `get_pull_request_reviews`        | List PR reviews                                 |
| `create_pull_request`             | Create PR (title, body, head, base, draft)      |
| `merge_pull_request`              | Merge PR (merge/squash/rebase method)           |
| `update_pull_request_branch`      | Update PR branch (rebase onto base)             |
| `create_pull_request_review`      | Submit review (approve/request-changes/comment) |
| `add_pull_request_review_comment` | Add line comment to PR diff                     |

### Code Search

| Tool           | Description               |
| -------------- | ------------------------- |
| `search_code`  | Search code across GitHub |
| `search_users` | Search users              |

### GitHub Actions

| Tool                     | Description                              |
| ------------------------ | ---------------------------------------- |
| `list_workflows`         | List repo workflows                      |
| `list_workflow_runs`     | List runs for a workflow                 |
| `get_workflow_run`       | Get run details + status                 |
| `list_workflow_run_jobs` | List jobs for a run                      |
| `get_workflow_run_logs`  | Download run logs                        |
| `trigger_workflow`       | Trigger workflow dispatch (ref + inputs) |
| `cancel_workflow_run`    | Cancel a running workflow                |
| `rerun_workflow_run`     | Rerun a workflow (all or failed-only)    |

---

## HopCode Internal MCP Client

`packages/core/src/mcp/github-mcp-client.ts` provides a typed TypeScript
client wrapping the same GitHub REST API. It's used internally by:

- `hopcode github pr` commands
- `hopcode github issues` commands
- GitHub subagents (`github-reviewer`, `github-triager`, etc.)

### Usage in custom code

```typescript
import { createGitHubMCPClient } from '@hoptrendy/hopcode-core/mcp/github-mcp-client';

const client = createGitHubMCPClient(config);

// Issues
const issues = await client.listIssues('owner', 'repo', {
  state: 'open',
  per_page: 25,
});
await client.createIssue('owner', 'repo', {
  title: 'Bug: ...',
  body: '...',
  labels: ['bug'],
});

// Pull Requests
const prs = await client.listPullRequests('owner', 'repo', { state: 'open' });
await client.createPullRequest('owner', 'repo', {
  title: '...',
  head: 'feat/x',
  base: 'main',
});
await client.mergePullRequest('owner', 'repo', 123, { merge_method: 'squash' });

// Workflows
const workflows = await client.listWorkflows('owner', 'repo');
await client.triggerWorkflow('owner', 'repo', 'ci.yml', { ref: 'main' });
const runs = await client.listWorkflowRuns('owner', 'repo', 'ci.yml', {
  status: 'completed',
});

// Check runs
const checks = await client.listCheckRuns('owner', 'repo', 'sha');
await client.createCheckRun('owner', 'repo', {
  name: 'HopCode Check',
  head_sha: 'sha',
  status: 'completed',
  conclusion: 'success',
  output: { title: 'All checks passed', summary: '✓ 42 tests' },
});
```

---

## Token Scopes Required

| Feature                    | Required Scopes           |
| -------------------------- | ------------------------- |
| Read public repos          | (none)                    |
| Read private repos         | `repo`                    |
| Create/update issues & PRs | `repo`                    |
| Trigger workflows          | `workflow`                |
| Manage releases            | `repo`                    |
| Read security alerts       | `repo`, `security_events` |
| Manage org secrets         | `admin:org`               |

Recommended scope for full HopCode integration:

```
repo, workflow, read:org, read:user, gist
```

---

## Troubleshooting

```bash
# Check MCP server connection
hopcode mcp list

# Test token manually
gh auth status
gh api user --jq .login

# Debug MCP calls
HOPCODE_DEBUG=GITHUB_MCP hopcode "list open PRs"

# Reconnect if stale
hopcode mcp reconnect github
```
