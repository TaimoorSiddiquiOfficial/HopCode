/**
 * PowerShell Command Validator
 *
 * Uses PowerShell's native System.Management.Automation.Language.Parser to create
 * a proper AST and validate commands in Plan mode. This mirrors the approach
 * used by bash-validator.ts but for PowerShell syntax.
 *
 * AST Node Types (from PowerShell):
 * - ScriptBlockAst: Root node
 * - PipelineAst: Pipeline of commands
 * - CommandAst: Simple command with elements
 * - CommandExpressionAst: Expression used as command
 * - SubExpressionAst: $(...) substitution
 * - ScriptBlockExpressionAst: { ... } script blocks
 */
import type { CompiledBashPattern } from './mode-types.ts';
/**
 * Register the directory containing the PowerShell parser script.
 * Call this once at app startup: setPowerShellValidatorRoot(join(__dirname, 'resources'))
 *
 * After this, the validator will look for powershell-parser.ps1 in this directory.
 */
export declare function setPowerShellValidatorRoot(dir: string): void;
/**
 * Result of validating a PowerShell command AST.
 */
export interface PowerShellValidationResult {
    allowed: boolean;
    /** Primary reason for rejection (if not allowed) */
    reason?: PowerShellValidationReason;
    /** Individual results for compound commands */
    subcommandResults?: SubcommandResult[];
}
export interface SubcommandResult {
    command: string;
    allowed: boolean;
    reason?: string;
}
export type PowerShellValidationReason = {
    type: 'pipeline';
    explanation: string;
} | {
    type: 'redirect';
    target: string;
    explanation: string;
} | {
    type: 'subexpression';
    explanation: string;
} | {
    type: 'script_block';
    explanation: string;
} | {
    type: 'invoke_expression';
    explanation: string;
} | {
    type: 'dot_sourcing';
    explanation: string;
} | {
    type: 'unsafe_command';
    command: string;
    explanation: string;
} | {
    type: 'parse_error';
    error: string;
} | {
    type: 'background_execution';
    explanation: string;
} | {
    type: 'assignment';
    explanation: string;
} | {
    type: 'powershell_unavailable';
    explanation: string;
};
/**
 * Check if PowerShell (pwsh) is available on this system.
 * Uses synchronous check for compatibility with existing validation flow.
 */
export declare function isPowerShellAvailable(): boolean;
/**
 * Validate a PowerShell command using AST analysis.
 *
 * @param command - The PowerShell command string to validate
 * @param patterns - Compiled regex patterns for allowed commands
 * @returns Validation result with detailed reason if rejected
 */
export declare function validatePowerShellCommand(command: string, patterns: CompiledBashPattern[]): PowerShellValidationResult;
/**
 * Synchronous check if command looks like PowerShell syntax.
 * Used to determine whether to use PowerShell or bash validation.
 */
export declare function looksLikePowerShell(command: string): boolean;
/**
 * Detect and unwrap `powershell.exe -Command "..."` wrapper, returning the inner command.
 *
 * Codex on Windows often wraps PowerShell commands in:
 *   "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -Command "Set-Content -Path \"...\" ..."
 *   powershell.exe -NoProfile -Command "..."
 *   pwsh -Command "..."
 *
 * The PS AST parser sees `powershell.exe` as the top-level command (not the inner cmdlet),
 * so extractPowerShellWriteTarget() fails. This function strips the wrapper and returns
 * the inner command with escaped quotes unescaped, so it can be re-parsed.
 */
export declare function unwrapPowerShellCommand(command: string): string | null;
/**
 * Extract file path from PowerShell write commands using AST analysis.
 * Used to check if a write command targets the plans folder.
 *
 * @param command - The PowerShell command string
 * @returns The file path if a write cmdlet is detected, null otherwise
 */
export declare function extractPowerShellWriteTarget(command: string): string | null;
/**
 * Extract file path from PowerShell read commands using AST analysis.
 * Used to detect file reads (Get-Content, gc, type) for prerequisite tracking.
 *
 * Handles complex cases like:
 * - Get-Content -Path "file.txt" -Encoding UTF8
 * - gc file.txt | Select-String "pattern"
 * - powershell.exe -Command "Get-Content file.txt"
 *
 * @param command - The PowerShell command string
 * @returns The file path if a read cmdlet is detected, null otherwise
 */
export declare function extractPowerShellReadTarget(command: string): string | null;
