import * as React from 'react';
import { type SessionStatusId, type SessionStatus, getStateIcon, getStateColor } from '@/config/session-status-config';
export { type SessionStatusId, type SessionStatus, getStateIcon, getStateColor };
export interface SessionStatusMenuProps {
    states?: SessionStatus[];
    activeState: SessionStatusId;
    onSelect: (stateId: SessionStatusId) => void;
    /** Whether the session is currently archived */
    isArchived?: boolean;
    /** Archive action - shows Archive item at bottom when provided and not archived */
    onArchive?: () => void;
    /** Unarchive action - shows Unarchive item at bottom when provided and archived */
    onUnarchive?: () => void;
    className?: string;
}
export declare function SessionStatusMenu({ states, activeState, onSelect, isArchived, onArchive, onUnarchive, className, }: SessionStatusMenuProps): React.JSX.Element;
