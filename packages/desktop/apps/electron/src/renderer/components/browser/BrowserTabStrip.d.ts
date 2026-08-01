/**
 * BrowserTabStrip
 *
 * Rendered in the TopBar, shows compact badges for all active browser instances.
 * Each badge opens a shared action menu.
 */
import type { BrowserInstanceInfo } from '../../../shared/types';
interface BrowserTabStripProps {
    activeSessionId?: string | null;
    instancesOverride?: BrowserInstanceInfo[];
    maxVisibleBadges?: number;
}
export declare function BrowserTabStrip({ activeSessionId, instancesOverride, maxVisibleBadges, }: BrowserTabStripProps): import("react").JSX.Element | null;
export {};
