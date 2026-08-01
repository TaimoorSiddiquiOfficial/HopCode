import type { SessionTarget } from './types.js';
export interface ChannelWebhookTargetConfig {
    chatId: string;
    senderId: string;
    threadId?: string;
    isGroup?: boolean;
}
export interface ChannelWebhookSourceConfig {
    secret?: string;
    secretEnv?: string;
    targets: Record<string, ChannelWebhookTargetConfig>;
}
export interface ChannelWebhookConfig {
    sources: Record<string, ChannelWebhookSourceConfig>;
}
export interface ChannelWebhookTask {
    channelName: string;
    source: string;
    eventType: string;
    targetRef: string;
    title: string;
    summary?: string;
    payload: Record<string, unknown>;
}
export interface ChannelWebhookRunOptions {
    timeoutMs?: number;
}
export declare function resolveChannelWebhookTarget(channelName: string, config: ChannelWebhookConfig, source: string, targetRef: string): SessionTarget;
export declare function buildChannelWebhookPrompt(task: ChannelWebhookTask, target: SessionTarget): string;
