/**
 * Session title generation utilities.
 *
 * Shared helpers for building title prompts and validating results.
 * Actual title generation is handled by agent classes using their respective SDKs:
 * - Backend agents use their own lightweight completion path
 */
/** Max characters used for persisted/displayed session titles. */
export declare const MAX_TITLE_LENGTH = 60;
/** Slice text at the last word boundary within `max` characters. */
export declare function sliceAtWord(text: string, max: number): string;
/** Truncate a title so the returned string never exceeds `max` characters. */
export declare function truncateTitle(title: string, max?: number): string;
/**
 * Sanitize a language preference string before prompt interpolation.
 * Returns undefined for invalid/suspicious inputs so the caller falls back to auto-detect.
 */
export declare function sanitizeLanguage(language?: string): string | undefined;
/**
 * Build a prompt for generating a session title from a user message.
 *
 * @param message - The user's message to generate a title from
 * @param options.language - Preferred language for the title
 * @returns Formatted prompt string
 */
export declare function buildTitlePrompt(message: string, options?: {
    language?: string;
}): string;
/**
 * Check if a message is likely low-signal (short acknowledgement/command).
 * Language-agnostic: uses length + word count only.
 */
export declare function isLowSignal(message: string): boolean;
/**
 * Select a spread of user messages that captures the session's purpose:
 * first (original intent), a recent-biased middle, and last (current state).
 *
 * Strips trailing low-signal messages (short acknowledgements like "ok", "thanks")
 * before selecting, so the spread focuses on substantive content.
 * Falls back to unfiltered if all messages are low-signal.
 *
 * For 4+ messages, picks at indices 0, ~66%, and last — biasing toward
 * where the conversation ended up rather than the exact midpoint.
 */
export declare function selectSpreadMessages(allUserMessages: string[]): string[];
/**
 * Build a prompt for regenerating a session title from recent messages.
 *
 * @param recentUserMessages - Spread of user messages (first, middle, last)
 * @param lastAssistantResponse - The most recent assistant response
 * @param options.language - Preferred language for the title
 * @returns Formatted prompt string
 */
export declare function buildRegenerateTitlePrompt(recentUserMessages: string[], lastAssistantResponse: string, options?: {
    language?: string;
}): string;
/**
 * Validate and clean a generated title.
 *
 * Iteratively strips known LLM preamble artifacts (leading "Title:", "Sure:", etc.),
 * then removes quotes and markdown formatting, and checks length/word-count bounds.
 *
 * @param title - The raw title from the model
 * @returns Cleaned title, or null if invalid
 */
export declare function validateTitle(title: string | null | undefined): string | null;
