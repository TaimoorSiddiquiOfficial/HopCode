/**
 * Read Pattern Detection for Shell Commands
 *
 * Uses bash-parser to properly parse shell commands and detect file-reading
 * operations (sed, cat, head, tail). This handles shell wrappers, quoting,
 * and escaping correctly.
 *
 * Used by event adapters to emit these as "Read" tool events for better UI display.
 */
export interface ReadCommandInfo {
    /** Path to the file being read */
    filePath: string;
    /** Starting line number (1-indexed) */
    startLine?: number;
    /** Ending line number (1-indexed, inclusive) */
    endLine?: number;
    /** Original shell command for display in overlay */
    originalCommand: string;
}
/**
 * Parse a shell command to detect if it's a file read operation.
 *
 * Supported patterns:
 * - cat file.ts
 * - sed -n '1,260p' file.ts
 * - head -n 50 file.ts
 * - tail -n 50 file.ts
 * - Shell wrappers: /bin/zsh -lc 'cat file.ts'
 *
 * @returns ReadCommandInfo if detected as a read, null otherwise
 */
export declare function parseReadCommand(command: string): ReadCommandInfo | null;
