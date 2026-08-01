import * as React from 'react';
/**
 * AcceptPlanDropdown - Dropdown for accepting plans with or without compaction
 *
 * Provides two options:
 * 1. Accept - Execute the plan immediately
 * 2. Accept & Compact - Summarize conversation first, then execute
 *
 * The compact option is useful when context is running low after a long planning session.
 */
interface AcceptPlanDropdownProps {
    /** Callback when user selects "Accept" (execute immediately) */
    onAccept: () => void;
    /** Callback when user selects "Accept & Compact" (compact first, then execute) */
    onAcceptWithCompact: () => void;
    /** Trigger label */
    acceptLabel?: string;
    /** Primary dropdown option label */
    acceptOptionLabel?: string;
    /** Additional className for the trigger button */
    className?: string;
}
export declare function AcceptPlanDropdown({ onAccept, onAcceptWithCompact, acceptLabel, acceptOptionLabel, className, }: AcceptPlanDropdownProps): React.JSX.Element;
export {};
