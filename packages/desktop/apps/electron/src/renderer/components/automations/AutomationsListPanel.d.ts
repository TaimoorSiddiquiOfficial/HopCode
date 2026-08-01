/**
 * AutomationsListPanel
 *
 * Navigator panel for displaying automations in the 2nd column.
 * Follows the SourcesListPanel pattern with avatar, title, subtitle, badges.
 * Title and Plus button are handled by the shared PanelHeader in AppShell.
 *
 * Supports CMD/CTRL+click multi-select and Shift+click range select,
 * using the shared EntityRow + createEntitySelection infrastructure.
 */
import * as React from 'react';
import { type AutomationListItem, type AutomationListFilter } from './types';
export interface AutomationsListPanelProps {
    automations: AutomationListItem[];
    automationFilter?: AutomationListFilter | null;
    onAutomationClick: (automationId: string) => void;
    onDeleteAutomation?: (automationId: string) => void;
    onToggleAutomation?: (automationId: string) => void;
    onTestAutomation?: (automationId: string) => void;
    onDuplicateAutomation?: (automationId: string) => void;
    selectedAutomationId?: string | null;
    workspaceRootPath?: string;
    className?: string;
}
export declare function AutomationsListPanel({ automations, automationFilter, onAutomationClick, onDeleteAutomation, onToggleAutomation, onTestAutomation, onDuplicateAutomation, selectedAutomationId, workspaceRootPath, className, }: AutomationsListPanelProps): React.JSX.Element;
