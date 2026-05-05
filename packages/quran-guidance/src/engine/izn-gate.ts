import { iznBehaviorRules } from '../data/izn-behavior-rules.js';
import type {
  DestructiveActionCategory,
  IznGateResult,
} from '../types/izn-types.js';

// ── Escalation thresholds ──────────────────────────────────────────
export const IZN_ESCALATION_LEVELS = {
  /** Standard self-verification — first-time or isolated destructive call. */
  CAUTION: 'caution',
  /** Repeated same-category block — stronger warning with regression risk. */
  WARNING: 'warning',
  /** Persistent same-category block — refusal with explicit justification. */
  REFUSAL: 'refusal',
} as const;

export type IznEscalationLevel =
  (typeof IZN_ESCALATION_LEVELS)[keyof typeof IZN_ESCALATION_LEVELS];

/** Consecutive blocks needed to escalate to warning level. */
const WARNING_THRESHOLD = 3;
/** Consecutive blocks needed to escalate to refusal level. */
const REFUSAL_THRESHOLD = 5;

export interface IznBlockHistoryEntry {
  category: DestructiveActionCategory;
}

function computeEscalationLevel(
  matchedCategories: DestructiveActionCategory[],
  blockHistory?: IznBlockHistoryEntry[],
): IznEscalationLevel | null {
  if (!blockHistory || blockHistory.length === 0) return null;

  // Count consecutive blocks where at least one category matches
  let consecutive = 0;
  for (let i = blockHistory.length - 1; i >= 0; i--) {
    const entry = blockHistory[i];
    const hasOverlap = entry.category
      ? matchedCategories.includes(entry.category)
      : false;
    if (hasOverlap) {
      consecutive++;
    } else {
      break;
    }
  }

  if (consecutive >= REFUSAL_THRESHOLD) return IZN_ESCALATION_LEVELS.REFUSAL;
  if (consecutive >= WARNING_THRESHOLD) return IZN_ESCALATION_LEVELS.WARNING;
  if (consecutive >= 1) return IZN_ESCALATION_LEVELS.CAUTION;
  return null;
}

/**
 * Izn pre-execution gate.
 *
 * When the agent is in Izn mode, this function checks whether a
 * tool call is a destructive action. Instead of hard-blocking, it
 * returns an intent-clarification plan — the model reads affected
 * files, traces dependencies, predicts cascade effects, and asks
 * the user to confirm their actual goal before acting.
 *
 * Non-destructive actions (reads, normal writes, searches) pass through.
 * Destructive categories trigger the clarification workflow.
 *
 * When `blockHistory` is provided, the gate escalates after repeated
 * same-category blocks: caution → warning (3+) → refusal (5+).
 */
export function checkIznGate(
  input: {
    toolName: string;
    toolArgs?: Record<string, unknown>;
    command?: string;
  },
  blockHistory?: IznBlockHistoryEntry[],
): IznGateResult {
  const textToCheck = buildTextToCheck(input);
  const matchedCategories = matchCategories(textToCheck, input.toolName);

  if (matchedCategories.length === 0) {
    return { allowed: true };
  }

  const escalationLevel = computeEscalationLevel(
    matchedCategories,
    blockHistory,
  );

  // Build the intent-clarification plan from the matched rules.
  const allAnalysisPlan = matchedCategories.flatMap((cat) => {
    const rule = iznBehaviorRules.find((r) => r.category === cat);
    return rule?.preVerify ?? [];
  });
  const allIntentQuestions = matchedCategories.flatMap((cat) => {
    const rule = iznBehaviorRules.find((r) => r.category === cat);
    return rule?.intentQuestions ?? [];
  });
  const allImpactScope = matchedCategories.flatMap((cat) => {
    const rule = iznBehaviorRules.find((r) => r.category === cat);
    if (!rule?.impactAnalysis) return [];
    return [
      ...rule.impactAnalysis.readTargets,
      ...rule.impactAnalysis.dependencyChecks,
      ...rule.impactAnalysis.cascadeScenarios,
    ];
  });

  const uniqueAnalysisPlan = [...new Set(allAnalysisPlan)];
  const uniqueIntentQuestions = [...new Set(allIntentQuestions)];
  const uniqueImpactScope = [...new Set(allImpactScope)];

  const reason = buildEscalatedReason(matchedCategories, escalationLevel);

  return {
    allowed: false,
    reason,
    requiredConfirmation: buildConfirmationText(
      uniqueAnalysisPlan,
      escalationLevel,
    ),
    category: matchedCategories,
    analysisPlan: uniqueAnalysisPlan,
    intentQuestions: uniqueIntentQuestions,
    impactScope: uniqueImpactScope,
    escalationLevel: escalationLevel ?? undefined,
  };
}

/**
 * Izn post-execution scope report.
 *
 * After a tool executes in Izn mode, appends a brief scope-verification
 * reminder to the model's context. For destructive actions, includes
 * the category-specific post-report checklist. For normal tools, a
 * generic reminder to verify the result matches intent.
 *
 * When `blockHistory` is provided and escalation applies, the report
 * includes stronger regression-risk warnings.
 */
export function reportIznScope(
  input: {
    toolName: string;
    toolArgs?: Record<string, unknown>;
    command?: string;
  },
  blockHistory?: IznBlockHistoryEntry[],
): { context: string } {
  const textToCheck = buildTextToCheck(input);
  const matchedCategories = matchCategories(textToCheck, input.toolName);
  const escalationLevel = computeEscalationLevel(
    matchedCategories,
    blockHistory,
  );

  if (matchedCategories.length === 0) {
    return {
      context: [
        'Izn scope: Verify this change matches your intent before continuing.',
        'If anything looks wrong, report it and revert.',
      ].join(' '),
    };
  }

  // Destructive tool: include category-specific post-report checklist
  const allPostReport = matchedCategories.flatMap((cat) => {
    const rule = iznBehaviorRules.find((r) => r.category === cat);
    return rule?.postReport ?? [];
  });
  const uniquePostReport = [...new Set(allPostReport)];

  // Gather intent-retention guidance from matched rules
  const allRevertConditions = matchedCategories.flatMap((cat) => {
    const rule = iznBehaviorRules.find((r) => r.category === cat);
    return rule?.revertCondition ? [rule.revertCondition] : [];
  });
  const uniqueRevertConditions = [...new Set(allRevertConditions)];

  const escalationHeader =
    escalationLevel === IZN_ESCALATION_LEVELS.REFUSAL
      ? '⚠️ IZN REFUSAL '
      : escalationLevel === IZN_ESCALATION_LEVELS.WARNING
        ? '⚠️ IZN WARNING '
        : '';

  const lines = [
    `${escalationHeader}Izn scope — ${matchedCategories.join(', ')} completed:`,
    '',
    ...uniquePostReport.map((step, i) => `${i + 1}. ${step}`),
    '',
    'Intent verification:',
    '- If intent was clarified before this action, confirm the result matches what was agreed.',
    '- If any cascade effects occurred that were not predicted, report them now.',
    '- If the action was partial or skipped steps, note what was skipped and why.',
  ];

  if (uniqueRevertConditions.length > 0) {
    lines.push(
      '',
      'Revert conditions (check if any apply):',
      ...uniqueRevertConditions.map((c) => `- ${c}`),
    );
  }

  if (escalationLevel === IZN_ESCALATION_LEVELS.WARNING) {
    lines.push(
      '',
      '⚠️ Repeated same-category action — regression risk elevated.',
      '    Confirm this specific action is still within the agreed scope.',
    );
  }

  if (escalationLevel === IZN_ESCALATION_LEVELS.REFUSAL) {
    lines.push(
      '',
      '⛔ This action type has been blocked repeatedly.',
      '    The risk of unintended damage now outweighs the stated intent.',
      '    If this action is genuinely necessary, re-explain the full intent',
      '    and break the work into smaller, verified steps.',
    );
  }

  lines.push('', 'Verify scope and report any deviations.');

  return { context: lines.join('\n') };
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Build a single string from all text-bearing inputs for pattern matching. */
function buildTextToCheck(input: {
  toolName: string;
  toolArgs?: Record<string, unknown>;
  command?: string;
}): string {
  return [
    input.toolName,
    input.command ?? '',
    ...(input.toolArgs
      ? Object.entries(input.toolArgs)
          .filter(
            (entry): entry is [string, string] =>
              entry[0] !== 'description' && typeof entry[1] === 'string',
          )
          .map(([, value]) => value)
      : []),
  ].join(' ');
}

/**
 * Match tool input against destructive action detection patterns.
 *
 * All destructive categories (file removal, remote overwrites,
 * schema changes, access changes) only apply to run_shell_command.
 * Other tools (write_file, edit, etc.) may contain matching keywords
 * in their content or documentation arguments — those are not
 * destructive actions and must not be flagged.
 */
function matchCategories(
  textToCheck: string,
  toolName: string,
): DestructiveActionCategory[] {
  // Only run_shell_command can execute destructive operations.
  // Content-modifying tools (write_file, edit) never perform
  // file system or database destruction regardless of content.
  if (toolName !== 'run_shell_command') {
    return [];
  }

  const matched: DestructiveActionCategory[] = [];
  for (const rule of iznBehaviorRules) {
    if (rule.detectPattern.test(textToCheck)) {
      matched.push(rule.category);
    }
  }
  return matched;
}

function buildEscalatedReason(
  matchedCategories: DestructiveActionCategory[],
  escalationLevel: IznEscalationLevel | null,
): string {
  const base = `Destructive action detected: ${matchedCategories.join(', ')}.`;

  switch (escalationLevel) {
    case IZN_ESCALATION_LEVELS.REFUSAL:
      return `${base} BLOCKED — this action type has been attempted ${REFUSAL_THRESHOLD}+ times. Re-explain intent and break into smaller verified steps.`;
    case IZN_ESCALATION_LEVELS.WARNING:
      return `${base} WARNING — repeated same-category action. Confirm this is still within agreed scope.`;
    default:
      return `${base} Izn requires self-verification before proceeding.`;
  }
}

function buildConfirmationText(
  analysisPlan: string[],
  escalationLevel: IznEscalationLevel | null,
): string {
  const prefix =
    escalationLevel === IZN_ESCALATION_LEVELS.REFUSAL
      ? '⛔ REPEATED BLOCK — Self-Verification Required:'
      : escalationLevel === IZN_ESCALATION_LEVELS.WARNING
        ? '⚠️ Repeated Action — Self-Verification Required:'
        : 'Izn Mode — Self-Verification Required:';

  return [
    prefix,
    '',
    ...analysisPlan.map((step, i) => `${i + 1}. ${step}`),
    '',
    'Confirm scope before proceeding.',
  ].join('\n');
}
