/**
 * Test utilities for agent tests
 *
 * Provides mock factories and helpers for testing agent implementations.
 */
import type { AgentEvent } from '@craft-agent/core/types';
import type { BackendConfig, ChatOptions } from '../backend/types.ts';
import { AbortReason } from '../backend/types.ts';
import type { Workspace } from '../../config/storage.ts';
import type { SessionConfig as Session } from '../../sessions/storage.ts';
import type { LoadedSource } from '../../sources/types.ts';
import { BaseAgent } from '../base-agent.ts';
/**
 * Create a mock Workspace object for testing.
 */
export declare function createMockWorkspace(overrides?: Partial<Workspace>): Workspace;
/**
 * Create a mock Session object for testing.
 */
export declare function createMockSession(overrides?: Partial<Session>): Session;
/**
 * Create a mock LoadedSource object for testing.
 */
export declare function createMockSource(overrides?: Partial<LoadedSource['config']>): LoadedSource;
/**
 * Create a mock BackendConfig for testing.
 */
export declare function createMockBackendConfig(overrides?: Partial<BackendConfig>): BackendConfig;
/**
 * Concrete implementation of BaseAgent for testing.
 * Provides minimal implementations of abstract methods.
 */
export declare class TestAgent extends BaseAgent {
    protected backendName: string;
    chatCalls: Array<{
        message: string;
        attachments?: unknown[];
        options?: ChatOptions;
    }>;
    abortCalls: Array<{
        reason?: string;
    }>;
    forceAbortCalls: Array<{
        reason: AbortReason;
    }>;
    respondToPermissionCalls: Array<{
        requestId: string;
        allowed: boolean;
        alwaysAllow?: boolean;
    }>;
    private _isProcessing;
    constructor(config: BackendConfig);
    protected chatImpl(message: string, attachments?: unknown[], options?: ChatOptions): AsyncGenerator<AgentEvent>;
    abort(reason?: string): Promise<void>;
    forceAbort(reason?: AbortReason): void;
    isProcessing(): boolean;
    respondToPermission(requestId: string, allowed: boolean, alwaysAllow?: boolean): void;
    runMiniCompletion(_prompt: string): Promise<string | null>;
    queryLlm(_request: import('../llm-tool.ts').LLMQueryRequest): Promise<import('../llm-tool.ts').LLMQueryResult>;
    getConfigWatcherManager(): import("../index.js").ConfigWatcherManager | null;
    resetTracking(): void;
}
/**
 * Collect all events from an AsyncGenerator.
 */
export declare function collectEvents(generator: AsyncGenerator<AgentEvent>): Promise<AgentEvent[]>;
/**
 * Create a callback spy that records all calls.
 */
export declare function createCallbackSpy<T extends (...args: unknown[]) => unknown>(): {
    spy: T;
    calls: Parameters<T>[];
};
