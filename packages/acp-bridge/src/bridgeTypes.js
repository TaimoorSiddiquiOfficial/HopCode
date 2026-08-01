/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export const LOAD_REPLAY_MODE_META_KEY = 'hopcode.session.loadReplayMode';
export const LOAD_REPLAY_META_KEY = 'hopcode.session.loadReplay';
export const LOAD_REPLAY_PAGE_SIZE_META_KEY = 'hopcode.session.loadReplayPageSize';
export const LOAD_REPLAY_BULK_MODE = 'bulk';
export const LOAD_REPLAY_VERSION = 1;
export const CHANNEL_STARTUP_PROFILE_META_KEY = 'qwen.daemon.channelStartupProfile';
export const CHANNEL_STARTUP_PROFILE_VERSION = 1;
/**
 * ACP ext-method the spawned `qwen --acp` child calls between tool batches to
 * pull user messages the browser queued mid-turn. The child-side caller
 * (`cli/src/acp-integration/session/Session.ts`) and the daemon-side answerer
 * (`bridgeClient.ts`) both import THIS single definition, so a rename can't
 * silently desync them into a runtime `-32601 methodNotFound` (which would
 * latch the drain off for the session). The desktop ACP client answers the same
 * method from its own in-memory queue; in `qwen serve` the daemon answers it
 * from `SessionEntry.midTurnMessageQueue`. Responses may also carry
 * `hasQueuedPrompt` so an armed daemon Todo guard yields to complete FIFO
 * prompts; older clients can omit it.
 */
export const MID_TURN_QUEUE_DRAIN_METHOD = 'craft/drainMidTurnQueue';
/**
 * Parent-to-agent request reporting that the daemon FIFO no longer contains the
 * complete prompt an active Todo Stop Guard yielded to. The child clears the
 * old guard instead of letting background work revive it or leaving unrelated
 * automatic turns blocked forever.
 */
export const TODO_STOP_GUARD_QUEUE_RELEASE_METHOD = 'craft/todoStopGuardQueueReleased';
/**
 * Reverse tool channel marker (issue #5626, Phase 2). The parent serve process
 * stamps this boolean on a client-hosted (extension) MCP server's
 * runtime-MCP-add config. The `qwen --acp` child reads it in its
 * `workspaceMcpRuntimeAdd` handler to (1) KEEP `type: 'sdk'` instead of
 * stripping it and (2) let the session `McpClientManager` bind that server's
 * `sendSdkMcpMessage` to the `qwen/control/client_mcp/message` ext-method.
 * Defined here — the single contract package both the parent provider
 * (`cli/src/serve/acp-http`) and the child handler (`cli/src/acp-integration`)
 * import — so a rename can't silently break the handshake.
 */
export const CLIENT_MCP_OVER_WS_CONFIG_FLAG = '__clientMcpOverWs';
//# sourceMappingURL=bridgeTypes.js.map