import { iznBehaviorRules } from '../data/izn-behavior-rules.js';
import type {
  DestructiveActionCategory,
  IznGateResult,
} from '../types/izn-types.js';

/**
 * Izn pre-execution gate.
 *
 * When the agent is in Izn mode, this function checks whether a
 * tool call is a destructive action that requires self-verification
 * before proceeding.
 *
 * Non-destructive actions (reads, normal writes, searches) pass through.
 * Destructive categories require verification.
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

  // Build the verification requirements
  const allPreVerify = matchedCategories.flatMap((cat) => {
    const rule = iznBehaviorRules.find((r) => r.category === cat);
    return rule?.preVerify ?? [];
  });
  const uniquePreVerify = [...new Set(allPreVerify)];

  return {
    allowed: false,
    reason: `Destructive action detected: ${matchedCategories.join(', ')}. Izn requires self-verification before proceeding.`,
    requiredConfirmation: [
      'Izn Mode — Self-Verification Required:',
      '',
      ...uniquePreVerify.map((step, i) => `${i + 1}. ${step}`),
      '',
      'Confirm scope before proceeding.',
    ].join('\n'),
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

  const lines = [
    `Izn scope — ${matchedCategories.join(', ')} completed:`,
    '',
    ...uniquePostReport.map((step, i) => `${i + 1}. ${step}`),
    '',
    'Verify scope and report any deviations.',
  ];

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
      ? Object.values(input.toolArgs).filter(
          (v): v is string => typeof v === 'string',
        )
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
