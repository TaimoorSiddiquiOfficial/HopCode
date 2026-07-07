/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

// ---------------------------------------------------------------------------
// Shared ACP route table
// ---------------------------------------------------------------------------
// Single source of truth for the URL→JSON-RPC mapping used by both
// `AcpWsTransport` and `AcpHttpTransport`. Keeping a single table
// prevents route inconsistencies between the two transport variants.
// ---------------------------------------------------------------------------

import { isRecord } from './acpTransportUtils.js';

export interface RouteMapping {
  method: string;
  /**
   * Extract JSON-RPC params from URL path segments, request body, and — for the
   * REST-style query-backed helpers (`/file?path=…&maxBytes=…`, `/stat`,
   * `/list`, `/glob`, `context-usage?detail=…`) — the URL query string. The
   * daemon's ACP handlers are strictly typed (e.g. `maxBytes` must be a
   * `number`, `detail` must be the boolean `true`), so query values — which
   * arrive as strings — are coerced to the expected type here via
   * `strParam`/`numParam`/`boolParam`.
   */
  extractParams: (
    segments: string[],
    body: unknown,
    httpMethod: string,
    query?: URLSearchParams,
  ) => Record<string, unknown>;
  /**
   * True for notifications (no response expected). The transport will
   * NOT wait for a JSON-RPC response from the server.
   */
  notification?: boolean;
}

/** A string query param, omitted when absent. */
function strParam(
  q: URLSearchParams | undefined,
  name: string,
): Record<string, string> {
  const v = q?.get(name);
  return v == null ? {} : { [name]: v };
}

/**
 * A numeric query param coerced to a `number`, omitted when absent. The daemon's
 * ACP handlers require a real number (a query string's `"123"` would be
 * rejected). An unparseable value forwards as `NaN`, which the daemon rejects
 * the same way it would a malformed REST query.
 *
 * An empty value (`?maxBytes=`) is treated as ABSENT, not `0`: `Number('')` is
 * `0`, a plausible-but-unintended value the handler would otherwise honor.
 */
function numParam(
  q: URLSearchParams | undefined,
  name: string,
): Record<string, number> {
  const v = q?.get(name);
  return v == null || v === '' ? {} : { [name]: Number(v) };
}

/** A boolean query param (`?detail=true`), omitted when absent. */
function boolParam(
  q: URLSearchParams | undefined,
  name: string,
): Record<string, boolean> {
  const v = q?.get(name);
  // Treat an empty value (`?detail=`) as absent, mirroring `numParam`, so we
  // don't forward `{ detail: false }` for a param the caller never set.
  return v == null || v === '' ? {} : { [name]: v === 'true' };
}

function bodyRecord(body: unknown): Record<string, unknown> {
  return isRecord(body) ? body : {};
}

export interface RouteEntry {
  httpMethod: string;
  pattern: RegExp;
  mapping: RouteMapping;
}

/**
 * Map of `METHOD PATH_PATTERN` to JSON-RPC method + params extractor.
 * Path segments are split by `/` after stripping the base URL prefix.
 *
 * Pattern conventions:
 *   - `:param` = named path param (consumed positionally)
 *   - `*`      = rest wildcard
 */
export const ROUTE_TABLE: readonly RouteEntry[] = [
  // POST /session → session/new
  // ACP standard: session/new always creates an isolated session.
  // Strip non-standard params (sessionScope) — the server enforces
  // 'thread' regardless, so passing it is harmless but misleading.
  {
    httpMethod: 'POST',
    pattern: /^\/session\/?$/,
    mapping: {
      method: 'session/new',
      extractParams: (_s, body) => {
        if (!isRecord(body)) return {};
        const { sessionScope: _, ...rest } = body as Record<string, unknown>;
        return rest;
      },
    },
  },
  // POST /session/:id/prompt → session/prompt
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/prompt$/,
    mapping: {
      method: 'session/prompt',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/cancel → session/cancel (notification)
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/cancel$/,
    mapping: {
      method: 'session/cancel',
      extractParams: (segs) => ({ sessionId: segs[0] }),
      notification: true,
    },
  },
  // DELETE /session/:id → session/close
  {
    httpMethod: 'DELETE',
    pattern: /^\/session\/([^/]+)\/?$/,
    mapping: {
      method: 'session/close',
      extractParams: (segs) => ({ sessionId: segs[0] }),
    },
  },
  // POST /session/:id/load → session/load
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/load$/,
    mapping: {
      method: 'session/load',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/resume → session/resume
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/resume$/,
    mapping: {
      method: 'session/resume',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/permission/:reqId → session/permission
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/permission\/([^/]+)$/,
    mapping: {
      method: 'session/permission',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
        requestId: segs[1],
      }),
    },
  },
  // POST /permission/:reqId (without session prefix)
  {
    httpMethod: 'POST',
    pattern: /^\/permission\/([^/]+)$/,
    mapping: {
      method: 'session/permission',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        requestId: segs[0],
      }),
    },
  },
  // POST /session/:id/model → session/set_model
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/model$/,
    mapping: {
      method: 'session/set_model',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // GET /capabilities → use initialize result (handled specially)
  {
    httpMethod: 'GET',
    pattern: /^\/capabilities\/?$/,
    mapping: {
      method: '_capabilities',
      extractParams: () => ({}),
    },
  },
  // GET /health
  {
    httpMethod: 'GET',
    pattern: /^\/health\/?$/,
    mapping: {
      method: '_hopcode/health',
      extractParams: () => ({}),
    },
  },

  // ---- Vendor session extensions (_hopcode/ prefix) -------------------------

  // PATCH /session/:id/metadata → _hopcode/session/update_metadata
  {
    httpMethod: 'PATCH',
    pattern: /^\/session\/([^/]+)\/metadata$/,
    mapping: {
      method: '_hopcode/session/update_metadata',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // PATCH /session/:id/organization → _qwen/session/update_organization
  {
    httpMethod: 'PATCH',
    pattern: /^\/session\/([^/]+)\/organization$/,
    mapping: {
      method: '_qwen/session/update_organization',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/heartbeat → _hopcode/session/heartbeat
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/heartbeat$/,
    mapping: {
      method: '_hopcode/session/heartbeat',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // GET /session/:id/artifacts → _qwen/session/artifacts
  {
    httpMethod: 'GET',
    pattern: /^\/session\/([^/]+)\/artifacts$/,
    mapping: {
      method: '_qwen/session/artifacts',
      extractParams: (segs) => ({ sessionId: segs[0] }),
    },
  },
  // POST /session/:id/artifacts → _qwen/session/artifacts/add
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/artifacts$/,
    mapping: {
      method: '_qwen/session/artifacts/add',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // DELETE /session/:id/artifacts/:artifactId → _qwen/session/artifacts/remove
  {
    httpMethod: 'DELETE',
    pattern: /^\/session\/([^/]+)\/artifacts\/([^/]+)$/,
    mapping: {
      method: '_qwen/session/artifacts/remove',
      extractParams: (segs) => ({
        sessionId: segs[0],
        artifactId: segs[1],
      }),
    },
  },
  // POST /session/:id/recap → _hopcode/session/recap
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/recap$/,
    mapping: {
      method: '_hopcode/session/recap',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/btw → _hopcode/session/btw
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/btw$/,
    mapping: {
      method: '_hopcode/session/btw',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/shell → _hopcode/session/shell
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/shell$/,
    mapping: {
      method: '_hopcode/session/shell',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/branch → session/fork
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/branch$/,
    mapping: {
      method: 'session/fork',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },
  // POST /session/:id/detach → _hopcode/session/detach
  {
    httpMethod: 'POST',
    pattern: /^\/session\/([^/]+)\/detach$/,
    mapping: {
      method: '_hopcode/session/detach',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        sessionId: segs[0],
      }),
    },
  },

  // ---- Session diagnostic routes (_hopcode/ prefix) -------------------------

  // GET /session/:id/context → _hopcode/session/context
  {
    httpMethod: 'GET',
    pattern: /^\/session\/([^/]+)\/context$/,
    mapping: {
      method: '_hopcode/session/context',
      extractParams: (segs) => ({ sessionId: segs[0] }),
    },
  },
  // GET /session/:id/context-usage → _hopcode/session/context_usage
  {
    httpMethod: 'GET',
    pattern: /^\/session\/([^/]+)\/context-usage$/,
    mapping: {
      method: '_hopcode/session/context_usage',
      extractParams: (segs) => ({ sessionId: segs[0] }),
    },
  },
  // GET /session/:id/supported-commands → _hopcode/session/supported_commands
  {
    httpMethod: 'GET',
    pattern: /^\/session\/([^/]+)\/supported-commands$/,
    mapping: {
      method: '_hopcode/session/supported_commands',
      extractParams: (segs) => ({ sessionId: segs[0] }),
    },
  },
  // GET /session/:id/tasks → _hopcode/session/tasks
  {
    httpMethod: 'GET',
    pattern: /^\/session\/([^/]+)\/tasks$/,
    mapping: {
      method: '_hopcode/session/tasks',
      extractParams: (segs) => ({ sessionId: segs[0] }),
    },
  },
  // GET /session/:id/lsp -> _hopcode/session/lsp
  {
    httpMethod: 'GET',
    pattern: /^\/session\/([^/]+)\/lsp$/,
    mapping: {
      method: '_hopcode/session/lsp',
      extractParams: (segs) => ({ sessionId: segs[0] }),
    },
  },

  // ---- Granular workspace routes (_hopcode/workspace/*) ---------------------

  // GET /workspace/mcp → _hopcode/workspace/mcp
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/mcp\/?$/,
    mapping: {
      method: '_hopcode/workspace/mcp',
      extractParams: () => ({}),
    },
  },
  // GET /workspace/skills → _hopcode/workspace/skills
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/skills\/?$/,
    mapping: {
      method: '_hopcode/workspace/skills',
      extractParams: () => ({}),
    },
  },
  // GET /workspace/providers → _hopcode/workspace/providers
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/providers\/?$/,
    mapping: {
      method: '_hopcode/workspace/providers',
      extractParams: () => ({}),
    },
  },
  // GET /workspace/env → _hopcode/workspace/env
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/env\/?$/,
    mapping: {
      method: '_hopcode/workspace/env',
      extractParams: () => ({}),
    },
  },
  // GET /workspace/preflight → _hopcode/workspace/preflight
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/preflight\/?$/,
    mapping: {
      method: '_hopcode/workspace/preflight',
      extractParams: () => ({}),
    },
  },
  // POST /workspace/init → _hopcode/workspace/init
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/init\/?$/,
    mapping: {
      method: '_hopcode/workspace/init',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
  // GET /workspace/tools → _hopcode/workspace/tools
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/tools\/?$/,
    mapping: {
      method: '_hopcode/workspace/tools',
      extractParams: () => ({}),
    },
  },
  // GET /workspace/memory → _hopcode/workspace/memory
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/memory\/?$/,
    mapping: {
      method: '_hopcode/workspace/memory',
      extractParams: () => ({}),
    },
  },
  // POST /workspace/memory → _hopcode/workspace/memory/write
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/memory\/?$/,
    mapping: {
      method: '_hopcode/workspace/memory/write',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
  // GET /workspace/agents → _hopcode/workspace/agents/list
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/agents\/?$/,
    mapping: {
      method: '_hopcode/workspace/agents/list',
      extractParams: () => ({}),
    },
  },
  // POST /workspace/agents → _hopcode/workspace/agents/create
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/agents\/?$/,
    mapping: {
      method: '_hopcode/workspace/agents/create',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
  // GET /workspace/agents/:agentType → _hopcode/workspace/agents/get
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/agents\/([^/]+)\/?$/,
    mapping: {
      method: '_hopcode/workspace/agents/get',
      extractParams: (segs) => ({ agentType: segs[0] }),
    },
  },
  // DELETE /workspace/agents/:agentType → _hopcode/workspace/agents/delete
  {
    httpMethod: 'DELETE',
    pattern: /^\/workspace\/agents\/([^/]+)\/?$/,
    mapping: {
      method: '_hopcode/workspace/agents/delete',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        agentType: segs[0],
      }),
    },
  },
  // GET /workspace/mcp/:server/tools → _hopcode/workspace/mcp/tools
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/mcp\/([^/]+)\/tools\/?$/,
    mapping: {
      method: '_hopcode/workspace/mcp/tools',
      extractParams: (segs) => ({ serverName: segs[0] }),
    },
  },
  // POST /workspace/mcp/servers → _hopcode/workspace/mcp/servers/add
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/mcp\/servers\/?$/,
    mapping: {
      method: '_hopcode/workspace/mcp/servers/add',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
  // DELETE /workspace/mcp/servers/:name → _hopcode/workspace/mcp/servers/remove
  {
    httpMethod: 'DELETE',
    pattern: /^\/workspace\/mcp\/servers\/([^/]+)\/?$/,
    mapping: {
      method: '_hopcode/workspace/mcp/servers/remove',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        name: segs[0],
      }),
    },
  },
  // POST /workspace/set-tool-enabled → _hopcode/workspace/set_tool_enabled
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/set-tool-enabled\/?$/,
    mapping: {
      method: '_hopcode/workspace/set_tool_enabled',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
  // POST /workspace/mcp/:server/restart → _hopcode/workspace/restart_mcp_server
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/mcp\/([^/]+)\/restart\/?$/,
    mapping: {
      method: '_hopcode/workspace/restart_mcp_server',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        serverName: segs[0],
      }),
    },
  },
  // GET /workspace/auth/status → _hopcode/workspace/auth/status
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/auth\/status\/?$/,
    mapping: {
      method: '_hopcode/workspace/auth/status',
      extractParams: () => ({}),
    },
  },
  // POST /workspace/auth/device-flow → _hopcode/workspace/auth/device_flow/start
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/auth\/device-flow\/?$/,
    mapping: {
      method: '_hopcode/workspace/auth/device_flow/start',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
  // GET /workspace/auth/device-flow/:id → _hopcode/workspace/auth/device_flow/get
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/auth\/device-flow\/([^/]+)\/?$/,
    mapping: {
      method: '_hopcode/workspace/auth/device_flow/get',
      extractParams: (segs) => ({ id: segs[0] }),
    },
  },
  // DELETE /workspace/auth/device-flow/:id → _hopcode/workspace/auth/device_flow/cancel
  {
    httpMethod: 'DELETE',
    pattern: /^\/workspace\/auth\/device-flow\/([^/]+)\/?$/,
    mapping: {
      method: '_hopcode/workspace/auth/device_flow/cancel',
      extractParams: (segs) => ({ id: segs[0] }),
    },
  },

  // GET /workspace/:id/sessions → session/list
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/(.+)\/sessions\/?$/,
    mapping: {
      method: 'session/list',
      extractParams: (segs, _body, _method, query) => {
        const size = query?.get('size');
        return {
          workspaceCwd: segs[0],
          ...strParam(query, 'cursor'),
          ...strParam(query, 'archiveState'),
          ...strParam(query, 'view'),
          ...strParam(query, 'group'),
          ...(size == null || size === ''
            ? {}
            : { _meta: { size: Number(size) } }),
        };
      },
    },
  },
  // GET /workspace/:id/session-groups → _qwen/workspace/session_groups/list
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/(.+)\/session-groups\/?$/,
    mapping: {
      method: '_qwen/workspace/session_groups/list',
      extractParams: (segs) => ({ workspaceCwd: segs[0] }),
    },
  },
  // POST /workspace/:id/session-groups → _qwen/workspace/session_groups/create
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/(.+)\/session-groups\/?$/,
    mapping: {
      method: '_qwen/workspace/session_groups/create',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        workspaceCwd: segs[0],
      }),
    },
  },
  // PATCH /workspace/:id/session-groups/:groupId → _qwen/workspace/session_groups/update
  {
    httpMethod: 'PATCH',
    pattern: /^\/workspace\/(.+)\/session-groups\/([^/]+)\/?$/,
    mapping: {
      method: '_qwen/workspace/session_groups/update',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        workspaceCwd: segs[0],
        groupId: segs[1],
      }),
    },
  },
  // DELETE /workspace/:id/session-groups/:groupId → _qwen/workspace/session_groups/delete
  {
    httpMethod: 'DELETE',
    pattern: /^\/workspace\/(.+)\/session-groups\/([^/]+)\/?$/,
    mapping: {
      method: '_qwen/workspace/session_groups/delete',
      extractParams: (segs) => ({
        workspaceCwd: segs[0],
        groupId: segs[1],
      }),
    },
  },

  // ---- Workspace catch-all (must be AFTER all specific workspace routes) --
  // Handles any workspace path not matched above (e.g., /workspace/custom/path).
  {
    httpMethod: 'GET',
    pattern: /^\/workspace\/(.+)$/,
    mapping: {
      method: '_hopcode/workspace',
      extractParams: (segs) => ({ path: segs[0] }),
    },
  },
  {
    httpMethod: 'POST',
    pattern: /^\/workspace\/(.+)$/,
    mapping: {
      method: '_hopcode/workspace',
      extractParams: (segs, body) => ({
        ...bodyRecord(body),
        path: segs[0],
      }),
    },
  },

  // ---- File system routes -----------------------------------------------
  // These map the DaemonClient's file-system helpers to _hopcode/file/* RPC
  // methods on the ACP daemon.

  // GET /file → _hopcode/file/read (query params forwarded as RPC params)
  {
    httpMethod: 'GET',
    pattern: /^\/file\/?$/,
    mapping: {
      method: '_hopcode/file/read',
      extractParams: () => ({}),
    },
  },
  // GET /file/bytes → _hopcode/file/read_bytes
  {
    httpMethod: 'GET',
    pattern: /^\/file\/bytes\/?$/,
    mapping: {
      method: '_hopcode/file/read_bytes',
      extractParams: () => ({}),
    },
  },
  // GET /stat → _hopcode/file/stat
  {
    httpMethod: 'GET',
    pattern: /^\/stat\/?$/,
    mapping: {
      method: '_hopcode/file/stat',
      extractParams: () => ({}),
    },
  },
  // GET /list → _hopcode/file/list
  {
    httpMethod: 'GET',
    pattern: /^\/list\/?$/,
    mapping: {
      method: '_hopcode/file/list',
      extractParams: () => ({}),
    },
  },
  // GET /glob → _hopcode/file/glob
  {
    httpMethod: 'GET',
    pattern: /^\/glob\/?$/,
    mapping: {
      method: '_hopcode/file/glob',
      extractParams: () => ({}),
    },
  },
  // POST /file/write → _hopcode/file/write
  {
    httpMethod: 'POST',
    pattern: /^\/file\/write\/?$/,
    mapping: {
      method: '_hopcode/file/write',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
  // POST /file/edit → _hopcode/file/edit
  {
    httpMethod: 'POST',
    pattern: /^\/file\/edit\/?$/,
    mapping: {
      method: '_hopcode/file/edit',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },

  // ---- Bulk session operations -------------------------------------------

  // POST /sessions/delete → _hopcode/sessions/delete
  {
    httpMethod: 'POST',
    pattern: /^\/sessions\/delete\/?$/,
    mapping: {
      method: '_hopcode/sessions/delete',
      extractParams: (_s, body) => (isRecord(body) ? body : {}),
    },
  },
];
