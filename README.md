<div align="center">

[![npm version](https://img.shields.io/npm/v/@hoptrendy/hopcode.svg)](https://www.npmjs.com/package/@hoptrendy/hopcode)
[![License](https://img.shields.io/github/license/TaimoorSiddiquiOfficial/HopCode.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![Downloads](https://img.shields.io/npm/dm/@hoptrendy/hopcode.svg)](https://www.npmjs.com/package/@hoptrendy/hopcode)

<a href="https://trendshift.io/repositories/15287" target="_blank"><img src="https://trendshift.io/api/badge/repositories/15287" alt="TaimoorSiddiquiOfficial%2Fhopcode | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

**The open-source AI coding agent that lives in your terminal.**

<a href="https://taimoorsiddiquiofficial.github.io/hopcode-docs/zh/users/overview">中文</a> |
<a href="https://taimoorsiddiquiofficial.github.io/hopcode-docs/de/users/overview">Deutsch</a> |
<a href="https://taimoorsiddiquiofficial.github.io/hopcode-docs/fr/users/overview">français</a> |
<a href="https://taimoorsiddiquiofficial.github.io/hopcode-docs/ja/users/overview">日本語</a> |
<a href="https://taimoorsiddiquiofficial.github.io/hopcode-docs/ru/users/overview">Русский</a> |
<a href="https://taimoorsiddiquiofficial.github.io/hopcode-docs/pt-BR/users/overview">Português (Brasil)</a>

</div>

## Why HopCode?

- **Agentic out of the box** — Auto-Memory, Auto-Skills, SubAgents, Agent Teams, and MCP. Dynamic workflows, zero setup.
- **Open-source, inside and out** — The framework and the Qwen models are open-source. They evolve together. No vendor lock-in.
- **Multi-protocol** — Supports OpenAI, Anthropic, Gemini, and Qwen APIs. Any third-party provider or local model (Ollama / vLLM). Switch at runtime.
- **Beyond the terminal** — IDE plugins, Desktop app, daemon mode, SDKs, and IM bots (Telegram / DingTalk / WeChat / Feishu).

> [!TIP]
> HopCode is actively iterating on itself — using its own agent and models to file issues, submit PRs, review code, and run tests. Powered by the community, driven by AI.

## Installation

**Linux / macOS:**

```bash
curl -fsSL https://hopcode-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-hopcode-standalone.sh | bash
```

**Windows:**

```powershell
irm https://hopcode-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-hopcode-standalone.ps1 | iex
```

> Restart your terminal after installation to ensure environment variables take effect.

<details>
<summary>NPM / Homebrew</summary>

**NPM** (requires [Node.js 22+](https://nodejs.org/)):

```bash
npm install -g @hoptrendy/hopcode@latest
```

**Homebrew** (macOS / Linux):

```bash
brew install hopcode
```

</details>

## Quick Start

```bash
hopcode          # Launch interactive terminal UI
# Inside the session:
/auth         # Configure your provider and API key
```

See the [Authentication Guide](https://taimoorsiddiquiofficial.github.io/hopcode-docs/en/users/configuration/auth/) and [Settings Reference](https://taimoorsiddiquiofficial.github.io/hopcode-docs/en/users/configuration/settings/) for detailed setup.

![HopCode](https://img.alicdn.com/imgextra/i2/O1CN01K0nwj41RM1Il8kB0t_!!6000000002096-2-tps-1544-1060.png)

## How to Use HopCode

| Mode            | Command            | Use Case                                                                                                                                                                                                                                                                                     |
| --------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Interactive** | `hopcode`          | Terminal UI with rich rendering, `@file` references, slash commands                                                                                                                                                                                                                          |
| **Headless**    | `hopcode -p "..."` | Scripts, CI/CD, batch processing — no UI                                                                                                                                                                                                                                                     |
| **IDE**         | —                  | [VS Code](https://taimoorsiddiquiofficial.github.io/hopcode-docs/en/users/integration-vscode/), [Zed](https://taimoorsiddiquiofficial.github.io/hopcode-docs/en/users/integration-zed/), [JetBrains](https://taimoorsiddiquiofficial.github.io/hopcode-docs/en/users/integration-jetbrains/) |
| **Desktop**     | —                  | [HopCode Desktop](https://github.com/TaimoorSiddiquiOfficial/HopCode/releases/tag/desktop-latest) — GUI for macOS, Windows, Linux                                                                                                                                                            |
| **Daemon**      | `hopcode serve`    | Shared agent session over HTTP+SSE (ACP). Multiple clients, one agent. _(experimental)_ [Docs](https://taimoorsiddiquiofficial.github.io/hopcode-docs/en/users/hopcode-serve)                                                                                                                |
| **SDK**         | —                  | [TypeScript](./packages/sdk-typescript/README.md), [Python](./packages/sdk-python/README.md), [Java](./packages/sdk-java/hopcode/README.md)                                                                                                                                                  |
| **IM Bot**      | `hopcode channel`  | Connect to Telegram, DingTalk, WeChat, or Feishu                                                                                                                                                                                                                                             |

<details>
<summary>SDK example (Python)</summary>

```python
import asyncio

from hopcode_sdk import is_sdk_result_message, query


async def main() -> None:
    result = query(
        "Summarize the repository layout.",
        {
            "cwd": "/path/to/project",
            "path_to_hopcode_executable": "hopcode",
        },
    )

    async for message in result:
        if is_sdk_result_message(message):
            print(message["result"])


asyncio.run(main())
```

</details>

## Capabilities

If you know Claude Code, you already know HopCode — and then some. We've put significant effort into [bringing HopCode to feature parity with Claude Code](https://github.com/wenshao/codeagents/blob/main/docs/comparison/hopcode-improvement-report.md), improving both breadth and reliability across the board.

| Feature                                                            | HopCode | Claude Code |
| ------------------------------------------------------------------ | :-----: | :---------: |
| SubAgents, Agent Teams, Dynamic Workflows                          |    ✓    |      ✓      |
| Auto-Memory, Auto-Skills, Hooks                                    |    ✓    |      ✓      |
| Built-in Skills (/review, /batch, /loop, /bugfix…)                 |    ✓    |      ✓      |
| MCP, Plan Mode, LSP Integration                                    |    ✓    |      ✓      |
| Auto Mode, Sandbox, Git Worktrees                                  |    ✓    |      ✓      |
| Computer Use (desktop automation)                                  |    ✓    |      ✓      |
| IDE Plugins (VS Code / JetBrains / Zed)                            |    ✓    |      ✓      |
| SDK                                                                |    ✓    |      ✓      |
| Headless Mode, Session Management                                  |    ✓    |      ✓      |
| Open-source — model and framework                                  |    ✓    |      —      |
| Multi-protocol (OpenAI / Anthropic / Gemini / Qwen + any provider) |    ✓    |      —      |
| Agent Arena (multi-model head-to-head on same task)                |    ✓    |      —      |
| Daemon Mode — `hopcode serve` (multi-client shared agent)          |    ✓    |      —      |
| IM Channels (Telegram / DingTalk / WeChat / Feishu)                |    ✓    |      —      |

## Ecosystem

- [**HopCode Desktop**](https://github.com/TaimoorSiddiquiOfficial/HopCode/releases/tag/desktop-latest) — Official desktop app for macOS, Windows, and Linux
- [**AionUi**](https://github.com/iOfficeAI/AionUi) — A modern GUI for command-line AI tools including HopCode
- [**Gemini CLI Desktop**](https://github.com/Piebald-AI/gemini-cli-desktop) — A cross-platform desktop/web/mobile UI for HopCode

- [**🦞 HopCode Claw**](https://github.com/openclaw/acpx) — Let other agents (Claude, Codex, etc.) delegate coding tasks to HopCode via ACP. Paste this prompt into your agent:

```text
Use HopCode as a coding agent. First, fetch and read this skill reference:
https://raw.githubusercontent.com/TaimoorSiddiquiOfficial/HopCode/refs/heads/main/.hopcode/skills/hopcode-claw/SKILL.md
Then follow the instructions inside to install, authenticate, and use HopCode via acpx for all coding tasks.
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Acknowledgments

This project was originally based on [Google Gemini CLI](https://github.com/google-gemini/gemini-cli) v0.8.2. We gratefully acknowledge the Gemini CLI team's excellent work. Starting from HopCode v0.1, we stopped syncing with upstream and began independent development as a multi-protocol, multi-platform agent framework with deep integrations for Qwen models and beyond.
