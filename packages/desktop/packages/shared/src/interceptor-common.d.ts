/**
 * Shared infrastructure for the unified network interceptor.
 *
 * This module stores cross-process tool metadata and recent API errors.
 * This module provides the common pieces:
 * - toolMetadataStore (file-based cross-process sharing)
 * - LastApiError (error capture for error handler)
 * - Logging utilities
 * - Config reading (richToolDescriptions, extendedPromptCache settings)
 */
/** Packaged apps run from inside an app.asar archive */
export declare const IS_PACKAGED: boolean;
/** Enable interceptor logging in dev mode (not packaged), disable in production */
export declare const INTERCEPTOR_LOGGING_ENABLED: boolean;
export declare const DEBUG: boolean;
/** Config file path for reading settings in the SDK subprocess */
export declare const CONFIG_FILE: string;
export declare const LOG_DIR: string;
export declare const LOG_FILE: string;
export declare function debugLog(...args: unknown[]): void;
/** Reset the config cache. Used by tests to ensure fresh reads after writing config. */
export declare function _resetConfigCacheForTesting(): void;
/**
 * Check if rich tool descriptions are enabled (adds _intent/_displayName to all tools).
 * Reads from config.json via shared cache — the file is small and this runs once per API request.
 * Defaults to true if config is unreadable or field is not set.
 */
export declare function isRichToolDescriptionsEnabled(): boolean;
/**
 * Check if extended prompt cache (1h TTL) is enabled.
 * When enabled, the interceptor upgrades all cache_control blocks from 5m to 1h TTL.
 * Defaults to false if config is unreadable or field is not set.
 */
export declare function isExtendedPromptCacheEnabled(): boolean;
/**
 * Check if 1M context window is enabled.
 * When disabled, the interceptor strips the context-1m beta header.
 * Defaults to false.
 * Must stay in sync with getEnable1MContext() in config/storage.ts.
 */
export declare function is1MContextEnabled(): boolean;
/**
 * Store the last API error for the error handler to access.
 * Uses file-based storage to reliably share across process boundaries.
 */
export interface LastApiError {
    status: number;
    statusText: string;
    message: string;
    timestamp: number;
}
export declare function setStoredError(error: LastApiError | null): void;
export declare function getLastApiError(sessionDir?: string): LastApiError | null;
export declare function clearLastApiError(): void;
/**
 * Metadata extracted from tool_use inputs by the SSE stripping/capture stream.
 * Keyed by tool_use_id, consumed by tool-matching.ts / event-adapter.ts.
 */
export interface ToolMetadata {
    intent?: string;
    displayName?: string;
    timestamp: number;
}
export declare const toolMetadataStore: {
    /**
     * Set session directory and pre-populate in-memory map from file.
     * Called by main process so subsequent get() calls are O(1) memory lookups.
     * Does NOT clear the map — entries from other sessions are preserved since
     * tool_use_ids are globally unique UUIDs and won't conflict.
     */
    setSessionDir(dir: string): void;
    /** Store metadata — writes to in-memory Map + cached file */
    set(toolUseId: string, metadata: ToolMetadata): void;
    /**
     * Read metadata — checks in-memory first, then session file.
     * Accepts an explicit sessionDir to read from the correct file even when
     * _sessionDir has been clobbered by a concurrent session's setSessionDir().
     */
    get(toolUseId: string, sessionDir?: string): ToolMetadata | undefined;
    delete(toolUseId: string): void;
    readonly size: number;
    /** Clear all in-memory entries. Used by tests to prevent cross-file state leaks. */
    _clearForTesting(): void;
};
/** Schema for _displayName field added to tool definitions */
export declare const displayNameSchema: {
    type: string;
    description: string;
};
/** Schema for _intent field added to tool definitions */
export declare const intentSchema: {
    type: string;
    description: string;
};
