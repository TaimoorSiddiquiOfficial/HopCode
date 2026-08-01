/**
 * FullscreenOverlayBase - Base component for all fullscreen overlays
 *
 * Uses Radix Dialog primitives for proper:
 * - Focus management (blur on open, restore on close)
 * - ESC key handling
 * - Coordination with other Radix components (popovers, dropdowns)
 * - Accessibility (role="dialog", aria-modal)
 *
 * Additionally handles:
 * - macOS traffic light hiding (via PlatformContext)
 * - Default scenic background (bg-foreground-3 + fullscreen-overlay-background blur)
 *   Callers can override via className (twMerge resolves conflicts)
 * - Optional structured header with badges (typeBadge, filePath, title, subtitle)
 * - Optional built-in copy button (copyContent prop)
 * - Full-viewport scroll container with edge-to-edge gradient fade mask (iOS-style contentInset).
 *   The scroll area covers the entire viewport — content scrolls behind the floating header.
 *   A CSS mask gradient fades content at both edges (top and bottom, starting from y=0).
 *   The header floats on top and covers content behind it.
 *   Content padding clears the header at rest so nothing is clipped initially.
 *
 * Layout:
 *   Dialog.Content (fixed inset-0, relative)
 *   ├── Masked area (absolute inset-0, CSS mask gradient)
 *   │   └── Scroll container (h-full, overflow-y-auto, paddingTop = header + fade)
 *   │       └── {error banner}
 *   │       └── {children}
 *   └── Header (absolute top-0, z-10, floating on top of scroll content)
 *
 * Used by: PreviewOverlay, DocumentFormattedMarkdownOverlay, WorkspaceCreationScreen
 */
import { type ReactNode } from 'react';
import { type OverlayTypeBadge } from './FullscreenOverlayBaseHeader';
import { type OverlayErrorBannerProps } from './OverlayErrorBanner';
export interface FullscreenOverlayBaseProps {
    /** Whether the overlay is visible */
    isOpen: boolean;
    /** Callback when the overlay should close (ESC key triggers this) */
    onClose: () => void;
    /** Content to render inside the overlay */
    children: ReactNode;
    /** Additional CSS classes for the container */
    className?: string;
    /** Accessible title for the overlay (visually hidden) */
    accessibleTitle?: string;
    /** Type badge — tool/format indicator (e.g. "Read", "Image", "Bash") */
    typeBadge?: OverlayTypeBadge;
    /** File path — shows dual-trigger menu badge with "Open" + "Reveal in {file manager}" */
    filePath?: string;
    /** Title — displayed as a badge when no filePath */
    title?: string;
    /** Click handler for the title badge */
    onTitleClick?: () => void;
    /** Subtitle — extra info badge (e.g. "Lines 1-50 of 200") */
    subtitle?: string;
    /** Right-side header actions (e.g. diff controls) */
    headerActions?: ReactNode;
    /** When provided, renders a built-in copy button in the header right actions area */
    copyContent?: string;
    /** Optional error banner — rendered between header and children */
    error?: OverlayErrorBannerProps;
    /**
     * Docked / embedded mode — render inline filling the parent container instead of
     * taking over the viewport via a modal Dialog portal. Used to show the preview in a
     * resizable side panel while the main UI stays visible and interactive.
     *
     * In this mode the component does NOT register a dismissible layer, does NOT hide the
     * macOS traffic lights, and does NOT trap focus. Closing is driven entirely by the
     * header close button (onClose).
     */
    embedded?: boolean;
}
export declare function handleFullscreenEscapeWithStack(): boolean;
export declare function FullscreenOverlayBase({ isOpen, onClose, children, className, accessibleTitle, typeBadge, filePath, title, onTitleClick, subtitle, headerActions, copyContent, error, embedded, }: FullscreenOverlayBaseProps): import("react").JSX.Element | null;
