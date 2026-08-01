/**
 * Build the client API proxy.
 *
 * Replaces the 329-line preload. The ElectronAPI TypeScript interface still
 * enforces types at compile time — this proxy provides runtime dispatch.
 */
import type { RpcClient } from '@craft-agent/server-core/transport';
import type { ElectronAPI } from '../shared/types';
export type ChannelMapEntry = {
    type: 'invoke';
    channel: string;
    transform?: (result: any) => any;
} | {
    type: 'listener';
    channel: string;
};
export type ChannelMap = Record<string, ChannelMapEntry>;
export declare function buildClientApi(client: RpcClient, channelMap: ChannelMap, isChannelAvailable?: (channel: string) => boolean): ElectronAPI;
