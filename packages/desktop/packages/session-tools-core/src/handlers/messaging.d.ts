/**
 * Messaging session tools — list bindings and unbind channels.
 *
 * NOTE: Binding is done via pairing codes (chat-side or UI-side),
 * not via arbitrary channelId from the agent. This prevents the agent
 * from binding sessions to channels it shouldn't have access to.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface ListMessagingChannelsArgs {
    sessionId?: string;
}
export declare function handleListMessagingChannels(ctx: SessionToolContext, args: ListMessagingChannelsArgs): Promise<ToolResult>;
export interface UnbindMessagingChannelArgs {
    platform?: 'telegram' | 'whatsapp';
}
export declare function handleUnbindMessagingChannel(ctx: SessionToolContext, args: UnbindMessagingChannelArgs): Promise<ToolResult>;
