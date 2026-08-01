/**
 * Auto-Label Evaluator
 *
 * Core evaluation engine for auto-label rules. Scans user messages against
 * configured regex patterns, producing label matches.
 *
 * Evaluation flow:
 * 1. Strip code blocks from message (avoid matching inside code)
 * 2. Walk the label tree, collect all labels with autoRules
 * 3. For each rule: run regex with forced 'g' flag, substitute capture groups
 * 4. Normalize extracted values based on the label's valueType
 * 5. Deduplicate matches (same labelId + value = keep only first)
 * 6. Cap at MAX_MATCHES_PER_MESSAGE to prevent label explosion
 * 7. Return array of AutoLabelMatch ready for session storage
 */
import type { LabelConfig, AutoLabelRule } from '../types.ts';
import type { AutoLabelMatch } from './types.ts';
/**
 * Recursively collect all labels that have autoRules defined.
 * Walks the entire label tree depth-first.
 */
export declare function collectAutoLabelRules(labels: LabelConfig[]): Array<{
    label: LabelConfig;
    rule: AutoLabelRule;
}>;
/**
 * Evaluate all auto-label rules against a user message.
 * Returns deduplicated matches with normalized values, capped at MAX_MATCHES_PER_MESSAGE.
 *
 * @param message - The user's message text to scan
 * @param labels - The workspace label tree (from config)
 */
export declare function evaluateAutoLabels(message: string, labels: LabelConfig[]): AutoLabelMatch[];
