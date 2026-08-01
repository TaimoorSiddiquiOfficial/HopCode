/**
 * StatusIcon - Thin wrapper around EntityIcon for statuses.
 *
 * Sets fallbackIcon={Circle}. Color is NOT handled here — the parent applies
 * a Tailwind color class (e.g. 'text-success') which cascades into colorable
 * SVGs via CSS currentColor inheritance.
 *
 * Status icons are discovered at `statuses/icons/{statusId}.{ext}`.
 */
import type { IconSize } from '@craft-agent/shared/icons';
interface StatusIconProps {
    /** Status identifier (used to discover icon file) */
    statusId: string;
    /** Icon value from config (emoji string) */
    icon?: string;
    /** Workspace ID for loading local icons */
    workspaceId: string;
    /** Size variant (default: 'sm' - statuses are typically small) */
    size?: IconSize;
    /** Additional className */
    className?: string;
    /** When true, emoji icons render without container chrome (bg, ring, rounded) */
    chromeless?: boolean;
    /** When true, renders without any container (just the SVG/emoji) */
    bare?: boolean;
}
export declare function resolveStatusIconSource(statusId: string, icon?: string): {
    iconPath?: string;
    iconValue?: string;
    iconFileName?: string;
};
export declare function StatusIcon({ statusId, icon, workspaceId, size, className, chromeless, bare, }: StatusIconProps): import("react").JSX.Element;
export {};
