/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonMidTurnMessageInjectedData } from '@hoptrendy/sdk/daemon';
export declare function getSidechannelMidTurnInjected(): readonly DaemonMidTurnMessageInjectedData[];
export declare function subscribeSidechannelMidTurnInjected(listener: () => void): () => void;
export declare function publishSidechannelMidTurnInjected(data: DaemonMidTurnMessageInjectedData): void;
/**
 * Remove exactly the `handled` batches (by object identity) from the buffer.
 *
 * The consumer reconciles a SESSION-SCOPED subset of the buffer (the batches for
 * the active session) and passes that same subset here. Two classes of batch are
 * therefore deliberately NOT removed and survive for their own reconcile:
 *
 * - Batches for a DIFFERENT session — the buffer is a cross-session singleton, so
 *   on an in-place session switch a frame for the previous session can still be
 *   buffered. It was never reconciled against this session's queue, so wiping it
 *   would lose it on switch-back (resent next turn = double delivery).
 * - Batches that arrived AFTER the consumer's render snapshot (the render→effect
 *   window) — they aren't in `handled`, so a blanket clear would drop them
 *   unreconciled. Identity-removal leaves them for the next effect run.
 *
 * Clearing only what was reconciled is what makes the dedupe exactly-once across
 * both the multi-session and the late-frame races.
 */
export declare function consumeSidechannelMidTurnInjected(handled: readonly DaemonMidTurnMessageInjectedData[]): void;
/** Drop the entire buffer (e.g. test teardown). */
export declare function clearSidechannelMidTurnInjected(): void;
/**
 * Parse a raw daemon SSE frame into the injected-messages payload, or
 * `undefined` if the frame is not a well-formed `mid_turn_message_injected`
 * event. Filters out non-string / empty entries; returns `undefined` when
 * nothing usable remains.
 */
export declare function parseSidechannelMidTurnInjected(event: unknown): DaemonMidTurnMessageInjectedData | undefined;
