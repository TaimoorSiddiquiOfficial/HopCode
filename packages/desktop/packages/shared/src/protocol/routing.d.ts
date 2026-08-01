/**
 * Exhaustive channel routing table for hybrid local/remote transport.
 *
 * Every RPC channel must belong to exactly one of two sets:
 * - LOCAL_ONLY: Always runs on the local Electron server, never proxied.
 * - REMOTE_ELIGIBLE: Runs on whichever server owns the workspace.
 *
 * An exhaustiveness test ensures new channels fail CI until classified.
 */
export declare const LOCAL_ONLY_CHANNELS: Set<string>;
export declare const REMOTE_ELIGIBLE_CHANNELS: Set<string>;
export declare function isLocalOnly(channel: string): boolean;
export declare function isRemoteEligible(channel: string): boolean;
