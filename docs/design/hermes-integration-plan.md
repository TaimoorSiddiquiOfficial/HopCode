# Hermes Agent → HopCode Feature Integration Plan

> **Date:** 2026-04-23  
> **Source:** [`docs/design/hopcode-vs-hermes-analysis.md`](./hopcode-vs-hermes-analysis.md)  
> **Goal:** Prioritize and plan adoption of Hermes Agent capabilities into HopCode

---

## Priority Matrix

| Priority | Feature                             | Hermes Implementation                | HopCode Fit                                                      | Effort | Impact      | Confidence |
| -------- | ----------------------------------- | ------------------------------------ | ---------------------------------------------------------------- | ------ | ----------- | ---------- |
| **P0**   | FTS5 Session Search                 | SQLite + FTS5 in `hermes_state.py`   | Add SQLite/FTS5 backend alongside file-based memory              | High   | 🔥 Critical | High       |
| **P0**   | Discord / Slack / WhatsApp channels | `gateway/` platform adapters         | Extend `packages/channels/` pattern                              | Medium | 🔥 Critical | High       |
| **P1**   | Self-improving skills               | Agent-curated skills from experience | Extend `packages/core/src/skills/` with ML-based skill evolution | High   | ⭐ High     | Medium     |
| **P1**   | User profiling / dialectic memory   | Honcho integration + `USER.md`       | Extend managed auto-memory with user-level persistence           | High   | ⭐ High     | Medium     |
| **P1**   | Serverless backends (Modal/Daytona) | 6 terminal backends                  | Add new agent backend types alongside Docker/Podman              | Medium | ⭐ High     | Medium     |
| **P2**   | Voice support                       | Built-in TTS/STT                     | Add optional voice pipeline                                      | Medium | ⭐ High     | Low        |
| **P2**   | Android/Termux                      | Curated `.[termux]` extra            | Test + document Termux compatibility                             | Low    | Medium      | High       |
| **P2**   | Profile isolation                   | `hermes -p <name>`                   | Add `--profile` CLI flag                                         | Low    | Medium      | High       |
| **P2**   | Context files (`.hopcode.md`)       | `.hermes.md` project context         | Add `.hopcode.md` auto-loading                                   | Low    | Medium      | High       |
| **P3**   | RL training infra                   | Atropos environments                 | Not applicable — research-only                                   | High   | Low         | Low        |

---

## Detailed Integration Plans

---

### P0: FTS5 Session Search

**Current State:**  
HopCode memory is file-based (`memory/` module uses `node:fs/promises`, JSON files, and token-matching recall). `recall.ts` scores documents with `tokenize()` + `scoreDocument()` — no full-text search.

**What Hermes Does:**  
SQLite database with FTS5 extension for full-text search across ALL past conversations. LLM summarization for cross-session recall.

**Integration Plan:**

```
packages/core/src/memory/
├── fts5/                    # NEW: SQLite + FTS5 backend
│   ├── connection.ts        # SQLite connection pool
│   ├── schema.ts            # CREATE TABLE / CREATE VIRTUAL TABLE fts5
│   ├── indexer.ts           # Index conversation turns into FTS5
│   ├── search.ts            # Full-text search with ranking
│   └── summarizer.ts        # LLM-based result summarization
├── store.ts                 # EXISTING: file-based storage
└── manager.ts               # UPDATED: choose backend (file / fts5 / hybrid)
```

**Key Implementation Points:**

1. Add `better-sqlite3` or `sqlite3` dependency to `packages/core/package.json`
2. Create `Fts5MemoryBackend` implementing same interface as file-based backend
3. On startup, migrate existing `.hopcode/memory/` JSON files into SQLite
4. Add `/search` or `/find` CLI command for cross-session FTS5 search
5. Telemetry: track search latency, result quality

**Files to modify:**

- `packages/core/src/memory/manager.ts` — add backend selection
- `packages/core/src/memory/types.ts` — add FTS5 types
- `packages/core/package.json` — add `better-sqlite3` dependency
- `packages/cli/src/commands/` — add `/search` command

---

### P0: Expand Messaging Channels

**Current State:**  
`packages/channels/` has: `telegram`, `weixin`, `dingtalk`, plus `base` abstraction.

**What Hermes Does:**  
18 platform adapters: Telegram, Discord, Slack, WhatsApp, Signal, Home Assistant, and more.

**Integration Plan:**

```
packages/channels/
├── base/                    # EXISTING
├── telegram/                # EXISTING
├── weixin/                  # EXISTING
├── dingtalk/                # EXISTING
├── discord/                 # NEW
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── adapter.ts       # Discord bot adapter
│   │   └── types.ts
│   └── README.md
├── slack/                   # NEW
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── adapter.ts       # Slack bot adapter
│   │   └── types.ts
│   └── README.md
├── whatsapp/                # NEW (optional — complex due to Meta API)
└── signal/                  # NEW (optional — requires signal-cli)
```

**Key Implementation Points:**

1. Extend `ChannelBase` interface in `packages/channels/base/` for real-time messaging
2. Discord: use `discord.js` library, bot token auth
3. Slack: use `@slack/bolt` library, app token + bot token
4. WhatsApp: use `whatsapp-web.js` or official Cloud API
5. Each adapter handles webhook/websocket → message event → AI response → send reply
6. Gateway process (`hopcode gateway start`) routes messages to correct adapter

**Files to modify:**

- `packages/channels/base/src/index.ts` — extend base interface
- `packages/cli/package.json` — add channel dependencies
- `packages/cli/src/commands/gateway.ts` — add gateway start/stop commands

---

### P1: Self-Improving Skills

**Current State:**  
Skills are static Markdown files loaded from `.hopcode/skills/` or URLs. 5 bundled skills (`spec-driven`, `git-workflow`, `codebase-map`, `changelog`, `mcp-builder`). No learning capability.

**What Hermes Does:**  
After complex tasks, agent autonomously creates new skills. Skills self-improve during use via usage telemetry. Compatible with `agentskills.io` open standard.

**Integration Plan:**

```
packages/core/src/skills/
├── bundled/                 # EXISTING
├── custom/                  # EXISTING
├── evolution/               # NEW: self-improving skill system
│   ├── observer.ts            # Watch task outcomes → identify pattern
│   ├── creator.ts             # Generate new SKILL.md from successful task
│   ├── improver.ts          # Update existing skill based on usage feedback
│   ├── registry.ts          # Track skill versions + performance metrics
│   └── types.ts
├── marketplace/             # NEW: skills hub integration
│   ├── client.ts            # API client for agentskills.io
│   ├── search.ts            # Search public skills
│   └── publish.ts           # Publish evolved skills
└── index.ts                 # UPDATED: register evolution pipeline
```

**Key Implementation Points:**

1. After successful multi-tool task completion, trigger `SkillEvolutionObserver`
2. Observer uses LLM to identify if task represents a reusable pattern
3. If pattern detected, `SkillCreator` generates `SKILL.md` with:
   - `title`, `description`, `when_to_use` (auto-generated)
   - `instructions` (extracted from successful task steps)
   - `examples` (from actual task)
4. Store evolved skills in `.hopcode/skills/evolved/`
5. `SkillImprover` tracks success/failure rates per skill, prompts LLM to update instructions
6. Add `/skills evolved` command to browse auto-generated skills
7. Optional: integrate with `agentskills.io` Hub

**Files to modify:**

- `packages/core/src/skills/index.ts` — hook into turn completion
- `packages/core/src/core/client.ts` — emit skill evolution events
- `packages/cli/src/commands/skills.ts` — add `evolved` subcommand

---

### P1: User Profiling / Dialectic Memory

**Current State:**  
Memory is per-project (`MEMORY.md`, auto-memory topics). No cross-project user profile.

**What Hermes Does:**  
Honcho dialectic modeling — builds deepening understanding of user across sessions. Dedicated `USER.md` file.

**Integration Plan:**

```
~/.hopcode/
├── settings.json            # EXISTING
├── profiles/
│   └── default/
│       ├── user-memory.md   # NEW: cross-project user profile
│       ├── preferences.json # NEW: structured preferences
│       └── dialectic/       # NEW: Honcho-style conversation analysis
│           ├── model.ts       # User model (communication style, expertise areas)
│           └── updates/     # Incremental updates from sessions
└── memory/                  # EXISTING (per-project)
```

**Key Implementation Points:**

1. Add `UserProfileManager` to `packages/core/src/memory/`
2. After each session, trigger dialectic analysis: LLM reads conversation + existing `user-memory.md` → generates/update user model
3. User model tracks:
   - Communication preferences (terse/verbose, technical level)
   - Expertise areas (detected from code being worked on)
   - Rules/feedback (automatically add to `feedback` memory type)
   - Goals (detected from project context)
4. Inject user profile into system prompt for every new session
5. Add `/profile` command to review/edit user model

**Files to modify:**

- `packages/core/src/memory/manager.ts` — add user profile lifecycle
- `packages/core/src/core/prompts.ts` — inject user profile
- `packages/cli/src/commands/` — add `/profile` command

---

### P1: Serverless Backends (Modal / Daytona)

**Current State:**  
Agent backends: `InProcessBackend`, `TmuxBackend`, `ITermBackend`. Sandbox: Docker/Podman.

**What Hermes Does:**  
6 backends: local, Docker, SSH, Daytona, Singularity, Modal. Dayton/Modal offer serverless hibernation.

**Integration Plan:**

```
packages/core/src/agents/backends/
├── detect.ts                # EXISTING
├── index.ts                 # EXISTING
├── InProcessBackend.ts      # EXISTING
├── ITermBackend.ts          # EXISTING
├── TmuxBackend.ts           # EXISTING
├── types.ts                 # EXISTING
├── DaytonaBackend.ts        # NEW
│   └── daytona integration
├── ModalBackend.ts          # NEW
│   └── modal integration
└── SshBackend.ts            # NEW
    └── ssh remote agent
```

**Key Implementation Points:**

1. **Daytona**: Use `@daytonaio/sdk` to create sandbox → run hopcode inside → stream results back
2. **Modal**: Use `@modal-labs/client` to deploy hopcode as Modal function → invoke remotely
3. **SSH**: Standard SSH exec for remote agent execution
4. Each backend implements `AgentBackend` interface:
   - `createAgent()` — provision sandbox/serverless function
   - `sendInput()` — send user prompt
   - `readOutput()` — stream tool results
   - `terminate()` — stop / hibernate
5. Add `--backend` CLI flag: `hopcode --backend modal`

**Files to modify:**

- `packages/core/src/agents/backends/detect.ts` — detect available backends
- `packages/core/src/agents/backends/types.ts` — extend interface
- `packages/cli/src/` — add `--backend` flag + auth for Daytona/Modal

---

### P2: Voice Support

**Current State:**  
Text-only interface. No audio pipeline.

**What Hermes Does:**  
Built-in TTS (text-to-speech) + STT (speech-to-text) for voice memos.

**Integration Plan:**

```
packages/core/src/voice/
├── stt.ts                   # Speech-to-text pipeline
│   └── providers: whisper, groq-whisper, openai-whisper
├── tts.ts                   # Text-to-speech pipeline
│   └── providers: elevenlabs, openai-tts, piper (local)
├── recorder.ts              # Microphone capture (node-record-lpcm16 or similar)
├── player.ts                # Audio playback (node-speaker or similar)
└── types.ts
```

**Key Implementation Points:**

1. Add optional `voice` dependency group: `@hoptrendy/hopcode-voice`
2. In interactive mode, detect voice message (e.g., special file type or flag)
3. STT: transcribe → send as text prompt
4. TTS: synthesize AI response → play audio
5. CLI flag: `hopcode --voice` or `--stt-provider whisper --tts-provider elevenlabs`

**Files to modify:**

- `packages/cli/src/` — add voice mode to interactive UI
- `packages/core/src/config/models.ts` — add voice model configs

---

### P2: Android / Termux Support

**Current State:**  
Requires Node.js 20+. Not tested on Android/Termux.

**What Hermes Does:**  
Curated `.[termux]` extra with compatible dependencies.

**Integration Plan:**

1. Test `npm install` in Termux environment
2. Identify incompatible native dependencies (node-pty, clipboard, etc.)
3. Make `@lydell/node-pty` optional or provide fallback
4. Document Termux installation in README
5. Add CI test for Termux compatibility

**Effort:** Low (mostly testing + documentation)

---

### P2: Profile Isolation

**Current State:**  
Single `~/.hopcode/` directory. No isolated profiles.

**What Hermes Does:**  
`hermes -p <name>` creates fully isolated `HERMES_HOME`.

**Integration Plan:**

```bash
# Usage
hopcode --profile work          # Use ~/.hopcode-profiles/work/
hopcode --profile personal      # Use ~/.hopcode-profiles/personal/
hopcode profile list
hopcode profile create work
hopcode profile delete work
```

**Key Implementation Points:**

1. Add `--profile` CLI flag
2. Modify `Storage.getGlobalHopCodeDir()` to respect `HOPCODE_PROFILE` env or `--profile`
3. Profile directory: `~/.hopcode-profiles/<name>/`
4. Add `hopcode profile` subcommands to CLI

**Files to modify:**

- `packages/core/src/config/storage.ts` — add profile path resolution
- `packages/cli/src/commands/` — add `profile` command group

---

### P2: Context Files (`.hopcode.md`)

**Current State:**  
Project context via `.hopcode/settings.json` only.

**What Hermes Does:**  
`.hermes.md` files auto-loaded as project context — shapes every conversation.

**Integration Plan:**

1. On startup, scan for `.hopcode.md` in project root
2. If found, prepend contents to system prompt (like AGENTS.md)
3. Support `.hopcode.md` in parent directories (inherits upward)
4. CLI command: `/context` to view/edit current context file

**Files to modify:**

- `packages/core/src/core/prompts.ts` — load `.hopcode.md`
- `packages/core/src/config/config.ts` — add context file path

---

## Implementation Order Recommendation

### Phase 1 (Immediate — 2-4 weeks)

1. **Profile isolation** (`--profile`) — Easy win, high user value
2. **Context files** (`.hopcode.md`) — Easy win, improves onboarding
3. **Android/Termux testing** — Low effort, expands addressable market

### Phase 2 (Short-term — 1-2 months)

4. **Discord + Slack channels** — High impact, extend existing pattern
5. **FTS5 Session Search** — Major differentiator, requires SQLite integration
6. **Serverless backends** (Modal/Daytona) — Technical differentiator

### Phase 3 (Medium-term — 2-3 months)

7. **User profiling** (Honcho-style dialectic memory) — Deep personalization
8. **Self-improving skills** — True AI differentiator
9. **Voice support** — Accessibility + mobile

### Phase 4 (Long-term — 3+ months)

10. **WhatsApp + Signal channels** — Complex due to API requirements
11. **RL training infrastructure** — Research angle, not user-facing

---

## Metrics for Success

| Feature               | Metric                             | Target                   |
| --------------------- | ---------------------------------- | ------------------------ |
| FTS5 Search           | Cross-session search latency       | < 200ms for 10k sessions |
| Discord/Slack         | Channel uptime                     | > 99% over 7 days        |
| Self-improving skills | Auto-generated skills accepted     | > 60% user acceptance    |
| User profiles         | Cross-project recall accuracy      | > 80% relevance          |
| Serverless            | Modal/Daytona backend success rate | > 95%                    |
| Voice                 | STT accuracy (WER)                 | < 10%                    |
| Profile isolation     | Profile switch time                | < 1s                     |
| Context files         | `.hopcode.md` adoption             | > 40% of active projects |
| Android/Termux        | Install success rate               | > 90%                    |

---

_Generated 2026-04-23. See companion doc [`hopcode-vs-hermes-analysis.md`](./hopcode-vs-hermes-analysis.md) for full competitive analysis._
