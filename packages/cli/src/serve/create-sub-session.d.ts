/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { AcpSessionBridge } from '@hoptrendy/acp-bridge/bridgeTypes';
import type { CreateSubSessionInfo, CreateSubSessionResult } from '@hoptrendy/acp-bridge/bridgeOptions';
/** Per-caller ceiling on concurrent in-flight sub-sessions. A `first-turn`
 * request holds a slot until its turn finishes; parallel tool calls from one
 * caller must not spawn unbounded sub-sessions. Over the cap the request is
 * rejected (surfaced as the tool's error), never silently dropped. */
export declare const MAX_CONCURRENT_SUB_SESSIONS_PER_CALLER = 5;
/**
 * Ceiling on concurrent in-flight sub-sessions across ALL callers of this
 * workspace's launcher.
 *
 * The per-caller cap is keyed on `callerSessionId`, and the daemon can only
 * authenticate that id as "a session on this channel" — every session of a
 * workspace shares ONE child process, so nothing at the transport can prove
 * *which* of them issued the call. A child running attacker code could rotate
 * ids to open a fresh bucket per launch, or charge them to a sibling. This
 * bound does not depend on the id being honest: it holds whichever bucket the
 * launch is charged to.
 */
export declare const MAX_CONCURRENT_SUB_SESSIONS_TOTAL = 20;
export interface SubSessionLauncher {
    /** The `onCreateSubSession` callback wired into the bridge. Returns a Promise
     * the child's tool awaits. */
    launch(info: CreateSubSessionInfo): Promise<CreateSubSessionResult>;
    /** Stop accepting new sub-sessions (daemon shutdown). Idempotent. */
    stop(): void;
}
export interface CreateSubSessionLauncherOptions {
    getBridge: () => AcpSessionBridge | undefined;
    boundWorkspace: string;
    /** Per-request `first-turn` wall-clock timeout; defaults to
     * {@link FIRST_TURN_TIMEOUT_MS}. Exposed for tests. */
    firstTurnTimeoutMs?: number;
    /** Sent-mode background-drain ceiling; defaults to
     * {@link SENT_MODE_DRAIN_TIMEOUT_MS}. Exposed for tests. */
    sentModeDrainTimeoutMs?: number;
}
export declare function createSubSessionLauncher(opts: CreateSubSessionLauncherOptions): SubSessionLauncher;
