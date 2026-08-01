/**
 * Notification Service
 *
 * Handles native OS notifications and app badge count.
 * - Shows notifications when new messages arrive (when app is not focused)
 * - Updates dock badge count with total unread messages
 * - Clicking notification navigates to the relevant session
 */
import type { WindowManager } from './window-manager';
import type { EventSink } from '@craft-agent/server-core/transport';
type ClientResolver = (webContentsId: number) => string | undefined;
/**
 * Initialize the notification service with window manager reference
 */
export declare function initNotificationService(wm: WindowManager): void;
/**
 * Set the event sink for notification broadcasts (called after server creation).
 *
 * When a resolver is provided we can route session navigation events to a
 * single client instead of broadcasting to every window in the workspace.
 */
export declare function setNotificationEventSink(sink: EventSink, resolver?: ClientResolver): void;
/**
 * Show a native notification for a new message
 *
 * @param title - Notification title (e.g., session name)
 * @param body - Notification body (e.g., message preview)
 * @param workspaceId - Workspace ID for navigation
 * @param sessionId - Session ID for navigation
 */
export declare function showNotification(title: string, body: string, workspaceId: string, sessionId: string): void;
/**
 * Handle notification click - focus window and navigate to session
 */
export declare function handleNotificationClick(workspaceId: string, sessionId: string): void;
/**
 * Initialize the base icon for badge overlay
 * Call this during app startup
 */
export declare function initBadgeIcon(iconPath: string): void;
/**
 * Update the app badge count (cross-platform)
 *
 * - macOS: Uses a canvas-based approach to draw the badge directly onto the dock icon.
 * - Windows: Uses taskbar overlay icon for badge display.
 * - Linux: Uses app.setBadgeCount() where supported (Unity, KDE).
 *
 * @param count - Number to show on badge (0 to clear)
 */
export declare function updateBadgeCount(count: number): void;
/**
 * Set the dock/taskbar icon with a pre-rendered badge image (cross-platform)
 * Called from IPC when renderer has drawn the badge
 */
export declare function setDockIconWithBadge(dataUrl: string): void;
/**
 * Clear the app dock badge
 */
export declare function clearBadgeCount(): void;
/**
 * Check if any window is currently focused
 */
export declare function isAnyWindowFocused(): boolean;
/**
 * Initialize instance badge for multi-instance development.
 *
 * When running from a numbered folder (e.g., craft-tui-agent-1), this shows
 * a permanent badge on the dock icon to distinguish between instances.
 * Uses macOS dock.setBadge() for text-based badge display.
 *
 * @param number - Instance number (1, 2, etc.) or null for default instance
 */
export declare function initInstanceBadge(number: number): void;
export {};
