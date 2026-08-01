/**
 * AutomationCard
 *
 * Expandable inline row for compact automation display.
 * Collapsed: shows name + summary. Expanded: shows trigger, actions, and controls.
 */
import * as React from 'react';
import { type AutomationListItem } from './types';
export interface AutomationCardProps {
    automation: AutomationListItem;
    defaultExpanded?: boolean;
    onToggleEnabled?: (enabled: boolean) => void;
    onTest?: () => void;
    className?: string;
}
export declare function AutomationCard({ automation, defaultExpanded, onToggleEnabled, onTest, className, }: AutomationCardProps): React.JSX.Element;
