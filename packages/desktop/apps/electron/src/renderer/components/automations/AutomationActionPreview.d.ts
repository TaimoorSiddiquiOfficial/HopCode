/**
 * AutomationActionPreview
 *
 * Compact action list for expanded rows in AutomationCard and AutomationsListPanel.
 * Shows MessageSquare/Webhook icon + truncated text.
 *
 * For the full-size info page with index numbering and @mention highlighting,
 * use AutomationActionRow instead.
 */
import type { AutomationAction } from './types';
export interface AutomationActionPreviewProps {
    actions: AutomationAction[];
    className?: string;
}
export declare function AutomationActionPreview({ actions, className }: AutomationActionPreviewProps): import("react").JSX.Element;
