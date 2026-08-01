/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type GitOperation } from '@hoptrendy/hopcode-core';
import type { AcpSessionBridge } from './acp-session-bridge.js';
export interface WorkspaceGitStatus {
    v: 2;
    workspaceCwd: string;
    branch: string | null;
    /** v2 enriched fields — absent when not a repo or git is unavailable. */
    detached?: boolean;
    staged?: number;
    unstaged?: number;
    untracked?: number;
    conflicted?: number;
    hasUpstream?: boolean;
    ahead?: number;
    behind?: number;
    stashCount?: number;
    /** In-progress operation (merge/rebase/cherry-pick/revert/bisect). */
    operation?: GitOperation;
    /** Epoch ms when the enriched fields were computed. */
    computedAt?: number;
}
export declare class WorkspaceGitState {
    private readonly entries;
    getStatus(workspaceCwd: string, bridge: AcpSessionBridge): Promise<WorkspaceGitStatus>;
    dispose(): void;
    disposeWorkspace(workspaceCwd: string): void;
    private getOrCreateEntry;
    private createEntry;
}
