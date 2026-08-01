/**
 * SourceManager - Centralized Source State Management
 *
 * Provides a unified interface for managing external data source state that both
 * Backend agents can use. Handles source tracking, formatting for
 * context injection, and auto-activation detection.
 *
 * Key responsibilities:
 * - Track active, inactive, and intended source states
 * - Format source state for system prompt injection
 * - Detect inactive source tool errors for auto-activation
 * - Determine authentication requirements for sources
 */
import type { LoadedSource } from '../../sources/types.ts';
import type { SourceManagerConfig } from './types.ts';
/**
 * SourceManager provides centralized source state tracking for agent backends.
 *
 * Usage:
 * ```typescript
 * const sourceManager = new SourceManager({
 *   onDebug: (msg) => console.log(msg),
 * });
 *
 * // Update source state when sources change
 * sourceManager.updateActiveState(['github', 'slack'], [], ['github', 'slack', 'failing-source']);
 * sourceManager.setAllSources(loadedSources);
 *
 * // Get formatted state for context injection
 * const contextBlock = sourceManager.formatSourceState();
 * ```
 */
export declare class SourceManager {
    private config;
    private activeSlugs;
    private intendedSlugs;
    private allSources;
    private knownSlugs;
    constructor(config?: SourceManagerConfig);
    /**
     * Update active source state based on what servers are actually running.
     *
     * @param mcpServerNames - Names of active MCP servers
     * @param apiServerNames - Names of active API servers
     * @param intendedSlugs - Source slugs that UI shows as active (may differ if build failed)
     */
    updateActiveState(mcpServerNames: string[], apiServerNames: string[], intendedSlugs?: string[]): void;
    /**
     * Set all available sources (active and inactive).
     */
    setAllSources(sources: LoadedSource[]): void;
    /**
     * Get all sources.
     */
    getAllSources(): LoadedSource[];
    /**
     * Check if a source slug is currently active.
     */
    isSourceActive(slug: string): boolean;
    /**
     * Check if a source slug is intended to be active (UI shows as active).
     */
    isSourceIntendedActive(slug: string): boolean;
    /**
     * Get active source slugs (only those with working tools).
     */
    getActiveSlugs(): Set<string>;
    /**
     * Get intended active source slugs (what UI shows).
     */
    getIntendedSlugs(): Set<string>;
    /**
     * Mark a source as seen (won't show introduction text again this session).
     */
    markSourceSeen(slug: string): void;
    /**
     * Mark a source as unseen (will show introduction text again).
     */
    markSourceUnseen(slug: string): void;
    /**
     * Reset all "seen" markers (e.g., on session clear).
     */
    resetSeenSources(): void;
    /**
     * Format source state as XML block for injection into user messages.
     * Shows active sources, inactive sources, and introduces new sources with taglines.
     *
     * @returns Formatted XML string for context injection
     */
    formatSourceState(): string;
    /**
     * Detect if a tool error indicates an inactive source that could be auto-activated.
     *
     * This is used when the agent tries to call a tool from a source that exists
     * but isn't currently active. If detected, the session manager can auto-activate
     * the source and retry the tool call.
     *
     * @param toolName - The tool name that was called
     * @param errorMessage - The error message from the tool call
     * @returns Source info if this is an inactive source error, null otherwise
     */
    detectInactiveSourceToolError(toolName: string, errorMessage: string): {
        sourceSlug: string;
        toolName: string;
    } | null;
    /**
     * Get the correct authentication tool name for a source, or null if no auth is needed.
     *
     * @param source - The source to check
     * @returns Tool name for authentication, or null
     */
    getAuthToolName(source: LoadedSource): string | null;
    /**
     * Check if a source needs authentication.
     */
    sourceNeedsAuthentication(source: LoadedSource): boolean;
}
