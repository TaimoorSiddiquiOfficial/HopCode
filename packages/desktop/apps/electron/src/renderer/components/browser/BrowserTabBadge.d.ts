/**
 * BrowserTabBadge
 *
 * Compact badge used in the top bar browser strip.
 * Render-only surface that acts as a dropdown trigger in BrowserTabStrip.
 */
import { type ButtonHTMLAttributes } from 'react';
import type { BrowserInstanceInfo } from '../../../shared/types';
interface BrowserTabBadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    instance: BrowserInstanceInfo;
    isActive: boolean;
}
export declare const BrowserTabBadge: import("react").ForwardRefExoticComponent<BrowserTabBadgeProps & import("react").RefAttributes<HTMLButtonElement>>;
export {};
