# Technology Stack

## Runtime & Core

- **Node.js**: >=20 (development: ~20.19.0)
- **TypeScript**: 5.x with strict mode
- **Module System**: ESM (`"type": "module"` in all packages)

## Monorepo Structure

- **Package Manager**: npm workspaces
- **Root Package**: `@hoptrendy/hopcode` v0.15.3
- **NPM Scope**: `@hoptrendy`
- **Build Tool**: Custom TypeScript build scripts + esbuild for bundling

## Major Packages

| Package                        | Version | Description                                                         |
| ------------------------------ | ------- | ------------------------------------------------------------------- |
| `@hoptrendy/hopcode-cli`       | 0.15.3  | CLI entry point with Ink-based terminal UI                          |
| `@hoptrendy/hopcode-core`      | 0.15.3  | Core logic: providers, agents, tools, MCP                           |
| `@hoptrendy/sdk`               | 0.19.5  | TypeScript SDK for programmatic access                              |
| `hopcode-vscode-ide-companion` | 0.15.3  | VS Code extension (native sidebar integration)                      |
| `@hoptrendy/web-templates`     | -       | Web UI component templates                                          |
| `@hoptrendy/webui`             | -       | Shared web UI components                                            |
| `@hoptrendy/channel-*`         | -       | Enterprise messaging channels (WeChat, DingTalk, Discord, Telegram) |

## AI/LLM Integration

### AI SDK (Vercel)

- **ai**: 5.0.124 — Main AI SDK framework
- **@ai-sdk/provider**: 2.0.1 — Provider interface
- **@ai-sdk/provider-utils**: 3.0.21 — Provider utilities

### Native Provider SDKs (15+ providers)

- **@ai-sdk/openai**: 2.0.89 — OpenAI, Groq, Fireworks, Together AI, OpenRouter
- **@ai-sdk/anthropic**: 2.0.65 — Anthropic Claude
- **@ai-sdk/google**: 2.0.54 — Google Gemini
- **@ai-sdk/google-vertex**: 3.0.106 — Google Vertex AI
- **@ai-sdk/amazon-bedrock**: 3.0.82 — AWS Bedrock
- **@ai-sdk/mistral**: 2.0.27 — Mistral AI
- **@ai-sdk/groq**: 2.0.34 — Groq (ultra-fast inference)
- **@ai-sdk/xai**: 2.0.51 — xAI Grok
- **@ai-sdk/cohere**: 2.0.22 — Cohere Command
- **@ai-sdk/deepseek**: 2.0.29 — DeepSeek
- **@ai-sdk/fireworks**: 2.0.46 — Fireworks AI
- **@ai-sdk/togetherai**: 1.0.34 — Together AI
- **@ai-sdk/openai-compatible**: 1.0.32 — Custom OpenAI-compatible endpoints
- **@ai-sdk/gateway**: 2.0.30 — Vercel AI Gateway
- **@ai-sdk/perplexity**: 2.0.23 — Perplexity
- **@ai-sdk/vercel**: 1.0.33 — Vercel
- **@ai-sdk/cerebras**: 1.0.36 — Cerebras
- **@ai-sdk/deepinfra**: 1.0.36 — DeepInfra
- **@ai-sdk/huggingface**: 1.0.43 — Hugging Face
- **@ai-sdk/replicate**: 2.0.29 — Replicate
- **@openrouter/ai-sdk-provider**: 1.5.4 — OpenRouter (300+ models)
- **@gitlab/gitlab-ai-provider**: 3.6.0 — GitLab AI

### Direct SDK Integrations

- **@anthropic-ai/sdk**: ^0.36.1 — Anthropic direct SDK
- **@google/genai**: 1.30.0 — Google Generative AI
- **openai**: 5.11.0 — OpenAI direct SDK

## MCP (Model Context Protocol)

- **@modelcontextprotocol/sdk**: ^1.25.1 — MCP client/server support
- **@agentclientprotocol/sdk**: ^0.14.1 — Agent Client Protocol

## Web & UI

### Terminal UI

- **ink**: ^6.2.3 — React-based terminal UI framework
- **react**: ^19.1.0 — React 19
- **ink-gradient**: ^3.0.0 — Gradient text in terminal
- **ink-spinner**: ^5.0.0 — Loading spinners
- **highlight.js**: ^11.11.1 — Syntax highlighting
- **lowlight**: ^3.3.0 — Low-light syntax highlighting

### Web Dashboard

- **Vite**: Build tool for web dashboard
- **React**: ^19.2.4 — Web UI components
- **Tailwind CSS**: ^3.4.18 — Utility-first CSS

### VS Code Extension

- **@types/vscode**: ^1.85.0 — VS Code API types
- **express**: ^5.1.0 — Extension backend server
- **markdown-it**: ^14.1.0 — Markdown rendering

## Database & Storage

- **SQLite**: Local session storage (via better-sqlite3)
- **File-based storage**: JSON configuration files

## Testing

- **vitest**: ^3.2.4 — Unit test framework
- **@vitest/coverage-v8**: ^3.1.1 — Code coverage
- **memfs**: ^4.42.0 — In-memory filesystem for testing
- **mock-fs**: ^5.5.0 — Filesystem mocking
- **msw**: ^2.10.4 — API mocking
- **@testing-library/react**: ^16.3.0 — React component testing
- **ink-testing-library**: ^4.0.0 — Ink UI testing
- **jsdom**: ^26.1.0 — DOM simulation

## Linting & Formatting

- **eslint**: ^9.24.0 — ESLint v9 flat config
- **@typescript-eslint/eslint-plugin**: ^8.30.1 — TypeScript ESLint rules
- **prettier**: ^3.5.3 — Code formatting
- **husky**: ^9.1.7 — Git hooks
- **lint-staged**: ^16.1.6 — Staged file linting

## Build & Bundling

- **esbuild**: ^0.25.0 — Ultra-fast JavaScript bundler
- **esbuild-plugin-wasm**: ^1.1.0 — WebAssembly bundling
- **tsx**: ^4.20.3 — TypeScript execution

## Key Libraries

### File & Process

- **chokidar**: ^4.0.3 — File watching
- **glob**: ^10.5.0 — File pattern matching
- **fdir**: ^6.4.6 — Fast directory traversal
- **ignore**: ^7.0.0 — .gitignore pattern matching
- **picomatch**: ^4.0.1 — Glob matching
- **shell-quote**: ^1.8.3 — Shell command parsing
- **command-exists**: ^1.2.9 — Command availability check

### Text Processing

- **marked**: ^15.0.12 — Markdown parsing
- **yaml**: ^2.7.0 — YAML parsing
- **@iarna/toml**: ^2.2.5 — TOML parsing
- **zod**: ^3.25.0 — Schema validation
- **jsonrepair**: ^3.13.0 — JSON repair
- **diff**: ^7.0.0 — Diff computation
- **fast-levenshtein**: ^2.0.6 — String similarity

### Networking

- **undici**: ^6.22.0 — HTTP client
- **https-proxy-agent**: ^7.0.6 — Proxy support
- **ws**: ^8.18.0 — WebSocket support

### Utilities

- **dotenv**: ^17.1.0 — Environment variable loading
- **uuid**: ^9.0.1 — Unique ID generation
- **open**: ^10.1.2 — Open URLs/files in browser
- **prompts**: ^2.4.2 — Interactive prompts
- **fzf**: ^0.5.2 — Fuzzy search
- **fuzzysort**: ^3.1.0 — Fuzzy matching
- **remeda**: ^2.33.7 — Functional utilities
- **async-mutex**: ^0.5.0 — Async locking
- **mnemonist**: ^0.40.3 — Data structures

### Code Analysis

- **web-tree-sitter**: ^0.24.7 — Incremental parsing
- **tree-sitter-wasms**: ^0.1.13 — Tree-sitter WASM grammars
- **chardet**: ^2.1.0 — Character encoding detection
- **iconv-lite**: ^0.6.3 — Character encoding conversion

### Git

- **simple-git**: ^3.28.0 — Git operations

### Archive & Compression

- **tar**: ^7.5.2 — Tar archive handling
- **extract-zip**: ^2.0.1 — ZIP extraction

## Optional Native Dependencies

### PTY (Pseudo-Terminal)

- **@lydell/node-pty**: 1.2.0-beta.10 — Cross-platform PTY for terminal emulation
  - Platform-specific binaries for darwin-arm64, darwin-x64, linux-x64, win32-arm64, win32-x64

### Clipboard

- **@teddyzhu/clipboard**: ^0.0.5 — Clipboard access
  - Platform-specific binaries for all major platforms

## OpenTelemetry (Observability)

- **@opentelemetry/api**: ^1.9.0
- **@opentelemetry/sdk-node**: ^0.203.0
- **@opentelemetry/instrumentation-http**: ^0.203.0
- **@opentelemetry/exporter-logs-otlp-grpc**: ^0.203.0
- **@opentelemetry/exporter-logs-otlp-http**: ^0.203.0
- **@opentelemetry/exporter-trace-otlp-grpc**: ^0.203.0
- **@opentelemetry/exporter-trace-otlp-http**: ^0.203.0
- **@opentelemetry/exporter-metrics-otlp-grpc**: ^0.203.0
- **@opentelemetry/exporter-metrics-otlp-http**: ^0.203.0

## AWS SDK (for Bedrock)

- **@aws-sdk/credential-providers**: ^3.0.0 — AWS credentials

## Developer Tools

- **cross-env**: ^7.0.3 — Cross-platform environment variables
- **npm-run-all2**: ^8.0.2 — NPM script orchestration
- **semver**: ^7.7.2 — Semantic versioning
- **strip-ansi**: ^7.1.2 — ANSI code stripping
- **wrap-ansi**: 9.0.2 — Text wrapping
- **string-width**: ^7.1.0 — String width calculation

## Security

- **google-auth-library**: ^10.5.0 — Google OAuth
- **@modelcontextprotocol/sdk**: ^1.25.1 — MCP OAuth support
