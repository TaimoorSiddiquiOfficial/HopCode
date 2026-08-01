/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Dispatch, SetStateAction } from 'react';
import type { DaemonSessionClient, CreateSessionRequest, DaemonTranscriptStore } from '@hoptrendy/sdk/daemon';
import { type TimerRef } from '../timing.js';
import type { ActivePrompt, AddDaemonSessionNotice, DaemonConnectionState, DaemonPromptStatus, DaemonSessionActions, SettledPrompt, PendingSessionLoad } from './types.js';
interface RefBox<T> {
    current: T;
}
export interface CreateDaemonSessionActionsArgs {
    store: DaemonTranscriptStore;
    sessionRef: RefBox<DaemonSessionClient | undefined>;
    activePromptsRef: RefBox<Map<string, ActivePrompt>>;
    settledPromptsRef: RefBox<Map<string, SettledPrompt>>;
    pendingSessionLoadRef: RefBox<PendingSessionLoad | undefined>;
    pendingSessionLoadIdRef: RefBox<number>;
    heartbeatSupportedRef: RefBox<boolean>;
    manualSessionClearRef: RefBox<boolean>;
    skipNextCleanupDetachSessionIdRef: RefBox<string | undefined>;
    passiveAssistantDoneTimerRef: TimerRef;
    getCreateSessionRequest: () => CreateSessionRequest;
    createDetachedSession: (workspaceCwd?: string, overrides?: Pick<CreateSessionRequest, 'approvalMode' | 'sourceType'>) => Promise<DaemonSessionClient>;
    getConnection: () => DaemonConnectionState;
    hasSessionActivePrompt: () => boolean;
    resetCurrentSessionActivePrompt: () => void;
    restartEventStream: (sessionId: string) => void;
    addNotice: AddDaemonSessionNotice;
    setConnection: Dispatch<SetStateAction<DaemonConnectionState>>;
    setPromptStatus: Dispatch<SetStateAction<DaemonPromptStatus>>;
    setRestoreSessionId: Dispatch<SetStateAction<string | undefined>>;
    setRestoreWorkspaceCwd: Dispatch<SetStateAction<string | undefined>>;
    setRestoreMode: Dispatch<SetStateAction<'load' | 'resume'>>;
    setRestoreSessionNonce: Dispatch<SetStateAction<number>>;
    setAttachSessionNonce: Dispatch<SetStateAction<number>>;
    setNewSessionNonce: Dispatch<SetStateAction<number>>;
}
export declare function getConnectionAfterSessionClear(current: DaemonConnectionState, clearedSessionId: string | undefined): DaemonConnectionState;
export declare function createDaemonSessionActions({ store, sessionRef, activePromptsRef, settledPromptsRef, pendingSessionLoadRef, pendingSessionLoadIdRef, heartbeatSupportedRef, manualSessionClearRef, skipNextCleanupDetachSessionIdRef, passiveAssistantDoneTimerRef, getCreateSessionRequest, createDetachedSession, getConnection, hasSessionActivePrompt, resetCurrentSessionActivePrompt, restartEventStream, addNotice, setConnection, setPromptStatus, setRestoreSessionId, setRestoreWorkspaceCwd, setRestoreMode, setRestoreSessionNonce, setAttachSessionNonce, setNewSessionNonce, }: CreateDaemonSessionActionsArgs): DaemonSessionActions;
export declare function getPromptSettledKey(sessionId: string, promptId: string): string;
export {};
