---
name: tool-development
description: >
  How HopCode tools work and how to create a new tool that the AI model can
  invoke. Use when adding a new tool, modifying tool permission logic, debugging
  tool execution or confirmation flows, or understanding how tools integrate with
  the permission system. Triggers on: "add tool", "new tool", "tool development",
  "BaseDeclarativeTool", "ToolInvocation", "tool permission", "tool confirmation",
  "tool registry", "coreToolScheduler".
---

# Tool Development

## Overview

Tools are the actions the AI model can invoke (file edit, shell, grep, MCP calls,
browser, etc.). Each tool consists of:

1. **A declaration** — JSON schema the model sees (name, description, parameters)
2. **An invocation class** — validates params and executes the action
3. **A builder** — links declaration to invocation class, registered in the tool registry

---

## Tool Lifecycle

```
Model output (tool_call)
      ↓
 ToolRegistry.get(toolName)   ← Lookup by name
      ↓
 builder.build(params)        ← Validate params, create ToolInvocation
      ↓
 invocation.getDefaultPermission()  ← 'allow' | 'ask' | 'deny'
      ↓
 PermissionManager             ← May upgrade/downgrade permission
      ↓
 invocation.getConfirmationDetails()  ← Only if permission = 'ask'
      ↓
 invocation.execute(signal)   ← Run the tool
      ↓
 ToolResult returned to model
```

---

## Base Classes

### `BaseDeclarativeTool` (recommended)

For tools declared with a static JSON schema and a Zod validator:

```typescript
import { BaseDeclarativeTool, Kind } from './tools.js';
import type { ToolInvocation, ToolResult } from './tools.js';
import type { Config } from '../config/config.js';

// 1. Define params type
interface MyToolParams {
  message: string;
  count?: number;
}

// 2. Define the invocation
class MyToolInvocation extends BaseToolInvocation<MyToolParams, ToolResult> {
  constructor(
    params: MyToolParams,
    private config: Config,
  ) {
    super(params);
  }

  getDescription(): string {
    return `echo "${this.params.message}" × ${this.params.count ?? 1}`;
  }

  async getDefaultPermission() {
    return 'allow' as const; // read-only → always allowed
  }

  async getConfirmationDetails(abortSignal: AbortSignal) {
    // Only called when permission = 'ask'
    return {
      type: 'generic' as const,
      title: 'My Tool',
      description: this.getDescription(),
    };
  }

  async execute(signal: AbortSignal): Promise<ToolResult> {
    const output = this.params.message.repeat(this.params.count ?? 1);
    return {
      llmContent: output,
      returnDisplay: output,
    };
  }
}

// 3. Create the declarative tool (links declaration + builder)
export const myTool = new BaseDeclarativeTool(
  {
    name: 'my_tool',
    description: 'Repeats a message N times.',
    parameters: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Text to repeat' },
        count: {
          type: 'number',
          description: 'Number of repetitions (default 1)',
        },
      },
      required: ['message'],
    },
  },
  (params, config) => new MyToolInvocation(params as MyToolParams, config),
);
```

---

## `ToolResult` Shape

```typescript
interface ToolResult {
  /** Text returned to the model. Required. */
  llmContent: string | Part[];

  /** What to display to the user in the UI. Can differ from llmContent. */
  returnDisplay?: string | AnsiOutput;

  /** If true, the model sees "tool was interrupted" instead of llmContent. */
  interrupted?: boolean;
}
```

---

## Permission Logic

`getDefaultPermission()` returns the tool's **intrinsic** permission:

| Return    | Meaning                                   | When to use                         |
| --------- | ----------------------------------------- | ----------------------------------- |
| `'allow'` | Safe, run immediately                     | Read-only ops (ls, grep, read-file) |
| `'ask'`   | May have side effects — confirm with user | Writes, shell, network              |
| `'deny'`  | Security violation — never run            | Command substitution in shell args  |

The `PermissionManager` may override this based on user rules (allow/ask/deny
patterns in settings). The final decision is resolved in `coreToolScheduler.ts`.

---

## Registering the Tool

Tools are registered in the tool registry. Add to the relevant registration file:

```typescript
// packages/core/src/tools/tool-names.ts — add name constant
export const ToolNames = {
  // ...existing...
  MY_TOOL: 'my_tool',
} as const;

// packages/core/src/tools/tools.ts or a registration file
// (check how existing tools like shell, grep, edit register themselves)
```

Check `packages/core/src/core/coreToolScheduler.ts` for how tools are loaded
and scheduled — the scheduler is the bridge between model output and tool
execution.

---

## Streaming Output (progress updates)

For long-running tools, pass `updateOutput` to stream partial results:

```typescript
async execute(
  signal: AbortSignal,
  updateOutput?: (output: ToolResultDisplay) => void,
): Promise<ToolResult> {
  for (const step of steps) {
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    updateOutput?.({ type: 'text', value: `Step ${step}...\n` });
    await doStep(step);
  }
  return { llmContent: 'Done', returnDisplay: 'All steps complete.' };
}
```

---

## MCP Tools

MCP tools are dynamically loaded from connected MCP servers. They don't use
`BaseDeclarativeTool` — they use `MpcTool` which wraps the remote tool
declaration. See:

- `packages/core/src/tools/mcp-tool.ts` — `MpcTool` wrapper
- `packages/core/src/tools/mcp-client.ts` — MCP client transport
- `packages/core/src/tools/mcp-client-manager.ts` — manages connections

---

## Prior Read Enforcement

Some tools (edit, shell) enforce that a file must have been read before it can
be modified. This is controlled by `priorReadEnforcement.ts`:

```typescript
import { checkPriorRead } from './priorReadEnforcement.js';

// Inside execute():
checkPriorRead(this.params.path, this.config); // throws StructuredToolError if not read
```

---

## Common Pitfalls

- **Always check `signal.aborted`** in loops and before expensive operations.
  Throw `new DOMException('Aborted', 'AbortError')` to propagate cancellation.
- **`getDescription()` is shown to the user before execution** — make it clear
  and human-readable, not a dump of all params.
- **`llmContent` vs `returnDisplay`** — `llmContent` goes back to the model
  (can be long/structured); `returnDisplay` is what users see (keep concise).
- **`isAutoMemPath()` guard** — if your tool reads/writes files, skip auto-memory
  paths using `isAutoMemPath(filepath)`.

---

## Key Files

| File                                              | Purpose                                                     |
| ------------------------------------------------- | ----------------------------------------------------------- |
| `packages/core/src/tools/tools.ts`                | `BaseDeclarativeTool`, `ToolInvocation`, `ToolResult` types |
| `packages/core/src/tools/tool-names.ts`           | Canonical tool name constants                               |
| `packages/core/src/tools/modifiable-tool.ts`      | Extension point for patching tool behavior                  |
| `packages/core/src/tools/priorReadEnforcement.ts` | Prior-read guards for write tools                           |
| `packages/core/src/core/coreToolScheduler.ts`     | Orchestrates tool execution, permission checks              |
| `packages/core/src/tools/edit.ts`                 | Full reference implementation (complex tool)                |
| `packages/core/src/tools/shell.ts`                | Reference for `ask` permission + confirmation               |
| `packages/core/src/tools/read-file.ts`            | Reference for simple `allow` tool                           |
| `packages/core/src/tools/mcp-client-manager.ts`   | Dynamic MCP tool discovery                                  |
