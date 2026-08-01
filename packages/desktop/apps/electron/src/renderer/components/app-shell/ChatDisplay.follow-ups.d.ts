/**
 * Pure helpers for follow-up annotations.
 *
 * Kept separate from `ChatDisplay.tsx` so they can be unit-tested without
 * pulling in React or the rest of the renderer. `ChatDisplay.tsx`
 * re-imports these — do not duplicate the logic there.
 *
 * Two distinct transforms live here:
 *   - `normalizeFollowUpText` (re-exported from `@craft-agent/ui`) — the
 *     content-preserving whitespace collapse used for the agent-facing
 *     message. NO length cap.
 *   - `truncateForChipTooltip` — UI helper that shortens + ellipsizes for
 *     the hover tooltip on the chip's index badge. Caller MUST supply the
 *     cap — there is no sensible default, and a default was the root
 *     cause of a past bug (OSS #580) where the agent-facing path
 *     accidentally reused it.
 */
export type PendingFollowUpAnnotation = {
    messageId: string;
    annotationId: string;
    note: string;
    selectedText: string;
    createdAt: number;
    color?: string;
    meta?: Record<string, unknown>;
};
/**
 * Whitespace-normalize + truncate for the hover tooltip shown on the
 * chip's index badge. Do NOT use for agent-facing messages — use
 * `normalizeFollowUpText` directly so the agent sees the full quote.
 */
export declare function truncateForChipTooltip(text: string, maxLength: number): string;
/**
 * Format pending follow-up annotations as a markdown section appended to
 * the user's message before it is sent to the agent. Quotes pass through
 * in full — only whitespace is normalized so the round-trip parser
 * (`normalizeFollowUpsMarkdown`) can re-parse them on message edit.
 */
export declare function formatFollowUpSection(followUps: PendingFollowUpAnnotation[], options?: {
    includeTopSeparator?: boolean;
}): string;
/**
 * Re-parse a message that already contains a `**Follow-ups**` section and
 * rebuild it in canonical form. Used when the user edits a sent message —
 * we want to normalize whitespace / re-number / repair spacing without
 * losing the quote/note pairs.
 *
 * The regex uses lazy `[\s\S]*?` for quotes, so arbitrarily long quotes
 * are handled correctly. Whitespace in quotes/notes is collapsed, matching
 * what `normalizeFollowUpText` produces — so a round-trip is a no-op for
 * quotes that passed through `formatFollowUpSection`.
 */
export declare function normalizeFollowUpsMarkdown(message: string): string;
