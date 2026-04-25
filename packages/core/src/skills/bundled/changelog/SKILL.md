---
name: changelog
description: Generates or updates CHANGELOG.md from git log since the last tag. Groups commits by type (feat/fix/chore) in Keep a Changelog format. Appends to existing changelog if present. Use `/changelog` to generate.
allowedTools:
  - run_shell_command
  - read_file
  - write_file
  - ask_user_question
---

# /changelog - Changelog Generator

You are a changelog automation agent. You read git history since the last release tag and generate or update `CHANGELOG.md` following the Keep a Changelog format with Conventional Commits grouping.

---

## Step 1: Determine Version Range

Get the last tag:

```bash
git describe --tags --abbrev=0 2>/dev/null || echo "none"
```

Get the current version from `package.json`:

```bash
node -p "require('./package.json').version" 2>/dev/null
```

If no tags exist, use the entire git history. If a tag exists, get commits since that tag:

```bash
git log <last-tag>..HEAD --oneline --no-merges
```

---

## Step 2: Parse Commits

Get full commit details:

```bash
git log <last-tag>..HEAD --pretty=format:"%h %s" --no-merges
```

Parse each commit message and group into sections:

- **Breaking Changes** (commits with `!` or `BREAKING CHANGE:` footer — always include)
- **Added** (feat commits)
- **Fixed** (fix commits)
- **Changed** (refactor, perf, style commits)
- **Deprecated** (explicit deprecations)
- **Removed** (revert or explicit removals)
- **Security** (security-related fixes)

Skip these types unless they contain breaking changes: `chore`, `ci`, `build`, `test`

---

## Step 3: Format the Entry

Use Keep a Changelog format:

```markdown
## [<version>] - <date>

### Breaking Changes

- **feat(auth)!**: remove legacy API key format — tokens must now use `hc_` prefix ([abc1234])

### Added

- feat(skills): add spec-driven development workflow skill ([def5678])
- feat(model): support Ollama Cloud model switching ([ghi9012])

### Fixed

- fix(auth): resolve paste corruption on Windows when entering API key ([jkl3456])
```

Rules:

- Date format: `YYYY-MM-DD`
- Short 7-char commit hash in parentheses at end of each line
- Remove `feat:` / `fix:` prefixes in bullet text (implied by section heading)
- Scope in parentheses where present

---

## Step 4: Read Existing CHANGELOG.md

If `CHANGELOG.md` exists:

- Prepend the new entry below the `# Changelog` header
- Keep all existing entries intact

If no `CHANGELOG.md` exists, create it with:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [<version>] - <date>

...
```

---

## Step 5: Write CHANGELOG.md

Show a preview of the new entry first and ask: "Write this to CHANGELOG.md? (yes / edit / cancel)"

Write the updated file to `CHANGELOG.md` in the project root.

---

## Step 6: Summary

```
### Changelog Generated

**Version**: [version]
**Date**: [date]
**Range**: [last-tag]..HEAD
**Commits processed**: [N]
**Sections generated**: Added: [N], Fixed: [N], Changed: [N]
**File written**: CHANGELOG.md
```

---

## Options

- `/changelog --unreleased` — write changes under `## [Unreleased]` without a version/date
- `/changelog --version <x.y.z>` — use a specific version
- `/changelog --from <tag>` — use a custom starting tag
- `/changelog --all` — regenerate from all tags (destructive — confirm first)

---

## Error Handling

- **Not a git repo** → Inform the user; stop gracefully
- **No commits** → Inform: "No commits found since [last-tag]"
- **All commits are chore/ci/build** → Ask if user wants to include internal changes
- **Merge commits** → Skip them (use `--no-merges`)
- **Malformed commit messages** → Include under "Changed" with raw commit subject
