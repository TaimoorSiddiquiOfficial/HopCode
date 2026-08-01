/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ServeProtocolVersions } from './capabilities.js';
import type { AcpHttpHandle, AcpHttpSnapshot } from './acp-http/index.js';
import type { DeviceFlowRegistry } from './auth/device-flow.js';
import type { DaemonLogger, DaemonLogHealth, DaemonLogIssue, DaemonLogMode } from './daemon-logger.js';
import type { AcpSessionBridge, BridgeDaemonStatusSnapshot } from './acp-session-bridge.js';
import type { RateLimiterInstance, RateLimitTier } from './rate-limit.js';
import type { ServeOptions } from './types.js';
import type { ChannelWorkerSnapshot } from './channel-worker-supervisor.js';
import type { ChannelWorkerGroupSnapshot } from './channel-worker-group.js';
import type { DaemonMetricsBucket } from './daemon-metrics-ring.js';
import type { DaemonWorkspaceService } from './workspace-service/index.js';
import type { TotalSessionAdmissionSnapshot } from './total-session-admission.js';
import type { WorkspaceRegistry } from './workspace-registry.js';
export type { DaemonMetricsBucket };
export type DaemonStatusDetail = 'summary' | 'full';
export type DaemonStatusLevel = 'ok' | 'warning' | 'error';
type SectionStatus = DaemonStatusLevel | 'unavailable';
type IssueSeverity = 'warning' | 'error';
type SectionSummary = Record<string, string | number | boolean | null>;
type StatusRecord = Record<string, unknown>;
export type DaemonStartupPreheatStatus = 'external_bridge' | 'not_scheduled' | 'scheduled' | 'running' | 'succeeded' | 'failed';
export interface DaemonStartupSnapshot {
    processStartedAt: string;
    listenerReadyAt?: string;
    processToListenMs?: number;
    runHopCodeServeToListenMs?: number;
    preheat: {
        status: DaemonStartupPreheatStatus;
        durationMs?: number;
        error?: string;
    };
}
export interface DaemonStatusIssue {
    code: 'session_capacity_high' | 'total_session_capacity_high' | 'connection_capacity_high' | 'pending_permissions' | 'acp_channel_down' | 'preflight_error' | 'mcp_budget_warning' | 'mcp_budget_exhausted' | 'rate_limit_hits' | 'workspace_status_unavailable' | 'channel_worker_exited' | 'channel_worker_partial_connect' | 'daemon_runtime_starting' | 'daemon_runtime_failed' | 'daemon_log_degraded';
    severity: IssueSeverity;
    message: string;
    section?: string;
}
export interface ParseDaemonStatusDetailResult {
    ok: boolean;
    detail?: DaemonStatusDetail;
}
export interface BuildDaemonStatusOptions {
    opts: ServeOptions;
    boundWorkspace: string;
    bridge: AcpSessionBridge;
    workspaceRegistry?: WorkspaceRegistry;
    workspace: DaemonWorkspaceService;
    daemonLog?: DaemonLogger;
    hopCodeVersion?: string;
    acpHandle?: AcpHttpHandle;
    rateLimiter?: RateLimiterInstance;
    getRestSseActive: () => number;
    features: readonly string[];
    protocolVersions: ServeProtocolVersions;
    supportedDeviceFlowProviders: readonly string[];
    deviceFlowRegistry: DeviceFlowRegistry;
    sessionShellCommandEnabled: boolean;
    startup?: DaemonStartupSnapshot;
    getChannelWorkerSnapshot?: () => ChannelWorkerSnapshot;
    getChannelWorkerSnapshots?: () => ChannelWorkerGroupSnapshot[];
    getPerfSnapshot?: () => DaemonPerfSnapshot;
    getMetricsSeries?: () => DaemonMetricsBucket[];
    getTotalSessionAdmissionSnapshot?: () => TotalSessionAdmissionSnapshot;
}
interface DaemonStatusSection<T> {
    status: SectionStatus;
    durationMs: number;
    summary?: SectionSummary;
    data?: T;
    error?: {
        kind: 'timeout' | 'error';
        message: string;
    };
}
type WorkspaceStatusSection = DaemonStatusSection<unknown>;
interface FullDaemonStatus {
    sessions: BridgeDaemonStatusSnapshot['sessions'];
    acpConnections: AcpHttpSnapshot['connections'];
    workspace: Record<string, WorkspaceStatusSection>;
    auth: {
        supportedDeviceFlowProviders: string[];
        pendingDeviceFlowCount: number;
    };
}
interface DaemonStatusSecurity {
    tokenConfigured: boolean;
    requireAuth: boolean;
    loopbackBind: boolean;
    allowOriginConfigured: boolean;
    allowOriginMode: string;
    sessionShellCommandEnabled: boolean;
}
interface DaemonStatusLimits {
    maxSessions: number | null;
    maxTotalSessions: number | null;
    maxPendingPromptsPerSession: number | null;
    listenerMaxConnections: number | null;
    eventRingSize: number;
    compactedReplayMaxBytes: number;
    promptDeadlineMs: number | null;
    writerIdleTimeoutMs: number | null;
    channelIdleTimeoutMs: number;
    sessionIdleTimeoutMs: number;
    acpConnectionCap: number | null;
}
interface DaemonStatusRuntime {
    loading?: boolean;
    error?: string;
    sessions: {
        active: number;
        admissionInFlight?: number;
    };
    permissions: {
        pending: number;
        policy: string;
    };
    channel: {
        live: boolean;
    };
    channelWorker: ChannelWorkerSnapshot;
    /**
     * Per-workspace channel workers on a multi-workspace daemon. Additive to
     * `channelWorker` (which stays as the primary workspace snapshot). Absent on
     * single-workspace daemons.
     */
    channelWorkers?: ChannelWorkerGroupSnapshot[];
    transport: {
        restSseActive: number;
        acp: {
            enabled: boolean;
            connections: number;
            connectionStreams: number;
            sessionStreams: number;
            sseStreams: number;
            wsStreams: number;
            pendingClientRequests: number;
        };
    };
    rateLimit: {
        enabled: boolean;
        rejectedSinceStart: Record<RateLimitTier, number>;
    };
    perf?: DaemonPerfSnapshot;
    /**
     * Rolling per-interval activity series backing the Daemon Status charts
     * (requests, latency, tokens, memory over time). Optional/additive to v=1:
     * absent when the daemon predates it or the sampler has not sealed a bucket
     * yet. Ordered oldest→newest.
     */
    metrics?: {
        series: DaemonMetricsBucket[];
    };
    activity: {
        activePrompts: number;
        pendingPrompts: number;
        queuedPrompts: number;
        lastActivityAt: string | null;
        idleSinceMs: number | null;
    };
    process: NodeJS.MemoryUsage;
}
export interface DaemonPipeStatsSnapshot {
    count: number;
    totalBytes: number;
    maxBytes: number;
}
export interface DaemonPerfSnapshot {
    eventLoop: {
        meanMs: number;
        p50Ms: number;
        p99Ms: number;
        maxMs: number;
    };
    promptQueueWait: {
        count: number;
        meanMs: number;
        maxMs: number;
        lastMs: number | null;
    };
    pipe: {
        inbound: DaemonPipeStatsSnapshot;
        outbound: DaemonPipeStatsSnapshot;
    };
}
export interface DaemonStatusResponse {
    v: 1;
    detail: DaemonStatusDetail;
    generatedAt: string;
    status: DaemonStatusLevel;
    issues: DaemonStatusIssue[];
    daemon: StatusRecord & {
        pid: number;
        uptimeMs: number;
        mode: ServeOptions['mode'];
        workspaceCwd: string;
        runId?: string;
        logMode?: DaemonLogMode;
        logHealth?: DaemonLogHealth;
        logIssues?: readonly DaemonLogIssue[];
        logDroppedRecords?: number;
        logDroppedBytes?: number;
    };
    security: DaemonStatusSecurity;
    limits: DaemonStatusLimits;
    workspaces?: Array<{
        id: string;
        cwd: string;
        primary: boolean;
        trusted: boolean;
    }>;
    capabilities: {
        protocolVersions: ServeProtocolVersions;
        features: string[];
    };
    runtime: DaemonStatusRuntime;
    full?: FullDaemonStatus;
}
export declare function parseDaemonStatusDetail(raw: unknown): ParseDaemonStatusDetailResult;
export declare function buildDaemonStatusResponse(detail: DaemonStatusDetail, input: BuildDaemonStatusOptions): Promise<DaemonStatusResponse>;
export declare function allowOriginMode(allowOrigins: readonly string[] | undefined): 'none' | 'specific' | 'any';
export declare function listenerMaxConnections(value: number | undefined): number | null;
export declare function positiveFiniteOrNull(value: number | undefined): number | null;
