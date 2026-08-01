/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface FollowupState {
    suggestion: string | null;
    isVisible: boolean;
    shownAt: number;
}
export interface UseDaemonFollowupSuggestionOptions {
    enabled?: boolean;
    onAccept?: (suggestion: string) => void;
    onOutcome?: (params: {
        outcome: 'accepted' | 'ignored';
        accept_method?: 'tab' | 'enter' | 'right';
        time_ms: number;
        suggestion_length: number;
    }) => void;
}
export interface UseDaemonFollowupSuggestionReturn {
    /**
     * Current follow-up suggestion display state — pass directly to
     * `<InputForm followupState={...} />`. Reflects the controller's
     * post-debounce visible state, not the raw daemon push.
     */
    followupState: FollowupState;
    /**
     * Accept the visible suggestion. Wire to `<InputForm onAcceptFollowup={...} />`.
     * Calls the underlying controller's accept (which invokes the
     * consumer-provided `onAccept` from options) AND clears the daemon
     * store's `lastFollowupSuggestion` so the same suggestion does not
     * re-push into the controller on the next render.
     */
    onAcceptFollowup: (method?: 'tab' | 'enter' | 'right', options?: {
        skipOnAccept?: boolean;
    }) => void;
    /**
     * Dismiss the visible suggestion. Wire to `<InputForm onDismissFollowup={...} />`.
     * Same store-clear semantics as `onAcceptFollowup`.
     */
    onDismissFollowup: () => void;
    /**
     * Explicit invalidation hook. Adapters call this just before invoking
     * `actions.sendPrompt(...)` so the prior turn's ghost-text disappears
     * synchronously — no wire round-trip needed (the daemon does not
     * emit a "suggestion cleared" event on prompt boundaries; clients
     * self-invalidate).
     */
    clear: () => void;
}
/**
 * Wire the daemon's server-pushed `followup_suggestion` event into the
 * webui's `<InputForm>`. Consumers:
 *
 *   1. Render `<InputForm followupState={...} onAcceptFollowup={...}
 *      onDismissFollowup={...} />` with the three values returned here.
 *   2. Call `clear()` from the hook just before `actions.sendPrompt(...)`
 *      so the prior turn's ghost-text disappears immediately.
 *
 * The hook subscribes to daemon follow-up sidechannels and drives a
 * daemon-local accept/dismiss controller. The controller is the source
 * of truth for what the input renders; the store/sidechannel is the
 * source of truth for what the daemon last sent for this session.
 *
 * Wiring `onAccept` and `onOutcome` propagates straight to the
 * daemon-local controller.
 *
 * Must be called within a `<DaemonSessionProvider>` — throws via
 * `useDaemonTranscriptStore` otherwise.
 */
export declare function useDaemonFollowupSuggestion(opts?: UseDaemonFollowupSuggestionOptions): UseDaemonFollowupSuggestionReturn;
