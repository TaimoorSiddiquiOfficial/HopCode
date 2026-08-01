/**
 * Notifications Hook
 *
 * Handles native OS notifications and badge Canvas rendering.
 * - Tracks window focus state
 * - Shows notifications for new messages when window is unfocused
 * - Renders badge icons via Canvas API (main process drives badge count directly)
 */
import type { Session } from '../../shared/types';
interface UseNotificationsOptions {
    /** Current workspace ID */
    workspaceId: string | null;
    /** Callback to navigate to a session when notification is clicked */
    onNavigateToSession?: (sessionId: string) => void;
    /** Whether notifications are enabled (from app settings) */
    enabled?: boolean;
}
interface UseNotificationsResult {
    /** Whether the window is currently focused */
    isWindowFocused: boolean;
    /** Show a notification for a session */
    showSessionNotification: (session: Session, messagePreview?: string) => void;
}
export declare function useNotifications({ workspaceId, onNavigateToSession, enabled, }: UseNotificationsOptions): UseNotificationsResult;
export {};
