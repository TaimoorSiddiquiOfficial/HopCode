import * as React from 'react';
import { type PermissionMode } from '@craft-agent/shared/agent/modes';
import type { BackgroundTask } from './ActiveTasksBar';
import type { LabelConfig } from '@craft-agent/shared/labels';
import type { SessionStatus } from '@/config/session-status-config';
export interface ActiveOptionBadgesProps {
    /** Current permission mode */
    permissionMode?: PermissionMode;
    /** Callback when permission mode changes */
    onPermissionModeChange?: (mode: PermissionMode) => void;
    /** Background tasks to display */
    tasks?: BackgroundTask[];
    /** Session ID for opening preview windows */
    sessionId?: string;
    /** Absolute path to the session folder (for Files header actions) */
    sessionFolderPath?: string;
    /** Callback when kill button is clicked on a task */
    onKillTask?: (taskId: string) => void;
    /** Callback to insert message into input field */
    onInsertMessage?: (text: string) => void;
    /** Label entries applied to this session (e.g., ["bug", "priority::3"]) */
    sessionLabels?: string[];
    /** Available label configs (tree structure) for resolving label display */
    labels?: LabelConfig[];
    /** Callback when a label is removed (legacy — prefer onLabelsChange) */
    onRemoveLabel?: (labelId: string) => void;
    /** Callback when session labels array changes (value edits or removals) */
    onLabelsChange?: (updatedLabels: string[]) => void;
    /** Label ID whose value popover should auto-open (set when a valued label is added via # menu) */
    autoOpenLabelId?: string | null;
    /** Called after the auto-open has been consumed, so the parent can clear the signal */
    onAutoOpenConsumed?: () => void;
    /** Available workflow states */
    sessionStatuses?: SessionStatus[];
    /** Current session state ID */
    currentSessionStatus?: string;
    /** Callback when state changes */
    onSessionStatusChange?: (stateId: string) => void;
    /** Additional CSS classes */
    className?: string;
}
export declare function ActiveOptionBadges({ permissionMode, onPermissionModeChange, tasks, sessionId, sessionFolderPath, onKillTask, onInsertMessage, sessionLabels, labels, onRemoveLabel, onLabelsChange, autoOpenLabelId, onAutoOpenConsumed, sessionStatuses, currentSessionStatus, onSessionStatusChange, className, }: ActiveOptionBadgesProps): React.JSX.Element | null;
