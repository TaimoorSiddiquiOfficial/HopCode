/**
 * Null-object BrowserPaneManager for headless mode.
 *
 * All methods return safe defaults or throw a clear error.
 * This replaces scattered `if (!browserPaneManager)` guards in handler code
 * with a proper null-object pattern — headless mode injects this stub,
 * Electron GUI injects the real implementation.
 */
import type { IBrowserPaneManager, AccessibilitySnapshot, BrowserConsoleEntry, BrowserConsoleOptions, BrowserDownloadEntry, BrowserDownloadOptions, BrowserInstanceSnapshot, BrowserKeyArgs, BrowserNetworkEntry, BrowserNetworkOptions, BrowserScreenshotOptions, BrowserScreenshotRegionTarget, BrowserScreenshotResult, BrowserWaitArgs, BrowserWaitResult } from '../handlers/browser-pane-manager-interface';
import type { BrowserInstanceInfo } from '@craft-agent/shared/protocol';
export declare class NullBrowserPaneManager implements IBrowserPaneManager {
    setSessionPathResolver(_fn: (sessionId: string) => string | null): void;
    destroyForSession(_sessionId: string): void;
    clearVisualsForSession(_sessionId: string): Promise<void>;
    unbindAllForSession(_sessionId: string): void;
    getOrCreateForSession(_sessionId: string): string;
    setAgentControl(_sessionId: string, _meta: {
        displayName?: string;
        intent?: string;
    }): void;
    createForSession(_sessionId: string, _options?: {
        show?: boolean;
    }): string;
    getInstance(_id: string): BrowserInstanceSnapshot | undefined;
    listInstances(): BrowserInstanceInfo[];
    focusBoundForSession(_sessionId: string): string;
    bindSession(_id: string, _sessionId: string): void;
    focus(_id: string): void;
    destroyInstance(_id: string): void;
    hide(_id: string): void;
    clearAgentControl(_sessionId: string): void;
    clearAgentControlForInstance(_instanceId: string, _sessionId?: string): {
        released: boolean;
        reason?: string;
    };
    navigate(_id: string, _url: string): Promise<{
        url: string;
        title: string;
    }>;
    goBack(_id: string): Promise<void>;
    goForward(_id: string): Promise<void>;
    getAccessibilitySnapshot(_id: string): Promise<AccessibilitySnapshot>;
    clickElement(_id: string, _ref: string, _options?: {
        waitFor?: 'none' | 'navigation' | 'network-idle';
        timeoutMs?: number;
    }): Promise<void>;
    clickAtCoordinates(_id: string, _x: number, _y: number): Promise<void>;
    drag(_id: string, _x1: number, _y1: number, _x2: number, _y2: number): Promise<void>;
    fillElement(_id: string, _ref: string, _value: string): Promise<void>;
    typeText(_id: string, _text: string): Promise<void>;
    selectOption(_id: string, _ref: string, _value: string): Promise<void>;
    setClipboard(_id: string, _text: string): Promise<void>;
    getClipboard(_id: string): Promise<string>;
    scroll(_id: string, _direction: 'up' | 'down' | 'left' | 'right', _amount?: number): Promise<void>;
    sendKey(_id: string, _args: BrowserKeyArgs): Promise<void>;
    uploadFile(_id: string, _ref: string, _filePaths: string[]): Promise<unknown>;
    evaluate(_id: string, _expression: string): Promise<unknown>;
    screenshot(_id: string, _options?: BrowserScreenshotOptions): Promise<BrowserScreenshotResult>;
    screenshotRegion(_id: string, _target: BrowserScreenshotRegionTarget): Promise<BrowserScreenshotResult>;
    getConsoleLogs(_id: string, _options?: BrowserConsoleOptions): BrowserConsoleEntry[];
    windowResize(_id: string, _width: number, _height: number): {
        width: number;
        height: number;
    };
    getNetworkLogs(_id: string, _options?: BrowserNetworkOptions): BrowserNetworkEntry[];
    waitFor(_id: string, _args: BrowserWaitArgs): Promise<BrowserWaitResult>;
    getDownloads(_id: string, _options?: BrowserDownloadOptions): Promise<BrowserDownloadEntry[]>;
    detectSecurityChallenge(_id: string): Promise<{
        detected: boolean;
        provider: string;
        signals: string[];
    }>;
}
