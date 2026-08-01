import * as React from "react";
interface TopBarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** The icon or content to display inside the button */
    children: React.ReactNode;
    /** Whether the button is in an active/pressed state (e.g., dropdown open) */
    isActive?: boolean;
    /** Additional class names */
    className?: string;
}
/**
 * TopBarButton - Consistent button style for the app's top bar
 *
 * Fixed size 28x28px with centered content, rounded corners, and hover effects.
 * Used for: Craft logo, back/forward navigation, sidebar toggle, etc.
 */
export declare const TopBarButton: React.ForwardRefExoticComponent<TopBarButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
