import * as React from 'react';
export interface TurnCardActionsMenuProps {
    /** Callback to open turn details in a new window */
    onOpenDetails?: () => void;
    /** Callback to open all edits/writes in multi-file diff view */
    onOpenMultiFileDiff?: () => void;
    /** Whether this turn has any Edit or Write activities */
    hasEditOrWriteActivities?: boolean;
    /** Additional className for the trigger button */
    className?: string;
}
/**
 * TurnCardActionsMenu - Dropdown menu for TurnCard header actions
 *
 * Shows:
 * - "View file changes" when turn has Edit/Write activities
 * - "View turn details" always
 */
export declare function TurnCardActionsMenu({ onOpenDetails, onOpenMultiFileDiff, hasEditOrWriteActivities, className, }: TurnCardActionsMenuProps): React.JSX.Element | null;
