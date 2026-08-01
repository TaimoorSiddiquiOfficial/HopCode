/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonMidTurnMessageInjectedData } from '@hoptrendy/sdk/daemon';
export interface UseDaemonMidTurnInjectedResult {
    /**
     * All injected mid-turn batches accumulated since the last `consume()`, in
     * arrival order. The array reference changes on every publish/consume, so a
     * consumer can run an effect keyed on it to reconcile every batch (not just
     * the newest) against its pending queue.
     */
    batches: readonly DaemonMidTurnMessageInjectedData[];
    /**
     * Drop exactly the batches passed in (by identity) — the consumer passes the
     * subset it actually reconciled (its active session's batches). Batches for
     * OTHER sessions, and frames that arrived after the snapshot, are not in that
     * subset and stay buffered for their own reconcile, so neither a session
     * switch nor a late frame can wipe an un-reconciled batch (= double delivery).
     */
    consume: (handled: readonly DaemonMidTurnMessageInjectedData[]) => void;
}
/**
 * Subscribe to injected mid-turn batches. Unlike a latest-wins signal, this
 * accumulates every batch so multi-batch turns (one frame per tool batch) are
 * all reconciled; the consumer calls `consume(handled)` with the batches it
 * processed.
 */
export declare function useDaemonMidTurnInjected(): UseDaemonMidTurnInjectedResult;
