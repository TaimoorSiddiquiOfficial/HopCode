import { ChannelBase } from '@hoptrendy/channel-base';
import type { ChannelAgentBridge, ChannelBaseOptions, ChannelConfig, ChannelTaskLifecycleEvent, SessionTarget } from '@hoptrendy/channel-base';
export declare class FeishuChannel extends ChannelBase {
    private eventDispatcher;
    private wsClient?;
    private httpServer?;
    private seenMessages;
    private dedupTimer?;
    /** Card state keyed by inbound messageId (unique per request). */
    private cardSessions;
    /** Map sessionId → inbound messageId, set in onPromptStart. */
    private sessionToInboundMsg;
    /** Question title keyed by inbound messageId. */
    private msgToQuestion;
    /** Sender @tag keyed by inbound messageId. */
    private msgToSenderName;
    /** Sender open_id keyed by inbound messageId — for stop-button auth in group chats. */
    private msgToSenderId;
    /** Tracks messages that were stopped. Cleaned up by onResponseComplete, onPromptEnd, stale timer, and disconnect. */
    private stoppedMessages;
    private botOpenId?;
    private tokenCache?;
    private tokenRefreshPromise?;
    private collapsible;
    private collapsibleThreshold;
    constructor(name: string, config: ChannelConfig, bridge: ChannelAgentBridge, options?: ChannelBaseOptions);
    supportsProactiveSend(): boolean;
    /** Build the event handler map shared between WebSocket and webhook modes. */
    private buildHandlerMap;
    connect(): Promise<void>;
    private connectWebSocket;
    private connectWebhook;
    private fetchBotInfo;
    /**
     * Fetch the content of a message by ID.
     * For interactive cards, extracts markdown text from card elements.
     */
    private fetchMessageContent;
    /**
     * Extract text content from a Feishu interactive card JSON structure.
     * Supports both v2 format ({ schema, body: { elements } }) and
     * v1/API-returned format ({ title, elements: [[...]] }).
     */
    private extractCardText;
    private getTenantAccessToken;
    private refreshToken;
    sendMessage(chatId: string, text: string): Promise<void>;
    protected pushProactive(target: SessionTarget, text: string): Promise<void>;
    private sendMessageInternal;
    private createStreamingCard;
    private updateCard;
    /** Delete a card message from Feishu to prevent orphaned "思考中..." cards. */
    private deleteCard;
    protected onResponseChunk(chatId: string, chunk: string, sessionId: string): void;
    protected onResponseBoundary(_chatId: string, sessionId: string): void;
    private isKnownInboundMessageId;
    private knownInboundMessageId;
    private statusLabelFor;
    private stopLabelFor;
    private finalizeStoppedCardUpdate;
    protected onTaskLifecycle(event: ChannelTaskLifecycleEvent): void;
    protected onResponseComplete(chatId: string, fullText: string, sessionId: string): Promise<void>;
    protected onPromptStart(chatId: string, sessionId: string, messageId?: string): void;
    protected onPromptEnd(_chatId: string, sessionId: string, messageId?: string): Promise<void>;
    private addReaction;
    private removeReaction;
    private onCardAction;
    disconnect(): void;
    /**
     * Count code fence boundaries in text using line-by-line tracking.
     * Handles indented fences and inline triple-backticks consistently.
     */
    private countFences;
    /**
     * Strip markdown tables from text while preserving code-fenced blocks.
     * Collapses consecutive table rows into a single replacement line.
     */
    private stripTables;
    private cleanupCard;
    private onMessage;
    /**
     * Extract text and media keys from Feishu message content.
     */
    private extractContent;
}
