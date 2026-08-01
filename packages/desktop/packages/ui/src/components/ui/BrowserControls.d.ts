import { type ReactNode } from 'react';
export interface BrowserControlsProps {
    /** Current URL displayed in the address bar */
    url?: string;
    /** Whether page is loading (toggles Stop/Reload, shows progress) */
    loading?: boolean;
    /** Enable back button */
    canGoBack?: boolean;
    /** Enable forward button */
    canGoForward?: boolean;
    /** Called when user submits a URL */
    onNavigate?: (url: string) => void;
    /** Back button click */
    onGoBack?: () => void;
    /** Forward button click */
    onGoForward?: () => void;
    /** Reload button click */
    onReload?: () => void;
    /** Stop button click */
    onStop?: () => void;
    /** Controlled URL input change */
    onUrlChange?: (url: string) => void;
    /** Compact layout variant */
    compact?: boolean;
    /** Content rendered before navigation buttons */
    leadingContent?: ReactNode;
    /** Content rendered after URL bar (e.g. label) */
    trailingContent?: ReactNode;
    /** Show animated loading progress bar (default true) */
    showProgressBar?: boolean;
    /** Additional CSS classes on the URL bar group (reload + form) */
    urlBarClassName?: string;
    /**
     * Minimum left clearance in px. When set, enables window-center mode:
     * back/forward are absolutely positioned and the reload + URL bar
     * centers in the full component width via CSS max(), falling back
     * to this clearance when the component is narrow.
     */
    leftClearance?: number;
    /**
     * Website theme color (from `<meta name="theme-color">`).
     * When set, tints the toolbar background like Safari/Chrome.
     * Text and icons automatically adjust for contrast.
     */
    themeColor?: string | null;
    /** Additional CSS classes on the root element */
    className?: string;
}
export declare function BrowserControls({ url: controlledUrl, loading, canGoBack, canGoForward, onNavigate, onGoBack, onGoForward, onReload, onStop, onUrlChange, compact, leadingContent, trailingContent, showProgressBar, urlBarClassName, leftClearance, themeColor, className, }: BrowserControlsProps): import("react").JSX.Element;
