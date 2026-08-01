/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ChannelWebhookTask } from '@hoptrendy/channel-base';
import type { ChannelWorkerGroup, ChannelWorkerGroupSnapshot } from './channel-worker-group.js';
import type { ChannelStartupAttemptFailure, ChannelWorkerSnapshot } from './channel-worker-supervisor.js';
import type { ChannelWorkspaceGroup } from './channel-workspace-grouping.js';
import type { ServeChannelSelection } from './types.js';
export type ChannelWorkerControlTransition = 'idle' | 'starting' | 'reconciling' | 'stopping' | 'rolling_back';
export interface ChannelWorkerControlState {
    enabled: boolean;
    selection: ServeChannelSelection | null;
    pendingSelection?: ServeChannelSelection;
    transition: ChannelWorkerControlTransition;
    workers: ChannelWorkerGroupSnapshot[];
}
export interface ChannelWorkerSetResult {
    changed: boolean;
    replaced: boolean;
    partial: boolean;
    state: ChannelWorkerControlState;
    /** Internal HTTP status hint; omitted from the response body. */
    created?: boolean;
}
export interface ChannelWorkerStopResult {
    changed: boolean;
    state: ChannelWorkerControlState;
}
export declare class ChannelWorkerControlError extends Error {
    readonly code: 'channel_worker_start_failed' | 'channel_worker_stop_failed' | 'channel_worker_not_enabled' | 'daemon_draining';
    readonly rolledBack?: boolean;
    readonly rollbackError?: string;
    readonly startupFailures?: ChannelStartupAttemptFailure[];
    readonly startupFailuresTruncated?: boolean;
    constructor(code: ChannelWorkerControlError['code'], message: string, details?: {
        rolledBack?: boolean;
        rollbackError?: string;
        startupFailures?: readonly ChannelStartupAttemptFailure[];
        startupFailuresTruncated?: boolean;
    });
}
export interface CreateChannelWorkerManagerOptions {
    resolveGroups: (selection: ServeChannelSelection, operation: 'initial' | 'set' | 'reload') => Promise<readonly ChannelWorkspaceGroup[]>;
    createGroup: (groups: readonly ChannelWorkspaceGroup[]) => ChannelWorkerGroup;
    reserveLease: (selection: ServeChannelSelection) => void;
    releaseLease: () => void;
    initialLeaseReserved?: boolean;
    onCommittedSelection?: (selection: ServeChannelSelection | undefined, groups: readonly ChannelWorkspaceGroup[]) => void;
    onStateChange?: (state: ChannelWorkerControlState) => void;
}
export interface ChannelWorkerManager {
    startInitial(selection: ServeChannelSelection): Promise<void>;
    setSelection(selection: ServeChannelSelection): Promise<ChannelWorkerSetResult>;
    stopSelection(): Promise<ChannelWorkerStopResult>;
    reload(): Promise<ChannelWorkerSnapshot>;
    state(): ChannelWorkerControlState;
    primarySnapshot(): ChannelWorkerSnapshot;
    snapshots(): ChannelWorkerGroupSnapshot[];
    enqueueWebhookTask(task: ChannelWebhookTask): ReturnType<ChannelWorkerGroup['enqueueWebhookTask']>;
    beginWorkspaceDrain(workspaceCwd: string): void;
    cancelWorkspaceDrain(workspaceCwd: string): void;
    workspaceActivity(workspaceCwd: string): number;
    removeWorkspace(workspaceCwd: string): Promise<void>;
    restoreWorkspace(workspaceCwd: string): Promise<void>;
    refreshWorkspaces(): Promise<void>;
    workerChanged(): void;
    shutdown(): Promise<void>;
    killAllSync(): void;
}
export declare function createChannelWorkerManager(opts: CreateChannelWorkerManagerOptions): ChannelWorkerManager;
