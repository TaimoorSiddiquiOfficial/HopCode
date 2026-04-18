# HopCode GitHub Actions Integration

Use HopCode with GitHub Actions to automate code tasks, triage issues, and review pull requests with AI.

## Quick Start

### 1. Run `/setup-github` in HopCode

Open HopCode in your project and run:

```
/setup-github
```

This will:

- Download all workflow templates into `.github/workflows/`
- Update `.gitignore` to exclude temporary HopCode files

### 2. Add Required Secrets

Go to your repository **Settings → Secrets and variables → Actions** and add:

| Secret           | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `OPENAI_API_KEY` | Your OpenAI API key (or replace with any supported provider) |

> **Using a different provider?** Replace `OPENAI_API_KEY` in the workflow files with your provider's key (e.g. `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY`). Update `hopcode auth openai` to `hopcode auth anthropic` etc.

### 3. Commit and Push the Workflows

```bash
git add .github/workflows/
git commit -m "chore: add HopCode AI workflows"
git push
```

---

## Included Workflows

### `hopcode-dispatch.yml` — Manual AI Tasks

Trigger HopCode manually from the Actions tab to perform any task.

**Trigger:** Actions → HopCode Dispatch → Run workflow

**Example tasks:**

- `"Refactor src/auth.ts to use async/await throughout"`
- `"Add JSDoc comments to all exported functions in src/utils/"`
- `"Fix the failing test in packages/api/tests/user.test.ts"`

---

### `hopcode-invoke.yml` — Comment Trigger

Invoke HopCode by commenting `/hopcode <task>` on any issue or PR.

**Example:**

```
/hopcode Add error handling to the login form
```

HopCode will check out the code, perform the task, and react with 👍 when done.

---

### `hopcode-triage.yml` — Auto-triage New Issues

Automatically labels and comments on new issues when they are opened or edited.

**What it does:**

- Applies labels (bug, enhancement, question, etc.)
- Adds a triage comment with next steps
- Notes duplicates or requests for more info

---

### `hopcode-scheduled-triage.yml` — Weekly Issue Triage

Runs every Monday at 9 AM UTC to triage any open unlabelled issues in bulk.

**Customise the schedule** by editing the `cron` value in the workflow file.

---

### `hopcode-review.yml` — Automated PR Review

Reviews pull requests for bugs, security issues, and code quality.

**Trigger:** Automatically on PR open, push, or ready-for-review (skips drafts)

---

## Supported AI Providers

HopCode works with any of these providers — just set the corresponding secret:

| Provider      | Secret Name         | Auth Command                |
| ------------- | ------------------- | --------------------------- |
| OpenAI        | `OPENAI_API_KEY`    | `hopcode auth openai`       |
| Anthropic     | `ANTHROPIC_API_KEY` | `hopcode auth anthropic`    |
| DeepSeek      | `DEEPSEEK_API_KEY`  | `hopcode auth deepseek`     |
| Groq          | `GROQ_API_KEY`      | `hopcode auth groq`         |
| Ollama Cloud  | `OLLAMA_API_KEY`    | `hopcode auth ollama-cloud` |
| Google Gemini | `GEMINI_API_KEY`    | `hopcode auth gemini`       |

---

## Configuration

### Using a Custom Model

Set the `model` input in `hopcode-dispatch.yml`, or set the `HOPCODE_MODEL` environment variable:

```yaml
env:
  HOPCODE_MODEL: deepseek/deepseek-chat
```

### Restricting Which PRs Get Reviewed

Edit `hopcode-review.yml` to add path filters:

```yaml
on:
  pull_request:
    paths:
      - 'src/**'
      - 'packages/**'
```

---

## Security Notes

- `GITHUB_TOKEN` is automatically provided by GitHub Actions — no setup needed
- API keys are stored as encrypted secrets — never commit them to source code
- Workflows run with least-privilege permissions (only `issues: write` or `pull-requests: write` as needed)
- HopCode never reads or exfiltrates your secrets — it uses them only to authenticate with AI providers

---

## Troubleshooting

**Workflow fails with "hopcode: command not found"**
Ensure the `npm install -g @hoptrendy/hopcode-cli` step runs before any `hopcode` commands.

**AI provider authentication fails**
Check that your secret (e.g. `OPENAI_API_KEY`) is set in Settings → Secrets → Actions.

**`/setup-github` downloads fail with 404**
Ensure you're on the latest version of HopCode: `npm update -g @hoptrendy/hopcode-cli`
