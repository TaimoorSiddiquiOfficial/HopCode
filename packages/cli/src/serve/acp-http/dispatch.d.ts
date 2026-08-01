/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { HttpAcpBridge } from '@hoptrendy/acp-bridge/bridgeTypes';
import { type WorkspaceFileSystemFactory } from '../fs/index.js';
import type { DeviceFlowRegistry } from '../auth/device-flow.js';
import { WorkspaceRememberTaskLane } from '../workspace-remember.js';
import { SessionArchiveCoordinator } from '../server/session-archive.js';
import type { DaemonWorkspaceService } from '../workspace-service/types.js';
import type { AcpConnection, ConnectionRegistry } from './connection-registry.js';
import { type JsonRpcInbound, type JsonRpcRequest } from './json-rpc.js';
/**
 * The ACP protocol version this transport speaks (ACP stable = 1).
 */
export declare const ACP_PROTOCOL_VERSION = 1;
/**
 * Routes JSON-RPC messages between the HTTP transport and the
 * `HttpAcpBridge`. Inbound client messages map to bridge calls; the
 * bridge's `BridgeEvent`s map back to JSON-RPC frames on the matching
 * session stream (see the design doc §4 translation table).
 */
export declare class AcpDispatcher {
    private readonly bridge;
    private readonly boundWorkspace;
    private readonly env;
    private readonly workspace;
    private readonly fsFactory?;
    private readonly deviceFlowRegistry?;
    private readonly sessionShellCommandEnabled;
    private readonly registry?;
    private readonly archiveCoordinator;
    private readonly agentManager;
    constructor(bridge: HttpAcpBridge, boundWorkspace: string, env: Readonly<NodeJS.ProcessEnv>, workspace: DaemonWorkspaceService, _workspaceRememberLane: WorkspaceRememberTaskLane, fsFactory?: WorkspaceFileSystemFactory | undefined, deviceFlowRegistry?: DeviceFlowRegistry | undefined, sessionShellCommandEnabled?: boolean, registry?: ConnectionRegistry | undefined, archiveCoordinator?: SessionArchiveCoordinator);
    private killOrphanSession;
    /**
     * Build the `WorkspaceRequestContext` for workspace-scoped operations
     * routed through the workspace service. The ACP dispatch has no session
     * context, so `sessionId` is omitted.
     */
    private wsCtx;
    private parseBoundWorkspaceParam;
    private parseSessionIds;
    private serializeSessionErrors;
    /**
     * Build the bridge context for a per-session call. Echoes the clientId the
     * bridge STAMPED at create/attach (the connection's own id is unregistered
     * and would be rejected) and threads `fromLoopback` so the `local-only`
     * permission policy can gate votes by transport — symmetric with the REST
     * surface's `detectFromLoopback(req)`.
     *
     * Throws when no stamped clientId is present: the only callers reach here
     * AFTER `requireOwned`, so the binding must exist and carry the bridge's
     * id. A missing id means an invariant broke (a `session/new`/`load` that
     * didn't record it) — fail loud rather than silently send an unregistered
     * id whose rejection surfaces asynchronously, far from the cause.
     */
    private sessionCtx;
    /**
     * The session's ACP-shaped config options (model/mode/…), read from the
     * child's own session state. Returned in `session/new` and as the result
     * of `session/set_config_option`. Best-effort — `undefined` on error.
     */
    private configOptionsFor;
    /**
     * Extract ACP-standard `SessionModelState` from configOptions.
     * ConfigOptions carry model info as `{ category: 'model', type: 'select',
     * currentValue, options }`. Maps to `{ currentModelId, availableModels }`.
     */
    private extractModelState;
    /**
     * Extract ACP-standard `SessionModeState` from configOptions.
     * ConfigOptions carry mode info as `{ category: 'mode', type: 'select',
     * currentValue, options }`. Maps to `{ currentModeId, availableModes }`.
     */
    private extractModeState;
    /**
     * Cancel a permission request the client abandoned (closed its stream /
     * connection before voting), so the bridge isn't left blocked. Invoked
     * by the connection-registry teardown path.
     */
    cancelAbandonedPermission(req: {
        sessionId: string;
        bridgeRequestId: string;
    }, clientId: string | undefined): boolean;
    /**
     * Build the `initialize` result advertising standard + `_hopcode` caps.
     * Negotiates the protocol version: we only implement stable V1, so we
     * clamp to `[1, ACP_PROTOCOL_VERSION]` — a client asking for 0/negative
     * (ACP marks V0 a pre-release fallback) or a future version gets `1`
     * rather than an echoed version we don't actually implement.
     */
    buildInitializeResult(connectionId: string, requestedVersion?: unknown): Record<string, unknown>;
    /**
     * Gate a per-session operation on connection ownership. Sends a JSON-RPC
     * error and returns false when this connection never created/attached
     * the session (prevents driving or eavesdropping on another
     * connection's session). `session/new|load|resume` are the
     * ownership-GRANTING ops and skip this.
     */
    private requireOwned;
    private withMutableOwned;
    private findPendingClientRequest;
    private dropResolvedPermission;
    /**
     * Drop ONLY the calling connection's own pending permission entry for
     * `requestId`, never a sibling co-owner's. Under the consensus policy a vote
     * (or an unexpected vote error) from connection B must not delete connection
     * A's still-needed entry, which would stall the quorum. A connection that
     * never streamed the request holds no entry, so this is a no-op for it.
     */
    private dropOwnPendingPermission;
    /**
     * Handle one inbound POST message. Returns nothing — every reply is
     * delivered asynchronously on a long-lived SSE stream per the RFD
     * (`POST` itself answers `202`). `initialize` is handled by the caller
     * (it mints the connection) and never reaches here.
     */
    handle(conn: AcpConnection, msg: JsonRpcInbound, sessionHeader?: string, reqLoopback?: boolean): Promise<void>;
    /**
     * Bind a session-scoped SSE stream to the bridge's event stream,
     * translating each `BridgeEvent` into a JSON-RPC frame (design §4.2).
     */
    pumpSessionEvents(conn: AcpConnection, sessionId: string, signal: AbortSignal, lastEventId?: number): Promise<void>;
    private translateEvent;
    /**
     * Resolve a client's JSON-RPC response to an agent→client request.
     * `fromLoopback` is the CURRENT request's loopback bit (the vote POST may
     * arrive from a different peer than `initialize`).
     */
    private resolveClientResponse;
    private handlePrompt;
    private replyConn;
    private replySession;
}
export type { JsonRpcRequest };
