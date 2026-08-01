/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface UseMessageQueueReturn {
    messageQueue: string[];
    addMessage: (message: string, deferUntilIdle?: boolean) => void;
    clearQueue: () => void;
    getQueuedMessagesText: () => string;
    /** Drain the entire queue joined with `\n\n`. For Ctrl+C / ESC / Up edit-restore. */
    popAllMessages: () => string | null;
    /** Restore interrupted steer messages to the front of the queue. */
    restoreMessages: (messages: string[]) => void;
    /**
     * Drain plain-text prompts that can steer the active turn. Pass true at the
     * idle boundary to also drain messages explicitly deferred with Ctrl+Q.
     * Slash commands always stay queued for individual processing.
     */
    drainQueue: (includeDeferred?: boolean) => string[];
    /** Pop the first item from the queue. */
    popNextSegment: () => string | null;
}
export declare function useMessageQueue(): UseMessageQueueReturn;
