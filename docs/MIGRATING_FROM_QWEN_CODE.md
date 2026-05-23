# Migrating from HopCode to HopCode

This guide helps existing HopCode users transition to HopCode.

## What Changed

HopCode is a fork of HopCode with expanded multi-provider support, new features, and a rebranded identity. The core functionality remains the same, but there are some changes to configuration, commands, and environment variables.

## Quick Migration Checklist

- [ ] Update global installation: `npm install -g @hoptrendy/hopcode`
- [ ] Rename config directory: `mv ~/.hopcode ~/.hopcode`
- [ ] Update shell aliases: `alias hopcode='hopcode'` (replace `qwen`)
- [ ] Update IDE extensions: Install HopCode VS Code / Zed extensions
- [ ] Update CI scripts: Replace `qwen` command with `hopcode`
- [ ] Update environment variables (see below)

## Command Changes

| HopCode          | HopCode             | Notes                            |
| ---------------- | ------------------- | -------------------------------- |
| `qwen`           | `hopcode`           | Main CLI entry point             |
| `qwen --json`    | `hopcode --json`    | Headless JSON output             |
| `hopcode serve`  | `hopcode serve`     | HTTP API server                  |
| `qwen dashboard` | `hopcode dashboard` | Web dashboard                    |
| `qwen profile`   | `hopcode profile`   | Profile management               |
| —                | `hopcode grpc`      | **New** — gRPC headless server   |
| —                | `hopcode arena`     | **New** — multi-agent arena mode |

## Configuration Directory

| HopCode              | HopCode              |
| -------------------- | -------------------- |
| `~/.hopcode/`        | `~/.hopcode/`        |
| `.hopcode/agents/`   | `.hopcode/agents/`   |
| `.hopcode/skills/`   | `.hopcode/skills/`   |
| `.hopcode/commands/` | `.hopcode/commands/` |

**Migration:**

```bash
# Linux/macOS
mv ~/.hopcode ~/.hopcode

# Windows
rename %USERPROFILE%\.hopcode %USERPROFILE%\.hopcode
```

## Environment Variables

| HopCode           | HopCode           | Status                          |
| ----------------- | ----------------- | ------------------------------- |
| `HOPCODE_SIMPLE`  | `HOPCODE_SIMPLE`  | **Preferred** (old still works) |
| `HOPCODE_SANDBOX` | `HOPCODE_SANDBOX` | Update recommended              |

## Package Name Changes

| Old         | New                  |
| ----------- | -------------------- |
| `hopcode`   | `@hoptrendy/hopcode` |
| `@qwen/sdk` | `@hoptrendy/sdk`     |

**Update imports:**

```typescript
// Before
import { Query } from '@qwen/sdk';

// After
import { Query } from '@hoptrendy/sdk';
```

## IDE Extension Migration

### VS Code

1. Uninstall the HopCode extension
2. Install `hopcode-vscode-ide-companion` from the marketplace
3. Your settings will be migrated automatically on first launch

### Zed

1. Uninstall the Qwen extension
2. Install the HopCode Zed extension

## New Features in HopCode

Features not available in HopCode:

- **Multi-provider support** — Claude, GPT, Gemini, DeepSeek, Groq, Ollama, and 15+ others
- **Per-agent model routing** — Different models for different agents/tasks
- **Arena mode** — Compare multiple agents side-by-side
- **Skills system** — Modular, reusable agent capabilities
- **MCP support** — Model Context Protocol servers
- **gRPC server** — Headless API for remote integrations
- **Web dashboard** — Standalone browser-based UI
- **CLI profiles** — Switch between different configuration sets

## Breaking Changes

1. **Config directory rename** — `~/.hopcode` → `~/.hopcode`
2. **Binary name** — `qwen` → `hopcode`
3. **NPM scope** — `@qwen/*` → `@hoptrendy/*`
4. **Docker image** — `ghcr.io/qwenlm/hopcode` → `ghcr.io/taimoorsiddiquiofficial/hopcode`

## Troubleshooting

### "Command not found: hopcode"

Ensure `@hoptrendy/hopcode` is installed globally:

```bash
npm install -g @hoptrendy/hopcode
```

### "Cannot find config directory"

Run the migration command:

```bash
hopcode doctor --fix-config-path
```

### VS Code extension shows "QwenAgentManager" errors

The VS Code extension has been fully rebranded. Update to the latest version:

```bash
# In VS Code
ext install hopcode.hopcode-vscode-ide-companion
```

## Support

If you encounter issues during migration:

1. Check the [troubleshooting guide](users/support/troubleshooting.md)
2. Open an issue on [GitHub](https://github.com/TaimoorSiddiquiOfficial/HopCode/issues)
3. Join the community Discord / Telegram channels
