/**
 * ItemNavigator - Shared arrow + dropdown navigation for overlay items.
 *
 * Renders left/right arrows with a clickable label between them.
 * Clicking the label opens a dropdown listing all items for direct selection.
 * The active item shows a check icon.
 *
 * Uses StyledDropdown components for consistent popover styling (vibrancy, blur, sizing).
 */
interface NavigatorItem {
    label?: string;
}
export interface ItemNavigatorProps {
    items: NavigatorItem[];
    activeIndex: number;
    onSelect: (index: number) => void;
    /** Size variant — 'sm' for inline blocks, 'md' for fullscreen overlays */
    size?: 'sm' | 'md';
}
export declare function ItemNavigator({ items, activeIndex, onSelect, size }: ItemNavigatorProps): import("react").JSX.Element | null;
export {};
