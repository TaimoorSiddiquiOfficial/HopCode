/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { SessionService, type SessionLocation } from '@hoptrendy/hopcode-core';
import type { AcpSessionBridge } from '../acp-session-bridge.js';
export interface DaemonArchiveSessionsResult {
    archived: string[];
    alreadyArchived: string[];
    notFound: string[];
    errors: Array<{
        sessionId: string;
        error: unknown;
    }>;
}
export interface DaemonUnarchiveSessionsResult {
    unarchived: string[];
    alreadyActive: string[];
    notFound: string[];
    errors: Array<{
        sessionId: string;
        error: unknown;
    }>;
}
export interface DaemonDeleteSessionsResult {
    removed: string[];
    notFound: string[];
    errors: Array<{
        sessionId: string;
        error: unknown;
    }>;
}
export type DaemonDeleteErrorPhase = 'close' | 'remove' | 'delete';
export declare class SessionArchiveCoordinator {
    private readonly exclusive;
    private readonly shared;
    assertNotTransitioning(sessionId: string): void;
    runExclusiveMany<T>(sessionIds: string[], fn: () => Promise<T>): Promise<T>;
    runSharedMany<T>(sessionIds: string[], fn: () => Promise<T>): Promise<T>;
}
export declare function deleteDaemonSessions(params: {
    sessionIds: string[];
    service: SessionService;
    bridge: Pick<AcpSessionBridge, 'closeSession'>;
    coordinator: SessionArchiveCoordinator;
    onError?: (entry: {
        phase: DaemonDeleteErrorPhase;
        sessionId: string;
        error: string;
    }) => void;
}): Promise<DaemonDeleteSessionsResult>;
export declare function assertSessionLoadable(workspaceCwd: string, sessionId: string): Promise<SessionLocation>;
export declare function assertSessionArchived(workspaceCwd: string, sessionId: string): Promise<void>;
export declare function logSessionArchiveWarning(message: string): void;
export declare function archiveDaemonSessions(params: {
    sessionIds: string[];
    service: SessionService;
    bridge: Pick<AcpSessionBridge, 'closeSession'>;
    coordinator: SessionArchiveCoordinator;
}): Promise<DaemonArchiveSessionsResult>;
export declare function unarchiveDaemonSessions(params: {
    sessionIds: string[];
    service: SessionService;
    coordinator: SessionArchiveCoordinator;
}): Promise<DaemonUnarchiveSessionsResult>;
