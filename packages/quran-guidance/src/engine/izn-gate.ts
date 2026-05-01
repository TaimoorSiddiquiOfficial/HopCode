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
 * Destructive categories (file deletion, force-push, DROP/TRUNCATE, permission changes)
 * require verification.
 */
export function checkIznGate(input: {
  toolName: string;
  toolArgs?: Record<string, unknown>;
  command?: string;
}): IznGateResult {
  const textToCheck = [
    input.toolName,
    input.command ?? '',
    ...(input.toolArgs
      ? Object.values(input.toolArgs).filter(
          (v): v is string => typeof v === 'string',
        )
      : []),
  ].join(' ');

  const matchedCategories: DestructiveActionCategory[] = [];

  for (const rule of iznBehaviorRules) {
    if (rule.detectPattern.test(textToCheck)) {
      matchedCategories.push(rule.category);
    }
  }

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
