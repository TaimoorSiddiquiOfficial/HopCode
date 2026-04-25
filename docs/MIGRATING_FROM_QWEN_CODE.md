# Migrating from Qwen Code to HopCode

This guide helps existing Qwen Code users transition to HopCode.

## What Changed

HopCode is a fork of Qwen Code with expanded multi-provider support, new features, and a rebranded identity. The core functionality remains the same, but there are some changes to configuration, commands, and environment variables.

## Quick Migration Checklist

- [ ] Update global installation: `npm install -g @hoptrendy/hopcode`
- [ ] Rename config directory: `mv ~/.qwen ~/.hopcode`
- [ ] Update shell aliases: `alias hopcode='hopcode'` (replace `qwen`)
- [ ] Update IDE extensions: Install HopCode VS Code / Zed extensions
- [ ] Update CI scripts: Replace `qwen` command with `hopcode`
- [ ] Update environment variables (see below)

## Command Changes

| Qwen Code        | HopCode             | Notes                            |
| ---------------- | ------------------- | -------------------------------- |
| `qwen`           | `hopcode`           | Main CLI entry point             |
| `qwen --json`    | `hopcode --json`    | Headless JSON output             |
| `qwen serve`     | `hopcode serve`     | HTTP API server                  |
| `qwen dashboard` | `hopcode dashboard` | Web dashboard                    |
| `qwen profile`   | `hopcode profile`   | Profile management               |
| —                | `hopcode grpc`      | **New** — gRPC headless server   |
| —                | `hopcode arena`     | **New** — multi-agent arena mode |

## Configuration Directory

| Qwen Code         | HopCode              |
| ----------------- | -------------------- |
| `~/.qwen/`        | `~/.hopcode/`        |
| `.qwen/agents/`   | `.hopcode/agents/`   |
| `.qwen/skills/`   | `.hopcode/skills/`   |
| `.qwen/commands/` | `.hopcode/commands/` |

**Migration:**

```bash
# Linux/macOS
mv ~/.qwen ~/.hopcode

# Windows
rename %USERPROFILE%\.qwen %USERPROFILE%\.hopcode
```

## Environment Variables

| Qwen Code          | HopCode           | Status                          |
| ------------------ | ----------------- | ------------------------------- |
| `QWEN_CODE_SIMPLE` | `HOPCODE_SIMPLE`  | **Preferred** (old still works) |
| `QWEN_SANDBOX`     | `HOPCODE_SANDBOX` | Update recommended              |

## Package Name Changes

| Old         | New                  |
| ----------- | -------------------- |
| `qwen-code` | `@hoptrendy/hopcode` |
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

1. Uninstall the Qwen Code extension
2. Install `hopcode-vscode-ide-companion` from the marketplace
3. Your settings will be migrated automatically on first launch

### Zed

1. Uninstall the Qwen extension
2. Install the HopCode Zed extension

## New Features in HopCode

Features not available in Qwen Code:

- **Multi-provider support** — Claude, GPT, Gemini, DeepSeek, Groq, Ollama, and 15+ others
- **Per-agent model routing** — Different models for different agents/tasks
- **Arena mode** — Compare multiple agents side-by-side
- **Skills system** — Modular, reusable agent capabilities
- **MCP support** — Model Context Protocol servers
- **gRPC server** — Headless API for remote integrations
- **Web dashboard** — Standalone browser-based UI
- **CLI profiles** — Switch between different configuration sets

## Breaking Changes

1. **Config directory rename** — `~/.qwen` → `~/.hopcode`
2. **Binary name** — `qwen` → `hopcode`
3. **NPM scope** — `@qwen/*` → `@hoptrendy/*`
4. **Docker image** — `ghcr.io/qwenlm/qwen-code` → `ghcr.io/taimoorsiddiquiofficial/hopcode`

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
