/**
 * Panel Stack State
 *
 * Single-lane panel model for side-by-side content panels.
 */
import type { ViewRoute } from '../../shared/routes';
export type PanelType = 'session' | 'source' | 'settings' | 'skills' | 'skillMarketplace' | 'other';
export type PanelLaneId = 'main';
export type OpenIntent = 'implicit' | 'explicit';
export interface PanelLanePolicy {
    id: PanelLaneId;
    order: number;
    allowedTypes: PanelType[];
    locked: boolean;
    singleton: boolean;
}
export declare const PANEL_LANE_POLICIES: Record<PanelLaneId, PanelLanePolicy>;
export interface PanelStackEntry {
    id: string;
    route: ViewRoute;
    proportion: number;
    panelType: PanelType;
    laneId: PanelLaneId;
}
export declare const panelStackAtom: any;
export declare const focusedPanelIdAtom: any;
export declare const panelCountAtom: any;
export declare const focusedPanelIndexAtom: any;
export declare const focusedPanelRouteAtom: any;
export declare function getPanelTypeFromRoute(route: ViewRoute): PanelType;
export declare function getDefaultLaneForType(_type: PanelType): PanelLaneId;
export declare function parseSessionIdFromRoute(route: ViewRoute): string | null;
export declare const focusedSessionIdAtom: any;
export declare const pushPanelAtom: any;
export declare const closePanelAtom: any;
export declare const reconcilePanelStackAtom: any;
export declare const resizePanelsAtom: any;
export declare const updateFocusedPanelRouteAtom: any;
export declare const focusNextPanelAtom: any;
export declare const focusPrevPanelAtom: any;
