/**
 * TerminalPreviewOverlay - Overlay for terminal output (Bash/Grep/Glob tools)
 *
 * Uses PreviewOverlay for presentation and TerminalOutput for display.
 */
import * as React from 'react';
import { type ToolType } from '../terminal/TerminalOutput';
export interface TerminalPreviewOverlayProps {
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close */
    onClose: () => void;
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
    /** Error message if the command failed to execute */
    error?: string;
    /** Render inline without dialog (for playground) */
    embedded?: boolean;
}
export declare function TerminalPreviewOverlay({ isOpen, onClose, command, output, exitCode, toolType, description, theme, error, embedded, }: TerminalPreviewOverlayProps): React.JSX.Element;
