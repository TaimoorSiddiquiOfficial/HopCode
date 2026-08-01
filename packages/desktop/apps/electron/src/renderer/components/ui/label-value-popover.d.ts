/**
 * LabelValuePopover - Popover for editing a label's typed value or removing it.
 *
 * Opens when clicking a LabelBadge. Shows:
 * - Value editor input adapted to the label's valueType (number/string/date)
 * - "Remove" button to detach the label from the session
 *
 * Value changes are committed on Enter or blur; Escape cancels and closes.
 * Boolean labels (no valueType) show only the remove button.
 */
import * as React from 'react';
import type { LabelConfig } from '@craft-agent/shared/labels';
export interface LabelValuePopoverProps {
    /** Label configuration (color, name, valueType) */
    label: LabelConfig;
    /** Current raw value string */
    value?: string;
    /** Called when user commits a new value (Enter or blur) */
    onValueChange?: (newValue: string | undefined) => void;
    /** Called when user clicks "Remove" */
    onRemove?: () => void;
    /** Controlled open state */
    open: boolean;
    /** Open state change handler */
    onOpenChange: (open: boolean) => void;
    /** Session identifier for scoped focus restoration */
    sessionId?: string;
    /** The trigger element (typically a LabelBadge) */
    children: React.ReactNode;
}
export declare function LabelValuePopover({ label, value, onValueChange, onRemove, open, onOpenChange, sessionId, children, }: LabelValuePopoverProps): React.JSX.Element;
