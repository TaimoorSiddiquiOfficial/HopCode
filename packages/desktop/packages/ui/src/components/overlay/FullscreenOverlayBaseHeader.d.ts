/**
 * FullscreenOverlayBaseHeader - Header component for fullscreen overlays
 *
 * Builds a badge row from structured props (typeBadge, filePath, title, subtitle).
 * The file path badge has a dual-trigger menu:
 * - Left-click → Radix DropdownMenu with "Open" / "Reveal in {file manager}"
 * - Right-click → Radix ContextMenu with the same items
 *
 * Both menus share one internal items array, just wrapped differently.
 * onOpenFileExternal and onRevealInFinder come from PlatformContext — no per-overlay callbacks.
 */
import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { type PreviewBadgeVariant } from '../ui/PreviewHeader';
/** Structured type badge — tool/format indicator (e.g. "Read", "Image", "Bash") */
export interface OverlayTypeBadge {
    icon: LucideIcon;
    label: string;
    variant?: PreviewBadgeVariant;
}
export interface FullscreenOverlayBaseHeaderProps {
    /** Close handler — shows X button in header */
    onClose: () => void;
    /** Type badge — tool/format indicator */
    typeBadge?: OverlayTypeBadge;
    /** File path — shows dual-trigger menu badge with "Open" + "Reveal in {file manager}" */
    filePath?: string;
    /** Title — displayed as a badge. Fallback when no file path. */
    title?: string;
    /** Click handler for the title badge */
    onTitleClick?: () => void;
    /** Subtitle — extra info badge (e.g. "Lines 1-50 of 200") */
    subtitle?: string;
    /** Right-side actions (e.g. diff controls) */
    headerActions?: ReactNode;
    /** When provided, renders a built-in copy button (matching close button style) */
    copyContent?: string;
}
export declare function FullscreenOverlayBaseHeader({ onClose, typeBadge, filePath, title, onTitleClick, subtitle, headerActions, copyContent, }: FullscreenOverlayBaseHeaderProps): import("react").JSX.Element;
