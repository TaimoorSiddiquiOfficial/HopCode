---
name: memory-system
description: >
  How HopCode's long-term memory (LTM) system works — extraction, dreaming,
  recall, forgetting, and the MemoryManager API. Use when working on memory
  features (/memory, /remember, /forget, /dream), debugging memory persistence,
  implementing memory-aware tools, or understanding how the AI retains
  cross-session context. Triggers on: "memory", "LTM", "remember", "forget",
  "dream", "recall", "MemoryManager", "auto memory", "GEMINI_MEMORY".
---

# Memory System

## Overview

HopCode has a long-term memory (LTM) system that persists knowledge across
sessions. It operates through three background pipelines:

```
User conversation
      ↓
 scheduleExtract()   ← Extract facts from completed turns
      ↓
 scheduleDream()     ← Consolidate + prune memory periodically
      ↓
 recall(query)       ← Inject relevant memories into context
```

The `MemoryManager` (packages/core/src/memory/manager.ts) is the single
entry point for all memory operations. Access it via `config.getMemoryManager()`.

---

## MemoryManager Public API

```typescript
const mm = config.getMemoryManager();

// Schedule background extraction of facts from a conversation turn
await mm.scheduleExtract({
  projectRoot: '/path/to/project',
  conversation: [...], // Content[]
});

// Schedule background dream (consolidation) for a project
await mm.scheduleDream({
  projectRoot: '/path/to/project',
});

// Retrieve memories relevant to a query
const memories = await mm.recall(projectRoot, query, {
  limit: 10,          // Max items to return (default: 10)
  minRelevance: 0.5,  // Minimum relevance score
});

// Remove memories matching a query
await mm.forget(projectRoot, query, {
  dryRun: false,  // Preview what would be deleted
});

// Get memory subsystem status for a project
const status = await mm.getStatus(projectRoot);

// Wait for all in-flight background tasks to complete
await mm.drain({ timeout: 30_000 });

// Append a raw memory entry to the user's memory file
await mm.appendToUserMemory(userMemory, projectRoot);
```

---

## Memory Pipelines

### Extract

Runs after each agent turn. Calls an extraction agent (`extractAgent.ts`) that
reads the conversation and produces discrete memory entries (facts, preferences,
project decisions). Entries are written to the auto-memory store.

Key files:

- `packages/core/src/memory/extract.ts` — extraction logic
- `packages/core/src/memory/extractAgent.ts` — AI agent that identifies facts
- `packages/core/src/memory/extractionAgentPlanner.ts`

### Dream

Periodic consolidation pass. Merges duplicates, prunes stale entries, and
upgrades low-quality memories. Runs asynchronously, one project at a time.

Key files:

- `packages/core/src/memory/dream.ts` — dream execution
- `packages/core/src/memory/dreamAgentPlanner.ts`

### Recall

Retrieves memories relevant to the current query using relevance scoring.
Results are injected into the system prompt so the model has cross-session
context.

Key files:

- `packages/core/src/memory/recall.ts`
- `packages/core/src/memory/relevanceSelector.ts`

---

## Memory Storage

Memory is stored per-project under the auto-memory directory:

```
~/.hopcode/memory/<project-hash>/
  entries.json       ← Individual memory entries
  metadata.json      ← Extraction timestamps, dream status
  lock               ← Advisory lock for concurrent access
```

`packages/core/src/memory/paths.ts` — all path helpers.
`packages/core/src/memory/store.ts` — read/write to the memory store.

`isAutoMemPath(path)` — returns `true` if a file path is inside the auto-memory
directory. Tools use this to skip memory files from normal file operations.

---

## Slash Commands

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `/memory`          | Open memory browser dialog                    |
| `/remember <text>` | Immediately append a memory entry             |
| `/forget <query>`  | Delete memories matching the query            |
| `/dream`           | Trigger an immediate dream/consolidation pass |

Command files in `packages/cli/src/ui/commands/`: `memoryCommand.ts`,
`rememberCommand.ts`, `forgetCommand.ts`, `dreamCommand.ts`.

---

## Task Records

Each scheduled operation creates a `MemoryTaskRecord`:

```typescript
type MemoryTaskRecord = {
  id: string;
  type: 'extract' | 'dream';
  projectRoot: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  startedAt?: number;
  completedAt?: number;
  error?: string;
};
```

Query with `mm.getStatus(projectRoot)` to see in-flight tasks.

---

## Governance

`packages/core/src/memory/governance.ts` enforces limits:

- Max entries per project
- Max total memory size
- Entry age-based pruning thresholds

These limits prevent unbounded memory growth.

---

## Common Pitfalls

- **Memory files must not be edited or read by tools directly.** Use
  `isAutoMemPath()` to guard. Memory files appear as regular files in glob/ls
  output but modifying them directly corrupts the store.
- **`scheduleDream` is idempotent** — calling it multiple times for the same
  project is safe; only one dream runs at a time per project.
- **`drain()` in tests** — always call `await mm.drain()` before asserting
  memory state in integration tests, otherwise background tasks may not have
  written yet.
- **Production code uses `config.getMemoryManager()`** — tests that need
  isolation construct `new MemoryManager()` directly.

---

## Key Files

| File                                     | Purpose                                                 |
| ---------------------------------------- | ------------------------------------------------------- |
| `packages/core/src/memory/manager.ts`    | `MemoryManager` — single entry point for all memory ops |
| `packages/core/src/memory/extract.ts`    | Extraction pipeline                                     |
| `packages/core/src/memory/dream.ts`      | Consolidation pipeline                                  |
| `packages/core/src/memory/recall.ts`     | Relevance-based memory retrieval                        |
| `packages/core/src/memory/forget.ts`     | Memory deletion                                         |
| `packages/core/src/memory/store.ts`      | Low-level read/write to entries.json                    |
| `packages/core/src/memory/paths.ts`      | Path helpers + `isAutoMemPath()`                        |
| `packages/core/src/memory/governance.ts` | Size/count limits and pruning policy                    |
| `packages/core/src/memory/types.ts`      | Type definitions                                        |
| `packages/core/src/memory/indexer.ts`    | Memory indexing for fast recall                         |
