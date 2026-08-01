/**
 * Browser CDP Helpers
 *
 * Uses Electron's webContents.debugger API (Chrome DevTools Protocol) for:
 * - Accessibility tree snapshots with ref-based element identification
 * - Element interaction (click, fill, select) via CDP commands
 *
 * This is the same approach used by Playwright/Stagehand — deterministic,
 * no fragile CSS selectors needed.
 */
import type { WebContents } from 'electron';
export interface AccessibilityNode {
    ref: string;
    role: string;
    name: string;
    value?: string;
    description?: string;
    focused?: boolean;
    checked?: boolean;
    disabled?: boolean;
}
export interface AccessibilitySnapshot {
    url: string;
    title: string;
    nodes: AccessibilityNode[];
}
export interface ElementBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface ElementGeometry {
    ref: string;
    role?: string;
    name?: string;
    box: ElementBox;
    clickPoint: {
        x: number;
        y: number;
    };
}
export interface ViewportMetrics {
    width: number;
    height: number;
    dpr: number;
    scrollX: number;
    scrollY: number;
}
export declare class BrowserCDP {
    private webContents;
    private attached;
    private detachListenerRegistered;
    private idleDetachTimer;
    private refMap;
    private refDetails;
    private backendNodeRefMap;
    private nextRefCounter;
    constructor(webContents: WebContents);
    private ensureAttached;
    private resetIdleDetachTimer;
    detach(): void;
    private send;
    private allocateRef;
    getAccessibilitySnapshot(): Promise<AccessibilitySnapshot>;
    getElementGeometry(ref: string): Promise<ElementGeometry>;
    getElementGeometryBySelector(selector: string): Promise<ElementGeometry>;
    getViewportMetrics(): Promise<ViewportMetrics>;
    renderTemporaryOverlay(params: {
        geometries: ElementGeometry[];
        includeMetadata?: boolean;
        metadataText?: string;
        includeClickPoints?: boolean;
    }): Promise<void>;
    clearTemporaryOverlay(): Promise<void>;
    /**
     * Generate a series of intermediate points between two coordinates.
     * Adds slight curve and jitter for realistic mouse movement.
     */
    private generateTrajectory;
    private sendMouseEvent;
    private clickAtCDP;
    private dragCDP;
    clickAtCoordinates(x: number, y: number): Promise<void>;
    drag(x1: number, y1: number, x2: number, y2: number): Promise<void>;
    typeText(text: string): Promise<void>;
    setClipboard(text: string): Promise<void>;
    getClipboard(): Promise<string>;
    clickElement(ref: string): Promise<ElementGeometry>;
    fillElement(ref: string, value: string): Promise<ElementGeometry>;
    selectOption(ref: string, value: string): Promise<ElementGeometry>;
    setFileInputFiles(ref: string, filePaths: string[]): Promise<ElementGeometry>;
}
