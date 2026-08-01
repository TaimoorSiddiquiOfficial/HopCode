/**
 * Bash Command Validator
 *
 * Uses bash-parser to create a proper AST and validate commands in Plan mode.
 * This enables compound commands like `git status && git log` to be allowed
 * when all parts are safe, while still blocking dangerous constructs.
 *
 * AST Node Types:
 * - Command: Simple command with name and args
 * - LogicalExpression: && (and) or || (or) chains
 * - Pipeline: Piped commands (|)
 * - Subshell: Commands in parentheses (...)
 * - Redirect: File redirections (>, >>, <)
 * - CommandExpansion: $(...) substitution
 */
import type { CompiledBashPattern } from './mode-types.ts';
/**
 * Result of validating a bash command AST.
 * Tracks which subcommands passed/failed for detailed error messages.
 */
export interface BashValidationResult {
    allowed: boolean;
    /** Primary reason for rejection (if not allowed) */
    reason?: BashValidationReason;
    /** Individual results for compound commands */
    subcommandResults?: SubcommandResult[];
}
export interface SubcommandResult {
    /** The command text that was validated */
    command: string;
    allowed: boolean;
    reason?: string;
}
/**
 * Detailed reason why validation failed.
 * Used to generate helpful error messages.
 */
export type BashValidationReason = {
    type: 'pipeline';
    explanation: string;
} | {
    type: 'redirect';
    op: string;
    explanation: string;
} | {
    type: 'command_expansion';
    explanation: string;
} | {
    type: 'process_substitution';
    explanation: string;
} | {
    type: 'parameter_expansion';
    explanation: string;
} | {
    type: 'env_assignment';
    explanation: string;
} | {
    type: 'unsafe_command';
    command: string;
    explanation: string;
} | {
    type: 'parse_error';
    error: string;
} | {
    type: 'compound_partial_fail';
    failedCommands: string[];
    passedCommands: string[];
} | {
    type: 'background_execution';
    explanation: string;
};
/**
 * Validate a bash command using AST analysis.
 *
 * @param command - The bash command string to validate
 * @param patterns - Compiled regex patterns for allowed commands
 * @returns Validation result with detailed reason if rejected
 */
export declare function validateBashCommand(command: string, patterns: CompiledBashPattern[]): BashValidationResult;
/**
 * Check if the command string contains dangerous control characters.
 *
 * Note: Newlines and carriage returns are NOT blocked here because bash-parser
 * correctly parses them as command separators, and the AST validation will
 * check each command individually. Only null bytes are blocked as they could
 * cause issues at lower levels (C bindings, string handling).
 */
export declare function hasControlCharacters(command: string): {
    char: string;
    explanation: string;
} | null;
