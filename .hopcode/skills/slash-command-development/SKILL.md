---
name: slash-command-development
description: >
  How the HopCode slash command system works and how to create a new built-in
  slash command. Use when adding a new /command, modifying an existing command's
  action or completion, debugging command dispatch, or understanding CommandContext.
  Triggers on: "add slash command", "new command", "slash command", "CommandContext",
  "/command development", "BuiltinCommandLoader".
---

# Slash Command Development

## Architecture Overview

The slash command system has four loaders that each contribute commands:

| Loader                 | Source                                                      | Kind                     |
| ---------------------- | ----------------------------------------------------------- | ------------------------ |
| `BuiltinCommandLoader` | `packages/cli/src/ui/commands/*.ts`                         | `CommandKind.BUILT_IN`   |
| `FileCommandLoader`    | `.hopcode/commands/`, `~/.hopcode/commands/` markdown files | `CommandKind.FILE`       |
| `BundledSkillLoader`   | `packages/core/src/skills/bundled/`                         | `CommandKind.SKILL`      |
| `McpPromptLoader`      | Connected MCP servers                                       | `CommandKind.MCP_PROMPT` |

`CommandService` (packages/cli/src/services/CommandService.ts) aggregates all loaders, de-duplicates, and resolves commands on `/` input.

---

## Adding a Built-in Command — Step by Step

### 1. Create the command file

Place it at `packages/cli/src/ui/commands/<name>Command.ts`:

```typescript
import type { SlashCommand } from './types.js';
import { CommandKind } from './types.js';

export const exampleCommand: SlashCommand = {
  name: 'example',
  altNames: ['ex'],
  description: 'Short description shown in /help',
  kind: CommandKind.BUILT_IN,
  supportedModes: ['interactive', 'non_interactive', 'acp'] as const,

  action: async (context, args) => {
    // Simple message return
    return {
      type: 'message',
      messageType: 'info',
      content: `You passed: ${args}`,
    };
  },
};
```

### 2. Register in BuiltinCommandLoader

In `packages/cli/src/services/BuiltinCommandLoader.ts`:

```typescript
import { exampleCommand } from '../ui/commands/exampleCommand.js';

// Inside the loadCommands() method, add to the returned array:
exampleCommand,
```

### 3. Write a test

Place at `packages/cli/src/ui/commands/exampleCommand.test.ts` — vitest, collocated.

---

## `SlashCommand` Interface

```typescript
interface SlashCommand {
  name: string;              // Primary slash trigger (without /)
  altNames?: string[];       // Aliases (/ex → /example)
  description: string;       // Shown in /help
  hidden?: boolean;          // Omit from /help listing
  kind: CommandKind;         // Always BUILT_IN for new built-ins
  supportedModes?: ExecutionMode[]; // 'interactive' | 'non_interactive' | 'acp'
  userInvocable?: boolean;   // Default: true
  modelInvocable?: boolean;  // Default: false — set true for skill-style commands
  argumentHint?: string;     // e.g., "<model-id>" shown in completion
  examples?: string[];
  action?: (context, args) => void | SlashCommandActionReturn | Promise<...>;
  completion?: (context, partialArg) => Promise<Array<string | CompletionItem> | null>;
  subCommands?: SlashCommand[];
}
```

---

## `CommandContext` — What's Available

```typescript
context.services.config        // Config | null — full app config
context.services.settings      // LoadedSettings
context.services.git           // GitService | undefined
context.services.logger        // Logger | null

context.ui.addItem(item, timestamp)  // Push a HistoryItem to the display
context.ui.clear()                   // Clear history and screen
context.ui.setPendingItem(item)      // Show a "loading" item
context.ui.loadHistory(items)        // Replace full history
context.ui.searchHistory?.(query)    // Search windowed history (interactive only)
context.ui.windowInfo?               // Current window position info

context.session.stats                // SessionStatsState
context.session.sessionShellAllowlist  // Approved shell commands this session

context.invocation.raw               // "/example foo bar" (full input)
context.invocation.name              // "example"
context.invocation.args              // "foo bar"
context.abortSignal                  // AbortSignal — respect for long ops
context.executionMode                // 'interactive' | 'non_interactive' | 'acp'
```

---

## `SlashCommandActionReturn` — Return Types

| Type                     | Effect                              | Key Fields                                    |
| ------------------------ | ----------------------------------- | --------------------------------------------- |
| `message`                | Show info/error/warning/success box | `messageType`, `content`                      |
| `stream_messages`        | Stream multiple messages            | `messages: AsyncGenerator`                    |
| `tool`                   | Invoke a core tool                  | `toolName`, `toolArgs`                        |
| `submit_prompt`          | Send content to the AI model        | `content: PartListUnion`                      |
| `dialog`                 | Open a named dialog                 | `dialog: 'auth' \| 'theme' \| 'model' \| ...` |
| `load_history`           | Replace conversation history        | `history`, `clientHistory`                    |
| `quit`                   | Exit the app                        | `messages`                                    |
| `confirm_shell_commands` | Ask user to approve shell cmds      | `commandsToConfirm`                           |
| `confirm_action`         | Show a confirmation prompt          | `prompt: ReactNode`                           |
| `startImmediateSubagent` | Spawn a subagent                    | `subagent`, `prompt`                          |

Return `undefined` (or `void`) to do nothing (the action handled everything via `context.ui`).

---

## Sub-commands Pattern

```typescript
export const parentCommand: SlashCommand = {
  name: 'parent',
  description: 'Parent command',
  kind: CommandKind.BUILT_IN,
  supportedModes: ['interactive'] as const,
  action: async (context, args) => {
    // Default action when called as /parent
    if (!args)
      return {
        type: 'message',
        messageType: 'info',
        content: 'Use /parent <sub>',
      };
    return undefined;
  },
  subCommands: [
    {
      name: 'sub',
      description: 'Sub-command',
      kind: CommandKind.BUILT_IN,
      supportedModes: ['interactive'] as const,
      action: async (context, args) => {
        return { type: 'message', messageType: 'success', content: 'Sub ran' };
      },
    },
  ],
};
```

---

## Streaming Output Example

For long-running operations that should show progress:

```typescript
action: async (context, args) => {
  return {
    type: 'stream_messages',
    messages: (async function* () {
      yield { messageType: 'info' as const, content: 'Step 1 ...' };
      await doStep1();
      yield { messageType: 'info' as const, content: 'Step 2 ...' };
      await doStep2();
      yield { messageType: 'success' as const, content: 'Done!' };
    })(),
  };
},
```

---

## TypeScript Gotchas

- **`noImplicitReturns` is enabled** — every branch of `action` must explicitly `return` something or `return undefined`. Missing returns cause type errors.
- `supportedModes` needs `as const` to satisfy the tuple literal type: `['interactive'] as const`
- The `args` parameter is deprecated — prefer `context.invocation.args` (same value, more explicit).
- `context.ui.searchHistory` and `context.ui.windowInfo` are optional (`?`) — only present in interactive mode. Guard with `if (context.ui.searchHistory)`.

---

## Key Files

| File                                                 | Purpose                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `packages/cli/src/ui/commands/types.ts`              | Full type definitions: `SlashCommand`, `CommandContext`, all return types |
| `packages/cli/src/services/BuiltinCommandLoader.ts`  | Register new built-in commands here                                       |
| `packages/cli/src/services/CommandService.ts`        | Aggregates all loaders, resolves commands                                 |
| `packages/cli/src/hooks/useSlashCommandProcessor.ts` | Dispatches commands in the React layer                                    |
| `packages/cli/src/ui/commands/historyCommand.ts`     | Good reference: sub-commands + streaming                                  |
| `packages/cli/src/ui/commands/aboutCommand.ts`       | Minimal reference: simple message return                                  |
| `packages/cli/src/ui/commands/themeCommand.ts`       | Dialog open + completion example                                          |
