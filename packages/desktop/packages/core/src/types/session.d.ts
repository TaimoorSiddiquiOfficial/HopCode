/**
 * Session types for conversation management
 *
 * Sessions are the primary isolation boundary. Each session maps 1:1
 * with a CraftAgent instance and SDK conversation.
 */
import type { StoredMessage, TokenUsage } from './message.ts';
/**
 * Session status for workflow tracking
 * Agents can update this to reflect the current state of the conversation
 */
export type SessionStatus = 'todo' | 'in_progress' | 'needs_review' | 'done' | 'cancelled';
/**
 * Session represents a conversation scope (SDK session = our scope boundary)
 */
export interface Session {
    id: string;
    sdkSessionId?: string;
    workspaceId: string;
    name?: string;
    createdAt: number;
    lastUsedAt: number;
    isArchived?: boolean;
    isFlagged?: boolean;
    status?: SessionStatus;
    lastReadMessageId?: string;
}
/**
 * Stored session with conversation data (for persistence)
 */
export interface StoredSession extends Session {
    messages: StoredMessage[];
    tokenUsage: TokenUsage;
}
/**
 * Session metadata for listing (without loading full messages)
 * Extended with archive status for Inbox/Archive features
 */
export interface SessionMetadata {
    id: string;
    workspaceId: string;
    name?: string;
    createdAt: number;
    lastUsedAt: number;
    messageCount: number;
    preview?: string;
    sdkSessionId?: string;
    isArchived?: boolean;
    isFlagged?: boolean;
    status?: SessionStatus;
    hidden?: boolean;
}
