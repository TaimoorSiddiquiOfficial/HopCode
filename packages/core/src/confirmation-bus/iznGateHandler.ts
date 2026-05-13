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

import {
  checkIznGate,
  reportIznScope,
  type IznGateResult,
  type IznBlockHistoryEntry,
} from '@hoptrendy/quran-guidance';

/**
 * Builds a system-reminder message with the Izn gate's analysis plan,
 * impact scope, and intent-clarification questions so the model can
 * pause, verify, and gather user confirmation before retrying.
 */
export function buildIznClarificationMessage(
  gateResult: IznGateResult & { allowed: false },
): string {
  const lines: string[] = [
    '<system-reminder>',
    `Izn gate — ${gateResult.category.join(', ')} detected. Pause and verify before retrying.`,
    '',
    '## Self-Verification Steps',
    '',
    ...gateResult.analysisPlan.map((step, i) => `${i + 1}. ${step}`),
  ];

  if (gateResult.impactScope.length > 0) {
    lines.push(
      '',
      '## Impact Analysis (investigate before acting)',
      '',
      ...gateResult.impactScope.map((item, i) => `${i + 1}. ${item}`),
    );
  }

  if (gateResult.intentQuestions.length > 0) {
    lines.push(
      '',
      '## Clarify Intent (ask the user)',
      '',
      ...gateResult.intentQuestions.map((q, i) => `${i + 1}. ${q}`),
    );
  }

  lines.push(
    '',
    'After completing verification and receiving confirmed intent, retry the tool call.',
    '',
    'If you cannot verify safety: do NOT retry. Use ask_user_question to revert to consultation.',
    '</system-reminder>',
  );

  return lines.join('\n');
}

export interface IznGateCheckParams {
  toolName: string;
  toolArgs: Record<string, unknown>;
}

export type IznGateDecision =
  | { allowed: true }
  | { allowed: false; clarificationMessage: string };

export class IznGateHandler {
  /**
   * Tracks shell commands that have passed the Izn verification gate
   * and are pending retry. When the model re-issues the same command
   * after self-verification, the hash match allows it to skip the
   * gate and execute. Hashes are removed on pass-through so they
   * cannot leak across turns.
   */
  private verifiedHashes = new Set<string>();

  /** Accumulated destructive-action block history for the current turn. */
  private blockHistory: IznBlockHistoryEntry[] = [];

  /**
   * Check whether a tool invocation should pass the Izn destructive-action
   * gate. If the tool/command was previously blocked and the model is now
   * retrying after verification (hash match), it is allowed through.
   *
   * @returns A decision — either `{ allowed: true }` or
   *   `{ allowed: false, clarificationMessage }` with a system-reminder
   *   instructing the model to pause, verify, and gather user confirmation.
   */
  check(params: IznGateCheckParams): IznGateDecision {
    const commandStr =
      typeof params.toolArgs.command === 'string'
        ? params.toolArgs.command
        : '';
    const hash = `${params.toolName}|${commandStr}`;

    // Retry-after-verification: if the model already received
    // clarification and is re-issuing the same command, allow it.
    if (this.verifiedHashes.has(hash)) {
      this.verifiedHashes.delete(hash);
      return { allowed: true };
    }

    const gateResult = checkIznGate(
      {
        toolName: params.toolName,
        toolArgs: params.toolArgs,
      },
      this.blockHistory,
    );

    if (!gateResult.allowed) {
      // Store the hash so the retry-after-verification path works.
      this.verifiedHashes.add(hash);

      // Record in block history for progressive escalation.
      if (gateResult.category.length > 0) {
        this.blockHistory.push({
          category: gateResult.category[0],
        });
      }

      return {
        allowed: false,
        clarificationMessage: buildIznClarificationMessage(gateResult),
      };
    }

    return { allowed: true };
  }

  /**
   * Generate a post-execution scope report for the model to self-verify.
   * Returns `null` when there is no scope context to report.
   */
  buildScopeReport(params: IznGateCheckParams): string | null {
    const scopeReport = reportIznScope(params, this.blockHistory);
    return scopeReport?.context ?? null;
  }

  /** Reset block history at the start of each user turn. */
  clearBlockHistory(): void {
    this.blockHistory = [];
  }

  /**
   * Discard verified hashes at the start of each user turn so that
   * stale hashes from a previous turn cannot auto-approve commands
   * without the model going through verification again.
   */
  clearVerifiedHashes(): void {
    this.verifiedHashes.clear();
  }

  getBlockHistory(): readonly IznBlockHistoryEntry[] {
    return this.blockHistory;
  }
}
