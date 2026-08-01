/**
 * Renderer — converts SessionManager events into chat messages.
 *
 * Three modes selected per binding via `BindingConfig.responseMode`:
 *
 *   - `streaming` (legacy): on Telegram, posts on first `text_delta` and
 *     edits every ~editIntervalMs as tokens arrive; each `text_complete`
 *     finalises the current message, so one agent run with multiple turns
 *     produces multiple messages. On platforms without editing, accumulates
 *     per turn and sends on each `text_complete`.
 *
 *   - `progress` (default): one evolving message per run. Posts
 *     "💭 thinking…" on first activity, edits to "🔧 <tool>…" on each
 *     `tool_start`, back to "💭 thinking…" on `tool_result`, and replaces
 *     the whole bubble with the final text on `complete`. Intermediate
 *     assistant text (`text_complete` with `isIntermediate`) is dropped.
 *     On adapters without `messageEditing`, degrades to a single
 *     send-on-complete (identical to `final_only`).
 *
 *   - `final_only`: silent until `complete`, then sends one message with
 *     the accumulated final text. Nothing is sent for empty completions.
 *
 * Permissions and errors are orthogonal: when the session requests a
 * permission or an error fires, the renderer flushes current mode state
 * and emits the prompt/error as a distinct message regardless of mode.
 */
import type { PlatformAdapter, ChannelBinding } from './types';
import type { PlanTokenRegistry } from './plan-tokens';
/** Session event shape (subset of the full SessionEvent from server-core). */
export interface SessionEvent {
    type: string;
    sessionId: string;
    [key: string]: unknown;
}
/**
 * Hook the renderer calls when it wants to remember a plan message id.
 * Passes the full `ChannelBinding` so callers can attribute the message
 * to the exact chat that rendered it — not just the session, which may
 * have multiple Telegram bindings.
 */
export type PlanMessageRecorder = (binding: ChannelBinding, token: string, messageId: string) => void;
export declare class Renderer {
    /** Per-binding render state. Keyed by binding.id */
    private states;
    private readonly planTokens;
    private readonly recordPlanMessage;
    constructor(deps?: {
        planTokens?: PlanTokenRegistry;
        recordPlanMessage?: PlanMessageRecorder;
    });
    private getState;
    /** Handle an outbound session event for a specific binding. */
    handle(event: SessionEvent, binding: ChannelBinding, adapter: PlatformAdapter): Promise<void>;
    private handleStreaming;
    private handleStreamingDelta;
    private scheduleEdit;
    private handleProgress;
    /**
     * Post the progress bubble if needed, and edit it to `status` if the
     * status has changed since the last write. Collapses redundant edits so
     * we stay under Telegram's per-chat edit budget.
     */
    private ensureProgressBubble;
    private handleFinalOnly;
    private handlePermissionRequest;
    private handleCredentialRequest;
    private handlePlanSubmitted;
    private handleError;
    private tryEditMessage;
    private cancelEditTimer;
    /** Reset per-run state (called on `complete`, `error`, etc.). */
    private resetRun;
    /** Send text, splitting if it exceeds platform limits. */
    private sendText;
    /** Clean up state for a removed binding. */
    removeBinding(bindingId: string): void;
}
