import * as React from "react";
import type { Session } from "../../shared/types";
import type { SessionMeta } from "../atoms/sessions";
import type { SessionStatusId } from "../config/session-status-config";
/** Common session fields used by getSessionTitle */
type SessionLike = Pick<Session, 'name' | 'preview'> & {
    messages?: Session['messages'];
};
/**
 * Get display title for a session.
 * Priority: custom name > first user message > preview (from metadata) > "New chat"
 * Works with both Session (full) and SessionMeta (lightweight)
 */
export declare function getSessionTitle(session: SessionLike | SessionMeta): string;
/**
 * Get a compact preview line for session-list rows.
 * Prefers the stored preview/first user message, but avoids duplicating the title.
 */
export declare function getSessionPreviewText(session: SessionLike | SessionMeta, maxLength?: number): string | null;
/**
 * Get the ID of the last final assistant or plan message (not intermediate)
 * Used for unread message tracking
 */
export declare function getLastFinalAssistantMessageId(session: Session): string | undefined;
/**
 * Check if a session has unread messages
 * A session is unread if:
 * - There's a final assistant message AND
 * - Its ID differs from lastReadMessageId
 */
export declare function hasUnreadMessages(session: Session): boolean;
/**
 * Count the number of unread final assistant messages
 * Returns the count of final assistant messages after lastReadMessageId
 */
export declare function countUnreadMessages(session: Session): number;
export declare function getSessionStatus(session: SessionMeta): SessionStatusId;
export declare function hasUnreadMeta(session: SessionMeta): boolean;
export declare function hasMessagesMeta(session: SessionMeta): boolean;
/** Short relative time locale for date-fns formatDistanceToNowStrict.
 *  Produces compact strings: "7m", "2h", "3d", "2w", "5mo", "1y"
 *  Uses i18n keys (time.compact.*) so output is localized. */
export declare const shortTimeLocale: {
    formatDistance: (token: string, count: number) => any;
};
export declare function formatSessionRelativeTime(timestamp: number): string;
/** Highlight matching text in a string with yellow background spans. */
export declare function highlightMatch(text: string, query: string): React.ReactNode;
export {};
