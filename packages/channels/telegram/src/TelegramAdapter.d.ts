import { ChannelBase } from '@hoptrendy/channel-base';
import type { ChannelAgentBridge, ChannelBaseOptions, ChannelConfig, ChannelTaskLifecycleEvent, SessionTarget } from '@hoptrendy/channel-base';
export declare class TelegramChannel extends ChannelBase {
    private bot;
    private botId;
    private botUsername;
    private hasConnectedOnce;
    private signalHandlersRegistered;
    constructor(name: string, config: ChannelConfig, bridge: ChannelAgentBridge, options?: ChannelBaseOptions);
    supportsProactiveSend(): boolean;
    protected supportsProactiveTarget(target: SessionTarget): boolean;
    private createBot;
    private getFileUrl;
    connect(): Promise<void>;
    private registerBotCommands;
    /** Per-chat typing interval — repeats every 4s since Telegram expires it after 5s. */
    private typingIntervals;
    private activeTypingSessions;
    private sendTyping;
    private startTyping;
    private stopTyping;
    protected onTaskLifecycle(event: ChannelTaskLifecycleEvent): void;
    protected onPromptStart(chatId: string, sessionId?: string): void;
    protected onPromptEnd(chatId: string, sessionId?: string): void;
    onSessionDied(sessionId: string): void;
    sendMessage(chatId: string, text: string): Promise<void>;
    protected pushProactive(target: SessionTarget, text: string): Promise<void>;
    private sendTelegramMessage;
    disconnect(): void;
    private buildEnvelope;
}
