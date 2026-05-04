import { iznBehaviorRules } from '../data/izn-behavior-rules.js';
import type {
  DestructiveActionCategory,
  IznGateResult,
} from '../types/izn-types.js';

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
 */
export function checkIznGate(input: {
  toolName: string;
  toolArgs?: Record<string, unknown>;
  command?: string;
}): IznGateResult {
  const textToCheck = buildTextToCheck(input);
  const matchedCategories = matchCategories(textToCheck, input.toolName);

  if (matchedCategories.length === 0) {
    return { allowed: true };
  }

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

  return {
    allowed: false,
    reason: `Destructive action detected: ${matchedCategories.join(', ')}. Izn requires self-verification before proceeding.`,
    requiredConfirmation: [
      'Izn Mode — Self-Verification Required:',
      '',
      ...uniqueAnalysisPlan.map((step, i) => `${i + 1}. ${step}`),
      '',
      'Confirm scope before proceeding.',
    ].join('\n'),
    category: matchedCategories,
    analysisPlan: uniqueAnalysisPlan,
    intentQuestions: uniqueIntentQuestions,
    impactScope: uniqueImpactScope,
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
 * Returns `null` if the tool should have no additional scope context.
 */
export function reportIznScope(input: {
  toolName: string;
  toolArgs?: Record<string, unknown>;
  command?: string;
}): { context: string } | null {
  const textToCheck = buildTextToCheck(input);
  const matchedCategories = matchCategories(textToCheck, input.toolName);
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

  const lines = [
    `Izn scope — ${matchedCategories.join(', ')} completed:`,
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

  lines.push('', 'Verify scope and report any deviations.');

  return { context: lines.join('\n') };
}

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
