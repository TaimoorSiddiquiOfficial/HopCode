# GitHub Integration Guide

**Version**: 1.0.0  
**Date**: 2026-04-24  
**Status**: Implementation Ready

---

## Overview

HopCode now includes native GitHub integration through:

1. **GitHub App Authentication** - JWT-based app authentication
2. **GitHub MCP Client** - Full GitHub API v3 coverage
3. **GitHub Subagents** - Specialized agents for GitHub workflows
4. **awesome-copilot Compatibility** - Skills and workflows integration

---

## GitHub App Setup

### Step 1: Create GitHub App

1. Go to GitHub Settings → Developer Settings → GitHub Apps
2. Click "New GitHub App"
3. Fill in app details:

```
Name: HopCode AI Agent
Homepage URL: https://hopcode.dev
Callback URL: https://hopcode.dev/auth/github/callback
```

### Step 2: Configure Permissions

**Repository Permissions:**

| Permission      | Access       | Description                    |
| --------------- | ------------ | ------------------------------ |
| Contents        | Read & Write | Read/write repository contents |
| Issues          | Read & Write | Manage issues                  |
| Pull requests   | Read & Write | Manage PRs                     |
| Workflows       | Read & Write | Trigger/manage workflows       |
| Actions         | Read & Write | Access workflow runs           |
| Checks          | Read & Write | Create check runs              |
| Commit statuses | Read & Write | Create commit statuses         |
| Members         | Read         | Read team members              |
| Metadata        | Read         | Always enabled                 |
| Projects        | Read & Write | Manage projects                |

**Organization Permissions:**

| Permission | Access       | Description         |
| ---------- | ------------ | ------------------- |
| Members    | Read         | Read team members   |
| Projects   | Read & Write | Manage org projects |

**User Permissions:**

| Permission | Access | Description       |
| ---------- | ------ | ----------------- |
| Email      | Read   | User email        |
| Profile    | Read   | User profile info |

### Step 3: Subscribe to Events

Enable these webhook events:

- Issues
- Issue comment
- Pull request
- Pull request review
- Pull request review comment
- Check run
- Check suite
- Workflow run
- Workflow dispatch

### Step 4: Generate Credentials

1. Generate Private Key (download PEM file)
2. Copy App ID
3. Generate Client Secret
4. Set Webhook Secret (for receiving events)
5. Set Webhook URL: `https://api.hopcode.dev/github/webhooks`

---

## Configuration

### Environment Variables

```bash
# GitHub App credentials
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_CLIENT_ID=Iv1.abcdef123456
GITHUB_CLIENT_SECRET=abcdef1234567890
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# Optional: GitHub Enterprise
GITHUB_ENTERPRISE_HOSTNAME=github.yourcompany.com
```

### Settings.json

Add to `~/.hopcode/settings.json`:

```json
{
  "github": {
    "appId": "123456",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "clientId": "Iv1.abcdef123456",
    "clientSecret": "abcdef1234567890",
    "webhookSecret": "your_webhook_secret",
    "hostname": "github.com"
  },
  "mcpServers": {
    "github": {
      "httpUrl": "https://api.githubcopilot.com/mcp/",
      "description": "GitHub MCP Server",
      "oauth": {
        "enabled": true,
        "provider": "github-app"
      }
    }
  }
}
```

---

## Usage

### GitHub Slash Commands

```bash
# Authenticate with GitHub
hopcode github auth

# List issues
hopcode github issues list --state open --label bug

# Get issue details
hopcode github issues get --number 123

# Create issue
hopcode github issues create --title "Bug: ..." --body "..." --label bug

# Review PR
hopcode github pr review --number 456

# Check CI status
hopcode github ci status --pr 456

# Trigger workflow
hopcode github workflow run --name "Deploy" --ref main
```

### GitHub Subagents

```bash
# Use GitHub reviewer agent
hopcode -p "/agent github-reviewer Review PR #456 for security issues"

# Use GitHub triager agent
hopcode -p "/agent github-triager Triage issue #789"

# Use GitHub CI monitor agent
hopcode -p "/agent github-ci-monitor Check why CI failed on main"

# Use GitHub releaser agent
hopcode -p "/agent github-releaser Create v1.2.3 release with changelog"

# Use GitHub security scanner agent
hopcode -p "/agent github-security-scanner Scan repo for vulnerabilities"
```

### MCP Tools

Available GitHub MCP tools:

**Issues:**

- `github.list_issues` - List issues with filters
- `github.get_issue` - Get issue details
- `github.create_issue` - Create new issue
- `github.update_issue` - Update issue
- `github.add_issue_comment` - Add comment

**Pull Requests:**

- `github.list_pull_requests` - List PRs
- `github.get_pull_request` - Get PR details
- `github.get_pull_request_files` - Get changed files
- `github.create_pull_request` - Create PR
- `github.update_pull_request` - Update PR
- `github.merge_pull_request` - Merge PR

**Workflows:**

- `github.list_workflows` - List workflows
- `github.trigger_workflow` - Trigger workflow
- `github.list_workflow_runs` - List runs
- `github.get_workflow_run` - Get run details
- `github.get_workflow_run_logs` - Get logs
- `github.cancel_workflow_run` - Cancel run
- `github.rerun_workflow_run` - Rerun run

**Checks:**

- `github.list_check_runs` - List check runs
- `github.create_check_run` - Create check run
- `github.update_check_run` - Update check run

---

## GitHub Actions Integration

### Example: HopCode PR Review Workflow

```yaml
# .github/workflows/hopcode-review.yml
name: HopCode PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      checks: read
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup HopCode
        uses: hoptrendy/setup-hopcode@v1
        with:
          github-app-id: ${{ secrets.GITHUB_APP_ID }}
          github-private-key: ${{ secrets.GITHUB_PRIVATE_KEY }}

      - name: Review PR
        run: |
          hopcode github auth
          hopcode -p "/agent github-reviewer Review this PR for code quality and best practices"
```

### Example: HopCode Issue Triage Workflow

```yaml
# .github/workflows/hopcode-triage.yml
name: HopCode Issue Triage

on:
  issues:
    types: [opened]

jobs:
  triage:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    steps:
      - name: Triage issue
        uses: hoptrendy/hopcode-triage@v1
        with:
          github-app-id: ${{ secrets.GITHUB_APP_ID }}
          github-private-key: ${{ secrets.GITHUB_PRIVATE_KEY }}
```

### Example: HopCode CI Monitor Workflow

```yaml
# .github/workflows/hopcode-ci-monitor.yml
name: HopCode CI Monitor

on:
  workflow_run:
    workflows: ['*']
    types: [completed]

jobs:
  analyze:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    permissions:
      actions: read
      checks: write
      issues: write
    steps:
      - name: Analyze failure
        uses: hoptrendy/hopcode-ci-analyzer@v1
        with:
          github-app-id: ${{ secrets.GITHUB_APP_ID }}
          github-private-key: ${{ secrets.GITHUB_PRIVATE_KEY }}
```

---

## awesome-copilot Integration

### Importing Skills

```bash
# Import awesome-copilot skills
hopcode skills add https://awesome-copilot.github.com/skills/github-reviewer/SKILL.md
hopcode skills add https://awesome-copilot.github.com/skills/issue-triage/SKILL.md
hopcode skills add https://awesome-copilot.github.com/skills/ci-monitor/SKILL.md

# List imported skills
hopcode skills list
```

### Using Workflows

```bash
# Import awesome-copilot workflows
hopcode workflows add https://awesome-copilot.github.com/workflows/pr-review.yml
hopcode workflows add https://awesome-copilot.github.com/workflows/issue-triage.yml

# List workflows
hopcode workflows list
```

---

## API Reference

### GitHubAppAuth

```typescript
import { GitHubAppAuth } from '@hoptrendy/hopcode-core';

const auth = new GitHubAppAuth({
  appId: '123456',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...',
});

// Get JWT token
const jwt = auth.generateJWT();

// Get installation token
const token = await auth.getInstallationToken(12345);

// Get token for repository
const repoToken = await auth.getTokenForRepository('owner', 'repo');
```

### GitHubMCPClient

```typescript
import { GitHubMCPClient } from '@hoptrendy/hopcode-core';

const client = new GitHubMCPClient(config);

// Issues
const issues = await client.listIssues('owner', 'repo', { state: 'open' });
const issue = await client.getIssue('owner', 'repo', 123);
await client.createIssue('owner', 'repo', { title: 'Bug', body: '...' });

// Pull Requests
const prs = await client.listPullRequests('owner', 'repo');
const pr = await client.getPullRequest('owner', 'repo', 456);
const files = await client.getPullRequestFiles('owner', 'repo', 456);

// Workflows
const workflows = await client.listWorkflows('owner', 'repo');
await client.triggerWorkflow('owner', 'repo', 'deploy.yml', { ref: 'main' });
const runs = await client.listWorkflowRuns('owner', 'repo', 'deploy.yml');

// Checks
const checks = await client.listCheckRuns('owner', 'repo', 'main');
await client.createCheckRun('owner', 'repo', { name: 'test', head_sha: '...' });
```

---

## Troubleshooting

### Authentication Errors

**Error**: `Failed to create installation token: 401`

**Solution**:

1. Verify App ID is correct
2. Check private key format (should include newlines)
3. Ensure app is installed on the repository

**Error**: `Rate limit exceeded`

**Solution**:

1. Use installation tokens (cached for 5 minutes)
2. Implement exponential backoff
3. Consider GitHub App rate limits (higher than OAuth)

### Permission Errors

**Error**: `Resource not accessible by integration`

**Solution**:

1. Check app permissions in GitHub Settings
2. Ensure repository granted access to app
3. Reinstall app with correct permissions

### Webhook Issues

**Error**: `Webhook signature verification failed`

**Solution**:

1. Verify webhook secret matches
2. Check webhook URL is accessible
3. Review webhook logs in GitHub App settings

---

## Security Best Practices

1. **Store secrets securely**: Use GitHub Secrets, never commit credentials
2. **Rotate keys regularly**: Regenerate private key every 90 days
3. **Use least privilege**: Only request necessary permissions
4. **Monitor app activity**: Review installed repositories and access logs
5. **Validate webhooks**: Always verify webhook signatures
6. **Token caching**: Cache installation tokens to reduce API calls

---

## Next Steps

1. **Create GitHub App** - Follow setup guide above
2. **Configure credentials** - Add to environment or settings.json
3. **Test authentication** - Run `hopcode github auth`
4. **Try subagents** - Use `/agent github-reviewer` on a PR
5. **Import skills** - Add awesome-copilot skills
6. **Setup workflows** - Add HopCode workflows to your repo

---

## Support

- **Documentation**: https://hopcode.dev/docs/github-integration
- **Issues**: https://github.com/TaimoorSiddiquiOfficial/HopCode/issues
- **Discussions**: https://github.com/TaimoorSiddiquiOfficial/HopCode/discussions
