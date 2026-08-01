/**
 * BaseAgent Abstract Class
 *
 * Shared base class for AI agent backends.
 * Extracts common functionality including:
 * - Model/thinking configuration
 * - Permission mode management (via PermissionManager)
 * - Source management (via SourceManager)
 * - Planning heuristics (via PlanningAdvisor)
 * - Config watching (via ConfigWatcherManager)
 * - Usage tracking (via UsageTracker)
 *
 * Provider-specific behavior (chat, abort, capabilities) is implemented in subclasses.
 */
import type { AgentEvent } from '@craft-agent/core/types';
import type { FileAttachment } from '../utils/files.ts';
import type { ThinkingLevel } from './thinking-levels.ts';
import type { PermissionMode } from './mode-manager.ts';
import type { LoadedSource } from '../sources/types.ts';
import { type LLMQueryRequest, type LLMQueryResult } from './llm-tool.ts';
import type { PermissionResponseOptions } from '../protocol/dto.ts';
import type { AgentBackend, ChatOptions, PermissionCallback, PlanCallback, AuthCallback, SourceChangeCallback, SourceActivationCallback, SdkMcpServerConfig, BackendConfig, PostInitResult, BridgeUpdateContext, RecoveryMessage } from './backend/types.ts';
import { AbortReason } from './backend/types.ts';
import type { Workspace } from '../config/storage.ts';
import { PermissionManager } from './core/permission-manager.ts';
import { SourceManager } from './core/source-manager.ts';
import { PromptBuilder } from './core/prompt-builder.ts';
import { PathProcessor } from './core/path-processor.ts';
import { ConfigWatcherManager } from './core/config-watcher-manager.ts';
import { UsageTracker, type UsageUpdate } from './core/usage-tracker.ts';
import { PrerequisiteManager } from './core/prerequisite-manager.ts';
import type { AutomationSystem } from '../automations/automation-system.ts';
import type { AgentEvent as AutomationAgentEvent, SdkAutomationInput } from '../automations/types.ts';
/**
 * Mini agent configuration - shared across all backends.
 * Centralized here to avoid duplication between backend agents.
 */
export interface MiniAgentConfig {
    /** Whether mini agent mode is enabled */
    enabled: boolean;
    /** Allowed tools for mini agent mode */
    tools: readonly string[];
    /** MCP server keys to include (others filtered out) */
    mcpServerKeys: readonly string[];
    /** Thinking/reasoning should be minimized */
    minimizeThinking: boolean;
}
export interface SpawnSessionRequest {
    prompt: string;
    name?: string;
    llmConnection?: string;
    model?: string;
    enabledSourceSlugs?: string[];
    permissionMode?: PermissionMode;
    thinkingLevel?: ThinkingLevel;
    labels?: string[];
    workingDirectory?: string;
    attachments?: Array<{
        path: string;
        name?: string;
    }>;
}
export interface SpawnSessionResult {
    sessionId: string;
    name: string;
    status: 'started';
    connection?: string;
    model?: string;
}
export interface SpawnSessionHelpResult {
    connections: Array<{
        slug: string;
        name: string;
        isDefault: boolean;
        providerType: string;
        models: string[];
        defaultModel?: string;
    }>;
    sources: Array<{
        slug: string;
        name: string;
        type: string;
        enabled: boolean;
    }>;
    defaults: {
        defaultConnection: string | null;
        permissionMode: string;
    };
}
/** Tool list for mini agents - quick config edits only */
export declare const MINI_AGENT_TOOLS: readonly ["Read", "Edit", "Write", "Glob", "Grep", "Bash"];
/** MCP servers for mini agents - minimal set (docs tools are now bundled in session) */
export declare const MINI_AGENT_MCP_KEYS: readonly ["session"];
/**
 * Abstract base class for agent backends.
 *
 * Provides:
 * - Common state management (model, thinking, workspace, session)
 * - Core module delegation (PermissionManager, SourceManager, etc.)
 * - Callback declarations for UI integration
 *
 * Subclasses must implement:
 * - backendName: Display name for error messages
 * - chat(): Provider-specific agentic loop
 * - abort(): Provider-specific abort handling
 * - capabilities(): Provider-specific capabilities
 * - respondToPermission(): Provider-specific permission resolution
 * - destroy(): Provider-specific cleanup
 * - runMiniCompletion(): Simple text completion using backend's auth
 */
export declare abstract class BaseAgent implements AgentBackend {
    protected abstract backendName: string;
    /** Whether this backend supports session branching. Subclasses can override. */
    protected _supportsBranching: boolean;
    get supportsBranching(): boolean;
    protected config: BackendConfig;
    protected workingDirectory: string;
    protected _sessionId: string;
    protected _model: string;
    protected _thinkingLevel: ThinkingLevel;
    protected permissionManager: PermissionManager;
    protected sourceManager: SourceManager;
    protected promptBuilder: PromptBuilder;
    protected pathProcessor: PathProcessor;
    protected configWatcherManager: ConfigWatcherManager | null;
    protected usageTracker: UsageTracker;
    protected prerequisiteManager: PrerequisiteManager;
    protected automationSystem?: AutomationSystem;
    protected temporaryClarifications: string | null;
    protected _pendingSourceActivationRestart: {
        sourceSlug: string;
        userMessage: string;
    } | null;
    protected _currentTurnUserMessage: string | null;
    setPendingSourceActivationRestart(pending: {
        sourceSlug: string;
        userMessage: string;
    }): void;
    consumePendingSourceActivationRestart(): {
        sourceSlug: string;
        userMessage: string;
    } | null;
    getCurrentTurnUserMessage(): string | null;
    protected setCurrentTurnUserMessage(message: string | null): void;
    onPermissionRequest: PermissionCallback | null;
    onPlanSubmitted: PlanCallback | null;
    onAuthRequest: AuthCallback | null;
    onSourceChange: SourceChangeCallback | null;
    onSourcesListChange: ((sources: LoadedSource[]) => void) | null;
    onConfigValidationError: ((file: string, errors: string[]) => void) | null;
    onPermissionModeChange: ((mode: PermissionMode) => void) | null;
    onDebug: ((message: string) => void) | null;
    onSourceActivationRequest: SourceActivationCallback | null;
    onUsageUpdate: ((update: UsageUpdate) => void) | null;
    onBackendAuthRequired: ((reason: string) => void) | null;
    onSpawnSession: ((request: SpawnSessionRequest) => Promise<SpawnSessionResult>) | null;
    constructor(config: BackendConfig, defaultModel: string, contextWindow?: number);
    /**
     * Start the config file watcher for hot-reloading changes.
     * Called by subclass constructor in non-headless mode.
     */
    protected startConfigWatcher(): void;
    /**
     * Stop the config file watcher.
     */
    protected stopConfigWatcher(): void;
    /**
     * Log a debug message. Override in subclass to add prefix.
     */
    protected debug(message: string): void;
    /**
     * Fire an automation agent event (from automations.json) via AutomationSystem.
     * Catches all errors — automations must never break the agent flow.
     *
     * Backends call this directly when handling automation hooks.
     *
     * @param signal - Optional AbortSignal for cancelling automation execution on abort
     */
    protected emitAutomationEvent(event: AutomationAgentEvent, input: SdkAutomationInput, signal?: AbortSignal): Promise<void>;
    /**
     * Handle successful completion of a session MCP tool (SubmitPlan, auth tools).
     *
     * WHY THIS IS ON BaseAgent:
     * -------------------------
     * Session-scoped tools (SubmitPlan, source_oauth_trigger, etc.) run in an
     * EXTERNAL MCP server subprocess (packages/session-mcp-server). That subprocess
     * has its own process memory, so when it calls getSessionScopedToolCallbacks(),
     * the callback registry is empty — it was populated in THIS process, not the subprocess.
     *
     * Instead, each backend detects session MCP tool
     * completions from its own event stream (different formats per SDK) and calls
     * THIS shared method to fire the appropriate callback.
     *
     * In-process tools can call the callback registry directly.
     *
     * CALLBACKS FIRED:
     * - SubmitPlan → this.onPlanSubmitted(planPath)
     *   → Electron reads plan file, shows plan card, calls interruptForHandoff(PlanSubmitted)
     * - Auth tools → this.onAuthRequest(authRequest)
     *   → Electron shows auth dialog, calls interruptForHandoff(AuthRequest)
     */
    protected handleSessionMcpToolCompletion(toolName: string, args: Record<string, unknown>): void;
    getModel(): string;
    setModel(model: string): void;
    getThinkingLevel(): ThinkingLevel;
    setThinkingLevel(level: ThinkingLevel): void;
    getPermissionMode(): PermissionMode;
    setPermissionMode(mode: PermissionMode): void;
    cyclePermissionMode(): PermissionMode;
    /**
     * Check if currently in safe mode (read-only exploration).
     */
    isInSafeMode(): boolean;
    getWorkspace(): Workspace;
    setWorkspace(workspace: Workspace): void;
    getSessionId(): string | null;
    setSessionId(sessionId: string | null): void;
    /**
     * Clear conversation history and start fresh.
     * Subclasses should override to clear provider-specific state.
     */
    clearHistory(): void;
    /**
     * Reset prerequisite read state (e.g., on context compaction).
     * After compaction the LLM no longer has guide content in context,
     * so it must re-read before using source tools.
     * Also resets seen sources so guide paths re-appear in source introductions.
     */
    resetPrerequisiteState(): void;
    /**
     * Update the working directory.
     * Also updates PermissionManager and persists to session config.
     */
    updateWorkingDirectory(path: string): void;
    /**
     * Update the SDK cwd (used for transcript storage location).
     *
     * This should only be called when it's safe to update - i.e., before any
     * SDK interaction has occurred. The SessionManager checks this condition
     * before calling this method.
     *
     * This updates the session config so the agent uses the new path for
     * SDK operations going forward.
     */
    updateSdkCwd(path: string): void;
    /**
     * Set the MCP server configurations for sources.
     * Called by facade when sources are activated/deactivated.
     *
     * Subclasses may override to handle provider-specific MCP setup.
     */
    setSourceServers(mcpServers: Record<string, SdkMcpServerConfig>, apiServers: Record<string, unknown>, intendedSlugs?: string[]): Promise<void>;
    getActiveSourceSlugs(): string[];
    getAllSources(): LoadedSource[];
    /**
     * Set all sources (for context injection).
     * Uses SourceManager for state tracking.
     */
    setAllSources(sources: LoadedSource[]): void;
    /**
     * Mark a source as unseen (will show introduction text again).
     */
    markSourceUnseen(sourceSlug: string): void;
    /**
     * Check if a source server is currently active.
     */
    isSourceServerActive(serverName: string): boolean;
    /**
     * Get the set of active source server names.
     */
    getActiveSourceServerNames(): Set<string>;
    /**
     * Set temporary clarifications for context injection.
     * These are injected into prompts but not yet persisted.
     */
    setTemporaryClarifications(text: string | null): void;
    /**
     * Get SourceManager for advanced source state queries.
     */
    getSourceManager(): SourceManager;
    /**
     * Get PermissionManager for advanced permission queries.
     */
    getPermissionManager(): PermissionManager;
    /**
     * Get PromptBuilder for context building.
     */
    getPromptBuilder(): PromptBuilder;
    /**
     * Check if running in mini agent mode.
     * Centralized detection used by all backends.
     */
    isMiniAgent(): boolean;
    /**
     * Get mini agent configuration for provider-specific application.
     * Returns centralized config that each backend interprets appropriately:
     * Backends interpret this shared config in their own runtime.
     */
    getMiniAgentConfig(): MiniAgentConfig;
    /**
     * Get the mini agent system prompt.
     * Shared across backends for consistency.
     * Uses workspace root path for config file locations.
     */
    getMiniSystemPrompt(): string;
    /**
     * Filter MCP servers for mini agent mode.
     * Only includes servers whose keys are in the allowed list.
     *
     * @param servers - Full set of MCP servers
     * @param allowedKeys - Keys to include (from getMiniAgentConfig().mcpServerKeys)
     * @returns Filtered servers object
     */
    filterMcpServersForMiniAgent<T>(servers: Record<string, T>, allowedKeys: readonly string[]): Record<string, T>;
    /**
     * Build recovery context from previous messages when session resume fails.
     * Called when we detect an empty response or thread not found during resume.
     * Injects previous conversation context so the agent can continue naturally.
     *
     * @returns Formatted string to prepend to the user message, or null if no context available.
     */
    protected buildRecoveryContext(): string | null;
    /**
     * Build one-time branch seed context for sessions branched from an earlier message.
     * Ensures the first turn in the new branch only sees transcript up to the selected branch point.
     */
    protected buildBranchSeedContext(messages?: RecoveryMessage[]): string | null;
    /**
     * Clear session ID and notify callbacks.
     * Called when session resume fails and we need to start fresh.
     */
    protected clearSessionForRecovery(): void;
    /**
     * Get the session storage path for this agent's session.
     * Convenience wrapper around getSessionPath() with null-checking.
     *
     * @returns Session path, or undefined if session/workspace not configured
     */
    protected getSessionStoragePath(): string | undefined;
    /**
     * Post-construction initialization.
     * Default: no-op for backends without post-construction auth injection.
     * Override in backends that need post-construction auth injection.
     */
    postInit(): Promise<PostInitResult>;
    /**
     * Apply bridge/config updates mid-session.
     * Default: no-op for backends that don't use bridge-mcp-server.
     * Override in backends that regenerate config or write bridge files.
     */
    applyBridgeUpdates(_context: BridgeUpdateContext): Promise<void>;
    /**
     * Ensure branch sessions are backend-ready before first user message.
     * Default implementation is a no-op.
     */
    ensureBranchReady(): Promise<void>;
    /**
     * Alias for destroy() for consistency.
     */
    dispose(): void;
    /**
     * Base cleanup - clears common resources.
     * Subclasses MUST call super.destroy() and add provider-specific cleanup.
     */
    destroy(): void;
    /**
     * Extract skill mentions from a message and resolve their SKILL.md paths.
     *
     * Parses [skill:slug] or [skill:workspaceId:slug] mentions, resolves the
     * corresponding SKILL.md file paths. Does NOT read the files — the model
     * must read them itself (enforced by PrerequisiteManager).
     *
     * @param message - The user message containing potential skill mentions
     * @returns Object with:
     *   - skillPaths: Map of slug → resolved SKILL.md absolute path
     *   - cleanMessage: Message with mentions stripped, or default directive
     *   - missingSkills: Array of skill slugs that were mentioned but not found
     */
    protected extractSkillPaths(message: string): {
        skillPaths: Map<string, string>;
        cleanMessage: string;
        missingSkills: string[];
    };
    /**
     * Format a directive telling the model to read skill SKILL.md files before proceeding.
     * Called from chat() — all agents get the same directive prepended to their message.
     */
    protected formatSkillDirective(skillPaths: Map<string, string>): string;
    /**
     * Send a message and stream back events.
     * Validates skill mentions, registers prerequisites, prepends read directive,
     * then delegates to chatImpl. All skill logic is handled here — chatImpl
     * never sees skill paths.
     */
    chat(message: string, attachments?: FileAttachment[], options?: ChatOptions): AsyncGenerator<AgentEvent>;
    /**
     * Provider-specific chat implementation.
     * Called by chat() after skill validation, prerequisite registration,
     * and directive injection. The message already contains any skill
     * read directives — subclasses don't handle skills at all.
     *
     * @param message - User message (may have skill read directive prepended)
     * @param attachments - File attachments
     * @param options - Chat options (resume, retry, etc.)
     */
    protected abstract chatImpl(message: string, attachments?: FileAttachment[], options?: ChatOptions): AsyncGenerator<AgentEvent>;
    /**
     * Abort current query (user stop or internal abort).
     */
    abstract abort(reason?: string): Promise<void>;
    /**
     * Force abort with specific reason.
     * Used for true hard-stop semantics (user stop, redirect fallback, teardown).
     */
    abstract forceAbort(reason: AbortReason): void;
    /**
     * Interrupt the current turn because control is being handed to the UI.
     *
     * Default implementation delegates to forceAbort(); backends can override
     * when handoff semantics differ from hard abort semantics.
     */
    interruptForHandoff(reason: AbortReason): void;
    /**
     * Redirect the agent mid-stream. Default: abort and let session layer re-send.
     * Override in backends that support native steering.
     */
    redirect(_message: string): boolean;
    /**
     * Check if currently processing a query.
     */
    abstract isProcessing(): boolean;
    /**
     * Respond to a pending permission request.
     */
    abstract respondToPermission(requestId: string, allowed: boolean, alwaysAllow?: boolean, options?: PermissionResponseOptions): void;
    /**
     * Run a simple text completion using the agent's auth infrastructure.
     * No tools, no system prompt - just text in → text out.
     * Each backend implements using its own runtime.
     *
     * @param prompt - The prompt to send
     * @returns The model's response text, or null if completion fails
     */
    abstract runMiniCompletion(prompt: string): Promise<string | null>;
    /**
     * Execute an LLM query using the agent's auth infrastructure.
     * Used by call_llm tool (via queryFn callback) and potentially by runMiniCompletion.
     *
     * Each backend implements this using its own session mechanism.
     *
     * @param request - The query request (prompt, model, systemPrompt, etc.)
     * @returns The model's response text and optional token usage
     */
    abstract queryLlm(request: LLMQueryRequest): Promise<LLMQueryResult>;
    /**
     * Pre-execute a call_llm request: resolve attachments, validate model, run query.
     * Shared across all backends. Providers can override validateCallLlmModel().
     */
    protected preExecuteCallLlm(input: Record<string, unknown>): Promise<LLMQueryResult>;
    /**
     * Optional model validation hook for call_llm.
     * Override in subclasses to filter unsupported models.
     * Return undefined to fall back to miniModel.
     */
    protected validateCallLlmModel?(modelId: string): string | undefined;
    /**
     * Pre-execute a spawn_session request: handle help mode or delegate to onSpawnSession.
     * Shared across all backends.
     */
    protected preExecuteSpawnSession(input: Record<string, unknown>): Promise<SpawnSessionResult | SpawnSessionHelpResult>;
    /**
     * Get available connections, models, and sources for spawn_session help mode.
     */
    protected getSpawnSessionHelp(): SpawnSessionHelpResult;
    /**
     * Generate a session title from a user message.
     * Uses runMiniCompletion with the same auth as the main agent.
     *
     * @param message - The user's message to generate a title from
     * @param options.language - Preferred language for the title
     * @returns Generated title (2-5 words), or null if generation fails
     */
    generateTitle(message: string, options?: {
        language?: string;
    }): Promise<string | null>;
    /**
     * Regenerate a session title based on recent conversation context.
     * Uses a spread of messages (first, middle, last) to capture the session's purpose.
     *
     * @param recentUserMessages - Spread of user messages
     * @param lastAssistantResponse - The most recent assistant response
     * @param options.language - Preferred language for the title
     * @returns Generated title (2-5 words), or null if generation fails
     */
    regenerateTitle(recentUserMessages: string[], lastAssistantResponse: string, options?: {
        language?: string;
    }): Promise<string | null>;
    /**
     * Get a bound summarize callback for passing to API tool builders.
     * This allows MCP servers to summarize using the agent's auth infrastructure.
     */
    getSummarizeCallback(): (prompt: string) => Promise<string | null>;
}
export { AbortReason };
