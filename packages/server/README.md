# @hoptrendy/hopcode-server

HopCode gRPC headless server — expose the core agent loop over a bidirectional gRPC stream.

## Overview

This package provides a **gRPC server** that enables remote clients to interact with HopCode agents:

- **Bidirectional streaming** — clients send prompts and approvals; the server streams back text chunks, tool calls, permission requests, and status events.
- **Session management** — create, list, cancel, and query session history.
- **Direct tool execution** — fire-and-forget tool calls for simple automation.

## Installation

```bash
npm install @hoptrendy/hopcode-server
```

## Proto File

The service definition lives at `proto/hopcode.proto`:

```protobuf
service HopCodeAgent {
  rpc StreamSession (stream ClientMessage) returns (stream ServerMessage);
  rpc CreateSession (CreateSessionRequest) returns (SessionInfo);
  rpc ListSessions (Empty) returns (SessionList);
  rpc GetSessionHistory (SessionId) returns (SessionHistory);
  rpc CancelSession (SessionId) returns (Empty);
  rpc ExecuteTool (ToolRequest) returns (ToolResult);
}
```

## CLI Usage

Start the server from the HopCode CLI:

```bash
hopcode grpc --port 50051 --host 0.0.0.0
```

## Programmatic Usage

```typescript
import { HopCodeServer } from '@hoptrendy/hopcode-server';

const server = new HopCodeServer({ port: 50051 });
await server.start();

// ... later ...
await server.stop();
```

## Architecture

The server bridges `AgentInteractive` events from `@hoptrendy/hopcode-core` into gRPC messages:

| Agent Event | gRPC Message |
|-------------|--------------|
| `round_start` | `StatusEvent` |
| `stream_text` | `TextChunk` |
| `tool_call` | `ToolCall` |
| `tool_result` | `ToolResult` |
| `tool_waiting_approval` | `PermissionRequest` |
| `usage_metadata` | `UsageEvent` |
| `error` | `ErrorEvent` |
| `finish` | `StatusEvent` |

## Status

**MVP** — core wire protocol and session scaffolding are implemented. Full agent runtime integration (wiring `AgentInteractive` into the session manager) is the next step.
