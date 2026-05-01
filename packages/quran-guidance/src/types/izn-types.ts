/**
 * Izn mode types for the Quran-guidance system.
 *
 * Izn (إذن) means "permission" — the user grants the agent full
 * trust to execute tools without individual approval, but the agent
 * must act with heightened responsibility and accountability.
 */

import type { AgentSituation, QuranicAngle } from './quran-guidance.js';

/** Categories of destructive actions that require self-verification in Izn mode. */
export type DestructiveActionCategory =
  | 'file_deletion'
  | 'force_push'
  | 'database_drop'
  | 'database_truncate'
  | 'permission_change';

/** Result of the Izn pre-execution gate check. */
export type IznGateResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: string;
      requiredConfirmation: string;
    };

/** Izn mode behavior rules that layer onto the base guidance. */
export type IznBehaviorRule = {
  /** The destructive action category that triggers this rule. */
  category: DestructiveActionCategory;
  /** Pattern to detect in tool names or arguments. */
  detectPattern: RegExp;
  /** Required verification step before execution. */
  preVerify: string[];
  /** What the agent must report after execution. */
  postReport: string[];
  /** When to revert to consultation despite having Izn. */
  revertCondition: string;
};

/** Extended situation angles when Izn mode is active. */
export const IZN_MODE_SITUATION: AgentSituation = 'izn_mode_active';

/** Additional angles applied when Izn mode is detected. */
export const IZN_MODE_ANGLES: QuranicAngle[] = [
  'responsibility',
  'trust',
  'accountability',
  'transparency',
  'avoid_harm',
];

/** Izn mode behavior constraints. */
export const IZN_MODE_DO = [
  'Self-verify before destructive actions (file deletion, force-push, database DROP/TRUNCATE, permission changes).',
  'Commit with clear descriptive messages explaining what and why.',
  'Report scope after completing all tool executions.',
  'Flag uncertainty and revert to consultation if unsure about an action.',
  'Never exploit trust — choose responsible path even if slower.',
];

export const IZN_MODE_AVOID = [
  'Do not skip verification just because permission exists.',
  'Do not make irreversible changes without explicit scope confirmation.',
  'Do not hide or obscure the consequences of actions.',
  'Do not treat Izn as license to do whatever you want.',
];

export const IZN_MODE_TONE = [
  'responsible',
  'transparent',
  'accountable',
  'trustworthy',
  'careful',
];
