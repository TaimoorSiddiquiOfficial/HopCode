# HopCode CLI — Architecture Design

> **Purpose:** This document is the authoritative memory of the HopCode product architecture.
> Read it before making changes to understand how components interact and where to start.

---

## Product Identity

| Key              | Value                             |
| ---------------- | --------------------------------- |
| **Product name** | HopCode                           |
| **Binary**       | `hopcode`                         |
| **NPM scope**    | `@hoptrendy`                      |
| **Root package** | `@hoptrendy/hopcode`              |
| **Core package** | `@hoptrendy/hopcode-core`         |
| **CLI package**  | `@hoptrendy/hopcode-cli`          |
| **SDK package**  | `@hoptrendy/sdk`                  |
| **Version**      | see `package.json` (root)         |
| **GitHub**       | `TaimoorSiddiquiOfficial/HopCode` |

---

## Repository Layout

```
HopCode/
├── packages/
│   ├── cli/               CLI entry point, UI components (React/Ink)
│   ├── core/              Core logic: providers, models, memory, sessions
│   └── vscode-ide-companion/  VS Code extension bridge
├── integration-tests/     End-to-end tests (globalSetup, suites)
├── scripts/               Build utilities (fix-import-extensions.mjs, etc.)
├── docs/                  Product documentation
│   └── ARCHITECTURE.md    ← this file
├── .github/
│   └── workflows/         CI pipelines (ci.yml, hopcode-pr-review.yml, etc.)
├── eslint.config.js        ESLint flat config (v9) — monorepo-wide
├── tsconfig.json           Root TypeScript config
└── package.json            Root workspace (npm workspaces)
```

---

## Package Dependency Graph

```
packages/cli
    └── depends on packages/core
packages/core
    └── depends on AI SDK packages (@ai-sdk/*, ai)
integration-tests
    └── depends on @hoptrendy/hopcode-core (via packages/core)
```

---

## Core Package Structure (`packages/core/src/`)

```
core/src/
├── provider/              Multi-provider AI integration layer
│   ├── provider.ts        Provider registry, factory, SDK initialisation
│   ├── models.ts          Static model catalog (all providers + models)
│   ├── auth.ts            API key / auth management per provider
│   ├── transform.ts       AI SDK message transformation, effort levels
│   ├── error.ts           Provider-specific error parsing/classification
│   └── sdk/               Vendored AI SDK adapters (ignored by ESLint)
│       └── copilot/       GitHub Copilot SDK adapter (Vercel AI SDK base)
├── memory/
│   ├── const.js           Memory constants (imported by integration-tests)
│   └── ...
├── session/               Session management (sessionID, history)
├── flag/                  Feature flags (OPENCODE_EXPERIMENTAL_*)
├── project/               Project detection and configuration
└── util/
    ├── fn.ts              Type-safe function wrapper (uses zod for schema)
    ├── error.ts           NamedError base class
    └── iife.ts            IIFE helper utility
```

### Provider System

The provider system (`packages/core/src/provider/`) is adapted from the [opencode](https://github.com/sst/opencode) project.

**Key design decisions:**

- Uses **TypeScript namespaces** (`export namespace Provider { ... }`) — intentional pattern, not a mistake. ESLint `@typescript-eslint/no-namespace` is disabled for this directory.
- All providers expose a unified `Provider.Model` interface, regardless of underlying SDK.
- **Live model fetching**: providers with `liveModels: true` (e.g. Ollama, Groq, OpenRouter) query their API for the model list at runtime.
- AI SDK types (`any`, complex generics) are used extensively — `@typescript-eslint/no-explicit-any` is disabled for this directory.
- `zod/v4` sub-path imports are used (allowed via `import/no-internal-modules` override).

**Provider registration flow:**

1. `provider.ts` exports `PROVIDER_REGISTRY` — map of `providerID → ProviderConfig`
2. Each config has: `label`, `requiresApiKey`, `envKey`, `baseUrl`, `liveModels`, `defaultModel`, `categories`
3. The CLI `/provider` command reads this registry to show the selection list
4. On API key entry, the key is saved to `settings.json` via `saveApiKey(providerId, key)`
5. Model list is fetched live (for `liveModels: true`) or read from static catalog

---

## CLI Package Structure (`packages/cli/src/`)

```
cli/src/
├── commands/              CLI slash commands
│   ├── provider.ts        /provider command — opens ProviderDialog
│   ├── model.ts           /model command — model selection
│   └── ...
├── ui/
│   └── components/
│       ├── ProviderDialog.tsx   3-step wizard: provider → api-key → model
│       └── ...
├── settings/
│   └── settings.ts        Read/write settings.json (API keys, model choice)
└── hopcode.ts             Main entry point
```

### Slash Command Flow

```
User types /provider
    → CommandParser matches "provider"
    → ProviderDialog.tsx renders (step: 'provider')
    → User selects provider
    → (if requiresApiKey) step: 'api-key' — user enters key → saved to settings.json
    → step: 'model'
        → if liveModels: async fetch from provider API
        → else: static catalog from getCatalog(providerId)
    → User selects model → saved to settings.json as activeModel
```

### Settings System

`settings.json` is the persistent configuration file (location: `~/.config/hopcode/settings.json`).

Key fields:

```json
{
  "provider": "openai",
  "model": "gpt-4o",
  "apiKeys": {
    "openai": "sk-...",
    "anthropic": "..."
  }
}
```

Environment variable `<PROVIDER>_API_KEY` overrides `settings.json` keys at runtime.

---

## Provider Registry (Supported Providers)

| Provider ID    | Label             | Env Key                                       | Live Models |
| -------------- | ----------------- | --------------------------------------------- | ----------- |
| `openai`       | OpenAI            | `OPENAI_API_KEY`                              | no          |
| `anthropic`    | Anthropic         | `ANTHROPIC_API_KEY`                           | no          |
| `google`       | Google Gemini     | `GOOGLE_GENERATIVE_AI_API_KEY`                | no          |
| `ollama-local` | Ollama (Local)    | —                                             | yes         |
| `ollama-cloud` | Ollama Cloud      | `OLLAMA_CLOUD_API_KEY`                        | yes         |
| `groq`         | Groq              | `GROQ_API_KEY`                                | yes         |
| `openrouter`   | OpenRouter        | `OPENROUTER_API_KEY`                          | yes         |
| `mistral`      | Mistral           | `MISTRAL_API_KEY`                             | yes         |
| `together`     | Together AI       | `TOGETHER_API_KEY`                            | yes         |
| `azure`        | Azure OpenAI      | `AZURE_API_KEY`                               | no          |
| `bedrock`      | AWS Bedrock       | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` | no          |
| `vertex`       | Google Vertex     | `GOOGLE_VERTEX_*`                             | no          |
| `copilot`      | GitHub Copilot    | `GITHUB_TOKEN`                                | no          |
| `deepseek`     | DeepSeek          | `DEEPSEEK_API_KEY`                            | no          |
| `xai`          | xAI / Grok        | `XAI_API_KEY`                                 | no          |
| `perplexity`   | Perplexity        | `PERPLEXITY_API_KEY`                          | no          |
| `cohere`       | Cohere            | `COHERE_API_KEY`                              | no          |
| `fireworks`    | Fireworks AI      | `FIREWORKS_API_KEY`                           | yes         |
| `baseten`      | Baseten           | `BASETEN_API_KEY`                             | yes         |
| `zai`          | ZAI               | `ZAI_API_KEY`                                 | no          |
| `lmstudio`     | LM Studio         | —                                             | yes         |
| `opencode`     | OpenCode          | —                                             | no          |
| `vercel`       | Vercel AI Gateway | `VERCEL_API_KEY`                              | no          |

---

## CI/CD Pipelines (`.github/workflows/`)

| File                                 | Trigger                       | Purpose                                |
| ------------------------------------ | ----------------------------- | -------------------------------------- |
| `ci.yml`                             | push/PR                       | **Lint**, Build, Unit Tests, E2E tests |
| `hopcode-pr-review.yml`              | PR comment `@hopcode /review` | AI-powered PR review                   |
| `hopcode-scheduled-issue-triage.yml` | schedule (daily)              | Auto-triage stale issues               |
| `hopcode-automated-issue-triage.yml` | issue opened                  | Label + classify new issues            |
| `gemini-scheduled-pr-triage.yml`     | schedule                      | PR triage with Gemini                  |
| `check-issue-completeness.yml`       | issue opened                  | Check issue template completeness      |
| `publish.yml`                        | release tag                   | Publish to NPM                         |

**CI Lint job** uses `npm run lint` → `eslint . --ext .ts,.tsx && eslint integration-tests`

---

## ESLint Configuration (`eslint.config.js`)

Uses ESLint flat config (v9). Key overrides:

| Scope                                | Rules                                                                                                                                        |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Global ignores                       | `node_modules`, `dist`, `.hopcode-backup-*/**`, `packages/core/src/provider/sdk/**`, `packages/core/test-openai-provider.ts`                 |
| `packages/**/src/**/*.{ts,tsx}`      | Full TypeScript + import rules                                                                                                               |
| `packages/core/src/provider/**/*.ts` | `no-namespace`, `no-explicit-any`, `ban-ts-comment`, `array-type`, `no-this-alias` OFF; `allowEmptyCase` ON; zod/v4 internal imports allowed |
| `./scripts/**/*.{js,mjs}`            | Node globals (`process`, `console`) added                                                                                                    |
| `**/*.cjs`                           | `no-require-imports` OFF                                                                                                                     |

---

## Known Design Patterns

- **Namespace exports**: `export namespace ProviderAuth {}`, `export namespace ProviderError {}` — all in `packages/core/src/provider/`. This is intentional OpenCode compatibility.
- **iife() helper**: `import { iife } from '../util/iife.js'` — used to create inline expressions from blocks.
- **`@ts-expect-error` comments**: Used in provider SDK for complex AI SDK type coercions.
- **Empty case fallthrough**: Switch cases with only a comment (no code) intentionally fall through — enabled via `allowEmptyCase: true`.

---

## Development Workflow

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run linter (must pass before commit)
npm run lint

# Run unit tests
npm test

# Run E2E integration tests
npm run e2e

# Run the CLI locally
node packages/cli/dist/hopcode.js
```

---

## Version Bump Strategy

- Bump `version` in `package.json` for any meaningful feature/fix
- All sub-packages should bump in sync
- Use semantic versioning: `MAJOR.MINOR.PATCH`
- Current scope: `@hoptrendy` (NPM org)

---

## GitHub Actions Workflow Integration (`/ci` command)

HopCode CLI can interact with GitHub Actions directly, allowing developers to check CI status, view failure logs, re-run jobs, and trigger dispatches without leaving the terminal.

### Token Resolution

Priority order for GitHub token:

1. `GITHUB_TOKEN` environment variable
2. `settings.env.GITHUB_TOKEN` (stored via `hopcode github auth`)

### New Files

| File                                         | Purpose                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| `packages/cli/src/utils/githubApi.ts`        | GitHub REST API client — PR, issue, commit, and **Actions** methods            |
| `packages/cli/src/utils/githubTokenStore.ts` | Token persistence (`loadGitHubToken`, `saveGitHubToken`, `requireGitHubToken`) |
| `packages/cli/src/ui/commands/ciCommand.ts`  | `/ci` slash command handler                                                    |

### `/ci` Sub-Commands

| Sub-command                     | API call                                            | Permissions needed |
| ------------------------------- | --------------------------------------------------- | ------------------ |
| `/ci`                           | `GET /repos/.../actions/runs?branch=`               | Actions: read      |
| `/ci logs`                      | `GET .../runs/{id}/jobs` + `GET .../jobs/{id}/logs` | Actions: read      |
| `/ci rerun`                     | `POST .../runs/{id}/rerun-failed-jobs`              | Actions: write     |
| `/ci cancel`                    | `POST .../runs/{id}/cancel`                         | Actions: write     |
| `/ci dispatch <workflow> [ref]` | `POST .../workflows/{id}/dispatches`                | Actions: write     |
| `/ci workflows`                 | `GET .../actions/workflows`                         | Actions: read      |

### Doctor Check

`/doctor` reports `GitHub token` status under the **HopCode** category:

- ✅ pass — token found in env or settings
- ⚠ warn — not configured (recommends setting `GITHUB_TOKEN` or running `hopcode github auth`)
