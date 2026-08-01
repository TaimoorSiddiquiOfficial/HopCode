/**
 * Automation System Validation
 *
 * Validators for automations.json configuration files.
 * Used by PreToolUse automations and workspace validators.
 */
import type { ValidationResult } from '../config/validators.ts';
import type { AutomationsValidationResult } from './types.ts';
/**
 * Validate automations config (internal - returns parsed config)
 */
export declare function validateAutomationsConfig(content: unknown): AutomationsValidationResult;
/**
 * Validate automations config from a JSON string (no disk reads).
 * Used by PreToolUse automation to validate before writing to disk.
 * Follows the same pattern as other config validators in validators.ts.
 */
export declare function validateAutomationsContent(jsonString: string, fileName?: string): ValidationResult;
/**
 * Validate automations.json from workspace path (reads from disk).
 * Follows the same pattern as other validators in validators.ts.
 */
export declare function validateAutomations(workspaceRoot: string): ValidationResult;
