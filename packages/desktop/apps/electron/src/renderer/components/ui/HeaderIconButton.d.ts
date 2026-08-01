/**
 * HeaderIconButton
 *
 * Unified icon button for panel headers (Navigator and Detail panels).
 * Provides consistent styling for all header action buttons.
 */
import * as React from 'react';
interface HeaderIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Icon as React element - caller controls size/styling */
    icon: React.ReactNode;
    /** Optional tooltip text */
    tooltip?: string;
}
export declare const HeaderIconButton: React.ForwardRefExoticComponent<HeaderIconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
