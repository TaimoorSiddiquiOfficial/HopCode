/**
 * Basic file-name validation for Git Bash executable paths.
 * Accepts Windows-style and POSIX-style separators to support cross-platform tests.
 */
export declare function isGitBashExecutablePath(filePath: string): boolean;
/**
 * Validate a user-provided Git Bash executable path.
 * Enforces bash.exe filename and existence on disk.
 */
export declare function validateGitBashPath(filePath: string): Promise<{
    valid: true;
    path: string;
} | {
    valid: false;
    error: string;
}>;
/**
 * Check if a Git Bash path is usable without returning UI-facing errors.
 */
export declare function isUsableGitBashPath(filePath: string): Promise<boolean>;
