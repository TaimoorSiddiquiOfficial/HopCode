export interface InlineMenuSurfaceOptions<T> {
    className: string;
    zIndex?: number | string;
    onSelect: (item: T, index: number) => void;
    render: (container: HTMLElement, items: T[], selectedIndex: number) => void;
}
/**
 * Headless inline menu surface for caret-anchored menus (slash, mention, label, etc.).
 *
 * Provides:
 * - delegated click selection via data-index
 * - keyboard selection helpers
 * - scroll-follow for selected row
 * - manual positioning
 */
export declare class InlineMenuSurface<T> {
    readonly element: HTMLElement;
    private readonly options;
    private items;
    private selectedIndex;
    constructor(options: InlineMenuSurfaceOptions<T>);
    mount(parent?: HTMLElement): void;
    update(items: T[], selectedIndex?: number): void;
    setSelectedIndex(next: number): void;
    moveSelection(step: number): void;
    getSelectedItem(): T | undefined;
    setPosition(top: number, left: number): void;
    destroy(): void;
    private clampSelectedIndex;
    private ensureSelectedVisible;
    private handleMouseDown;
}
