/**
 * ConfigWatcherManager
 *
 * Provides a simplified interface for watching configuration file changes.
 * Wraps the underlying ConfigWatcher with agent-focused callbacks.
 *
 * Used by backend agents for hot-reloading:
 * - Source config changes (add/update/delete)
 * - Skills config changes
 * - Permissions config changes
 * - Validation errors
 */
import type { LoadedSource } from '../../sources/types.ts';
import type { LoadedSkill } from '../../skills/types.ts';
/**
 * Callbacks for config changes - simplified for agent use
 */
export interface ConfigWatcherManagerCallbacks {
    /**
     * Called when a source config changes.
     * @param slug - Source slug
     * @param source - Updated source or null if deleted
     */
    onSourceChange?: (slug: string, source: LoadedSource | null) => void;
    /**
     * Called when the sources list changes (add/remove folders).
     * @param sources - All current sources
     */
    onSourcesListChange?: (sources: LoadedSource[]) => void;
    /**
     * Called when a skill config changes.
     * @param slug - Skill slug
     * @param skill - Updated skill or null if deleted
     */
    onSkillChange?: (slug: string, skill: LoadedSkill | null) => void;
    /**
     * Called when the skills list changes (add/remove folders).
     * @param skills - All current skills
     */
    onSkillsListChange?: (skills: LoadedSkill[]) => void;
    /**
     * Called when workspace permissions change.
     * @param workspaceId - Workspace ID
     */
    onWorkspacePermissionsChange?: (workspaceId: string) => void;
    /**
     * Called when a source's permissions change.
     * @param sourceSlug - Source slug
     */
    onSourcePermissionsChange?: (sourceSlug: string) => void;
    /**
     * Called when default (app-level) permissions change.
     */
    onDefaultPermissionsChange?: () => void;
    /**
     * Called when a validation error occurs while loading config.
     * @param file - File path relative to config root
     * @param errors - Validation errors
     */
    onValidationError?: (file: string, errors: string[]) => void;
    /**
     * Called when an error occurs reading/parsing a file.
     * @param file - File path relative to config root
     * @param error - Error that occurred
     */
    onError?: (file: string, error: Error) => void;
}
/**
 * Configuration for ConfigWatcherManager
 */
export interface ConfigWatcherManagerConfig {
    /**
     * Workspace root path to watch.
     * Can be either workspace ID or full path.
     */
    workspaceRootPath: string;
    /**
     * Whether the agent is running in headless mode.
     * Config watching is skipped in headless mode to reduce overhead.
     */
    isHeadless?: boolean;
    /**
     * Debug callback for logging.
     */
    onDebug?: (message: string) => void;
}
/**
 * Manages config file watching for agent hot-reload functionality.
 *
 * Provides a simplified interface over ConfigWatcher that:
 * - Only exposes agent-relevant callbacks
 * - Handles headless mode (no-op)
 * - Provides consistent debug logging
 */
export declare class ConfigWatcherManager {
    private watcher;
    private workspaceRootPath;
    private isHeadless;
    private callbacks;
    private onDebugCallback;
    constructor(config: ConfigWatcherManagerConfig, callbacks?: ConfigWatcherManagerCallbacks);
    /**
     * Start watching configuration files.
     * No-op if already running or in headless mode.
     */
    start(): void;
    /**
     * Stop watching configuration files.
     */
    stop(): void;
    /**
     * Check if the watcher is currently running.
     */
    isRunning(): boolean;
    /**
     * Update callbacks after construction.
     * Useful when callbacks need to reference agent state that isn't available at construction.
     */
    updateCallbacks(callbacks: Partial<ConfigWatcherManagerCallbacks>): void;
    /**
     * Get the workspace root path being watched.
     */
    getWorkspaceRootPath(): string;
    private debug;
}
/**
 * Create and optionally start a ConfigWatcherManager.
 *
 * @param config - Manager configuration
 * @param callbacks - Callbacks for config changes
 * @param autoStart - Whether to start watching immediately (default: true)
 * @returns ConfigWatcherManager instance
 */
export declare function createConfigWatcherManager(config: ConfigWatcherManagerConfig, callbacks?: ConfigWatcherManagerCallbacks, autoStart?: boolean): ConfigWatcherManager;
