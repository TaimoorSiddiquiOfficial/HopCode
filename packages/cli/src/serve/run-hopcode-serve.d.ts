/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Server } from 'node:http';
import type { BridgeEvent } from '@hoptrendy/acp-bridge/eventBus';
import { type ServeFastPathSettings } from './fast-path-settings.js';
import type { AcpSessionBridge } from '@hoptrendy/acp-bridge/bridgeTypes';
import { type DaemonLogger } from './daemon-logger.js';
import { type ServeOptions } from './types.js';
import type { WorkspaceFileSystemFactory } from './fs/index.js';
import { type WorkspaceRegistrationStore } from './workspace-registration-store.js';
import type { PermissionPolicy } from '@hoptrendy/acp-bridge';
import type { ChannelWorkerSupervisor, CreateChannelWorkerSupervisorOptions } from './channel-worker-supervisor.js';
import type { ServiceInfo, ServiceInfoWorker } from '../commands/channel/pidfile.js';
type RunHopCodeServeOptions = Omit<ServeOptions, 'token' | 'workspace'> & {
    token?: string;
    workspace?: string | string[];
};
/**
 * Boot-time policy validation error. The catch block in `runHopCodeServe`
 * matches with `instanceof InvalidPolicyConfigError` to distinguish
 * operator-misconfiguration (rethrow → fail boot loudly) from
 * settings-read failures (fall back to defaults).
 */
export declare class InvalidPolicyConfigError extends Error {
    readonly name = "InvalidPolicyConfigError";
    constructor(message: string);
}
/**
 * Parse + validate the `policy.*` section of merged daemon settings.
 * Returns the resolved `permissionPolicy` /
 * `permissionConsensusQuorum` for `BridgeOptions`, or throws
 * `InvalidPolicyConfigError` for operator misconfiguration.
 *
 * - `permissionStrategy` must be one of the four `PermissionPolicy`
 *   literals if present.
 * - `consensusQuorum` must be a positive integer if present.
 * - When `consensusQuorum` is set but `permissionStrategy` is not
 *   `'consensus'`, the override is silently ignored — emit a
 *   stderr warning so the operator notices.
 *
 * The mismatch warning runs through `onWarning` so tests can
 * capture it; production passes `writeStderrLine`.
 *
 * The runtime valid-policy set is derived from
 * `SERVE_CAPABILITY_REGISTRY.permission_mediation.modes` (single
 * source of truth) instead of repeating the four literals.
 */
export declare function validatePolicyConfig(policyConfig?: {
    permissionStrategy?: unknown;
    consensusQuorum?: unknown;
}, onWarning?: (message: string) => void): {
    permissionPolicy: PermissionPolicy | undefined;
    permissionConsensusQuorum: number | undefined;
};
export declare function formatChannelWorkerDaemonUrl(host: string, port: number): string;
/**
 * Pull the `context.fileName` snapshot out of merged settings into a
 * typed string, falling back to `undefined` when the value is missing
 * or malformed.
 *
 * Validation contract:
 *   - non-empty string after trim → returned trimmed
 *   - array → first non-empty string element after trim, or undefined
 *   - anything else (object, number, boolean, undefined) → undefined
 *
 * Returning `undefined` is the bridge's signal to use its own
 * `getCurrentGeminiMdFilename()` default — so a malformed value
 * keeps the daemon alive rather than producing a garbage filename.
 */
export declare function extractContextFilename(value: unknown): string | undefined;
export interface RunHandle {
    server: Server;
    url: string;
    bridge: AcpSessionBridge;
    /**
     * Whether the Web Shell UI was actually mounted (assets resolved and
     * `serveWebShell !== false`). The `--open` launcher checks this so it never
     * points a browser at an API-only daemon.
     */
    webShellMounted: boolean;
    /**
     * The bearer token the daemon actually authenticates against (already
     * trimmed), or undefined when none is configured. `--open` reads this so the
     * URL it hands the browser always matches the server's value instead of
     * re-deriving it from argv/env.
     */
    resolvedToken?: string;
    /** Resolves when the full REST/Web/ACP runtime has been mounted. */
    runtimeReady: Promise<void>;
    /** Resolves when the listener has fully closed and the bridge is drained. */
    close(): Promise<void>;
}
type ChannelServicePidfile = {
    readServiceInfo(): ServiceInfo | null;
    writeServeServiceInfo(opts: {
        channels: string[];
        servePid?: number;
        workerPid?: number;
        workers?: ServiceInfoWorker[];
    }): void;
    reserveServeServiceInfo(opts: {
        channels: string[];
        servePid?: number;
    }): void;
    removeServiceInfo(): void;
    removeServeServiceInfo?(servePid?: number): boolean;
};
export declare function createDisabledChannelWorkerSupervisor(): ChannelWorkerSupervisor;
export interface RunHopCodeServeDeps {
    /** Bridge instance; tests inject a fake. Defaults to a fresh real one. */
    bridge?: AcpSessionBridge;
    /**
     * Whether to start the real ACP child eagerly after listen. Production
     * keeps this on; tests can disable it so boot-path assertions do not wait
     * on a real child bridge.
     */
    preheatBridge?: boolean;
    /**
     * Workspace filesystem factory. When omitted, `runHopCodeServe`
     * constructs one using `boundWorkspace`, `trustedWorkspace`, and a
     * default warning-emit hook. Tests inject a real factory + custom
     * emit to capture audit events.
     */
    fsFactory?: WorkspaceFileSystemFactory;
    /**
     * Trust snapshot for the bound workspace at boot. Drives the
     * `WorkspaceFileSystem`'s `assertTrustedForIntent` gate — read
     * intents always pass; mutating intents (`write`, `edit`) throw
     * `untrusted_workspace` when this is false. Defaults to true:
     * the daemon binds at boot to a workspace the operator
     * explicitly chose, and the trust dialog flow that ungates write
     * permissions in the interactive CLI is not yet replicated for
     * the daemon. Tests pin this to false to assert the gate is
     * actually wired through `runHopCodeServe → createServeApp →
     * fsFactory`.
     */
    trustedWorkspace?: boolean;
    /**
     * Audit-emit hook for `fs.access` / `fs.denied`. Defaults to a
     * stderr warning every 100 events so a regression that drops
     * audit emission stays visible in the operator log.
     */
    fsAuditEmit?: (event: BridgeEvent) => void;
    /**
     * Lightweight settings summary already loaded by the serve fast path.
     * Reusing it avoids a second pre-listen settings/env scan.
     */
    bootSettings?: ServeFastPathSettings;
    /**
     * Pre-resolved daemon debug directory. The full CLI/exported API can pass
     * Storage.getGlobalDebugDir(); the serve fast path intentionally avoids
     * importing core before listen and instead derives this from bootSettings.
     */
    daemonLogBaseDir?: string;
    /**
     * Internal CLI fast-path mode: resolve once the TCP listener is ready.
     * The default preserves the embedded API contract by resolving only after
     * the runtime bridge and routes are mounted.
     */
    resolveOnListen?: boolean;
    /**
     * Internal serve fast-path mode: keep bootstrap /health responsive before
     * starting the heavier runtime graph. A fallback timer still starts runtime
     * when no health probe arrives. Only applies with resolveOnListen.
     */
    deferRuntimeUntilFirstHealth?: boolean;
    /**
     * Bounds background runtime mounting after the listener is ready. Defaults to
     * HOPCODE_SERVE_RUNTIME_STARTUP_TIMEOUT_MS, then 120s. Use 0 to disable.
     */
    runtimeStartupTimeoutMs?: number;
    channelWorkerSupervisorFactory?: (opts: CreateChannelWorkerSupervisorOptions) => ChannelWorkerSupervisor;
    channelServicePidfile?: ChannelServicePidfile;
    workspaceRegistrationStore?: WorkspaceRegistrationStore;
}
export declare function createLazyBridgeProxy(getBridge: () => AcpSessionBridge | undefined, getStartupError?: () => string | undefined): AcpSessionBridge;
export declare function resolveRuntimeStartupTimeoutMs(override: number | undefined): number;
export declare function waitForRuntimeStartingForShutdown(runtimeStarting: Promise<void> | undefined, daemonLog: Pick<DaemonLogger, 'warn'>, timeoutMs?: number): Promise<void>;
export declare function runHopCodeServe(optsIn: RunHopCodeServeOptions, deps?: RunHopCodeServeDeps): Promise<RunHandle>;
export {};
