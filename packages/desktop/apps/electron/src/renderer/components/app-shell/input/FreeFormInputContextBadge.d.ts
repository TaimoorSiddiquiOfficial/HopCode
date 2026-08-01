import * as React from 'react';
export interface FreeFormInputContextBadgeProps {
    /** Left area - fully customizable (icon, avatar stack, etc.) */
    icon: React.ReactNode;
    /** Label text - shown in expanded state or collapsed with selection */
    label: string;
    /** Accessible label for the full badge when visible metadata is appended */
    ariaLabel?: string;
    /** Optional trailing metadata shown after the label */
    trailingContent?: React.ReactNode;
    /** Whether to show expanded state (icon + label + chevron) vs collapsed */
    isExpanded?: boolean;
    /** Whether there's an active selection (affects collapsed state styling and shows label) */
    hasSelection?: boolean;
    /** Show chevron indicator (for dropdowns) - only visible in expanded state */
    showChevron?: boolean;
    /** Click handler */
    onClick?: () => void;
    /** Tooltip content - can be string or ReactNode for rich content */
    tooltip?: React.ReactNode;
    /** Whether the badge is currently "open" (e.g., dropdown is shown) */
    isOpen?: boolean;
    /** Whether the badge is disabled */
    disabled?: boolean;
    /** Additional className for the button */
    className?: string;
    /** Ref forwarding for positioning dropdowns */
    buttonRef?: React.RefObject<HTMLButtonElement>;
    /** Data attribute for tutorials */
    'data-tutorial'?: string;
}
/**
 * FreeFormInputContextBadge - Unified context badge for Sources, Files, and Folder selectors
 *
 * Visual States:
 * - Expanded: Icon + Label + Chevron, no background, hover shows background
 * - Collapsed (no selection): Icon only, no background, hover shows background
 * - Collapsed (has selection): Icon + Label (fading), bg-background + shadow-minimal
 * - Open: bg-foreground/5 (like hover)
 */
export declare const FreeFormInputContextBadge: React.ForwardRefExoticComponent<FreeFormInputContextBadgeProps & React.RefAttributes<HTMLButtonElement>>;
