import * as React from 'react';
export interface SimpleDropdownItemProps {
    /** Click handler */
    onClick: (e?: React.MouseEvent) => void;
    /** Item content */
    children: React.ReactNode;
    /** Optional icon (rendered before label) */
    icon?: React.ReactNode;
    /** Destructive variant - red text */
    variant?: 'default' | 'destructive';
    /** Additional className */
    className?: string;
    /** Optional ref callback to access the underlying button */
    buttonRef?: (el: HTMLButtonElement | null) => void;
    /** Optional hover callback */
    onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export declare function SimpleDropdownItem({ onClick, children, icon, variant, className, buttonRef, onMouseEnter, }: SimpleDropdownItemProps): React.JSX.Element;
export interface SimpleDropdownProps {
    /** Trigger element */
    trigger: React.ReactNode;
    /** Menu items */
    children: React.ReactNode;
    /** Alignment relative to trigger */
    align?: 'start' | 'end';
    /** Additional className for the menu */
    className?: string;
    /** Whether the dropdown is disabled */
    disabled?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Enable built-in ArrowUp/ArrowDown/Enter keyboard navigation (default: true) */
    keyboardNavigation?: boolean;
}
export declare function SimpleDropdown({ trigger, children, align, className, disabled, onOpenChange, keyboardNavigation, }: SimpleDropdownProps): React.JSX.Element;
