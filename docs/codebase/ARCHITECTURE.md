# Architecture

## System Overview

HopCode is an **agentic AI coding assistant** that lives in your terminal. It combines a multi-provider LLM integration layer with a comprehensive tool system, MCP support, and a modular skills/subagents architecture.

---

## Data Flow

### Interactive Mode Flow

```
1. User runs `hopcode` in terminal
   ↓
2. CLI entry point (packages/cli/index.ts)
   ↓
3. Interactive mode (packages/cli/src/interactive.tsx)
   - Ink-based React UI renders
   - Session initialization
   ↓
4. Config loading (packages/core/src/config/config.ts)
   - Load settings.json (user + project)
   - Load environment variables
   - Initialize providers, models, tools
   ↓
5. HopCodeClient (packages/core/src/core/client.ts)
   - Main conversation loop
   - Tool scheduling and execution
   - Session management
   ↓
6. Provider layer (packages/core/src/provider/)
   - Route to selected LLM (OpenAI, Anthropic, etc.)
   - Stream response back to UI
   ↓
7. Tool execution (packages/core/src/tools/)
   - File operations (read, write, edit)
   - Shell commands
   - MCP tools
   - Subagent spawning
   - Skill invocation
   ↓
8. Output rendering (Ink UI or headless)
```

### Headless Mode Flow

```
1. User runs `hopcode -p "prompt"`
   ↓
2. Non-interactive CLI (packages/cli/src/nonInteractiveCli.ts)
   ↓
3. Single-turn execution
   - Load config
   - Create content generator
   - Execute tools
   - Output result (text/JSON)
   ↓
4. Exit
```

### Subagent Flow

```
1. Main agent decides to spawn subagent
   ↓
2. SubagentManager.loadSubagent(name)
   - Load from project/user/builtin
   - Parse AGENT.md frontmatter
   ↓
3. AgentHeadless runtime (packages/core/src/agents/runtime/)
   - Create isolated session
   - Apply tool restrictions
   - Route to model (inherit or override)
   ↓
4. Subagent executes with scoped tools
   ↓
5. Results returned to parent agent
```

### Skill Flow

```
1. User invokes skill: `hopcode skills use spec-driven`
   OR model calls SkillTool
   ↓
2. SkillManager.loadSkill(name)
   - Parse SKILL.md frontmatter
   - Load hooks configuration
   ↓
3. Register session-scoped hooks
   - Command hooks (run shell commands)
   - HTTP hooks (call external APIs)
   ↓
4. Skill body (markdown) injected into system prompt
   ↓
5. Model follows skill instructions
   ↓
6. Hooks fire on matching events
```

---

## Key Abstractions

### 1. Provider System

**File**: `packages/core/src/provider/provider.ts`

The provider system abstracts over 15+ LLM providers using the Vercel AI SDK.

```typescript
interface ProviderConfig {
  label: string;
  requiresApiKey: boolean;
  envKey?: string;
  baseUrl?: string;
  liveModels: boolean;  // Fetch models from API at runtime
  defaultModel?: string;
  categories: string[];
}
```

**Provider Registry** (23 providers):
- `openai` — OpenAI, Groq, Fireworks, Together AI, OpenRouter
- `anthropic` — Anthropic Claude
- `google` / `vertex-ai` — Google Gemini / Vertex AI
- `ollama-local` — Local Ollama models
- `groq` — Groq (ultra-fast)
- `openrouter` — OpenRouter (300+ models)
- `mistral` — Mistral AI
- `deepseek` — DeepSeek
- `xai` — xAI Grok
- `cohere` — Cohere
- `bedrock` — AWS Bedrock
- `azure` — Azure OpenAI
- `copilot` — GitHub Copilot
- `lmstudio` — LM Studio local models
- And 9 more...

**Model Resolution**:
```
User selects model "gpt-4o"
  ↓
ModelRegistry.lookup("gpt-4o")
  ↓
Returns ProviderModelConfig:
{
  id: "gpt-4o",
  name: "GPT-4o",
  provider: "openai",
  authType: "openai",
  baseUrl: "https://api.openai.com/v1"
}
  ↓
ContentGenerator created with resolved config
```

---

### 2. Tool System

**File**: `packages/core/src/tools/tools.ts`

Tools are the actions HopCode can take. Each tool is a class with:
- `invoke()` — Execute the tool
- `schema` — Zod schema for parameters
- `description` — What the tool does

**Core Tools** (63 tool files):

| Category | Tools |
|----------|-------|
| **File I/O** | `read-file`, `write-file`, `edit`, `ls`, `glob` |
| **Search** | `ripGrep`, `grep` |
| **Shell** | `shell` (execute commands) |
| **LSP** | `lsp` (language server protocol) |
| **MCP** | `mcp-client`, `mcp-tool` |
| **Web** | `web-search`, `web-fetch` |
| **Task Management** | `todoWrite`, `task-create`, `task-get`, `task-list`, `task-update`, `task-output` |
| **Agent Control** | `task-stop`, `task-ready` (spawn/kill subagents) |
| **Skills** | `skill` (invoke skills) |
| **User Interaction** | `askUserQuestion` |
| **Cron** | `cron-create`, `cron-list`, `cron-delete` |
| **Configuration** | `diffOptions` |

**Tool Registry**:
```typescript
class ToolRegistry {
  private tools: Map<ToolName, Tool<any, any>>;
  
  registerTool(tool: Tool<any, any>): void;
  getTool(name: ToolName): Tool<any, any>;
  listTools(): Tool<any, any>[];
}
```

**Permission System**:
Tools can run in different approval modes:
- `plan` — All tool calls require approval
- `default` — Edit tools require approval
- `auto-edit` — Safe edits auto-approved
- `yolo` — No approval required

---

### 3. Agent System

**File**: `packages/core/src/agents/runtime/`

HopCode uses a **multi-agent architecture** where the main agent can spawn specialized subagents.

**Agent Types**:

| Agent | Purpose |
|-------|---------|
| **Main Agent** | Primary conversation partner |
| **Subagents** | Specialized tasks (testing, review, etc.) |
| **Arena Agents** | Parallel model comparison |

**Subagent Configuration** (`AGENT.md`):
```markdown
---
name: test-engineer
description: Writes and runs tests
tools:
  - read-file
  - write-file
  - shell
approvalMode: auto-edit
model: inherit
---

You are a test engineering specialist...
```

**Runtime Config Types**:
```typescript
interface PromptConfig {
  systemPrompt: string;
  model?: string;
}

interface ModelConfig {
  authType: AuthType;
  model: string;
}

interface RunConfig {
  maxTurns?: number;
  maxTimeMinutes?: number;
}

interface ToolConfig {
  allowedTools?: string[];
  disallowedTools?: string[];
}
```

---

### 4. Skills System

**File**: `packages/core/src/skills/skill-manager.ts`

Skills are modular instruction sets that extend HopCode's capabilities.

**Skill Structure** (`SKILL.md`):
```markdown
---
name: spec-driven
description: Spec-driven TDD workflow
allowedTools:
  - read-file
  - write-file
  - shell
hooks:
  on_session_start:
    - matcher: ".*"
      hooks:
        - type: command
          command: "echo 'Starting spec-driven workflow'"
when_to_use: Use when user wants to implement a feature from a spec
---

# Spec-Driven Development Workflow

1. Read the spec...
2. Write failing tests...
3. Implement until tests pass...
```

**Skill Levels** (precedence order):
1. `session` — Runtime-provided (highest)
2. `project` — `.hopcode/skills/` in project
3. `user` — `~/.hopcode/skills/`
4. `extension` — Provided by extensions
5. `bundled` — Built-in skills (lowest)

**Built-in Skills**:
- `spec-driven` — TDD / spec-first development
- `git-workflow` — Conventional commits, PR descriptions
- `codebase-map` — Generate architecture docs
- `changelog` — Update CHANGELOG.md
- `mcp-builder` — Build MCP servers
- `review` — Code review automation
- `loop` — Recurring task loops
- `learn` — Learn from sessions
- `batch` — Batch file operations
- `qc-helper` — Qwen Code helper

---

### 5. MCP (Model Context Protocol)

**File**: `packages/core/src/mcp/`

MCP allows HopCode to connect to external data sources and tools.

**MCP Server Configuration**:
```json
{
  "mcpServers": {
    "github-copilot": {
      "httpUrl": "https://api.githubcopilot.com/mcp/",
      "oauth": { "enabled": true }
    },
    "deepwiki": {
      "httpUrl": "https://mcp.deepwiki.com/mcp"
    }
  }
}
```

**OAuth Flow**:
1. User initiates MCP connection
2. OAuth provider redirects to authorization URL
3. User grants permission
4. Token stored in `~/.hopcode/mcp-tokens.json`
5. MCP client uses token for authenticated requests

---

### 6. LSP (Language Server Protocol)

**File**: `packages/core/src/lsp/`

LSP integration provides deep code intelligence.

**LSP Features**:
- Symbol navigation (go to definition, find references)
- Hover information (type hints, documentation)
- Diagnostics (errors, warnings)
- Call hierarchy (callers/callees)
- Document symbols

**LSP Configuration** (`.hopcode/lsp.json`):
```json
{
  "servers": {
    "typescript": {
      "command": ["tsserver"],
      "filePatterns": ["*.ts", "*.tsx"]
    },
    "rust-analyzer": {
      "command": ["rust-analyzer"],
      "filePatterns": ["*.rs"]
    }
  }
}
```

---

### 7. Arena Mode

**File**: `packages/core/src/agents/arena/`

Arena mode runs multiple models in parallel on the same task.

**Flow**:
```
User: hopcode --arena gpt-4o,claude-sonnet,deepseek-r1 "refactor this"
  ↓
ArenaManager creates 3 ArenaAgentClient instances
  ↓
Each client runs independently with its model
  ↓
Responses streamed in synchronized columns
  ↓
User can compare outputs side-by-side
  ↓
/stats shows per-model token usage and cost
```

---

### 8. Hook System

**File**: `packages/core/src/hooks/`

Hooks allow external automation to integrate with HopCode sessions.

**Hook Types**:
- **Command Hooks**: Run shell commands
- **HTTP Hooks**: Call external APIs

**Hook Events**:
- `on_session_start` — When session begins
- `on_tool_call` — Before/after tool execution
- `on_agent_spawn` — When subagent is spawned
- `on_session_end` — When session ends

**Hook Configuration**:
```yaml
hooks:
  on_session_start:
    - matcher: ".*"
      hooks:
        - type: command
          command: "notify-send 'HopCode session started'"
        - type: http
          url: "https://api.example.com/hopcode-event"
          headers:
            Authorization: "Bearer ${API_KEY}"
          allowedEnvVars: ["API_KEY"]
```

---

## State Management

### Session State

**File**: `packages/core/src/services/sessionService.ts`

Sessions are persisted to disk:
- Location: `~/.hopcode/sessions/<sessionId>.json`
- Contains: Conversation history, tool calls, model config

**Session Lifecycle**:
1. Session created on startup
2. Each turn appended to history
3. Session can be resumed later
4. `/compress` command reduces token usage

### Memory System

**File**: `packages/core/src/memory/`

Auto-memory tracks important facts across sessions:
- User preferences
- Project structure notes
- Past decisions

**Memory Files**:
- `~/.hopcode/auto-memory/index.json` — Searchable index
- `GEMINI.md` files in project — Manual memory

---

## External Integrations

### GitHub Actions

**File**: `packages/cli/src/utils/githubApi.ts`

HopCode can interact with GitHub Actions:
- Check CI status
- View failure logs
- Rerun failed jobs
- Trigger workflows

**Commands**:
- `/ci` — List recent runs
- `/ci logs <run-id>` — View logs
- `/ci rerun <run-id>` — Rerun failed jobs
- `/ci cancel <run-id>` — Cancel running job
- `/ci dispatch <workflow>` — Trigger workflow

### VS Code Extension

**File**: `packages/vscode-ide-companion/src/extension.ts`

The VS Code extension provides:
- Sidebar chat view
- Diff editor integration
- Workspace context access
- Settings sync

**Communication**:
- Extension runs local HTTP server (port 7777)
- CLI connects via HTTP for IDE context
- Diff view uses VS Code native diff editor

---

## Configuration System

### Settings Resolution Order

```
1. CLI flags (--model, --provider, etc.)
2. Environment variables (HOPCODE_*, OPENAI_API_KEY, etc.)
3. Project .env files
4. User ~/.hopcode/settings.json
5. Project .hopcode/settings.json
6. Defaults
```

### Settings Schema

```typescript
interface Settings {
  modelProviders: {
    openai?: ProviderConfig[];
    anthropic?: ProviderConfig[];
    // ...
  };
  env: Record<string, string>;
  security: {
    auth: {
      selectedType: AuthType;
    };
  };
  model: {
    name: string;
  };
  agentModels: Record<string, string>;
  mcpServers: Record<string, MCPServerConfig>;
}
```

---

## Telemetry & Observability

**File**: `packages/core/src/telemetry/`

HopCode uses OpenTelemetry for tracing:

**Events Tracked**:
- Session start/end
- Tool calls (type, duration, success/failure)
- Model requests (tokens in/out, latency)
- Errors and crashes

**Exporters**:
- OTLP/gRPC — Send to observability backend
- OTLP/HTTP — HTTP-based export
- Local logging — Debug mode

**Configuration**:
```json
{
  "telemetry": {
    "enabled": true,
    "target": "otlp",
    "endpoint": "http://localhost:4317"
  }
}
```

---

## Security Model

### Authentication

**Supported Methods**:
- API Key (all providers)
- OAuth (GitHub Copilot, Google)
- AWS Credentials (Bedrock)
- Service Account Impersonation (Vertex AI)

### Sandboxing

**File**: `scripts/build_sandbox.js`

Sandboxing isolates tool execution:
- **Linux**: Docker/Podman containers
- **macOS**: Seatbelt sandbox profiles
- **Windows**: Job objects + restricted tokens

**Sandbox Configuration**:
```bash
# Enable sandboxing
export QWEN_SANDBOX=true

# Or in settings.json
{
  "sandbox": {
    "enabled": true,
    "provider": "docker"
  }
}
```

### Secret Protection

- API keys stored in `~/.hopcode/settings.json` (not committed to git)
- Secrets never logged or included in tool outputs
- MCP tokens encrypted at rest

---

## Extension Points

### 1. Add New Provider

1. Add provider config to `packages/core/src/provider/provider.ts`
2. (Optional) Add model catalog to `packages/core/src/provider/models.ts`
3. Install AI SDK provider package
4. Test with `/provider` command

### 2. Add New Tool

1. Create tool class in `packages/core/src/tools/`
2. Implement `Tool<any, any>` interface
3. Register in `ToolRegistry`
4. Add to system prompt

### 3. Add New Skill

1. Create directory in `packages/core/src/skills/bundled/`
2. Add `SKILL.md` with frontmatter + body
3. Skill auto-discovered on next startup

### 4. Add New Subagent

1. Create directory in `packages/core/src/subagents/bundled/`
2. Add `AGENT.md` with frontmatter + body
3. Subagent available via `/agent` command

### 5. Add MCP Server

1. Add server config to `~/.hopcode/settings.json`
2. Run `/mcp connect` command
3. Server tools available to model

---

## Performance Optimizations

### Tool Execution

- **Parallel Execution**: Independent tools run concurrently
- **Lazy Loading**: Tool classes loaded on first use
- **RipGrep**: Fast text search (10-100x faster than grep)

### Model Switching

- **Model Caching**: Provider instances cached by authType
- **Streaming**: Responses streamed in real-time
- **Token Counting**: Accurate token tracking for cost control

### File Operations

- **Chokidar**: Efficient file watching (debounced)
- **fdir**: Fast directory traversal
- **ignore**: .gitignore-aware file filtering

---

## Error Handling

### Error Classification

**File**: `packages/core/src/provider/error.ts`

Provider errors classified by type:
- `RATE_LIMIT` — Too many requests
- `AUTH` — Authentication failure
- `QUOTA` — API quota exceeded
- `INVALID_REQUEST` — Bad parameters
- `SERVER` — Provider server error
- `NETWORK` — Connection issues

### Error Recovery

- **Retry Logic**: Exponential backoff for transient errors
- **Fallback Models**: Switch to alternative model on error
- **Graceful Degradation**: Continue with reduced functionality

---

## Testing Strategy

### Unit Tests

- **Location**: `*.test.ts` alongside source files
- **Framework**: Vitest
- **Mocking**: memfs for filesystem, msw for HTTP

### Integration Tests

- **Location**: `integration-tests/`
- **Types**:
  - CLI tests (headless mode)
  - Interactive tests (tmux-based)
  - SDK tests
  - Terminal benchmark tests

### E2E Tests

- **Command**: `npm run test:e2e`
- **Environment**: Real model calls (sandboxed)
- **Validation**: Output correctness, latency, cost

---

## Build System

### Build Pipeline

```
npm run build
  ↓
1. TypeScript compilation (tsc)
   - packages/core/src/ → packages/core/dist/
   - packages/cli/src/ → packages/cli/dist/
   - ...
  ↓
2. Asset copying
   - SKILL.md files
   - WASM binaries
   - Tree-sitter grammars
  ↓
3. Bundle (npm run bundle)
   - esbuild bundles dist/ → dist/cli.js
   - Single executable file
```

### Bundle Size Optimization

- **Tree Shaking**: Unused code eliminated
- **WASM Embedding**: Base64-encoded in bundle
- **Native Binaries**: External (node-pty, clipboard)

---

## Deployment

### NPM Publishing

```bash
npm run release:version  # Bump versions
npm publish --workspaces # Publish all packages
```

### Docker Image

```dockerfile
FROM node:20-alpine
COPY dist/ /app/dist/
ENTRYPOINT ["node", "/app/dist/cli.js"]
```

### VS Code Extension

```bash
cd packages/vscode-ide-companion
npm run package  # Creates .vsix file
# Upload to VS Code Marketplace
```
