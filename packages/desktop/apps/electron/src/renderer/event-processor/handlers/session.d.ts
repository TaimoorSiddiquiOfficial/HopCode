/**
 * Session Event Handlers
 *
 * Handles complete, error, sources_changed, etc.
 * Pure functions that return new state - no side effects.
 */
import type { SessionState, ProcessResult, CompleteEvent, ErrorEvent, TypedErrorEvent, SourcesChangedEvent, LabelsChangedEvent, SessionStatusChangedEvent, SessionFlaggedEvent, SessionUnflaggedEvent, SessionArchivedEvent, SessionUnarchivedEvent, NameChangedEvent, PermissionRequestEvent, CredentialRequestEvent, PlanSubmittedEvent, StatusEvent, InfoEvent, InterruptedEvent, TitleGeneratedEvent, TitleRegeneratingEvent, AsyncOperationEvent, WorkingDirectoryChangedEvent, PermissionModeChangedEvent, SessionModelChangedEvent, LLMConnectionChangedEvent, UserMessageEvent, MessageContentUpdatedEvent, MessageAnnotationsUpdatedEvent, SessionSharedEvent, SessionUnsharedEvent, AuthRequestEvent, AuthCompletedEvent, UsageUpdateEvent, AvailableCommandsUpdateEvent } from '../types';
/**
 * Handle complete - agent loop finished
 *
 * Sets isProcessing: false, clears streaming state.
 * Also marks any running tools as complete (fail-safe).
 */
export declare function handleComplete(state: SessionState, event: CompleteEvent): ProcessResult;
/**
 * Handle error - simple error event
 */
export declare function handleError(state: SessionState, event: ErrorEvent): ProcessResult;
/**
 * Handle typed_error - error with structured details
 */
export declare function handleTypedError(state: SessionState, event: TypedErrorEvent): ProcessResult;
/**
 * Handle status - status message (e.g., compacting)
 * Stores on session for ProcessingIndicator AND appends as message for TurnCard activity
 */
export declare function handleStatus(state: SessionState, event: StatusEvent): ProcessResult;
/**
 * Handle info - info message (may update existing compacting message)
 */
export declare function handleInfo(state: SessionState, event: InfoEvent): ProcessResult;
/**
 * Handle interrupted - agent was interrupted
 * When message is provided, it's a user-initiated stop (shows "Response interrupted")
 * When message is omitted, it's a silent redirect (user sent new message while processing)
 * When queuedMessages is provided, those messages were waiting to be processed and should
 * be restored to the input field (the corresponding user bubbles are removed from the chat).
 */
export declare function handleInterrupted(state: SessionState, event: InterruptedEvent): ProcessResult;
/**
 * Handle title_generated - update session title and clear regenerating state
 */
export declare function handleTitleGenerated(state: SessionState, event: TitleGeneratedEvent): ProcessResult;
/**
 * Handle title_regenerating - set regenerating state for shimmer effect
 * @deprecated Use handleAsyncOperation instead
 */
export declare function handleTitleRegenerating(state: SessionState, event: TitleRegeneratingEvent): ProcessResult;
/**
 * Handle async_operation - set async operation state for shimmer effect
 * Generic handler for any async operation (sharing, updating share, revoking, title regeneration)
 */
export declare function handleAsyncOperation(state: SessionState, event: AsyncOperationEvent): ProcessResult;
/**
 * Handle working_directory_changed - update session working directory (user-initiated via UI)
 */
export declare function handleWorkingDirectoryChanged(state: SessionState, event: WorkingDirectoryChangedEvent): ProcessResult;
/**
 * Handle permission_mode_changed - return effect for parent to handle session options
 */
export declare function handlePermissionModeChanged(state: SessionState, event: PermissionModeChangedEvent): ProcessResult;
/**
 * Handle session_model_changed - update session model
 */
export declare function handleSessionModelChanged(state: SessionState, event: SessionModelChangedEvent): ProcessResult;
/**
 * Handle connection_changed - sync session.llmConnection to renderer state
 */
export declare function handleConnectionChanged(state: SessionState, event: LLMConnectionChangedEvent): ProcessResult;
/**
 * Handle available_commands_update - sync provider slash commands and skills.
 */
export declare function handleAvailableCommandsUpdate(state: SessionState, event: AvailableCommandsUpdateEvent): ProcessResult;
/**
 * Handle user_message - confirms optimistic user message from backend
 *
 * Three statuses:
 * - 'accepted': Message is being processed (confirms optimistic message)
 * - 'queued': Message was queued during ongoing response (adds if not present, marks as queued)
 * - 'processing': Queued message is now being processed (updates status)
 */
export declare function handleUserMessage(state: SessionState, event: UserMessageEvent): ProcessResult;
/**
 * Handle message_content_updated - replace a message with the backend-authoritative version.
 */
export declare function handleMessageContentUpdated(state: SessionState, event: MessageContentUpdatedEvent): ProcessResult;
/**
 * Handle message_annotations_updated - update annotations on a specific message.
 */
export declare function handleMessageAnnotationsUpdated(state: SessionState, event: MessageAnnotationsUpdatedEvent): ProcessResult;
/**
 * Handle sources_changed - update session's enabled sources
 */
export declare function handleSourcesChanged(state: SessionState, event: SourcesChangedEvent): ProcessResult;
/**
 * Handle labels_changed - update session's labels
 */
export declare function handleLabelsChanged(state: SessionState, event: LabelsChangedEvent): ProcessResult;
/**
 * Handle session_status_changed - update session's sessionStatus (external metadata change or agent tool)
 */
export declare function handleSessionStatusChanged(state: SessionState, event: SessionStatusChangedEvent): ProcessResult;
/**
 * Handle session_flagged - mark session as flagged
 */
export declare function handleSessionFlagged(state: SessionState, _event: SessionFlaggedEvent): ProcessResult;
/**
 * Handle session_unflagged - mark session as unflagged
 */
export declare function handleSessionUnflagged(state: SessionState, _event: SessionUnflaggedEvent): ProcessResult;
/**
 * Handle session_archived - mark session as archived
 */
export declare function handleSessionArchived(state: SessionState, _event: SessionArchivedEvent): ProcessResult;
/**
 * Handle session_unarchived - mark session as unarchived
 */
export declare function handleSessionUnarchived(state: SessionState, _event: SessionUnarchivedEvent): ProcessResult;
/**
 * Handle name_changed - update session name (external metadata change)
 */
export declare function handleNameChanged(state: SessionState, event: NameChangedEvent): ProcessResult;
/**
 * Handle permission_request - return effect for parent to handle
 */
export declare function handlePermissionRequest(state: SessionState, event: PermissionRequestEvent): ProcessResult;
/**
 * Handle credential_request - return effect for parent to handle
 */
export declare function handleCredentialRequest(state: SessionState, event: CredentialRequestEvent): ProcessResult;
/**
 * Handle plan_submitted - add plan message to session
 */
export declare function handlePlanSubmitted(state: SessionState, event: PlanSubmittedEvent): ProcessResult;
/**
 * Handle session_shared - session was shared to viewer
 */
export declare function handleSessionShared(state: SessionState, event: SessionSharedEvent): ProcessResult;
/**
 * Handle session_unshared - session share was revoked
 */
export declare function handleSessionUnshared(state: SessionState, _event: SessionUnsharedEvent): ProcessResult;
/**
 * Handle auth_request - add auth-request message to session
 * This is the unified auth flow - execution is paused until auth completes
 */
export declare function handleAuthRequest(state: SessionState, event: AuthRequestEvent): ProcessResult;
/**
 * Handle auth_completed - update auth-request message status
 * The agent will resume via a new user message (sent by session manager)
 */
export declare function handleAuthCompleted(state: SessionState, event: AuthCompletedEvent): ProcessResult;
/**
 * Handle usage_update - real-time context usage during processing
 * Merges usage update into existing tokenUsage (preserves outputTokens, costUsd, etc.)
 */
export declare function handleUsageUpdate(state: SessionState, event: UsageUpdateEvent): ProcessResult;
