/**
 * AutomationMenu - Shared menu content for automation actions
 *
 * Used by:
 * - AutomationsListPanel (dropdown via "..." button, context menu via right-click)
 * - AutomationInfoPage (title dropdown menu)
 *
 * Uses MenuComponents context to render with either DropdownMenu or ContextMenu
 * primitives, following the same dual-menu pattern as SourceMenu.
 */
export interface AutomationMenuProps {
    automationId: string;
    automationName: string;
    enabled: boolean;
    onToggleEnabled?: () => void;
    onTest?: () => void;
    onDuplicate?: () => void;
    onEditJson?: () => void;
    onDelete?: () => void;
    /** Send to another workspace (omit to hide the option) */
    onSendToWorkspace?: () => void;
}
export declare function AutomationMenu({ automationId, automationName, enabled, onToggleEnabled, onTest, onDuplicate, onEditJson, onDelete, onSendToWorkspace, }: AutomationMenuProps): import("react").JSX.Element;
