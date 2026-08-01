import type { EventSink } from '@craft-agent/server-core/transport';
import type { ISessionManager, IBrowserPaneManager } from '@craft-agent/server-core/handlers';
import { type PlatformServices } from '@craft-agent/server-core/runtime';
import { type PermissionMode, type AuthRequest, type AuthResult } from '@craft-agent/shared/agent';
import { resolveBackendContext, type AgentBackend, type AvailableCommandsSnapshot } from '@craft-agent/shared/agent/backend';
import { type Workspace, type WorkspaceInfo } from '@craft-agent/shared/config';
import type { ActiveSessionInfo } from '@craft-agent/core/types';
import { type SessionBundle, type DispatchMode, type SessionStatus, type SessionHeader } from '@craft-agent/shared/sessions';
import { TokenRefreshManager } from '@craft-agent/shared/sources';
import { McpClientPool, McpPoolServer } from '@craft-agent/shared/mcp';
import { type Session, type FileAttachment, type SendMessageOptions, type UnreadSummary, type RemoteSessionTransferPayload, type ImportRemoteSessionTransferResult, type AvailableSlashCommand, type RefreshAvailableCommandsOptions, type PermissionRuleType, type PermissionSettingsScope, type HopCodePermissionSettings, type HopCodeCoreSettingKey, type HopCodeCoreSettingsSnapshot, type HopCodeHookDefinition, type HopCodeHookEvent, type HopCodeMcpServerConfig, type HopCodeProviderCatalog, type HopCodeProviderConnectParams, type HopCodeProviderConnectResult, type HopCodeSettingValue, type HopCodeSettingsScope, type HopCodeSkillDeleteRequest, type HopCodeSkillDeleteResult, type HopCodeSkillInstallRequest, type HopCodeSkillInstallResult, type HopCodeSkillSetEnabledRequest, type HopCodeSkillSetEnabledResult } from '@craft-agent/shared/protocol';
import { type Message, type StoredAttachment } from '@craft-agent/core/types';
import { type ThinkingLevel } from '@craft-agent/shared/agent/thinking-levels';
import { sanitizeForTitle } from '@craft-agent/server-core/domain';
export { sanitizeForTitle };
export declare function setSessionPlatform(platform: PlatformServices): void;
interface SessionRuntimeHooks {
    updateBadgeCount: (count: number) => void;
    captureException: (error: unknown, context?: {
        errorSource?: string;
        sessionId?: string;
    }) => void;
    onSessionStarted: () => void;
    onSessionStopped: () => void;
}
export declare function setSessionRuntimeHooks(hooks: Partial<SessionRuntimeHooks>): void;
/**
 * Feature flags for agent behavior
 */
export declare const AGENT_FLAGS: {
    /** Default modes enabled for new sessions */
    readonly defaultModesEnabled: true;
};
/** Agent type - unified backend interface for all providers */
type AgentInstance = AgentBackend;
interface ManagedSession {
    id: string;
    workspace: Workspace;
    agent: AgentInstance | null;
    agentCreatePromise?: Promise<AgentInstance>;
    messages: Message[];
    isProcessing: boolean;
    /** Set when user requests stop - allows event loop to drain before clearing isProcessing */
    stopRequested?: boolean;
    lastUsedAt?: number;
    lastMessageAt: number;
    streamingText: string;
    processingGeneration: number;
    name?: string;
    externalBackendSyncedTitle?: string;
    externalBackendTitleSyncChain?: Promise<void>;
    isFlagged: boolean;
    /** Whether this session is archived */
    isArchived?: boolean;
    /** Timestamp when session was archived (for retention policy) */
    archivedAt?: number;
    /** Permission mode for this session */
    permissionMode?: PermissionMode;
    /** Previous permission mode (runtime-only session_state modeTransition context) */
    previousPermissionMode?: PermissionMode;
    /** Centralized MCP client pool for this session's source connections */
    mcpPool?: McpClientPool;
    /** HTTP MCP server exposing pool tools to external SDK subprocesses */
    poolServer?: McpPoolServer;
    sdkSessionId?: string;
    tokenUsage?: {
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
        contextTokens: number;
        costUsd: number;
        cacheReadTokens?: number;
        cacheCreationTokens?: number;
        /** Model's context window size in tokens (from SDK modelUsage) */
        contextWindow?: number;
    };
    availableCommands?: AvailableSlashCommand[];
    availableSkills?: string[];
    availableSkillDetails?: Array<import('@craft-agent/core/types').AvailableSkillDetail>;
    sessionStatus?: string;
    lastReadMessageId?: string;
    /**
     * Explicit unread flag - single source of truth for NEW badge.
     * Set to true when assistant message completes while user is NOT viewing.
     * Set to false when user views the session (and not processing).
     */
    hasUnread?: boolean;
    enabledSourceSlugs?: string[];
    labels?: string[];
    workingDirectory?: string;
    sdkCwd?: string;
    sharedUrl?: string;
    sharedId?: string;
    model?: string;
    llmConnection?: string;
    connectionLocked?: boolean;
    thinkingLevel?: ThinkingLevel;
    systemPromptPreset?: 'default' | 'mini' | string;
    lastMessageRole?: 'user' | 'assistant' | 'plan' | 'tool' | 'error';
    lastFinalMessageId?: string;
    turnStartFinalMessageId?: string;
    pendingExternalMetadata?: SessionHeader;
    _metadataWriteGuardUntil?: number;
    isAsyncOperationOngoing?: boolean;
    preview?: string;
    createdAt?: number;
    messageCount?: number;
    messageQueue: Array<{
        message: string;
        attachments?: FileAttachment[];
        storedAttachments?: StoredAttachment[];
        options?: SendMessageOptions;
        messageId?: string;
        optimisticMessageId?: string;
        eventClientId?: string;
        midTurnPending?: boolean;
    }>;
    backgroundShellCommands: Map<string, string>;
    backgroundTaskOutputs: Map<string, {
        outputFile: string;
        summary: string;
        status: string;
        completedAt: number;
    }>;
    messagesLoaded: boolean;
    externalMessagesLoadAttempted?: boolean;
    externalMessagesLoadedThroughAt?: number;
    pendingAuthRequestId?: string;
    pendingAuthRequest?: AuthRequest;
    lastSentMessage?: string;
    lastSentAttachments?: FileAttachment[];
    lastSentStoredAttachments?: StoredAttachment[];
    lastSentOptions?: SendMessageOptions;
    authRetryAttempted?: boolean;
    authRetryInProgress?: boolean;
    hidden?: boolean;
    branchFromMessageId?: string;
    branchContextStrategy?: 'sdk-fork' | 'seeded-fresh-session';
    branchFromSdkSessionId?: string;
    branchFromSessionPath?: string;
    branchFromSdkCwd?: string;
    branchFromSdkTurnId?: string;
    branchSeedApplied?: boolean;
    transferredSessionSummary?: string;
    transferredSessionSummaryApplied?: boolean;
    tokenRefreshManager: TokenRefreshManager;
    triggeredBy?: {
        automationName?: string;
        event?: string;
        timestamp?: number;
    };
    agentReady?: Promise<void>;
    agentReadyResolve?: () => void;
    envOverrides?: Record<string, string>;
    wasInterrupted?: boolean;
}
/**
 * Create a ManagedSession from any session-like source (SessionMetadata, SessionConfig, StoredSession).
 * Spreads all matching fields from the source so new persistent fields automatically propagate.
 * Runtime-only fields get sensible defaults.
 */
export declare function createManagedSession(source: {
    id: string;
} & Partial<ManagedSession>, workspace: Workspace, overrides?: Partial<ManagedSession>): ManagedSession;
interface SessionManagerOptions {
    createExternalSessionAgent?: (workspace: Workspace, backendContext: ReturnType<typeof resolveBackendContext>) => AgentBackend;
}
export declare class SessionManager implements ISessionManager {
    private readonly createExternalSessionAgentOverride?;
    private sessions;
    private pendingDeltas;
    private deltaFlushTimers;
    private configWatchers;
    private automationSystems;
    private pendingCredentialResolvers;
    private pendingPermissionRequests;
    private privilegedExecutionBroker;
    private adminRememberApprovals;
    private messageLoadingPromises;
    private externalSessionListSyncAt;
    private externalSessionListSyncPromises;
    private pendingExternalSessionDeletes;
    private externalSessionAgents;
    /**
     * Track which session the user is actively viewing (per workspace).
     * Map of workspaceId -> sessionId. Used to determine if a session should be
     * marked as unread when assistant completes - if user is viewing it, don't mark unread.
     */
    private activeViewingSession;
    /** Coordinates startup initialization waiters from IPC handlers. */
    private initGate;
    private taskOutputIndex;
    /** Monotonic clock to ensure strictly increasing message timestamps */
    private lastTimestamp;
    /** Originating renderer for an active send; keeps events flowing across workspace switches. */
    private sessionEventClientIds;
    private currentGlobalPermissionMode;
    constructor(options?: SessionManagerOptions);
    /**
     * Centralized setter for session processing state.
     * Automatically notifies the power manager on transitions (true→false, false→true)
     * so callers don't need to remember to call onSessionStarted/onSessionStopped.
     */
    private setProcessing;
    /** Wait until initialize() has completed (sessions loaded from disk).
     *  Resolves immediately if already initialized. */
    waitForInit(): Promise<void>;
    private browserPaneManager;
    private eventSink;
    setEventSink(sink: EventSink): void;
    setBrowserPaneManager(bpm: IBrowserPaneManager): void;
    /** Returns a strictly increasing timestamp (ms). When Date.now() collides with
     *  the previous value, increments by 1 to preserve event ordering. */
    private monotonic;
    private getAdminRememberKey;
    private hasActiveAdminRememberApproval;
    private storeAdminRememberApproval;
    private clearAdminRememberApprovalsForSession;
    private clearPendingPermissionRequestsForSession;
    /**
     * Apply external session header metadata to in-memory state and emit UI events.
     * Returns true if any in-memory metadata field changed.
     */
    private applyExternalSessionMetadata;
    /**
     * Set up ConfigWatcher for a workspace to broadcast live updates
     * (sources added/removed, guide.md changes, etc.)
     * Called eagerly at boot for all workspaces (automations/scheduler) and
     * on client connect (GET_WORKSPACE / SWITCH_WORKSPACE).
     * Idempotent — returns immediately if already watching.
     * workspaceId must be the global config ID (what the renderer knows).
     */
    setupConfigWatcher(workspaceRootPath: string, workspaceId: string): void;
    /**
     * Manually notify the ConfigWatcher of a file change.
     * Workaround for Bun's fs.watch on Linux not detecting atomic renames.
     */
    notifyConfigFileChange(workspaceRootPath: string, relativePath: string): void;
    /**
     * Reload sources for all sessions in a workspace, skipping those currently processing.
     */
    private reloadSourcesForWorkspace;
    private broadcastSourcesChanged;
    private broadcastStatusesChanged;
    private broadcastLabelsChanged;
    private broadcastAutomationsChanged;
    private broadcastAppThemeChanged;
    private broadcastLlmConnectionsChanged;
    private updatehopcodeConnectionModels;
    private updatehopcodeConnectionDefault;
    private broadcastSkillsChanged;
    private broadcastDefaultPermissionsChanged;
    /**
     * Reload sources for a session with an active agent.
     * Called by ConfigWatcher when source files change on disk.
     * If agent is null (session hasn't sent any messages), skip - fresh build happens on next message.
     */
    private reloadSessionSources;
    /**
     * Reinitialize authentication environment variables.
     * Call this after onboarding or settings changes to pick up new credentials.
     *
     * SECURITY NOTE: these env vars are propagated only from trusted app settings,
     * not from a user's project environment.
     */
    /**
     * Reinitialize authentication environment variables.
     *
     * Uses the default LLM connection to determine which credentials to set.
     *
     * @param connectionSlug - Optional connection slug to use (overrides default)
     */
    reinitializeAuth(connectionSlug?: string): Promise<void>;
    initialize(): Promise<void>;
    private loadSessionsFromDisk;
    refreshExternalSessions(workspaceId?: string): Promise<void>;
    private refreshExternalSessionsForWorkspace;
    private doRefreshExternalSessionsForWorkspace;
    private createExternalSessionListAgent;
    private externalSessionAgentCacheKey;
    private getExternalSessionAgent;
    private withExternalSessionAgent;
    private resolveExternalSessionConnectionSlug;
    private isQwenCanonicalMessageSession;
    private resolveQwenCanonicalCwd;
    private canonicalizeQwenManagedSessionId;
    private externalSessionDeleteKey;
    private externalSessionDeleteKeyForManaged;
    private isExternalSessionDeletePending;
    private renameExternalBackendSessionIfSupported;
    private syncExternalBackendTitleIfSupported;
    private deleteExternalBackendSessionIfSupported;
    private findManagedSessionsBySdkSessionId;
    private selectManagedSessionBySdkSessionId;
    private removeDuplicateExternalListedMirrors;
    private parseExternalSessionTimestamp;
    private isExternalSessionPlaceholderTitle;
    private hasNoRenderableLocalMessages;
    private isUnresolvedQwenCanonicalMirror;
    private shouldInspectExternalPlaceholderSession;
    private extractMessagePreview;
    private loadExternalListedMessages;
    private removeExternalListedLocalMirror;
    private applyAvailableCommandsSnapshot;
    private applyAvailableCommandsFromMessagesResult;
    private applyTokenUsageFromMessagesResult;
    private applyLoadedExternalMessages;
    private inferLegacyQwenCanonicalAttachmentOverlays;
    private upsertExternalListedSession;
    private removeMissingExternalListedSessions;
    private persistSession;
    flushSession(sessionId: string): Promise<void>;
    private persistSessionMetadataUpdate;
    flushAllSessions(): Promise<void>;
    /**
     * Get human-readable description for auth request
     */
    private getAuthRequestDescription;
    /**
     * Format auth result message to send back to agent
     */
    private formatAuthResultMessage;
    /**
     * Complete an auth request and send result back to agent
     * This updates the auth message status and sends a faked user message
     */
    completeAuthRequest(sessionId: string, result: AuthResult): Promise<void>;
    /**
     * Handle credential input from the UI (for non-OAuth auth)
     * Called when user submits credentials via the inline form
     */
    handleCredentialInput(sessionId: string, requestId: string, response: import('@craft-agent/shared/protocol').CredentialResponse): Promise<void>;
    getWorkspaces(): Workspace[];
    getWorkspacesInfo(): WorkspaceInfo[];
    getActiveSessionCount(workspaceId?: string): number;
    getWorkspaceAutomationSummary(workspaceId: string): {
        automationCount: number;
        schedulerRunning: boolean;
    };
    getActiveSessionsInfo(): ActiveSessionInfo[];
    /**
     * Reload all sessions from disk.
     * Used after importing sessions to refresh the in-memory session list.
     */
    reloadSessions(): void;
    getSessions(workspaceId?: string): Session[];
    /**
     * Aggregate unread state across all workspaces.
     * Excludes hidden and archived sessions from counts/indicators.
     */
    getUnreadSummary(): UnreadSummary;
    /**
     * Refresh badge count from current unread state.
     * Called by renderer on mount — ensures badge is set even if the initial
     * emitUnreadSummaryChanged() fired before the renderer was ready.
     */
    refreshBadge(): void;
    /**
     * Broadcast global unread summary to all workspace windows.
     */
    private emitUnreadSummaryChanged;
    private emitSessionListChanged;
    private emitSessionListRefreshStateChanged;
    /**
     * Get a single session by ID with all messages loaded.
     * Used for lazy loading session messages when session is selected.
     * Messages are loaded from disk on first access to reduce memory usage.
     */
    getSession(sessionId: string): Promise<Session | null>;
    /**
     * Ensure messages are loaded for a managed session.
     * Uses promise deduplication to prevent race conditions when multiple
     * concurrent calls (e.g., rapid session switches + message send) try
     * to load messages simultaneously.
     */
    private ensureMessagesLoaded;
    /**
     * Internal: Load messages from disk storage into the managed session.
     */
    private loadMessagesFromDisk;
    private shouldAttemptExternalMessageLoad;
    private loadExternalMessagesForEmptyLoadedSession;
    private markExternalMessagesLoadedThrough;
    private findMessageForContentUpdate;
    private loadExternalSessionMessages;
    /**
     * Get the filesystem path to a session's folder
     */
    getSessionPath(sessionId: string): string | null;
    createSession(workspaceId: string, options?: import('@craft-agent/shared/protocol').CreateSessionOptions): Promise<Session>;
    /**
     * Get or create agent for a session (lazy loading)
     * Creates the appropriate backend agent based on LLM connection.
     *
     * Provider resolution order:
     * 1. session.llmConnection (locked after first message)
     * 2. workspace.defaults.defaultLlmConnection
     * 3. global defaultLlmConnection
     * 4. fallback: no connection configured
     */
    private getOrCreateAgent;
    private createMidTurnMessagesDrainedCallback;
    private createAgentForManagedSession;
    flagSession(sessionId: string): Promise<void>;
    unflagSession(sessionId: string): Promise<void>;
    archiveSession(sessionId: string): Promise<void>;
    unarchiveSession(sessionId: string): Promise<void>;
    setSessionStatus(sessionId: string, sessionStatus: SessionStatus): Promise<void>;
    /**
     * Set the LLM connection for a session.
     * Can only be changed before the first message is sent (connection is locked after).
     * This determines which LLM provider/backend will be used for this session.
     */
    setSessionConnection(sessionId: string, connectionSlug: string): Promise<void>;
    /**
     * Set pending plan execution state.
     * Called when user clicks "Accept & Compact" to persist the plan path
     * so execution can resume after compaction (even if page reloads).
     */
    setPendingPlanExecution(sessionId: string, planPath: string, draftInputSnapshot?: string): Promise<void>;
    /**
     * Mark compaction as complete for pending plan execution.
     * Called when compaction_complete event fires - allows reload recovery
     * to know that compaction finished and plan can be executed.
     */
    markCompactionComplete(sessionId: string): Promise<void>;
    /**
     * Mark pending plan execution as already dispatched from the UI.
     * This prevents reload recovery from double-submitting the same plan if
     * sending succeeded but cleanup failed due a reconnect/disconnect.
     */
    markPendingPlanExecutionDispatched(sessionId: string): Promise<void>;
    /**
     * Clear pending plan execution state.
     * Called after plan execution is triggered, on new user message,
     * or when the pending execution is no longer relevant.
     */
    clearPendingPlanExecution(sessionId: string): Promise<void>;
    /**
     * Get pending plan execution state for a session.
     * Used on reload/init to check if we need to resume plan execution.
     */
    getPendingPlanExecution(sessionId: string): {
        planPath: string;
        draftInputSnapshot?: string;
        awaitingCompaction: boolean;
        executionDispatched: boolean;
    } | null;
    /**
     * Dispatch a plan approval for a session, equivalent to the desktop
     * "Accept plan" button. Switches the session out of Plan mode (safe)
     * into allow-all if needed so the plan can execute without per-tool
     * prompts, then sends the approval message through the normal sendMessage
     * path.
     */
    acceptPlan(sessionId: string, _planPath?: string): Promise<void>;
    /**
     * Share session to the web viewer
     * Uploads session data and returns shareable URL
     */
    shareToViewer(sessionId: string): Promise<import('@craft-agent/shared/protocol').ShareResult>;
    /**
     * Update an existing shared session
     * Re-uploads session data to the same URL
     */
    updateShare(sessionId: string): Promise<import('@craft-agent/shared/protocol').ShareResult>;
    /**
     * Revoke a shared session
     * Deletes from viewer and clears local shared state
     */
    revokeShare(sessionId: string): Promise<import('@craft-agent/shared/protocol').ShareResult>;
    /**
     * Update session's enabled sources
     * If agent exists, builds and applies servers immediately.
     * Otherwise, servers will be built fresh on next message.
     */
    setSessionSources(sessionId: string, sourceSlugs: string[]): Promise<void>;
    /**
     * Get the enabled source slugs for a session
     */
    getSessionSources(sessionId: string): string[];
    /**
     * Get the last final assistant message ID from a list of messages
     * A "final" message is one where:
     * - role === 'assistant' AND
     * - isIntermediate !== true (not commentary between tool calls)
     * Returns undefined if no final assistant message exists
     */
    private getLastFinalAssistantMessageId;
    /**
     * Set which session the user is actively viewing.
     * Called when user navigates to a session. Used to determine whether to mark
     * new messages as unread - if user is viewing, don't mark unread.
     */
    setActiveViewingSession(sessionId: string | null, workspaceId: string): void;
    /**
     * Clear active viewing session for a workspace.
     * Called when all windows leave a workspace to ensure read/unread state is correct.
     */
    clearActiveViewingSession(workspaceId: string): void;
    /**
     * Check if a session is currently being viewed by the user
     */
    private isSessionBeingViewed;
    /**
     * Mark a session as read by setting lastReadMessageId and clearing hasUnread.
     * Called when user navigates to a session (and it's not processing).
     */
    markSessionRead(sessionId: string): Promise<void>;
    /**
     * Mark a session as unread by setting hasUnread flag.
     * Called when user manually marks a session as unread via context menu.
     */
    markSessionUnread(sessionId: string): Promise<void>;
    /**
     * Mark all non-hidden, non-archived sessions in a workspace as read.
     * Called from "Mark All Read" context menu on "All Sessions".
     */
    markAllSessionsRead(workspaceId: string): Promise<void>;
    renameSession(sessionId: string, name: string): Promise<void>;
    /**
     * Regenerate the session title based on recent messages.
     * Uses the last few user messages to capture what the session has evolved into.
     * Automatically uses the same provider as the session.
     */
    refreshTitle(sessionId: string): Promise<{
        success: boolean;
        title?: string;
        error?: string;
    }>;
    /**
     * Update the working directory for a session.
     *
     * If no messages have been sent yet (no SDK interaction), also updates sdkCwd
     * so the SDK will use the new path for transcript storage. This prevents the
     * confusing "bash shell runs from a different directory" warning when the user
     * changes the working directory before their first message.
     */
    updateWorkingDirectory(sessionId: string, path: string): void;
    /**
     * Update the model for a session
     * Pass null to clear the session-specific model (will use global config)
     * @param connection - Optional LLM connection slug (only applied if not already locked)
     */
    updateSessionModel(sessionId: string, workspaceId: string, model: string | null, connection?: string): Promise<void>;
    private createDraftAgent;
    private cleanupDraftAgent;
    private persistDraftModelSelection;
    private refreshhopcodeConnectionDefault;
    /**
     * Edit the latest user message, rewind provider history, and rerun the turn.
     */
    updateMessageContent(sessionId: string, messageId: string, content: string): Promise<void>;
    private rehydrateStoredAttachments;
    /**
     * Add an annotation to a message and persist the session.
     */
    addMessageAnnotation(sessionId: string, messageId: string, annotation: NonNullable<Message['annotations']>[number]): void;
    /**
     * Patch an existing annotation on a message.
     */
    updateMessageAnnotation(sessionId: string, messageId: string, annotationId: string, patch: Partial<NonNullable<Message['annotations']>[number]>): void;
    /**
     * Remove an annotation from a message and persist the session.
     */
    removeMessageAnnotation(sessionId: string, messageId: string, annotationId: string): void;
    deleteSession(sessionId: string): Promise<void>;
    sendMessage(sessionId: string, message: string, attachments?: FileAttachment[], storedAttachments?: StoredAttachment[], options?: SendMessageOptions, existingMessageId?: string, eventClientId?: string, _isAuthRetry?: boolean): Promise<void>;
    cancelProcessing(sessionId: string, silent?: boolean): Promise<void>;
    /**
     * Attempt auth retry: refresh token, destroy agent, resend last message.
     * Shared by both typed_error and plain error auth-retry paths.
     * Returns true if retry was initiated, false if conditions not met.
     */
    private attemptAuthRetry;
    /**
     * Central handler for when processing stops (any reason).
     * Single source of truth for cleanup and queue processing.
     *
     * @param sessionId - The session that stopped processing
     * @param reason - Why processing stopped ('complete' | 'interrupted' | 'error')
     */
    private onProcessingStopped;
    /**
     * Process the next message in the queue.
     * Called by onProcessingStopped when queue has messages.
     */
    private processNextQueuedMessage;
    killShell(sessionId: string, shellId: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Get output from a background task
     *
     * Looks up the output file stored when a task_completed event was received,
     * reads its contents, and returns them. Falls back to the SDK-provided summary
     * if the file cannot be read.
     *
     * @param taskId - The task or shell ID
     * @returns Task output content, or null if task not found
     */
    getTaskOutput(taskId: string): Promise<string | null>;
    /**
     * Respond to a pending permission request
     * Returns true if the response was delivered, false if agent/session is gone
     */
    respondToPermission(sessionId: string, requestId: string, allowed: boolean, alwaysAllow: boolean, options?: import('@craft-agent/shared/protocol').PermissionResponseOptions): boolean;
    /**
     * Respond to a pending credential request
     * Returns true if the response was delivered, false if no pending request found
     *
     * Supports both:
     * - New unified auth flow (via handleCredentialInput)
     * - Legacy callback flow (via pendingCredentialResolvers)
     */
    respondToCredential(sessionId: string, requestId: string, response: import('@craft-agent/shared/protocol').CredentialResponse): Promise<boolean>;
    applyGlobalPermissionMode(mode: PermissionMode, options?: {
        changedBy?: 'user' | 'system' | 'restore' | 'automation' | 'unknown';
    }): Promise<void>;
    /**
     * Set the app-wide permission mode. Every live session follows this value.
     */
    setGlobalPermissionMode(mode: PermissionMode, options?: {
        changedBy?: 'user' | 'system' | 'restore' | 'automation' | 'unknown';
        preferredSessionId?: string;
    }): Promise<void>;
    /**
     * Existing session-scoped command entry point. Mode is app-wide now, so this
     * fans out to every session while preserving the old RPC shape.
     */
    setSessionPermissionMode(sessionId: string, mode: PermissionMode): Promise<void>;
    private applyPermissionModeToManagedSession;
    private persistQwenApprovalMode;
    getSessionPermissionSettings(sessionId: string): Promise<HopCodePermissionSettings>;
    setSessionPermissionRules(sessionId: string, scope: PermissionSettingsScope, ruleType: PermissionRuleType, rules: string[]): Promise<HopCodePermissionSettings>;
    getSessionQwenCoreSettings(sessionId: string): Promise<HopCodeCoreSettingsSnapshot>;
    listSessionHopCodeProviders(sessionId: string): Promise<HopCodeProviderCatalog>;
    connectSessionHopCodeProvider(sessionId: string, params: HopCodeProviderConnectParams): Promise<HopCodeProviderConnectResult>;
    setSessionQwenCoreSetting(sessionId: string, scope: HopCodeSettingsScope, key: HopCodeCoreSettingKey, value: HopCodeSettingValue): Promise<HopCodeCoreSettingsSnapshot>;
    setSessionQwenMcpServer(sessionId: string, scope: HopCodeSettingsScope, name: string, server: HopCodeMcpServerConfig): Promise<HopCodeCoreSettingsSnapshot>;
    removeSessionQwenMcpServer(sessionId: string, scope: HopCodeSettingsScope, name: string): Promise<HopCodeCoreSettingsSnapshot>;
    setSessionQwenHook(sessionId: string, scope: HopCodeSettingsScope, event: HopCodeHookEvent, index: number | undefined, hook: HopCodeHookDefinition): Promise<HopCodeCoreSettingsSnapshot>;
    removeSessionQwenHook(sessionId: string, scope: HopCodeSettingsScope, event: HopCodeHookEvent, index: number): Promise<HopCodeCoreSettingsSnapshot>;
    setSessionQwenExtensionSetting(sessionId: string, extensionId: string, settingKey: string, scope: HopCodeSettingsScope, value: HopCodeSettingValue): Promise<HopCodeCoreSettingsSnapshot>;
    /**
     * Get authoritative permission mode diagnostics for a session.
     * Used by renderer to reconcile optimistic/stale mode state.
     */
    getSessionPermissionModeState(sessionId: string): {
        permissionMode: PermissionMode;
        previousPermissionMode?: PermissionMode;
        transitionDisplay?: string;
        modeVersion: number;
        changedAt: string;
        changedBy: 'user' | 'system' | 'restore' | 'automation' | 'unknown';
    } | null;
    /**
     * Set labels for a session (additive tags, many-per-session).
     * Labels are IDs referencing workspace labels/config.json.
     */
    setSessionLabels(sessionId: string, labels: string[]): void;
    private refreshDraftAvailableCommands;
    private installDraftQwenSkill;
    private deleteDraftQwenSkill;
    private setDraftQwenSkillEnabled;
    refreshAvailableCommands(sessionId: string, options?: RefreshAvailableCommandsOptions): Promise<{
        success: boolean;
        availableCommands?: AvailableCommandsSnapshot['availableCommands'];
        availableSkills?: string[];
        availableSkillDetails?: AvailableCommandsSnapshot['availableSkillDetails'];
        error?: string;
    }>;
    installQwenSkill(sessionId: string, skill: HopCodeSkillInstallRequest, options?: RefreshAvailableCommandsOptions): Promise<{
        success: boolean;
        skill?: HopCodeSkillInstallResult;
        availableCommands?: AvailableCommandsSnapshot['availableCommands'];
        availableSkills?: string[];
        availableSkillDetails?: AvailableCommandsSnapshot['availableSkillDetails'];
        error?: string;
    }>;
    deleteQwenSkill(sessionId: string, skill: HopCodeSkillDeleteRequest, options?: RefreshAvailableCommandsOptions): Promise<{
        success: boolean;
        skill?: HopCodeSkillDeleteResult;
        availableCommands?: AvailableCommandsSnapshot['availableCommands'];
        availableSkills?: string[];
        availableSkillDetails?: AvailableCommandsSnapshot['availableSkillDetails'];
        error?: string;
    }>;
    setQwenSkillEnabled(sessionId: string, skill: HopCodeSkillSetEnabledRequest, options?: RefreshAvailableCommandsOptions): Promise<{
        success: boolean;
        skill?: HopCodeSkillSetEnabledResult;
        availableCommands?: AvailableCommandsSnapshot['availableCommands'];
        availableSkills?: string[];
        availableSkillDetails?: AvailableCommandsSnapshot['availableSkillDetails'];
        error?: string;
    }>;
    /**
     * Set the thinking level for a session. See {@link ThinkingLevel} for valid values.
     * This is sticky and persisted across messages.
     */
    setSessionThinkingLevel(sessionId: string, level: ThinkingLevel): void;
    /**
     * Generate an AI title for a session from the user's first message.
     * Uses the agent's generateTitle() method which handles provider-specific SDK calls.
     * If no agent exists, creates a temporary one using the session's connection.
     */
    private generateTitle;
    private processEvent;
    private sendEvent;
    /**
     * Queue a text delta for batched sending (performance optimization)
     * Instead of sending 50+ IPC events per second, batches deltas and flushes every 50ms
     */
    private queueDelta;
    /**
     * Flush any pending deltas for a session (sends batched IPC event)
     * Called on timer or when streaming ends (text_complete)
     */
    private flushDelta;
    /**
     * Execute a prompt automation by creating a new session and sending the prompt
     */
    executePromptAutomation(workspaceId: string, workspaceRootPath: string, prompt: string, labels?: string[], permissionMode?: PermissionMode, mentions?: string[], llmConnection?: string, model?: string, automationName?: string): Promise<{
        sessionId: string;
    }>;
    /**
     * Resolve @mentions in automation prompts to source and skill slugs
     */
    private resolveAutomationMentions;
    private generateRemoteTransferSummary;
    exportRemoteSessionTransfer(sessionId: string, workspaceId: string): Promise<RemoteSessionTransferPayload | null>;
    importRemoteSessionTransfer(workspaceId: string, payload: RemoteSessionTransferPayload): Promise<ImportRemoteSessionTransferResult>;
    /**
     * Export a session as a portable SessionBundle.
     *
     * Steps:
     * 1. Validate session exists and resolve its workspace
     * 2. If session is processing, refuse (caller must stop it first)
     * 3. Flush pending persistence writes
     * 4. Serialize session directory into a bundle
     */
    exportSession(sessionId: string, workspaceId: string): Promise<SessionBundle | null>;
    /**
     * Import a session bundle into a target workspace.
     *
     * Steps:
     * 1. Validate bundle structure and target workspace
     * 2. Generate new session ID (fork) or use original (move)
     * 3. Create session directory and write JSONL + files
     * 4. Register session in-memory
     * 5. Emit session_created event
     * 6. Return new session ID and compatibility warnings
     */
    importSession(workspaceId: string, bundle: SessionBundle, mode: DispatchMode): Promise<{
        sessionId: string;
        warnings?: string[];
    }>;
    /**
     * Find an LLM connection on this server that matches the given provider type.
     * Checks workspace default first, then falls back to any matching connection.
     */
    private findCompatibleLlmConnection;
    /**
     * Clean up all resources held by the SessionManager.
     * Should be called on app shutdown to prevent resource leaks.
     */
    cleanup(): void;
}
