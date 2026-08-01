/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonTranscriptStore } from '@hoptrendy/sdk/daemon';
export interface TimerRef {
    current: ReturnType<typeof setTimeout> | undefined;
}
export declare function getReconnectDelayMs(attempt: number, reconnectDelayMs: number, maxReconnectDelayMs: number): number;
export declare function withActionTimeout<T>(promise: Promise<T>, message: string, timeoutMs?: number): Promise<T>;
export declare function delay(delayMs: number, signal: AbortSignal): Promise<void>;
export declare function clearPassiveAssistantDoneTimer(timerRef: TimerRef): void;
export declare function schedulePassiveAssistantDone(store: DaemonTranscriptStore, timerRef: TimerRef, reason?: string, delayMs?: number, onDone?: () => void): void;
