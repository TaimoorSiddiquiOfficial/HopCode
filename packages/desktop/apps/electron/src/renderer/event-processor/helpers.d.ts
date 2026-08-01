/**
 * Message Operation Helpers
 *
 * Pure utility functions for finding and updating messages.
 * All lookups are by ID (turnId, toolUseId) - NEVER by position.
 */
import type { Message, Session } from '../../shared/types';
/**
 * Generate a unique message ID
 */
export declare function generateMessageId(): string;
/**
 * Find message index by turnId
 * Returns -1 if not found
 */
export declare function findMessageByTurnId(messages: Message[], turnId: string | undefined, role?: 'assistant' | 'tool'): number;
/**
 * Find streaming assistant message by turnId
 * Falls back to last streaming assistant if no turnId
 */
export declare function findStreamingMessage(messages: Message[], turnId?: string): number;
/**
 * Find assistant message by turnId (streaming or not)
 */
export declare function findAssistantMessage(messages: Message[], turnId?: string): number;
/**
 * Find tool message by toolUseId
 */
export declare function findToolMessage(messages: Message[], toolUseId: string): number;
/**
 * Update message at index, returning new session
 * Always creates new references (immutable update)
 * @param updateTimestamp - If true, also update lastMessageAt
 */
export declare function updateMessageAt(session: Session, index: number, updates: Partial<Message>, updateTimestamp?: boolean): Session;
/**
 * Append message to session, returning new session
 * @param updateTimestamp - If false, don't update lastMessageAt (for intermediate/tool messages)
 */
export declare function appendMessage(session: Session, message: Message, updateTimestamp?: boolean): Session;
/**
 * Insert message at index, returning new session
 * @param updateTimestamp - If false, don't update lastMessageAt (for intermediate/tool messages)
 */
export declare function insertMessageAt(session: Session, index: number, message: Message, updateTimestamp?: boolean): Session;
/**
 * Create an empty session for a given ID
 */
export declare function createEmptySession(sessionId: string, workspaceId: string, workspaceName?: string): Session;
