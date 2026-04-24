# Competitive Feature Matrix: HopCode vs Hermes-Agent vs OpenClaude

> Last updated: 2026-04-23
> Purpose: Track feature parity and competitive positioning across terminal-first AI coding agents.

---

## Project Metadata

| Attribute    | HopCode                     | Hermes-Agent          | OpenClaude            |
| ------------ | --------------------------- | --------------------- | --------------------- |
| **Language** | TypeScript (strict, ESM)    | Python + TypeScript   | TypeScript (Bun/Node) |
| **Version**  | 0.15.1                      | 0.10.0 (Apr 16, 2026) | 0.6.0 (Apr 22, 2026)  |
| **Stars**    | —                           | **111k**              | 23.8k                 |
| **Forks**    | —                           | 16.2k                 | 7.9k                  |
| **License**  | Apache-2.0                  | Apache-2.0            | Apache-2.0            |
| **Origin**   | Qwen Code / Gemini CLI fork | Nous Research         | Claude Code offshoot  |

---

## Core Agent Capabilities

| Feature                  |    HopCode    |                Hermes                |       OpenClaude       | Notes                                                            |
| ------------------------ | :-----------: | :----------------------------------: | :--------------------: | ---------------------------------------------------------------- |
| Terminal-first CLI       |      ✅       |                  ✅                  |           ✅           | All three are terminal-native                                    |
| Interactive TUI          |  Ink (React)  |              Custom TUI              |       Custom TUI       | Hermes has multiline editing                                     |
| Headless / CI mode       |     JSONL     |                 Yes                  |      gRPC + JSONL      | OpenClaude gRPC on port 50051                                    |
| Multi-provider support   |      15+      |         OpenRouter + custom          | 200+ via OpenAI-compat | HopCode supports Anthropic, Gemini, DeepSeek, Groq, Ollama, etc. |
| Per-agent model routing  |      ✅       |               Partial                |  ✅ (`agentRouting`)   | **Added recently to HopCode**                                    |
| Vision / image inputs    |      ✅       |                  ✅                  |           ✅           |                                                                  |
| Web search               |   Pluggable   |                 Yes                  |   DuckDuckGo default   | HopCode needs default search provider                            |
| Web fetch                |      ✅       |                 Yes                  |          Yes           |                                                                  |
| File read / write / edit |      ✅       |                  ✅                  |           ✅           |                                                                  |
| Grep / glob / ls         |      ✅       |                  ✅                  |           ✅           |                                                                  |
| Bash / shell execution   |   ✅ (PTY)    |                  ✅                  |           ✅           | HopCode uses `node-pty`                                          |
| Sandboxed execution      | Docker/Podman | Docker/SSH/Daytona/Singularity/Modal |         Docker         | Hermes has **6 backends**                                        |
| Saved provider profiles  |      ✅       |                 Yes                  |           ✅           |                                                                  |
| CLI profiles             |      ✅       |                 Yes                  |          Yes           |                                                                  |

---

## Advanced Agent Features

| Feature                            |    HopCode    |         Hermes          | OpenClaude | Priority for HopCode                         |
| ---------------------------------- | :-----------: | :---------------------: | :--------: | -------------------------------------------- |
| **Self-improving RL loop**         |      ❌       |   ✅ (Tinker-Atropos)   |     ❌     | **High** — Hermes's core differentiator      |
| **Cross-session memory / recall**  |  Auto-memory  | ✅ (FTS5 + LLM summary) |   Basic    | Medium — add FTS5 to `MemoryStore`           |
| **Honcho dialectic user modeling** |      ❌       |           ✅            |     ❌     | Medium                                       |
| **Skill evolution / auto-skills**  | Static skills |    ✅ (auto-curated)    |   Static   | Medium                                       |
| **Cron / scheduled tasks**         |      ✅       |           ✅            |     ❌     | **Advantage**                                |
| **Background tasks / subagents**   |      ✅       |    ✅ (RPC workers)     |  Partial   | Parity                                       |
| **Arena mode**                     |      ✅       |           ❌            |     ❌     | **Advantage**                                |
| **MCP (Model Context Protocol)**   |      ✅       |           ✅            |     ✅     | Parity                                       |
| **agentskills.io standard**        |      ❌       |           ✅            |     ❌     | Medium — adopt standard for interoperability |

---

## Integrations & Deployment

| Feature                       |                   HopCode                    |       Hermes        | OpenClaude | Notes                             |
| ----------------------------- | :------------------------------------------: | :-----------------: | :--------: | --------------------------------- |
| VS Code extension             |                      ✅                      |         ❌          |     ✅     |                                   |
| Zed extension                 |                      ✅                      |         ❌          |     ❌     | **Advantage**                     |
| Standalone Web UI / dashboard |              ✅ (web-dashboard)              |      ✅ (web/)      |     ❌     | **Recently added to HopCode**     |
| Telegram channel              |                      ✅                      |         ✅          |     ❌     |                                   |
| Discord channel               |                      ❌                      |         ✅          |     ❌     | **Gap**                           |
| Slack channel                 |                      ❌                      |         ✅          |     ❌     | **Gap**                           |
| Signal channel                |                      ❌                      |         ✅          |     ❌     | **Gap**                           |
| WhatsApp channel              |                      ❌                      |         ✅          |     ❌     | **Gap**                           |
| Email channel                 |                      ❌                      |         ✅          |     ❌     | **Gap**                           |
| WeChat channel                |                      ✅                      |         ❌          |     ❌     | **Advantage**                     |
| DingTalk channel              |                      ✅                      |         ❌          |     ❌     | **Advantage**                     |
| Docker deployment             |                      ✅                      |         ✅          |     ✅     |                                   |
| Serverless / Modal            |                      ❌                      |         ✅          |     ❌     | **Gap** — Modal support in Hermes |
| gRPC API server               | ✅ (MVP — `packages/server`, `hopcode grpc`) | Partial (RPC tools) |     ✅     | **Gap closed**                    |
| TypeScript SDK                |                      ✅                      |         ❌          |     ❌     | **Advantage**                     |
| Java SDK                      |                      ✅                      |         ❌          |     ❌     | **Advantage**                     |

---

## Memory & Persistence

| Feature                         | HopCode |      Hermes      | OpenClaude |
| ------------------------------- | :-----: | :--------------: | :--------: |
| Auto-memory extraction          |   ✅    |        ✅        |   Basic    |
| Memory indexing                 |   ✅    |    ✅ (FTS5)     |   Basic    |
| Memory dreaming / consolidation |   ✅    |        ✅        |     ❌     |
| Project memory                  |   ✅    |        ✅        |   Basic    |
| User memory                     |   ✅    | Honcho dialectic |   Basic    |
| Feedback memory                 |   ✅    |        ✅        |   Basic    |
| Full-text search (FTS5)         |   ❌    |        ✅        |     ❌     |

---

## Competitive Velocity

| Metric              | HopCode         | Hermes          | OpenClaude       |
| ------------------- | --------------- | --------------- | ---------------- |
| Latest release date | ~0.15.1 (stale) | Apr 16, 2026    | **Apr 22, 2026** |
| Release cadence     | Unknown         | Weekly/biweekly | **Weekly**       |
| Stars               | —               | **111k**        | 23.8k            |
| Community size      | Small           | Very large      | Medium           |

**Alert:** Both competitors released within the last week. HopCode has not shipped a release recently. Urgency to close gaps and ship is high.

---

## Strategic Recommendations

### Immediate (This Week)

1. **Fix rebranding debt** — `Dockerfile` entrypoint, env var names, internal `Gemini*` classes.
2. **Ship a release** — Version is stuck at 0.15.1. Cut 0.16.0 with Arena, per-agent routing, web-dashboard, skills, and MCP.
3. **Bundle size audit** — Profile `dist/cli.js` and enforce a CI budget.

### Short-Term (Month)

4. **gRPC Headless Server** — This is the single biggest gap vs OpenClaude. A gRPC server with bidirectional streaming unlocks remote agents, microservices, and better IDE integrations.
5. **DuckDuckGo Default Search** — Add DuckDuckGo as the default web search provider to match OpenClaude's out-of-box experience.
6. **Discord / Slack Adapters** — Expand `packages/channels/` to close the messaging gap vs Hermes.

### Medium-Term (Quarter)

7. **FTS5 Memory** — Add SQLite FTS5 to `MemoryStore` for full-text recall.
8. **Serverless Templates** — Create Modal / Docker Compose templates for cloud deployment.
9. **agentskills.io Standard** — Evaluate adopting the emerging skill standard for interoperability.

### Long-Term

10. **RL / Self-Improvement Loop** — Design feedback hooks where tool success/failure trains skill weights. This is Hermes's core moat.
11. **Worker Agent Pool** — Extend subagents into a distributed pool for parallel execution.

---

## How to Update This Matrix

When adding a new feature or discovering a competitor update:

1. Edit this file directly.
2. Update the `Last updated` header.
3. If a gap is closed, move the row to the "Parity" section and strike through the old priority.
4. Open a PR with `[competitive-matrix]` in the title for traceability.
