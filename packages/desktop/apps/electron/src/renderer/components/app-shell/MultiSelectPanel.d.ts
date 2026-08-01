/**
 * MultiSelectPanel - Panel shown when multiple items are selected.
 *
 * Displays the selection count and optional batch action buttons.
 * Used for sessions (with status/label/archive actions), sources, and skills.
 */
import * as React from 'react';
import type { SessionStatusId, SessionStatus } from '@/config/session-status-config';
import type { LabelConfig } from '@craft-agent/shared/labels';
type MultiSelectEntityType = 'automation' | 'session' | 'skill' | 'source';
export interface MultiSelectPanelProps {
    /** Number of selected items */
    count: number;
    /** Entity type used to resolve localized selection copy (default: "session") */
    entityType?: MultiSelectEntityType;
    /** Available todo states */
    sessionStatuses?: SessionStatus[];
    /** Active status if all selected share the same state */
    activeStatusId?: SessionStatusId | null;
    /** Callback when setting status for all selected */
    onSetStatus?: (status: SessionStatusId) => void;
    /** Available label configs (tree) */
    labels?: LabelConfig[];
    /** Labels applied to all selected sessions */
    appliedLabelIds?: Set<string>;
    /** Callback when toggling a label for all selected */
    onToggleLabel?: (labelId: string) => void;
    /** Callback when archiving all selected */
    onArchive?: () => void;
    /** Callback when sending selected to another workspace */
    onSendToWorkspace?: () => void;
    /** Callback when clearing the selection */
    onClearSelection?: () => void;
    /** Optional className for the container */
    className?: string;
}
export declare function MultiSelectPanel({ count, entityType, sessionStatuses, activeStatusId, onSetStatus, labels, appliedLabelIds, onToggleLabel, onArchive, onSendToWorkspace, onClearSelection, className, }: MultiSelectPanelProps): React.JSX.Element;
export {};
