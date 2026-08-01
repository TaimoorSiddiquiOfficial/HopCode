/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { HopCodeAgentManager } from '../../services/hopcodeAgentManager.js';
import type { ConversationStore } from '../../services/conversationStore.js';
/**
 * Base message handler interface
 * All sub-handlers should implement this interface
 */
export interface IMessageHandler {
    /**
     * Handle message
     * @param message - Message object
     * @returns Promise<void>
     */
    handle(message: {
        type: string;
        data?: unknown;
    }): Promise<void>;
    /**
     * Check if this handler can handle the message type
     * @param messageType - Message type
     * @returns boolean
     */
    canHandle(messageType: string): boolean;
}
/**
 * Base message handler class
 * Provides common dependency injection and helper methods
 */
export declare abstract class BaseMessageHandler implements IMessageHandler {
    protected agentManager: HopCodeAgentManager;
    protected conversationStore: ConversationStore;
    protected currentConversationId: string | null;
    protected sendToWebView: (message: unknown) => void;
    private readonly syncCurrentConversationId?;
    constructor(agentManager: HopCodeAgentManager, conversationStore: ConversationStore, currentConversationId: string | null, sendToWebView: (message: unknown) => void, syncCurrentConversationId?: ((id: string | null) => void) | undefined);
    abstract handle(message: {
        type: string;
        data?: unknown;
    }): Promise<void>;
    abstract canHandle(messageType: string): boolean;
    /**
     * Update current conversation ID
     */
    setCurrentConversationId(id: string | null): void;
    /**
     * Update current conversation ID through the owning router when available.
     */
    protected updateCurrentConversationId(id: string | null): void;
    /**
     * Get current conversation ID
     */
    getCurrentConversationId(): string | null;
}
