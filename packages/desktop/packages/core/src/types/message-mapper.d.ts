import type { Message, StoredMessage } from './message.ts';
/**
 * Convert runtime Message to StoredMessage for persistence.
 *
 * Excludes transient runtime-only fields:
 * - isStreaming
 * - isPending
 */
export declare function messageToStored(msg: Message): StoredMessage;
/**
 * Convert StoredMessage to runtime Message.
 *
 * Adds a timestamp fallback for legacy messages where timestamp was omitted.
 */
export declare function storedToMessage(stored: StoredMessage): Message;
