/**
 * Auto-Label Rule Validation
 *
 * Validates auto-label rule patterns at config-save time to catch
 * invalid regex syntax and catastrophic backtracking patterns early.
 *
 * Called from the label config validator (validators.ts) when labels/config.json
 * is being written.
 */
export interface AutoLabelValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Validate a single auto-label rule.
 * Checks regex syntax, flags, and known problematic patterns.
 *
 * @param pattern - The regex pattern string
 * @param flags - Optional flags (defaults to 'gi')
 * @returns Validation result with errors/warnings
 */
export declare function validateAutoLabelRule(pattern: string, flags?: string): AutoLabelValidationResult;
