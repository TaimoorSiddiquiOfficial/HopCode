/**
 * PreviewOverlay - Base component for all preview overlays
 *
 * Provides unified presentation logic for modal/fullscreen overlays:
 * - Portal rendering to document.body (via FullscreenOverlayBase for fullscreen mode)
 * - Responsive modal (>=1200px) vs fullscreen (<1200px) modes
 * - Escape key to close
 * - Backdrop click to close (modal mode)
 * - Consistent header layout with badges, close button
 * - Optional error banner
 *
 * Header is delegated to FullscreenOverlayBase in fullscreen mode (which renders
 * FullscreenOverlayBaseHeader). In modal/embedded mode, renders the header directly.
 *
 * Used by: CodePreviewOverlay, TerminalPreviewOverlay, GenericOverlay, etc.
 */
import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import type { PreviewBadgeVariant } from '../ui/PreviewHeader';
/** Badge color variants - re-export for backwards compatibility */
export type BadgeVariant = PreviewBadgeVariant;
export interface PreviewOverlayProps {
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close */
    onClose: () => void;
    /** Theme mode */
    theme?: 'light' | 'dark';
    /** Type badge configuration — tool/format indicator */
    typeBadge: {
        icon: LucideIcon;
        label: string;
        variant: BadgeVariant;
    };
    /** File path — shows dual-trigger menu badge with "Open" + "Reveal in {file manager}" */
    filePath?: string;
    /** Title — displayed as badge. Fallback when no file path. */
    title?: string;
    /** Callback when title badge is clicked (only used when no filePath) */
    onTitleClick?: () => void;
    /** Optional subtitle (e.g., line range info) */
    subtitle?: string;
    /** Optional error state */
    error?: {
        label: string;
        message: string;
    };
    /** Actions to show in header right side */
    headerActions?: ReactNode;
    /** Main content */
    children: ReactNode;
    /** Render inline (no dialog/portal) — for embedding in design system playground */
    embedded?: boolean;
    /** Custom class names for the overlay container (e.g., to override bg-background) */
    className?: string;
}
export declare function PreviewOverlay({ isOpen, onClose, theme, typeBadge, filePath, title, onTitleClick, subtitle, error, headerActions, children, embedded, className, }: PreviewOverlayProps): import("react").JSX.Element | null;
