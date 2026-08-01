/**
 * EntityIcon - Unified base component for rendering any entity's icon.
 *
 * Handles three icon kinds:
 * - emoji: Renders as sized text span with bg-muted container
 * - file: Renders via CrossfadeAvatar with smooth loading transition
 * - fallback: Renders the fallbackIcon (Lucide component) with proper sizing
 *
 * Entity-specific wrappers (SourceAvatar, SkillAvatar, StatusIcon)
 * call this with their own fallbackIcon and any extra chrome (status dots, color, etc.)
 *
 * The fallbackIcon prop is the primary customisation point for subclasses.
 * EntityIcon handles all sizing, styling, and rendering logic internally.
 */
import * as React from 'react';
import type { ResolvedEntityIcon, IconSize } from '@craft-agent/shared/icons';
/**
 * Any React component that accepts className prop.
 * Compatible with Lucide icons, custom SVG components (e.g. McpIcon), etc.
 */
export type IconComponent = React.ComponentType<{
    className?: string;
}>;
export interface EntityIconProps {
    /** Resolved icon from useEntityIcon hook */
    icon: ResolvedEntityIcon;
    /** Size variant (default: 'md') */
    size?: IconSize;
    /** Icon component rendered when icon.kind === 'fallback' (Lucide icon or custom SVG) */
    fallbackIcon: IconComponent;
    /** Escape hatch: fully custom fallback ReactNode (overrides fallbackIcon if provided) */
    fallback?: React.ReactNode;
    /** Alt text for accessibility */
    alt?: string;
    /** Additional className on the outer container */
    className?: string;
    /**
     * Override container size class.
     * Use 'h-full w-full' for fluid sizing within a parent container.
     * If provided, replaces the default ICON_SIZE_CLASSES for the given size.
     */
    containerClassName?: string;
    /**
     * When true, renders emoji without container chrome (no bg, ring, or rounded).
     * Used for inline emoji icons in the sidebar where the container is unnecessary.
     */
    chromeless?: boolean;
    /**
     * When true, renders the icon content directly without any container div.
     * Used in filter menus where the parent provides all necessary styling.
     * Color inheritance still works via parent element's color style.
     */
    bare?: boolean;
}
declare function EntityIconComponent({ icon, size, fallbackIcon: FallbackIcon, fallback, alt, className, containerClassName, chromeless, bare, }: EntityIconProps): React.JSX.Element;
type EntityIconWithMarker = typeof EntityIconComponent & {
    acceptsBare: true;
};
export declare const EntityIcon: EntityIconWithMarker;
export {};
