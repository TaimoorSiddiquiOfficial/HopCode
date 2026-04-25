# Project Structure

## Root Directory

```
HopCode/
├── packages/              # Monorepo packages
├── integration-tests/     # End-to-end test suites
├── docs/                  # Documentation (user guides, architecture)
├── docs-site/             # Next.js documentation website
├── scripts/               # Build, test, and development scripts
├── assets/                # Static assets (images, etc.)
├── deploy/                # Deployment configurations
├── examples/              # Example usage and demos
├── .github/               # GitHub workflows and issue templates
├── .hopcode/              # HopCode configuration (skills, agents, settings)
├── .vscode/               # VS Code workspace settings
├── eslint-rules/          # Custom ESLint rules
└── integration-tests/     # E2E and integration test suites
```

### Root Configuration Files

| File                | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `package.json`      | Root workspace config with npm workspaces        |
| `tsconfig.json`     | Root TypeScript configuration (strict mode, ESM) |
| `eslint.config.js`  | ESLint v9 flat config for monorepo               |
| `.prettierrc.json`  | Prettier formatting rules                        |
| `.nvmrc`            | Node.js version specification (~20.19.0)         |
| `.npmrc`            | NPM configuration (registry, scopes)             |
| `esbuild.config.js` | Esbuild bundling configuration                   |
| `vitest.config.ts`  | Vitest test runner configuration                 |
| `Dockerfile`        | Container build configuration                    |
| `Makefile`          | Makefile for common operations                   |

---

## Packages Directory

### `packages/cli/` — Command-Line Interface

**Purpose**: Terminal application entry point with interactive UI

```
packages/cli/
├── index.ts                    # CLI entry point (#!/usr/bin/env node)
├── src/
│   ├── interactive.tsx         # Main interactive mode (Ink UI)
│   ├── interactive.test.tsx    # Interactive mode tests
│   ├── nonInteractiveCli.ts    # Headless mode (-p flag)
│   ├── nonInteractiveCli.test.ts
│   ├── commands/               # Slash command implementations
│   │   ├── provider.ts         # /provider — provider selection
│   │   ├── model.ts            # /model — model switching
│   │   ├── auth.ts             # /auth — authentication
│   │   ├── ci.ts               # /ci — GitHub Actions integration
│   │   └── ...
│   ├── ui/                     # Ink-based UI components
│   │   ├── components/
│   │   │   ├── ProviderDialog.tsx  # 3-step provider setup wizard
│   │   │   └── ...
│   │   └── hooks/
│   ├── config/                 # CLI-specific configuration
│   ├── core/                   # CLI core logic
│   ├── i18n/                   # Internationalization (7 languages)
│   ├── nonInteractive/         # Headless mode components
│   ├── remoteInput/            # Remote input handling
│   ├── dualOutput/             # Dual output mode
│   ├── acp-integration/        # Agent Client Protocol integration
│   ├── services/               # CLI services
│   ├── utils/                  # Utility functions
│   │   ├── githubApi.ts        # GitHub REST API client
│   │   ├── githubTokenStore.ts # GitHub token persistence
│   │   └── ...
│   └── generated/              # Auto-generated files
├── package.json
└── dist/                       # Built output
```

**Key Dependencies**: `ink`, `react`, `yargs`, `@hoptrendy/hopcode-core`

---

### `packages/core/` — Core Library

**Purpose**: Shared core logic for all HopCode consumers

```
packages/core/
├── src/
│   ├── index.ts                # Main exports (372 lines of re-exports)
│   │
│   ├── config/                 # Configuration system
│   │   ├── config.ts           # Main Config class (2844 lines)
│   │   ├── storage.ts          # Storage paths and directories
│   │   ├── models.ts           # Model configuration and registry
│   │   └── constants.ts        # Configuration constants
│   │
│   ├── provider/               # AI provider integration layer
│   │   ├── provider.ts         # Provider registry and factory
│   │   ├── models.ts           # Static model catalog
│   │   ├── auth.ts             # API key and auth management
│   │   ├── transform.ts        # AI SDK message transformation
│   │   ├── error.ts            # Provider error parsing
│   │   └── sdk/                # Vendored AI SDK adapters
│   │       └── copilot/        # GitHub Copilot SDK adapter
│   │
│   ├── agents/                 # Agent system
│   │   ├── runtime/            # Agent runtime types and backends
│   │   │   ├── agent-types.ts  # PromptConfig, ModelConfig, RunConfig
│   │   │   └── backends/       # Agent backend implementations
│   │   ├── arena/              # Arena mode (multi-model competition)
│   │   │   ├── ArenaManager.ts # Manages parallel model execution
│   │   │   └── ArenaAgentClient.ts
│   │   ├── background-tasks.ts # Background task management
│   │   └── index.ts
│   │
│   ├── subagents/              # Subagent system
│   │   ├── subagent-manager.ts # Subagent discovery and loading
│   │   ├── builtin-agents.ts   # Built-in subagents
│   │   ├── types.ts            # SubagentConfig, SubagentLevel
│   │   ├── model-selection.ts  # Model routing for subagents
│   │   └── validation.ts       # Configuration validation
│   │
│   ├── skills/                 # Skills system (modular capabilities)
│   │   ├── skill-manager.ts    # Skill discovery, caching, watching
│   │   ├── skill-load.ts       # Skill file parsing
│   │   ├── types.ts            # SkillConfig, SkillLevel
│   │   └── bundled/            # Built-in skills
│   │       ├── spec-driven/    # Spec-driven development
│   │       ├── git-workflow/   # Conventional commits
│   │       ├── codebase-map/   # Codebase documentation
│   │       ├── changelog/      # CHANGELOG generation
│   │       ├── mcp-builder/    # MCP server builder
│   │       ├── review/         # Code review automation
│   │       ├── loop/           # Recurring task loops
│   │       ├── learn/          # Learn from sessions
│   │       ├── batch/          # Batch operations
│   │       └── qc-helper/      # Qwen Code helper
│   │
│   ├── tools/                  # Tool system (63 files)
│   │   ├── tools.ts            # Tool base classes and interfaces
│   │   ├── tool-registry.ts    # Tool discovery and registration
│   │   ├── tool-names.ts       # Tool name constants
│   │   ├── tool-error.ts       # Tool error types
│   │   ├── read-file.ts        # File reading tool
│   │   ├── write-file.ts       # File writing tool
│   │   ├── edit.ts             # File editing tool
│   │   ├── shell.ts            # Shell command execution
│   │   ├── ripGrep.ts          # Fast text search
│   │   ├── glob.ts             # File pattern matching
│   │   ├── grep.ts             # Grep search
│   │   ├── ls.ts               # Directory listing
│   │   ├── lsp.ts              # Language Server Protocol tools
│   │   ├── mcp-client.ts       # MCP client tool
│   │   ├── mcp-client-manager.ts
│   │   ├── mcp-tool.ts         # MCP tool wrapper
│   │   ├── web-search/         # Web search integration
│   │   ├── web-fetch.ts        # Web page fetching
│   │   ├── todoWrite.ts        # Task management
│   │   ├── task-*.ts           # Task CRUD operations
│   │   ├── skill.ts            # Skill invocation tool
│   │   ├── cron-*.ts           # Cron job management
│   │   ├── modifiable-tool.ts  # Tool output modification
│   │   ├── askUserQuestion.ts  # User interaction
│   │   ├── exitPlanMode.ts     # Plan mode exit
│   │   ├── diffOptions.ts      # Diff configuration
│   │   └── agent/              # Agent spawning tools
│   │
│   ├── mcp/                    # MCP (Model Context Protocol)
│   │   ├── oauth-provider.ts   # MCP OAuth flow
│   │   ├── oauth-token-storage.ts
│   │   ├── oauth-utils.ts
│   │   ├── google-auth-provider.ts
│   │   ├── sa-impersonation-provider.ts
│   │   └── token-storage/
│   │
│   ├── lsp/                    # Language Server Protocol
│   │   ├── NativeLspService.ts # LSP client implementation
│   │   ├── LspServerManager.ts # LSP server lifecycle
│   │   ├── LspConnectionFactory.ts
│   │   ├── LspConfigLoader.ts  # LSP configuration loading
│   │   ├── LspResponseNormalizer.ts
│   │   ├── types.ts            # LSP type definitions (524 lines)
│   │   └── constants.ts
│   │
│   ├── memory/                 # Memory system
│   │   ├── const.js            # Memory constants
│   │   ├── store.js            # Auto-memory index
│   │   ├── paths.js            # Memory directory paths
│   │   ├── manager.ts          # Memory management
│   │   └── gemini.md           # Memory file format
│   │
│   ├── hooks/                  # Hook system
│   │   ├── index.ts            # Hook system entry point
│   │   ├── types.ts            # HookDefinition, HookEventName
│   │   └── ...
│   │
│   ├── core/                   # Core engine
│   │   ├── client.ts           # HopCodeClient main class
│   │   ├── contentGenerator.ts # Content generator factory
│   │   ├── hopCodeChat.ts      # Chat session management
│   │   ├── hopCodeRequest.ts   # Request handling
│   │   ├── coreToolScheduler.ts# Tool execution scheduler
│   │   ├── permission-helpers.ts
│   │   ├── nonInteractiveToolExecutor.ts
│   │   ├── prompts.ts          # System prompts
│   │   ├── tokenLimits.ts      # Token limit management
│   │   ├── turn.ts             # Conversation turn management
│   │   ├── logger.js           # Logging utilities
│   │   └── insightProtocol.ts  # Insight protocol
│   │
│   ├── services/               # Core services
│   │   ├── fileDiscoveryService.ts
│   │   ├── fileSystemService.ts
│   │   ├── gitService.ts       # Git operations
│   │   ├── chatRecordingService.ts
│   │   ├── sessionService.ts   # Session persistence
│   │   ├── cronScheduler.ts    # Cron job scheduling
│   │   ├── task-store.ts       # Task persistence
│   │   ├── permissionBlockerService.ts
│   │   └── shellExecutionService.ts
│   │
│   ├── permissions/            # Permission system
│   │   ├── permission-manager.ts
│   │   └── index.ts
│   │
│   ├── confirmation-bus/       # Message bus for hooks
│   │   ├── message-bus.ts
│   │   └── types.ts
│   │
│   ├── extension/              # Extension system
│   │   ├── extensionManager.ts # Extension loading and management
│   │   └── claude-converter.ts # Claude marketplace integration
│   │
│   ├── ide/                    # IDE integration
│   │   └── ideContext.ts       # IDE context store
│   │
│   ├── output/                 # Output formatting
│   │   ├── json-formatter.ts   # JSON output mode
│   │   └── types.ts            # InputFormat, OutputFormat
│   │
│   ├── models/                 # Model configuration
│   │   ├── index.ts            # Model registry exports
│   │   └── ...
│   │
│   ├── prompts/                # Prompt management
│   │   └── prompt-registry.ts
│   │
│   ├── telemetry/              # Telemetry and observability
│   │   ├── index.ts            # Telemetry initialization
│   │   └── ...
│   │
│   ├── project/                # Project detection
│   │   └── ...
│   │
│   ├── flag/                   # Feature flags
│   │   └── ...
│   │
│   ├── followup/               # Follow-up suggestions
│   │   └── ...
│   │
│   ├── hopcode/                # HopCode-specific logic
│   │   └── ...
│   │
│   ├── bun.ts                  # Bun runtime detection
│   ├── env.ts                  # Environment variables
│   ├── global.ts               # Global types
│   ├── plugin.ts               # Plugin system
│   ├── installation.ts         # Installation detection
│   ├── auth.ts                 # Authentication utilities
│   │
│   ├── utils/                  # Utility functions (100+ files)
│   │   ├── debugLogger.ts      # Debug logging (SKILL_MANAGER, etc.)
│   │   ├── textUtils.ts        # Text normalization
│   │   ├── yaml-parser.ts      # YAML parsing
│   │   ├── workspaceContext.ts # Workspace detection
│   │   ├── shell-utils.ts      # Shell utilities
│   │   ├── proxyUtils.ts       # Proxy configuration
│   │   ├── errors.ts           # Error handling
│   │   ├── browser.ts          # Browser launch utilities
│   │   ├── ignorePatterns.ts   # File exclusion patterns
│   │   ├── memoryDiscovery.ts  # Memory file discovery
│   │   ├── rulesDiscovery.ts   # Conditional rules registry
│   │   ├── tool-utils.ts       # Tool utilities
│   │   └── ...
│   │
│   ├── constants/              # Constants
│   │   ├── codingPlan.ts       # Coding Plan configuration
│   │   └── ...
│   │
│   ├── generated/              # Auto-generated files
│   │   └── version.ts          # Version info
│   │
│   ├── mocks/                  # Test mocks
│   ├── __mocks__/              # Vitest mocks
│   └── test-utils/             # Test utilities
│
├── scripts/
│   └── postinstall.js          # Post-install script
├── vendor/                     # Vendored dependencies
└── package.json
```

**Key Dependencies**: `ai`, `@ai-sdk/*`, `zod`, `yaml`, `openai`, `@anthropic-ai/sdk`, `@google/genai`, `@modelcontextprotocol/sdk`

---

### `packages/vscode-ide-companion/` — VS Code Extension

**Purpose**: Native VS Code sidebar integration

```
packages/vscode-ide-companion/
├── src/
│   └── extension.ts            # Extension entry point
├── assets/
│   ├── icon.png                # Extension icon
│   └── sidebar-icon.svg        # Sidebar icon
├── dist/                       # Built extension (CJS)
├── package.json                # VS Code extension manifest
└── esbuild.js                  # Esbuild configuration
```

**Key Features**:

- Sidebar chat view (primary + secondary)
- Diff editor integration (accept/cancel)
- Keybindings (Ctrl+Shift+L / Cmd+Shift+L)
- Settings sync with `~/.hopcode/settings.json`
- JSON schema validation for settings

---

### `packages/sdk-typescript/` — TypeScript SDK

**Purpose**: Programmatic access to HopCode CLI

```
packages/sdk-typescript/
├── src/
│   └── index.ts                # SDK exports
├── dist/                       # Built SDK (CJS + ESM)
├── scripts/
│   ├── build.js                # Build script
│   └── bundle-cli.js           # CLI bundling
└── package.json
```

**Exports**:

- `./dist/index.mjs` — ESM build
- `./dist/index.cjs` — CommonJS build
- `./dist/index.d.ts` — TypeScript types

---

### `packages/channels/` — Enterprise Messaging Channels

**Purpose**: Multi-platform messaging integration

```
packages/channels/
├── base/                       # Base channel interface
├── discord/                    # Discord bot integration
├── telegram/                   # Telegram bot integration
├── weixin/                     # WeChat (Chinese messaging)
│   ├── accounts.ts
│   ├── login.ts
│   └── index.ts
├── dingtalk/                   # DingTalk (Chinese enterprise)
└── plugin-example/             # Example channel plugin
```

---

### `packages/web-dashboard/` — Web Dashboard

**Purpose**: Browser-based UI for HopCode

```
packages/web-dashboard/
├── src/                        # React source files
├── server/                     # Backend server
├── dist/                       # Built dashboard
├── index.html
├── vite.config.ts
└── package.json
```

---

### `packages/web-templates/` — Web UI Templates

**Purpose**: Reusable web UI components

```
packages/web-templates/
├── src/
├── dist/
├── build.mjs
└── package.json
```

---

### `packages/webui/` — Shared Web UI

**Purpose**: Shared UI components used by VS Code extension and web dashboard

---

### `packages/server/` — Server Components

**Purpose**: Server-side components for remote deployment

---

### `packages/sdk-java/` — Java SDK

**Purpose**: Java SDK for programmatic access (structure similar to TypeScript SDK)

---

## Integration Tests

```
integration-tests/
├── globalSetup.ts              # Global test setup
├── test-helper.ts              # Test utilities
├── test-mcp-server.ts          # Mock MCP server
├── vitest.config.ts            # Vitest configuration
├── vitest.terminal-bench.config.ts
├── fixtures/                   # Test fixtures
├── cli/                        # CLI integration tests
│   └── ...
├── interactive/                # Interactive mode tests
│   └── ...
├── sdk-typescript/             # SDK integration tests
│   └── ...
├── terminal-bench/             # Terminal benchmark tests
│   └── ...
├── terminal-capture/           # Terminal screenshot tests
│   └── ...
├── hook-integration/           # Hook system tests
│   └── ...
└── concurrent-runner/          # Concurrent test runner
    └── ...
```

**Test Commands**:

- `npm run test:integration:sandbox:none` — Run without sandboxing
- `npm run test:integration:sandbox:docker` — Run with Docker sandbox
- `npm run test:integration:sandbox:podman` — Run with Podman sandbox
- `npm run test:e2e` — Full E2E test suite

---

## Documentation

```
docs/
├── ARCHITECTURE.md             # Architecture design (authoritative)
├── index.md                    # Documentation index
├── MIGRATING_FROM_QWEN_CODE.md # Migration guide
├── hopcodecli.png              # CLI screenshot
├── _meta.ts                    # Documentation metadata
│
├── users/                      # User documentation
│   ├── overview.md             # HopCode overview
│   ├── quickstart.md           # Quick start guide
│   ├── common-workflow.md      # Common workflows
│   ├── configuration/          # Configuration guides
│   ├── features/               # Feature documentation
│   ├── integration-vscode.md   # VS Code integration
│   ├── integration-zed.md      # Zed integration
│   ├── integration-jetbrains.md# JetBrains integration
│   ├── integration-github-actions.md
│   ├── reference/              # Reference docs
│   ├── support/                # Support and troubleshooting
│   ├── extension/              # Extension docs
│   └── ide-integration/        # IDE integration guides
│
├── developers/                 # Developer documentation
│   ├── contributing.md         # Contribution guidelines
│   ├── testing.md              # Testing guide
│   └── ...
│
├── design/                     # Design documents
│   └── ...
│
├── plans/                      # Project plans
│   └── ...
│
└── github-actions/             # GitHub Actions workflows
    └── ...
```

---

## Scripts

```
scripts/
├── build.js                    # Main build script (TypeScript compilation)
├── build_package.js            # Build individual packages
├── build_sandbox.js            # Build sandbox container
├── build_vscode_companion.js   # Build VS Code extension
├── bundle.js                   # Bundle dist/ into cli.js
├── copy_bundle_assets.js       # Copy assets for bundling
├── dev.js                      # Development mode
├── start.js                    # Start CLI from source
├── lint.js                     # Linting (ESLint, Prettier, etc.)
├── format                      # Formatting script
├── test*.js                    # Test runners
├── generate-git-commit-info.js # Generate version info
├── generate-settings-schema.ts # Generate settings JSON schema
├── check-i18n.ts               # i18n key checking
├── check-lockfile.js           # Lockfile validation
├── clean.js                    # Clean build artifacts
├── husky/                      # Git hooks
├── installation/               # Installation scripts
│   ├── install-hopcode.sh      # Linux/macOS installer
│   └── install-hopcode.bat     # Windows installer
├── tests/                      # Test utilities
└── ...
```

---

## GitHub Workflows

```
.github/workflows/
├── ci.yml                      # Main CI pipeline (lint, build, test)
├── publish.yml                 # NPM publishing
├── hopcode-pr-review.yml       # AI-powered PR review
├── hopcode-automated-issue-triage.yml
├── hopcode-scheduled-issue-triage.yml
├── gemini-scheduled-pr-triage.yml
└── check-issue-completeness.yml
```

---

## HopCode Configuration

```
.hopcode/
├── settings.json               # User/project settings
├── settings.json.example       # Example settings
├── agents/                     # Custom subagents
│   └── ...
├── skills/                     # Custom skills
│   └── ...
└── commands/                   # Custom commands
    └── ...
```

**Settings Structure**:

```json
{
  "modelProviders": {
    /* provider configurations */
  },
  "env": {
    /* environment variables */
  },
  "security": { "auth": { "selectedType": "openai" } },
  "model": { "name": "gpt-4o" },
  "agentModels": {
    /* per-subagent model routing */
  },
  "mcpServers": {
    /* MCP server configurations */
  }
}
```

---

## Build Output

```
dist/                           # Bundled CLI (from esbuild)
packages/*/dist/                # Package build outputs
```

**Build Process**:

1. `npm run build` — TypeScript compilation to each package's `dist/`
2. `npm run bundle` — Esbuild bundles into single `dist/cli.js`
3. `npm run build:all` — Full build including sandbox container

---

## Key Path Conventions

| Path                       | Purpose                                 |
| -------------------------- | --------------------------------------- |
| `~/.hopcode/settings.json` | User-global settings                    |
| `~/.hopcode/skills/`       | User-level skills                       |
| `~/.hopcode/agents/`       | User-level subagents                    |
| `.hopcode/settings.json`   | Project-specific settings               |
| `.hopcode/skills/`         | Project-level skills                    |
| `.hopcode/agents/`         | Project-level subagents                 |
| `~/.hopcode-profiles.json` | CLI profile storage                     |
| `~/.config/hopcode/`       | Config directory (alternative location) |
