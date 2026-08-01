/**
 * AutomationActionRow
 *
 * Inline display of a single automation action (prompt or webhook).
 * Used within the "Then" section of AutomationInfoPage.
 */
import type { AutomationAction } from './types';
export interface AutomationActionRowProps {
    action: AutomationAction;
    index: number;
    className?: string;
}
export declare function AutomationActionRow({ action, index, className }: AutomationActionRowProps): import("react").JSX.Element;
