# `gh` CLI Reference for HopCode

Quick reference for the GitHub CLI (`gh`). All commands run against the repo
detected from the current directory's `git remote get-url origin`.

## Core Flags

| Flag                | Description                            |
| ------------------- | -------------------------------------- |
| `--repo owner/repo` | Override repo (default: auto-detected) |
| `--json fields`     | Output specific JSON fields            |
| `--jq expr`         | Filter JSON output with jq             |
| `--limit N`         | Cap results                            |
| `-y / --yes`        | Skip confirmation prompts              |
| `--dry-run`         | Preview without executing              |

---

## Pull Requests

```bash
# List
gh pr list [--state open|closed|all] [--label NAME] [--author LOGIN] [--limit N]
gh pr list --json number,title,headRefName,mergeStateStatus,isDraft

# View
gh pr view NUMBER [--json FIELDS]
gh pr diff NUMBER                        # full diff
gh pr checks NUMBER                      # CI status
gh pr status                             # PRs involving you

# Create
gh pr create [--title STR] [--body STR] [--base BRANCH] [--draft] [--fill]
gh pr create --web                       # open in browser

# Review
gh pr review NUMBER --approve
gh pr review NUMBER --request-changes --body "..."
gh pr review NUMBER --comment --body "..."

# Merge
gh pr merge NUMBER [--merge|--squash|--rebase] [--delete-branch] [--auto]

# Edit
gh pr edit NUMBER --title "new title" --body "new body"
gh pr edit NUMBER --add-label "bug" --remove-label "wip"
gh pr edit NUMBER --add-reviewer login
gh pr ready NUMBER                       # mark draft as ready

# Close / Reopen
gh pr close NUMBER [--comment "..."] [--delete-branch]
gh pr reopen NUMBER

# Checkout locally
gh pr checkout NUMBER
```

---

## Issues

```bash
# List
gh issue list [--state open|closed|all] [--label NAME] [--assignee @me|LOGIN]
gh issue list --json number,title,labels,assignees,createdAt

# View
gh issue view NUMBER [--json FIELDS]
gh issue view NUMBER --comments           # include comments

# Create
gh issue create --title STR --body STR [--label NAME] [--assignee LOGIN] [--milestone NAME]
gh issue create --web

# Edit
gh issue edit NUMBER --title "..." --body "..."
gh issue edit NUMBER --add-label NAME --remove-label NAME
gh issue edit NUMBER --add-assignee LOGIN

# Close / Reopen
gh issue close NUMBER [--comment "..."] [--reason completed|not_planned]
gh issue reopen NUMBER

# Pin / Transfer
gh issue pin NUMBER
gh issue transfer NUMBER REPO
```

---

## GitHub Actions / Workflows

```bash
# List workflows
gh workflow list
gh workflow view WORKFLOW_ID_OR_NAME

# Run a workflow
gh workflow run WORKFLOW_FILE [--ref BRANCH] [-f key=value]

# List runs
gh run list [--workflow WORKFLOW] [--branch BRANCH] [--status STATUS] [--limit N]
gh run list --json databaseId,name,status,conclusion,startedAt

# View run
gh run view RUN_ID
gh run view RUN_ID --log                 # full logs
gh run view RUN_ID --log-failed          # only failed steps

# Cancel / Rerun
gh run cancel RUN_ID
gh run rerun RUN_ID
gh run rerun RUN_ID --failed-only
gh run rerun RUN_ID --job JOB_ID

# Download artifacts
gh run download RUN_ID [--name ARTIFACT_NAME] [--dir ./artifacts]
```

---

## Releases

```bash
# List
gh release list [--limit N]

# View
gh release view [TAG] [--json FIELDS]

# Create
gh release create TAG [--title STR] [--notes STR] [--generate-notes]
gh release create TAG --draft            # draft release
gh release create TAG --prerelease
gh release create TAG --notes-file CHANGELOG.md

# Upload assets
gh release upload TAG FILE...

# Edit
gh release edit TAG [--draft=false] [--latest] [--notes STR]

# Delete
gh release delete TAG [--yes] [--cleanup-tag]

# Download
gh release download [TAG] [--asset GLOB] [--dir ./dist]
```

---

## Repository

```bash
# View
gh repo view [REPO] [--json FIELDS] [--web]

# Create / Clone / Fork
gh repo create NAME [--public|--private|--internal] [--description STR] [--source .]
gh repo clone REPO [DIR]
gh repo fork REPO [--clone] [--remote-name upstream]

# Archive / Delete
gh repo archive [REPO]
gh repo delete REPO --yes                # requires confirmation

# Sync fork
gh repo sync [REPO] [--branch BRANCH] [--source upstream/branch]

# Topics
gh repo edit --add-topic TOPIC --remove-topic TOPIC
```

---

## API (Raw REST)

Use `gh api` for endpoints not covered by top-level commands:

```bash
# GET
gh api repos/:owner/:repo/topics
gh api repos/:owner/:repo/collaborators --jq '.[].login'

# POST / PATCH
gh api repos/:owner/:repo/labels \
  --method POST \
  -f name="new-label" -f color="ff0000"

# Paginate
gh api repos/:owner/:repo/issues \
  --paginate \
  --jq '.[] | {number, title}'

# GraphQL
gh api graphql -f query='
  query($owner:String!, $repo:String!, $number:Int!) {
    repository(owner:$owner, name:$repo) {
      pullRequest(number:$number) {
        title
        reviewDecision
        latestOpinionatedReviews(first:5) {
          nodes { author { login } state }
        }
      }
    }
  }
' -F owner=owner -F repo=repo -F number=42
```

---

## Gist

```bash
gh gist create FILE [--public] [--desc STR]
gh gist list [--public]
gh gist view ID
gh gist edit ID
gh gist clone ID
```

---

## Auth

```bash
gh auth login [--hostname github.com] [--with-token]   # token via stdin
gh auth logout
gh auth status
gh auth token                                           # print current token
gh auth refresh --scopes repo,workflow,write:packages
```

---

## Output Tips

```bash
# Pretty-print JSON field
gh pr view 123 --json files --jq '.files[].path'

# Filter with complex jq
gh issue list --state all --json number,title,labels \
  --jq '.[] | select(.labels[].name == "bug") | {number, title}'

# Tab-separated table for scripting
gh pr list --json number,headRefName,title \
  --jq '.[] | [.number, .headRefName, .title] | @tsv'
```
