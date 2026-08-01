/**
 * BrowserPaneManager
 *
 * Owns browser instances as native web contents views. Instances can live in
 * a dedicated BrowserWindow or be docked into an app window.
 */
import { BrowserWindow, View, WebContentsView } from 'electron';
import type { WindowManager } from './window-manager';
import { BrowserCDP, type AccessibilitySnapshot, type ElementGeometry } from './browser-cdp';
import { type BrowserEmptyStateLaunchPayload, type BrowserEmptyStateLaunchResult, type BrowserInstanceInfo } from '../shared/types';
import type { IBrowserPaneManager } from '@craft-agent/server-core/handlers';
export type { BrowserInstanceInfo };
export declare const BROWSER_PANE_SESSION_PARTITION = "persist:browser-pane";
interface AgentControlState {
    active: boolean;
    sessionId: string;
    displayName?: string;
    intent?: string;
}
interface AgentControlLockState {
    active: boolean;
    previousResizable: boolean;
}
interface BrowserInstance {
    id: string;
    window: BrowserWindow;
    viewHostWindow: BrowserWindow;
    containerView: View;
    toolbarView: WebContentsView;
    pageView: WebContentsView;
    nativeOverlayView: WebContentsView;
    cdp: BrowserCDP;
    currentUrl: string;
    title: string;
    favicon: string | null;
    isLoading: boolean;
    canGoBack: boolean;
    canGoForward: boolean;
    boundSessionId: string | null;
    ownerType: 'session' | 'manual';
    ownerSessionId: string | null;
    isVisible: boolean;
    presentation: 'window' | 'docked';
    dockBounds: BrowserPaneDockBounds | null;
    dockExpanded: boolean;
    keepAliveOnWindowClose: boolean;
    toolbarReady: boolean;
    toolbarMenuOpen: boolean;
    toolbarMenuHeight: number;
    toolbarMenuOverlayActive: boolean;
    showOnCreate: boolean;
    pendingShowOnReady: boolean;
    pendingShowToken: number;
    lastAction: LastBrowserAction | null;
    agentControl: AgentControlState | null;
    lockState: AgentControlLockState;
    nativeOverlayReady: boolean;
    themeColor: string | null;
    inPageThemeTimer: ReturnType<typeof setTimeout> | null;
    themeObserverToken: string | null;
    dockClipCssKey: string | null;
    dockClipCssPending: boolean;
    dockClipGeneration: number;
    consoleLogs: BrowserConsoleEntry[];
    networkLogs: BrowserNetworkEntry[];
    downloads: BrowserDownloadEntry[];
    lastLaunchToken: string | null;
}
interface CreateBrowserInstanceOptions {
    show?: boolean;
    ownerType?: 'session' | 'manual';
    ownerSessionId?: string;
    presentation?: 'window' | 'docked';
}
interface BrowserPaneDockBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface BrowserScreenshotOptions {
    mode?: 'raw' | 'agent';
    refs?: string[];
    includeLastAction?: boolean;
    includeMetadata?: boolean;
    /** Annotate screenshot with @eN labels on all interactive elements from accessibility tree */
    annotate?: boolean;
    format?: 'png' | 'jpeg';
    jpegQuality?: number;
}
export interface BrowserConsoleEntry {
    timestamp: number;
    level: 'log' | 'info' | 'warn' | 'error';
    message: string;
}
export interface BrowserConsoleOptions {
    level?: 'all' | BrowserConsoleEntry['level'];
    limit?: number;
}
export interface BrowserScreenshotRegionTarget {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    ref?: string;
    selector?: string;
    padding?: number;
    format?: 'png' | 'jpeg';
    jpegQuality?: number;
}
export interface BrowserNetworkEntry {
    timestamp: number;
    method: string;
    url: string;
    status: number;
    resourceType: string;
    ok: boolean;
}
export interface BrowserNetworkOptions {
    limit?: number;
    status?: 'all' | 'failed' | '2xx' | '3xx' | '4xx' | '5xx';
    method?: string;
    resourceType?: string;
}
export interface BrowserWaitArgs {
    kind: 'selector' | 'text' | 'url' | 'network-idle';
    value?: string;
    timeoutMs?: number;
    pollMs?: number;
    idleMs?: number;
}
export interface BrowserWaitResult {
    ok: true;
    kind: BrowserWaitArgs['kind'];
    elapsedMs: number;
    detail: string;
}
export interface BrowserKeyArgs {
    key: string;
    modifiers?: Array<'shift' | 'control' | 'alt' | 'meta'>;
}
export interface BrowserDownloadEntry {
    id: string;
    timestamp: number;
    url: string;
    filename: string;
    state: 'started' | 'completed' | 'interrupted' | 'cancelled';
    bytesReceived: number;
    totalBytes: number;
    mimeType: string;
    savePath?: string;
}
export interface BrowserDownloadOptions {
    action?: 'list' | 'wait';
    limit?: number;
    timeoutMs?: number;
}
export interface BrowserScreenshotResult {
    imageBuffer: Buffer;
    imageFormat: 'png' | 'jpeg';
    metadata?: {
        mode: 'raw' | 'agent';
        viewport?: {
            width: number;
            height: number;
            dpr: number;
            scrollX: number;
            scrollY: number;
        };
        targets?: Array<{
            ref: string;
            role?: string;
            name?: string;
            box: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            clickPoint: {
                x: number;
                y: number;
            };
        }>;
        action?: {
            tool: string;
            ref?: string;
            status: 'succeeded' | 'failed';
            timestamp: number;
        };
        annotationPartial?: boolean;
        warnings?: string[];
        region?: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        targetMode?: 'coords' | 'ref' | 'selector';
    };
}
interface LastBrowserAction {
    tool: string;
    ref?: string;
    status: 'succeeded' | 'failed';
    geometry?: ElementGeometry;
    timestamp: number;
}
export declare class BrowserPaneManager implements IBrowserPaneManager {
    private instances;
    private destroyingIds;
    private stateChangeCallback;
    private removedCallback;
    private interactedCallback;
    private partitionPermissionsInitialized;
    private partitionObserversInitialized;
    private inFlightRequestsByWebContentsId;
    private lastNetworkActivityByWebContentsId;
    private popupWindowsByParentInstanceId;
    private popupParentByWebContentsId;
    private windowManager;
    private sessionPathResolver;
    setWindowManager(windowManager: WindowManager): void;
    setSessionPathResolver(fn: (sessionId: string) => string | null): void;
    onStateChange(callback: (info: BrowserInstanceInfo) => void): void;
    onRemoved(callback: (id: string) => void): void;
    onInteracted(callback: (id: string) => void): void;
    createInstance(id?: string, options?: CreateBrowserInstanceOptions): string;
    destroyInstance(id: string): void;
    getInstance(id: string): BrowserInstance | undefined;
    private cleanupDestroyedInstance;
    /**
     * Get an instance that is confirmed alive (window not destroyed).
     * Throws a clear error if the instance is missing or its window was closed.
     * Automatically cleans up stale entries from the instance map.
     */
    private requireAliveInstance;
    handleEmptyStateLaunchFromRenderer(senderWebContentsId: number, payload: BrowserEmptyStateLaunchPayload): Promise<BrowserEmptyStateLaunchResult>;
    private findInstanceByPageWebContentsId;
    private resolveLaunchWorkspaceId;
    private buildDeepLinkFromRoute;
    private triggerEmptyStateRouteLaunch;
    listInstances(): BrowserInstanceInfo[];
    getWindowCount(): number;
    getBrowserWindows(): BrowserWindow[];
    navigate(id: string, url: string): Promise<{
        url: string;
        title: string;
    }>;
    goBack(id: string): Promise<void>;
    goForward(id: string): Promise<void>;
    reload(id: string): void;
    stop(id: string): void;
    focus(id: string): void;
    dock(id: string, hostWindow: BrowserWindow, bounds: BrowserPaneDockBounds): void;
    toggleDockExpanded(id: string): void;
    hide(id: string): void;
    getAccessibilitySnapshot(id: string): Promise<AccessibilitySnapshot>;
    clickAtCoordinates(id: string, x: number, y: number): Promise<void>;
    drag(id: string, x1: number, y1: number, x2: number, y2: number): Promise<void>;
    typeText(id: string, text: string): Promise<void>;
    setClipboard(id: string, text: string): Promise<void>;
    getClipboard(id: string): Promise<string>;
    clickElement(id: string, ref: string, options?: {
        waitFor?: 'none' | 'navigation' | 'network-idle';
        timeoutMs?: number;
    }): Promise<void>;
    fillElement(id: string, ref: string, value: string): Promise<void>;
    selectOption(id: string, ref: string, value: string): Promise<void>;
    private suspendOverlayForCapture;
    private restoreOverlayAfterCapture;
    screenshot(id: string, options?: BrowserScreenshotOptions): Promise<BrowserScreenshotResult>;
    screenshotRegion(id: string, target: BrowserScreenshotRegionTarget): Promise<BrowserScreenshotResult>;
    private capturePageWithRecovery;
    private isDisplaySurfaceUnavailableError;
    private capturePageImage;
    private waitForScreenshotReadiness;
    getConsoleLogs(id: string, options?: BrowserConsoleOptions): BrowserConsoleEntry[];
    getNetworkLogs(id: string, options?: BrowserNetworkOptions): BrowserNetworkEntry[];
    waitFor(id: string, args: BrowserWaitArgs): Promise<BrowserWaitResult>;
    sendKey(id: string, args: BrowserKeyArgs): Promise<void>;
    getDownloads(id: string, options?: BrowserDownloadOptions): Promise<BrowserDownloadEntry[]>;
    uploadFile(id: string, ref: string, filePaths: string[]): Promise<ElementGeometry>;
    windowResize(id: string, width: number, height: number): {
        width: number;
        height: number;
    };
    evaluate(id: string, expression: string): Promise<unknown>;
    detectSecurityChallenge(id: string): Promise<{
        detected: boolean;
        provider: string;
        signals: string[];
    }>;
    scroll(id: string, direction: 'up' | 'down' | 'left' | 'right', amount?: number): Promise<void>;
    bindSession(id: string, sessionId: string): void;
    unbindSession(id: string): void;
    /** Unbind all instances bound to the given session (non-destructive — window stays alive and reusable). */
    unbindAllForSession(sessionId: string): void;
    getBoundForSession(sessionId: string): string | null;
    private findReusableUnboundInstance;
    createForSession(sessionId: string, options?: {
        show?: boolean;
    }): string;
    focusBoundForSession(sessionId: string): string;
    getOrCreateForSession(sessionId: string): string;
    getBoundInstanceId(sessionId: string): string | null;
    destroyForSession(sessionId: string): void;
    clearVisualsForSession(sessionId: string): Promise<void>;
    private getAgentControlLabel;
    private reapplyAgentControlVisual;
    /** Resolve the app's current accent color as a concrete CSS value (not a var reference). */
    private getResolvedAccentColor;
    private loadNativeOverlayPage;
    private getToolbarEffectiveHeight;
    private getLayoutFrame;
    private getViewHostWindow;
    private removeViewsFromWindow;
    private attachViewsToHost;
    private hideHostedViews;
    private raiseToolbarView;
    private resetDockedPageClip;
    private applyDockedPageClip;
    private removeDockedPageClip;
    private layoutContainerView;
    private layoutToolbarView;
    private updateNativeOverlayState;
    private getWindowResizable;
    private setWindowResizable;
    private applyAgentControlLock;
    destroyAll(): void;
    private finalizeDestroyedInstance;
    private layoutPageView;
    private layoutAllViews;
    private forceCloseToolbarMenu;
    private isBrowserEmptyStateUrl;
    private normalizePageState;
    private loadEmptyStatePage;
    private handleDeepLinkUrl;
    private maybeHandleEmptyStateLaunch;
    private loadToolbarPage;
    private loadToolbarFallback;
    private sleep;
    private pushToolbarState;
    /** Register IPC handlers for toolbar actions. Call once at app startup. */
    registerToolbarIpc(): void;
    private markToolbarReady;
    /**
     * Activate or update the agent control overlay on the browser instance
     * bound to the given session. Called from sessions.ts on browser_* tool_start events.
     */
    setAgentControl(sessionId: string, meta: {
        displayName?: string;
        intent?: string;
    }): void;
    /**
     * Clear the agent control overlay for the given session.
     * Called on explicit browser_tool release and session/window teardown.
     */
    clearAgentControl(sessionId: string): void;
    clearAgentControlForInstance(instanceId: string, sessionId?: string): {
        released: boolean;
        reason?: string;
    };
    /**
     * Extract a theme color from the page using Safari 26-style heuristics.
     * Priority: media-aware theme-color meta → elementsFromPoint (fixed/sticky headers) → body/html bg.
     * All colors pass through (including white/black) — contrast is handled by the renderer.
     * Guards against stale extraction (URL change during async executeJavaScript).
     */
    private extractThemeColor;
    private applyThemeColor;
    private installThemeObserver;
    private scheduleEarlyThemeExtraction;
    private getInstanceByWebContentsId;
    private registerPopupWindow;
    private unregisterPopupWindow;
    private closePopupsForParent;
    private pushNetworkLog;
    private pushDownloadLog;
    private resolveDownloadsDir;
    private uniqueFilename;
    private setupSessionObservers;
    private logPermissionDecision;
    private setupSessionPermissions;
    private isToolbarUiDocumentUrl;
    private setupWindowListeners;
    private toInfo;
    private emitStateChange;
}
