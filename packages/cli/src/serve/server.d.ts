/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application } from 'express';
import type { DaemonStatusProvider } from '@hoptrendy/acp-bridge';
import type { DaemonLogger } from './daemon-logger.js';
import type { DaemonMetricsBucket, DaemonPerfSnapshot, DaemonStartupSnapshot } from './daemon-status.js';
import type { ChannelWorkerSnapshot, ChannelWorkerSupervisor } from './channel-worker-supervisor.js';
import type { ChannelWorkerGroupSnapshot } from './channel-worker-group.js';
import type { ChannelWorkerControlState, ChannelWorkerSetResult, ChannelWorkerStopResult } from './channel-worker-manager.js';
import { DeviceFlowRegistry, type DeviceFlowProvider } from './auth/device-flow.js';
import { ClientMcpSenderRegistry } from './acp-http/client-mcp-sender-registry.js';
import { type AcpSessionBridge } from './acp-session-bridge.js';
import { type ServeAuthProviderInstallRequest, type ServeAuthProviderInstallResult, type ServeChannelSelection, type ChannelWebhookConfigSource, type ServeOptions } from './types.js';
import type { WorkspaceFileSystemFactory } from './fs/index.js';
import { type DaemonWorkspaceService, type DaemonWorkspaceServiceDeps } from './workspace-service/index.js';
import { type WorkspaceVoiceRouteDeps } from './routes/workspace-voice.js';
import { WorkspaceVoiceCoordinator } from './voice/workspace-voice-coordinator.js';
import { type TotalSessionAdmissionSnapshot } from './total-session-admission.js';
import { type WorkspaceRegistry, type WorkspaceRuntime, type WorkspaceRuntimeEnvMetadata } from './workspace-registry.js';
import { type WorkspaceRuntimeRemovalController } from './routes/workspace-management.js';
import type { WorkspaceRegistrationStore } from './workspace-registration-store.js';
import type { BridgeEvent } from '@hoptrendy/acp-bridge/eventBus';
export { resolveBridgeFsFactory } from './server/fs-factory.js';
export { resolveBoundWorkspacesFromIdeEnv } from './server/fs-factory.js';
export { PromptDeadlineExceededError, resolvePromptDeadlineMs, } from './server/prompt-deadline.js';
export { InvalidCursorError, getWorkspaceSessionInfoForResponse, listWorkspaceSessionsForResponse, } from './server/session-list.js';
export type { ListWorkspaceSessionsOptions, ListWorkspaceSessionsReadOptions, ListWorkspaceSessionsResult, WorkspaceSessionInfoResult, } from './server/session-list.js';
/**
 * Build a no-op fs-audit emitter that logs a warning every
 * `WARN_EVERY` dropped events. The default factory uses this so a
 * regression that silently strips audit events shows up in operator
 * logs instead of disappearing. `runHopCodeServe` replaces this with a
 * real per-session emit, so legitimate production traffic never hits
 * the warning.
 */
export declare function createDefaultFsAuditEmit(): (event: BridgeEvent) => void;
export declare function getActiveSseCount(): number;
export interface ServeAppDeps {
    /** Bridge instance; tests inject a fake. Defaults to a fresh real one. */
    bridge?: AcpSessionBridge;
    /**
     * Enables resident management of scheduled-task-owned sessions: a periodic
     * keepalive (so their schedulers aren't idle-reaped) and a boot-time
     * rehydration (so they re-arm after a restart). Opt-in — only the real
     * long-running daemon (`runHopCodeServe`) sets it. Tests and direct embeds
     * leave it off so `createServeApp` neither spawns sessions on boot nor holds
     * a heartbeat timer.
     */
    manageScheduledTaskSessions?: boolean;
    /**
     * Directory of the built Web Shell SPA (`index.html` + `assets/`). When
     * set (and `opts.serveWebShell !== false`), `createServeApp` mounts the
     * UI at the daemon root before `bearerAuth`. Production `runHopCodeServe`
     * resolves this via `resolveWebShellDir()` and injects it here; direct
     * embeds / tests opt in by passing a fixture dir, so the default
     * `createServeApp` (no injection) stays API-only and existing route tests
     * are unaffected.
     */
    webShellDir?: string;
    /**
     * HopCode version advertised to web/SDK clients. Production passes the
     * resolved CLI package version; tests/direct embeds may omit it.
     */
    HopCodeVersion?: string;
    /**
     * Pre-canonicalized workspace path. When supplied, `createServeApp`
     * skips its own `canonicalizeWorkspace` call (which would issue a
     * redundant `realpathSync.native` syscall — idempotent, but a hot
     * boot-time stat we can avoid). `runHopCodeServe` passes this after
     * its own boot-time canonicalize so the value used by
     * `/capabilities`, the `POST /session` cwd fallback, and the
     * bridge are all the SAME canonical form. Callers that haven't
     * canonicalized yet (tests, direct embeds) omit this and
     * `createServeApp` falls back to canonicalizing `opts.workspace ??
     * process.cwd()` itself.
     */
    boundWorkspace?: string;
    /**
     * Workspace filesystem boundary factory. When supplied, file routes
     * pull a per-request `WorkspaceFileSystem` off it; when omitted,
     * `createServeApp` builds a strict default (`trusted: false`,
     * warn-once no-op `emit`) so an upstream refactor that forgets to
     * inject `fsFactory` never silently allows writes against an
     * untrusted workspace.
     */
    fsFactory?: WorkspaceFileSystemFactory;
    /**
     * Device-flow auth registry. Tests inject a fake; production callers
     * omit this and `createServeApp` constructs a default wired to the
     * shipped HopCode provider, the bridge's `publishWorkspaceEvent`,
     * and a stderr audit sink.
     */
    deviceFlowRegistry?: DeviceFlowRegistry;
    maxExtensionOperationHistory?: number;
    /**
     * Extra device-flow providers for tests / future extensions.
     * Production builds register only `HopCodeOAuthDeviceFlowProvider`;
     * passing extra entries here registers them in addition.
     */
    deviceFlowProviders?: DeviceFlowProvider[];
    /**
     * Installs an LLM auth provider by applying the same provider install plan
     * used by interactive `/auth`. Production `runHopCodeServe` injects a
     * settings-backed implementation; tests/direct embeds may omit it, in which
     * case the route reports `not_implemented`.
     */
    installAuthProvider?: (req: ServeAuthProviderInstallRequest) => Promise<ServeAuthProviderInstallResult>;
    /**
     * Optional daemon logger. When provided, `sendBridgeError` routes
     * each 5xx error through `daemonLog.error(...)` (which tees to stderr +
     * the daemon log file). When omitted, falls back to existing
     * stderr-only behavior.
     */
    daemonLog?: DaemonLogger;
    startup?: DaemonStartupSnapshot;
    getChannelWorkerSnapshot?: () => ChannelWorkerSnapshot;
    getChannelWorkerSnapshots?: () => ChannelWorkerGroupSnapshot[];
    getChannelWorkerControl?: () => ChannelWorkerControlState;
    isChannelControlDraining?: () => boolean;
    isChannelControlInitializing?: () => boolean;
    setChannelWorkerSelection?: (selection: ServeChannelSelection) => Promise<ChannelWorkerSetResult>;
    stopChannelWorker?: () => Promise<ChannelWorkerStopResult>;
    enqueueChannelWebhookTask?: ChannelWorkerSupervisor['enqueueWebhookTask'];
    channelWebhookConfigSources?: readonly ChannelWebhookConfigSource[];
    getChannelWebhookConfigSources?: () => readonly ChannelWebhookConfigSource[];
    getChannelWebhookConfigVersion?: () => number;
    registerChannelWebhookConfigRefresh?: (refresh: () => void) => void;
    /**
     * Stop and relaunch the daemon-managed channel worker so it re-reads
     * settings.json. Its presence mounts the compatibility reload route;
     * `channel_reload` is advertised only while the control state is enabled.
     */
    reloadChannelWorker?: () => Promise<ChannelWorkerSnapshot>;
    getPerfSnapshot?: () => DaemonPerfSnapshot;
    /** Rolling metrics series for the Daemon Status charts (oldest→newest). */
    getMetricsSeries?: () => DaemonMetricsBucket[];
    getTotalSessionAdmissionSnapshot?: () => TotalSessionAdmissionSnapshot;
    /**
     * Sink fed one (durationMs, statusCode) per matched daemon HTTP request, so
     * the metrics ring can bucket request rate and latency for the charts.
     */
    recordDaemonRequest?: (durationMs: number, statusCode: number) => void;
    workspace?: DaemonWorkspaceService;
    statusProvider?: DaemonStatusProvider;
    persistDisabledTools?: (workspace: string, toolName: string, enabled: boolean) => Promise<void>;
    persistDisabledSkills?: DaemonWorkspaceServiceDeps['persistDisabledSkills'];
    contextFilename?: string;
    persistSetting?: (workspace: string, scope: import('../config/settings.js').SettingScope, key: string, value: unknown) => Promise<void | import('../config/settings.js').LoadedSettings>;
    persistSettings?: (workspace: string, writes: Array<{
        scope: import('../config/settings.js').SettingScope;
        key: string;
        value: unknown;
    }>) => Promise<void>;
    sessionArtifactsPersistenceAvailable?: boolean;
    /**
     * Reverse tool channel (issue #5626, Phase 2). Shared sender registry that
     * bridges the daemon WS (per-connection `ClientMcpRegistrar`) and the ACP
     * child's `client_mcp/message` ext-method. `runHopCodeServe` constructs ONE and
     * passes the SAME instance here AND to its `createAcpSessionBridge` call (as
     * `clientMcpSender: registry.lookup`) so the bridge that answers the child
     * and the WS provider that registers senders agree. When omitted (the
     * standalone `createServeApp` path with no injected bridge), `createServeApp`
     * builds its own registry and wires it into the bridge it creates.
     */
    clientMcpSenderRegistry?: ClientMcpSenderRegistry;
    workspaceRegistry?: WorkspaceRegistry;
    createWorkspaceRuntime?: (cwd: string) => Promise<WorkspaceRuntime>;
    workspaceRegistrationStore?: WorkspaceRegistrationStore;
    workspaceRuntimeRemoval?: WorkspaceRuntimeRemovalController;
    primaryWorkspaceTrusted?: boolean;
    primaryRuntimeEnv?: WorkspaceRuntimeEnvMetadata;
    daemonEnv?: Readonly<NodeJS.ProcessEnv>;
    voiceTranscriber?: WorkspaceVoiceRouteDeps['transcribe'];
    voiceCoordinator?: WorkspaceVoiceCoordinator;
}
/**
 * Sizes the keepalive heartbeat interval so a resident task session is beaten
 * BEFORE the idle reaper closes it. Targets a third of the reaper window, but
 * never exceeds HALF of it — so at least one heartbeat lands in time even for a
 * small custom timeout, where the 30s floor would otherwise overshoot the whole
 * window and let the session be reaped before the first beat. When the reaper is
 * disabled (idle timeout ≤ 0) sessions are never reaped, so heartbeats aren't
 * needed — the loop still runs (to revive re-enabled bound sessions) but at the
 * relaxed max cadence.
 */
export declare function computeKeepaliveIntervalMs(idleTimeoutMs: number): number;
export declare function createServeApp(opts: ServeOptions, getPort?: () => number, deps?: ServeAppDeps): Application;
/**
 * Decide whether a permission vote arrived from a loopback peer.
 *
 * Per RFC 1122 the entire `127.0.0.0/8` block is loopback (and the
 * IPv4-mapped IPv6 form `::ffff:127.0.0.0/104` mirrors that). IPv6
 * loopback is `::1` (single literal).
 *
 * **Security**: reads `req.socket.remoteAddress` only — does NOT
 * consult `X-Forwarded-For` or any HTTP header (forgeable). Fail-
 * CLOSED: unrecognized shapes return `false`.
 */
export declare function detectFromLoopback(req: {
    socket?: {
        remoteAddress?: string | undefined;
    };
}): boolean;
/**
 * Build the JSON body for a 5xx response. The ACP SDK forwards
 * JSON-RPC-shaped errors like `{code: -32000, message: "Internal error",
 * data: {reason: "model quota exceeded"}}` — discarding `code`/`data`
 * collapses every distinct failure (quota / rate-limit / auth /
 * crash) to the same opaque `"Internal error"` string at the client.
 * Forward both fields so callers can triage from response body alone.
 * `error` stays as the human-readable string for backward compatibility
 * with clients that only consumed `error` in the original shape.
 *
 * BSA0G acknowledged: forwarding `data` verbatim leaks per-error
 * detail (file paths in upstream tool failures, partial API response
 * snippets, etc.) to every authenticated SSE subscriber that
 * observes 5xx responses. In Stage 1's single-user / small-team
 * trust model (every authenticated client is the same human or
 * collaborators they trust) this is acceptable — and the triage
 * value of the rich error is high. Stage 2 multi-tenant deployments
 * will need an opt-in `--redact-errors` flag (or per-deployment
 * policy hook) that strips `data` and replaces it with an
 * error-class identifier.
 */
