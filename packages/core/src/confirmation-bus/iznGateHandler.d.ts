/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Izn gate handler for destructive-action awareness.
 *
 * Manages the stateful aspects of the Izn gate: verified-hash tracking
 * for retry-after-verification and progressive block-history escalation.
 * Kept separate from the CoreToolScheduler so the gate logic is independently
 * testable and the scheduler stays focused on orchestration.
 */
import { type IznGateResult, type IznBlockHistoryEntry } from '@hoptrendy/quran-guidance';
/**
 * Builds a system-reminder message with the Izn gate's analysis plan,
 * impact scope, and intent-clarification questions so the model can
 * pause, verify, and gather user confirmation before retrying.
 */
export declare function buildIznClarificationMessage(gateResult: IznGateResult & {
    allowed: false;
}): string;
export interface IznGateCheckParams {
    toolName: string;
    toolArgs: Record<string, unknown>;
}
export type IznGateDecision = {
    allowed: true;
} | {
    allowed: false;
    clarificationMessage: string;
};
export declare class IznGateHandler {
    /**
     * Tracks shell commands that have passed the Izn verification gate
     * and are pending retry. When the model re-issues the same command
     * after self-verification, the hash match allows it to skip the
     * gate and execute. Hashes are removed on pass-through so they
     * cannot leak across turns.
     */
    private verifiedHashes;
    /** Accumulated destructive-action block history for the current turn. */
    private blockHistory;
    /**
     * Check whether a tool invocation should pass the Izn destructive-action
     * gate. If the tool/command was previously blocked and the model is now
     * retrying after verification (hash match), it is allowed through.
     *
     * @returns A decision — either `{ allowed: true }` or
     *   `{ allowed: false, clarificationMessage }` with a system-reminder
     *   instructing the model to pause, verify, and gather user confirmation.
     */
    check(params: IznGateCheckParams): IznGateDecision;
    /**
     * Generate a post-execution scope report for the model to self-verify.
     * Returns `null` when there is no scope context to report.
     */
    buildScopeReport(params: IznGateCheckParams): string | null;
    /** Reset block history at the start of each user turn. */
    clearBlockHistory(): void;
    /**
     * Discard verified hashes at the start of each user turn so that
     * stale hashes from a previous turn cannot auto-approve commands
     * without the model going through verification again.
     */
    clearVerifiedHashes(): void;
    getBlockHistory(): readonly IznBlockHistoryEntry[];
}
