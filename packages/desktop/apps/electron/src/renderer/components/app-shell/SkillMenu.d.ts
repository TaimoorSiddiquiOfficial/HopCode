/**
 * SkillMenu - Shared menu content for skill actions
 *
 * Used by:
 * - SkillsListPanel (dropdown via "..." button, context menu via right-click)
 * - SkillInfoPage (title dropdown menu)
 *
 * Uses MenuComponents context to render with either DropdownMenu or ContextMenu
 * primitives, allowing the same component to work in both scenarios.
 *
 * Provides consistent skill actions:
 * - Open in New Window
 * - Show in file manager
 * - Delete (workspace skills only)
 */
import * as React from 'react';
export interface SkillMenuProps {
    /** Skill slug */
    skillSlug: string;
    /** Skill name for display */
    skillName: string;
    /** Callbacks */
    onOpenInNewWindow: () => void;
    onShowInFinder: () => void;
    onDelete?: () => void;
    canShowInFinder?: boolean;
    canDelete?: boolean;
    deleteLabel?: string;
    /** Send to another workspace (omit to hide the option) */
    onSendToWorkspace?: () => void;
}
/**
 * SkillMenu - Renders the menu items for skill actions
 * This is the content only, not wrapped in a DropdownMenu or ContextMenu
 */
export declare function SkillMenu({ skillSlug, skillName, onOpenInNewWindow, onShowInFinder, onDelete, canShowInFinder, canDelete, deleteLabel, onSendToWorkspace, }: SkillMenuProps): React.JSX.Element;
