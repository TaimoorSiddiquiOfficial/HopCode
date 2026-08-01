/**
 * EntityRow — Reusable visual skeleton for list items.
 *
 * Extracted from SessionItem/SourceItem/SkillItem which all share the same layout:
 * - Absolutely-positioned icon on the left
 * - Title + badge/subtitle row
 * - Optional trailing content (timestamp, count)
 * - Hover-visible MoreHorizontal dropdown + context menu
 * - Selection/multi-select styling
 * - Optional separator above
 * - Optional children below the button (e.g. expanded child list)
 * - Optional overlay (e.g. match count badge)
 *
 * Domain-specific logic (what icon, what badges, what menu items) is injected via slots.
 */
import * as React from 'react';
export interface EntityRowProps {
    /** Left icon area — rendered in-flow as a flex child before the content column.
     *  Consumers can pass multiple icons (e.g. via a fragment) for a horizontal icon group. */
    icon?: React.ReactNode;
    /** Title content (ReactNode for search highlighting support) */
    title: React.ReactNode;
    /** Additional className on the title wrapper (e.g. shimmer animation) */
    titleClassName?: string;
    /** Content rendered inline after the title (e.g. timestamp). On hover, swapped with the more button.
     *  When set, the title row becomes single-line (truncated) and the absolute more button is hidden. */
    titleTrailing?: React.ReactNode;
    /** Content rendered inline immediately after the title, on the same row.
     *  Lives between the title and the trailing slot. Use for tiny, high-priority
     *  inline chips (e.g. platform bindings) that should read as part of the title
     *  area, not as badges below. `shrink-0` so long titles truncate first. */
    titleSuffix?: React.ReactNode;
    /** Optional subtitle line beneath the title */
    subtitle?: React.ReactNode;
    /** Badge/subtitle row beneath the title */
    badges?: React.ReactNode;
    /** Right-aligned content in the badge row (timestamp, child toggle) */
    trailing?: React.ReactNode;
    /** Interactive controls rendered outside the main row button on the right. */
    controls?: React.ReactNode;
    /** Content rendered below the main button (e.g. expanded child list) */
    children?: React.ReactNode;
    /** Absolutely-positioned overlay (e.g. match count badge) */
    overlay?: React.ReactNode;
    /** Selection state */
    isSelected?: boolean;
    /** Multi-select highlight (left accent bar + tinted bg) */
    isInMultiSelect?: boolean;
    /** Click handler — use onMouseDown for modifier key detection (Session), or onClick for simple cases */
    onMouseDown?: (e: React.MouseEvent) => void;
    /** Simple click handler (used when modifier key detection isn't needed) */
    onClick?: () => void;
    /** Show separator above this row */
    showSeparator?: boolean;
    /** Menu content — rendered in BOTH dropdown and context menu via providers.
     *  Should be a component that uses useMenuComponents() for its items. */
    menuContent?: React.ReactNode;
    /** Context menu content when different from dropdown (e.g. batch menu in multi-select) */
    contextMenuContent?: React.ReactNode;
    /** Whether to hide the more button (e.g. when overlay is showing) */
    hideMoreButton?: boolean;
    /** Additional props spread onto the <button> (aria attrs, keyboard handlers, tabIndex, ref) */
    buttonProps?: Record<string, unknown>;
    /** Data attributes on the outer wrapper div */
    dataAttributes?: Record<string, string | undefined>;
    /** Outer wrapper className */
    className?: string;
    /** Separator padding class (default: 'pl-12 pr-4') */
    separatorClassName?: string;
}
export declare function EntityRow({ icon, title, titleClassName, titleTrailing, titleSuffix, subtitle, badges, trailing, controls, children, overlay, isSelected, isInMultiSelect, onMouseDown, onClick, showSeparator, menuContent, contextMenuContent, hideMoreButton, buttonProps, dataAttributes, className, separatorClassName, }: EntityRowProps): React.JSX.Element;
