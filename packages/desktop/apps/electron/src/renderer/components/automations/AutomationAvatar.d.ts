/**
 * AutomationAvatar
 *
 * Small icon component that visually categorizes automations by event type.
 * Uses colored backgrounds with matching Lucide icons.
 */
import * as React from 'react';
import { type AutomationTrigger } from './types';
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
export interface AutomationAvatarProps {
    event: AutomationTrigger;
    size?: AvatarSize;
    /** Fill parent container (h-full w-full). Overrides size. */
    fluid?: boolean;
    className?: string;
}
export declare function AutomationAvatar({ event, size, fluid, className }: AutomationAvatarProps): React.JSX.Element;
export {};
