/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Plan Approval Gate orchestrator.
 *
 * Runs a single gate review agent, assigns stable finding ids, and
 * produces a {@link GateDecision}.
 *
 * This module is called from `ExitPlanModeToolInvocation.execute()` when
 * the pre-plan mode is AUTO or IZN.
 */
import type { Config } from '../config/config.js';
import type { GateAgentResult, MergedGateFinding, GateDecision, EvidenceBundle } from './types.js';
/**
 * Run a single round of the Plan Approval Gate. The caller
 * (ExitPlanModeTool) is responsible for the outer capped/uncapped loop
 * and for persisting the gate state between rounds.
 */
export declare function runPlanApprovalGate(config: Config, bundle: EvidenceBundle, signal: AbortSignal): Promise<GateDecision>;
/**
 * Assigns stable GF-N ids to findings from the single agent's result.
 */
export declare function assignFindingIds(result: GateAgentResult): MergedGateFinding[];
export declare function formatBlockedResponse(decision: GateDecision & {
    kind: 'blocked';
}): string;
export declare function formatNeedsUserResponse(decision: GateDecision & {
    kind: 'needs_user';
}): string;
export declare function formatCapEscalationResponse(decision: GateDecision & {
    kind: 'cap_escalation';
}): string;
export declare function formatApprovedNotes(findings: MergedGateFinding[]): string;
