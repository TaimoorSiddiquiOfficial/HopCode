/**
 * TerminalOutput - Terminal-style display for command output
 *
 * Platform-agnostic component for displaying terminal output with:
 * - ANSI color code support
 * - Grep output line number highlighting
 * - Light/dark theme support
 * - Copy functionality
 */
import * as React from 'react';
export type ToolType = 'bash' | 'grep' | 'glob';
export interface TerminalOutputProps {
    /** The command that was executed */
    command: string;
    /** The output from the command */
    output: string;
    /** Exit code (0 = success) */
    exitCode?: number;
    /** Tool type for display styling */
    toolType?: ToolType;
    /** Optional description of what the command does */
    description?: string;
    /** Theme mode */
    theme?: 'light' | 'dark';
    /** Additional class names */
    className?: string;
}
/**
 * TerminalOutput - Display terminal command and output with ANSI colors
 */
export declare function TerminalOutput({ command, output, exitCode, toolType, description, theme, className, }: TerminalOutputProps): React.JSX.Element;
