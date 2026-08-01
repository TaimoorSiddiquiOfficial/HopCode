/**
 * MenuComponents Context
 *
 * Provides menu primitives (MenuItem, Separator, Sub, SubTrigger, SubContent)
 * that work with both DropdownMenu and ContextMenu.
 *
 * This allows menu content components (SessionMenu, SourceMenu, SkillMenu) to
 * render identically in both dropdown and context menu scenarios without duplication.
 *
 * Usage:
 * - Wrap dropdown menu content with <DropdownMenuProvider>
 * - Wrap context menu content with <ContextMenuProvider>
 * - Use useMenuComponents() in menu content to get the right primitives
 */
import * as React from 'react';
import { DropdownMenuSub, StyledDropdownMenuItem, StyledDropdownMenuSeparator, StyledDropdownMenuSubTrigger, StyledDropdownMenuSubContent } from './styled-dropdown';
import { StyledContextMenuSub, StyledContextMenuItem, StyledContextMenuSeparator, StyledContextMenuSubTrigger, StyledContextMenuSubContent } from './styled-context-menu';
/**
 * Menu component types that can be provided via context.
 * These are the styled variants that match our design system.
 */
export interface MenuComponents {
    MenuItem: typeof StyledDropdownMenuItem | typeof StyledContextMenuItem;
    Separator: typeof StyledDropdownMenuSeparator | typeof StyledContextMenuSeparator;
    Sub: typeof DropdownMenuSub | typeof StyledContextMenuSub;
    SubTrigger: typeof StyledDropdownMenuSubTrigger | typeof StyledContextMenuSubTrigger;
    SubContent: typeof StyledDropdownMenuSubContent | typeof StyledContextMenuSubContent;
}
/**
 * Hook to get menu components from context.
 * Returns styled dropdown components by default if no provider is present.
 */
export declare function useMenuComponents(): MenuComponents;
/**
 * Provider for dropdown menu context.
 * Wrap dropdown menu content with this to use dropdown primitives.
 */
export declare function DropdownMenuProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
/**
 * Provider for context menu.
 * Wrap context menu content with this to use context menu primitives.
 */
export declare function ContextMenuProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
