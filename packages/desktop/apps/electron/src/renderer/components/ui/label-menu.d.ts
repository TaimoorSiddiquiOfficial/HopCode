import * as React from 'react';
import type { LabelConfig } from '@craft-agent/shared/labels';
import { type LabelMenuItem } from './label-menu-utils';
import { type SessionStatus } from '@/config/session-status-config';
export { createLabelMenuItems, filterItems, filterSessionStatuses, type LabelMenuItem } from './label-menu-utils';
export interface InlineLabelMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: LabelMenuItem[];
    onSelect: (labelId: string) => void;
    /** Called when user picks "Add New Label" (receives the current filter text as prefill) */
    onAddLabel?: (prefill: string) => void;
    filter?: string;
    position: {
        x: number;
        y: number;
    };
    className?: string;
    /** Available workflow states to show in the menu */
    states?: SessionStatus[];
    /** Currently active state ID (shows checkmark) */
    activeStateId?: string;
    /** Callback when a state is selected */
    onSelectState?: (stateId: string) => void;
}
/**
 * Inline autocomplete menu for labels and states, triggered by # in the input.
 * When states are provided, shows a "States" section above the labels section.
 * Appears above the cursor position and allows keyboard navigation across both sections.
 */
export declare function InlineLabelMenu({ open, onOpenChange, items, onSelect, onAddLabel, filter, position, className, states, activeStateId, onSelectState, }: InlineLabelMenuProps): React.JSX.Element | null;
/** Interface for elements compatible with this hook */
export interface LabelMenuInputElement {
    getBoundingClientRect: () => DOMRect;
    getCaretRect?: () => DOMRect | null;
    value: string;
    selectionStart: number;
}
export interface UseInlineLabelMenuOptions {
    /** Ref to the input element */
    inputRef: React.RefObject<LabelMenuInputElement | null>;
    /** Available labels (tree structure) */
    labels: LabelConfig[];
    /** Already-applied labels on the session (to exclude from menu) */
    sessionLabels?: string[];
    /** Callback when a label is selected */
    onSelect: (labelId: string) => void;
    /** Available workflow states */
    sessionStatuses?: SessionStatus[];
    /** Currently active state ID */
    activeStateId?: string;
}
export interface UseInlineLabelMenuReturn {
    isOpen: boolean;
    filter: string;
    position: {
        x: number;
        y: number;
    };
    items: LabelMenuItem[];
    /** Workflow states passed through for the menu component */
    states: SessionStatus[];
    /** Currently active state ID */
    activeStateId?: string;
    handleInputChange: (value: string, cursorPosition: number) => void;
    close: () => void;
    /** Returns the cleaned input text after removing the #trigger text */
    handleSelect: (labelId: string) => string;
}
/**
 * Hook that manages inline label/state menu state.
 * Detects # trigger in input text and shows a filterable menu of available labels and states.
 * Already-applied labels are excluded from the menu to prevent duplicates.
 */
export declare function useInlineLabelMenu({ inputRef, labels, sessionLabels, onSelect, sessionStatuses, activeStateId, }: UseInlineLabelMenuOptions): UseInlineLabelMenuReturn;
