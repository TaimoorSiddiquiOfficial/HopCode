import * as React from 'react';
import type { BackgroundTask } from './ActiveTasksBar';
/** Terminal data for overlay display */
export interface TerminalOverlayData {
    command: string;
    output: string;
    description?: string;
    toolType: 'bash' | 'grep' | 'glob';
}
export interface TaskActionMenuProps {
    /** Background task data */
    task: BackgroundTask;
    /** Session ID for opening preview windows */
    sessionId: string;
    /** Callback when kill button is clicked */
    onKillTask: (taskId: string) => void;
    /** Callback to insert message into input field */
    onInsertMessage?: (text: string) => void;
    /** Callback to show terminal output overlay */
    onShowTerminalOverlay?: (data: TerminalOverlayData) => void;
    /** Additional class name */
    className?: string;
}
/**
 * TaskActionMenu - Dropdown menu for background task actions
 *
 * Provides contextual actions for background tasks:
 * - View Output: Opens task output in terminal overlay
 * - Stop Task: Kills shell tasks (agent tasks show warning)
 */
export declare function TaskActionMenu({ task, sessionId, onKillTask, onInsertMessage, onShowTerminalOverlay, className }: TaskActionMenuProps): React.JSX.Element;
