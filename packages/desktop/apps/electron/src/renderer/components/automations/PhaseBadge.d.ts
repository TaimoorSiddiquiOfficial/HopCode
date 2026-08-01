/**
 * PhaseBadge
 *
 * Colored badge indicating the phase/timing of an automation trigger event.
 * Derives from getEventCategory() to avoid duplicating event classification.
 */
import { type AutomationTrigger } from './types';
export interface PhaseBadgeProps {
    event: AutomationTrigger;
    className?: string;
}
export declare function PhaseBadge({ event, className }: PhaseBadgeProps): import("react").JSX.Element;
