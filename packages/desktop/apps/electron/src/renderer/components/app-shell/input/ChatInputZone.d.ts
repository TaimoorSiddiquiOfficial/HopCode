import * as React from 'react';
import { type LabelConfig } from '@craft-agent/shared/labels';
import type { PermissionMode } from '@craft-agent/shared/agent/modes';
import type { SessionStatus } from '@/config/session-status-config';
import type { BackgroundTask } from '../ActiveTasksBar';
import { InputContainer } from './InputContainer';
interface ChatInputZoneProps {
    compactMode?: boolean;
    showOptionBadges?: boolean;
    permissionMode?: PermissionMode;
    onPermissionModeChange?: (mode: PermissionMode) => void;
    tasks?: BackgroundTask[];
    sessionId: string;
    sessionFolderPath?: string;
    onKillTask?: (taskId: string) => void;
    onInsertMessage?: (text: string) => void;
    sessionLabels?: string[];
    labels?: LabelConfig[];
    onLabelsChange?: (labels: string[]) => void;
    sessionStatuses?: SessionStatus[];
    currentSessionStatus?: string;
    onSessionStatusChange?: (stateId: string) => void;
    className?: string;
    inputProps: React.ComponentProps<typeof InputContainer>;
}
export declare function ChatInputZone({ compactMode, showOptionBadges, permissionMode, onPermissionModeChange, tasks, sessionId, sessionFolderPath, onKillTask, onInsertMessage, sessionLabels, labels, onLabelsChange, sessionStatuses, currentSessionStatus, onSessionStatusChange, className, inputProps, }: ChatInputZoneProps): React.JSX.Element;
export {};
