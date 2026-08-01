/**
 * CopyButton - Reusable copy-to-clipboard button with feedback
 *
 * Shows "Copy" initially, then "Copied!" with checkmark for 2 seconds after copying.
 * Used in overlay headers for copying content.
 */
import * as React from 'react';
export interface CopyButtonProps {
    /** Content to copy to clipboard */
    content: string;
    /** Optional label (default: "Copy") */
    label?: string;
    /** Optional tooltip for the button */
    title?: string;
    /** Optional className override */
    className?: string;
}
export declare function CopyButton({ content, title, className }: CopyButtonProps): React.JSX.Element;
