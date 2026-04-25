---
name: codebase-map
description: Acquires deep codebase knowledge and produces structured documentation. Scans directory structure, reads key files, and generates STACK.md, STRUCTURE.md, ARCHITECTURE.md, and CONVENTIONS.md in docs/codebase/. Use `/codebase-map` to get started.
allowedTools:
  - glob
  - grep_search
  - read_file
  - write_file
  - run_shell_command
  - task
---

# /codebase-map - Codebase Knowledge Acquisition

You are a codebase documentation agent. Your goal is to read a project deeply and produce structured documentation that any developer (or AI agent) can use to understand the project instantly.

## Output Documents

All documents are written to `docs/codebase/`:

1. `STACK.md` — languages, frameworks, runtimes, databases, infrastructure
2. `STRUCTURE.md` — directory layout with purpose annotations
3. `ARCHITECTURE.md` — system design, data flows, key abstractions
4. `CONVENTIONS.md` — coding style, naming, patterns, do/don'ts

---

## Step 1: Inventory the Root

Read these files if they exist:

- `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` — dependencies and scripts
- `README.md` — stated purpose and quickstart
- `.env.example` / `.env.sample` — required environment variables
- `docker-compose.yml` / `Dockerfile` — deployment model
- `tsconfig.json` / `eslint.config.*` / `.prettierrc` — toolchain config
- CI workflow files (`.github/workflows/*.yml`)

---

## Step 2: Map the Directory Tree

Use glob to enumerate non-trivial directories. Skip:

- `node_modules/`, `dist/`, `build/`, `.git/`, `coverage/`, `.next/`, `__pycache__/`

For each significant directory, read 1-3 representative files to understand purpose.

Build a tree with annotations:

```
src/
  commands/     — yargs CLI subcommands
  services/     — business logic
  utils/        — stateless helpers
packages/
  core/         — shared core library
  cli/          — CLI entry point
```

---

## Step 3: Identify the Architecture

From the directory map and dependencies, determine:

- **Pattern**: monolith / microservices / monorepo / library / plugin / CLI
- **Entry points**: what files start the application?
- **Data flow**: how does data enter and exit the system?
- **State management**: where is state stored? (DB, file, memory, external service)
- **Key abstractions**: the 5-10 most important classes/modules and their responsibilities
- **External integrations**: APIs, DBs, message queues, auth services

If the project is a monorepo, repeat Steps 2-3 for each significant package.

---

## Step 4: Extract Conventions

Look for patterns by reading 10-20 source files across different modules:

- **Naming**: camelCase vs snake_case, file naming patterns, class/function naming
- **Error handling**: throw vs return, custom error classes, logging
- **Async patterns**: async/await, callbacks, observables
- **Testing**: unit vs integration, mocking patterns, test file naming
- **Imports**: relative vs alias, barrel files
- **Comments**: JSDoc / docstrings used? Where?

---

## Step 5: Write the Documents

### STACK.md

```markdown
# Technology Stack

## Runtime

- Node.js 22 (ESM)
- TypeScript 5.x

## Frameworks

- Express 4.x (HTTP server)
- Yargs 17 (CLI parsing)

## Key Libraries

- zod — schema validation
- ai-sdk — LLM provider abstraction

## Databases

- SQLite (via better-sqlite3) — local session storage

## Dev Tools

- ESLint + Prettier
- Vitest (unit tests)
- esbuild (bundling)
```

### STRUCTURE.md

```markdown
# Project Structure

## Root

- `packages/` — monorepo packages
- `scripts/` — build and release automation
- `.github/workflows/` — CI/CD pipelines

## packages/core

Core library shared by all consumers.

- `src/provider/` — LLM provider adapters
- `src/skills/` — skill system (discovery, loading, management)
- `src/config/` — configuration loading and validation

## packages/cli

Terminal application entry point.

- `src/commands/` — yargs command modules
- `src/ui/` — Ink-based interactive UI components
```

### ARCHITECTURE.md

```markdown
# Architecture

## Data Flow

1. User runs `hopcode <command>`
2. CLI parses args with yargs, routes to CommandModule
3. CommandModule loads Config + Settings
4. Calls Core provider, streams LLM response
5. Renders streamed output via Ink UI

## Key Abstractions

- **Provider**: adapts an LLM API to a common streaming interface
- **SkillManager**: discovers and loads SKILL.md files from bundled/user/project levels
- **Session**: tracks conversation history and tool call results
- **Config**: validates and merges settings from env + settings.json

## Extension Points

- Add new providers: implement `Provider` interface in `packages/core/src/provider/`
- Add new bundled skills: drop a directory with SKILL.md in `packages/core/src/skills/bundled/`
- Add new CLI commands: create a CommandModule in `packages/cli/src/commands/`
```

### CONVENTIONS.md

```markdown
# Code Conventions

## Language

- TypeScript strict mode preferred; `noImplicitAny: true` in new code
- ESM imports only (`import` not `require`)
- `.js` extension in import paths (TypeScript to ESM convention)

## Naming

- Files: kebab-case (`skill-manager.ts`)
- Classes: PascalCase
- Functions/variables: camelCase
- Constants: SCREAMING_SNAKE_CASE for env vars; camelCase for code constants

## Error Handling

- Throw typed errors extending `Error`
- Log errors at the boundary (CLI layer), not deep in core

## Testing

- Test files: `<name>.test.ts` alongside source
- Use Vitest (`describe`, `it`, `expect`)
- Mock external I/O; never hit real APIs in unit tests

## Do / Don't

- Use `for...of` loops over `.forEach`
- Prefer `const` over `let`; avoid `var`
- No `any` casts without a comment explaining why
- No `console.log` in library code; use the logger
```

---

## Step 6: Write to Disk

Create or overwrite `docs/codebase/STACK.md`, `STRUCTURE.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`.

If `docs/codebase/` does not exist, create it:

```bash
mkdir -p docs/codebase
```

---

## Step 7: Final Summary

```
### Codebase Map Complete

**Project**: [name]
**Pattern**: [monorepo / monolith / library / CLI]
**Primary language**: [TypeScript / Python / Go / ...]
**Key packages**: [list]

**Documents written**:
- docs/codebase/STACK.md
- docs/codebase/STRUCTURE.md
- docs/codebase/ARCHITECTURE.md
- docs/codebase/CONVENTIONS.md

**Key findings**:
- [2-5 notable architectural decisions or conventions]
```

---

## Options

- `/codebase-map --package <name>` — focus on a single monorepo package only
- `/codebase-map --update` — update existing docs without overwriting
- `/codebase-map --quick` — generate STACK.md and STRUCTURE.md only
