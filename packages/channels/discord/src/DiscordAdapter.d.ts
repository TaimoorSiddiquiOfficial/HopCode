import { ChannelBase } from '@hoptrendy/channel-base';
import type { ChannelConfig, ChannelBaseOptions, ChannelAgentBridge } from '@hoptrendy/channel-base';
export declare class DiscordChannel extends ChannelBase {
    private client;
    private botId;
    constructor(name: string, config: ChannelConfig, bridge: ChannelAgentBridge, options?: ChannelBaseOptions);
    connect(): Promise<void>;
    private handleMessage;
    private isReplyToOwnMessage;
    /** Per-channel typing interval — Discord typing expires after ~10s. */
    private typingIntervals;
    protected onPromptStart(chatId: string): void;
    protected onPromptEnd(chatId: string): void;
    sendMessage(chatId: string, text: string): Promise<void>;
    disconnect(): void;
}
