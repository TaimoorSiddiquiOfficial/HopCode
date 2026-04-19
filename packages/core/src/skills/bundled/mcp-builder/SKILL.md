---
name: mcp-builder
description: Generates a complete MCP (Model Context Protocol) server from a description. Creates tool definitions, handler code, tests, and registers the server in .hopcode/mcp.json. Use `/mcp-builder` followed by a description of what the MCP server should do.
allowedTools:
  - glob
  - grep_search
  - read_file
  - write_file
  - run_shell_command
  - ask_user_question
---

# /mcp-builder - MCP Server Generator

You are an MCP server scaffold agent. Given a description of what an MCP server should do, you generate a complete, working MCP server with tool definitions, handler implementations, tests, and HopCode registration.

## What is MCP?

Model Context Protocol (MCP) is a standard for exposing tools and resources to AI agents. An MCP server defines:
- **Tools**: functions the AI can call (like `search_docs`, `run_query`, `send_email`)
- **Resources**: data sources the AI can read (like files, DB tables, API endpoints)
- **Prompts**: reusable prompt templates

HopCode auto-discovers MCP servers registered in `.hopcode/mcp.json`.

---

## Step 1: Clarify the MCP Server

Ask the user (if not already specified):
1. What is the **name** of this MCP server? (e.g., `github-tools`, `database-explorer`)
2. What **tools** should it expose? (list 1-5 tools with a sentence each)
3. Does it need **authentication**? (API key, OAuth, none)
4. What **language/runtime**? (TypeScript/Node.js default; Python if requested)
5. Where should it be placed? (default: `mcp-servers/<name>/`)

Build a spec:
```
### MCP Server Spec
- Name: github-tools
- Tools: list_repos, create_issue, get_pr_diff
- Auth: GITHUB_TOKEN env var
- Runtime: TypeScript (Node.js)
- Directory: mcp-servers/github-tools/
```

---

## Step 2: Scaffold the Directory

Create the directory structure:
```
mcp-servers/<name>/
  package.json
  tsconfig.json
  src/
    index.ts          — MCP server entry point
    tools/
      <tool1>.ts      — one file per tool
      index.ts        — exports all tools as array
    types.ts          — shared types/interfaces
  __tests__/
    <tool1>.test.ts
  README.md
```

---

## Step 3: Generate package.json

```json
{
  "name": "@hopcode/mcp-<name>",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc --watch",
    "test": "node --experimental-vm-modules node_modules/.bin/jest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^22.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

---

## Step 4: Generate src/index.ts

Use the official `@modelcontextprotocol/sdk` Server class:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './tools/index.js';

const server = new Server(
  { name: '<name>', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find(t => t.name === request.params.name);
  if (!tool) throw new Error(`Unknown tool: ${request.params.name}`);
  return tool.handler(request.params.arguments ?? {});
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## Step 5: Generate Tool Files

For each tool, create `src/tools/<tool-name>.ts`:

```typescript
export const <toolName>Tool = {
  name: '<tool-name>',
  description: '<what this tool does>',
  inputSchema: {
    type: 'object' as const,
    properties: {
      param1: { type: 'string', description: 'Description of param1' },
    },
    required: ['param1'],
  },
  async handler(args: Record<string, unknown>) {
    const { param1 } = args as { param1: string };
    // Implementation here
    return {
      content: [{ type: 'text' as const, text: `Result: ${param1}` }],
    };
  },
};
```

Create `src/tools/index.ts` exporting all tools as an array:
```typescript
import { <toolName>Tool } from './<tool-name>.js';
export const tools = [<toolName>Tool];
```

---

## Step 6: Generate Tests

For each tool, create `__tests__/<tool-name>.test.ts`:

```typescript
import { <toolName>Tool } from '../src/tools/<tool-name>.js';

describe('<toolName>Tool', () => {
  it('returns expected output for valid input', async () => {
    const result = await <toolName>Tool.handler({ param1: 'test' });
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Result');
  });

  it('handles missing required params', async () => {
    await expect(<toolName>Tool.handler({})).rejects.toThrow();
  });
});
```

---

## Step 7: Register in .hopcode/mcp.json

Read existing `.hopcode/mcp.json` (or create if absent). Add the new server entry:

```json
{
  "mcpServers": {
    "<name>": {
      "command": "node",
      "args": ["mcp-servers/<name>/dist/index.js"],
      "env": {
        "AUTH_TOKEN": "${AUTH_TOKEN}"
      }
    }
  }
}
```

---

## Step 8: Final Summary

```
### MCP Server Generated: <name>

**Directory**: mcp-servers/<name>/
**Tools**: [list of tool names]
**Auth**: [env var names]

**Files created**:
- mcp-servers/<name>/package.json
- mcp-servers/<name>/src/index.ts
- mcp-servers/<name>/src/tools/<tool>.ts (x N)
- mcp-servers/<name>/src/tools/index.ts
- mcp-servers/<name>/__tests__/<tool>.test.ts (x N)
- mcp-servers/<name>/README.md

**Registered in**: .hopcode/mcp.json

**Next steps**:
1. cd mcp-servers/<name> && npm install
2. npm run build
3. Set env vars: export AUTH_TOKEN=...
4. Restart HopCode — tools will be available automatically
```

---

## Error Handling

- **Directory already exists** → Ask: "Overwrite, merge, or cancel?"
- **Unknown runtime** → Default to TypeScript/Node.js, inform user
- **`.hopcode/mcp.json` has syntax errors** → Show the error, ask user to fix before registration
- **Tool count > 10** → Warn: "Consider splitting into multiple servers for maintainability"
