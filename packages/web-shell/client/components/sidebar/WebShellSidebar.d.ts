import { type ReactNode } from 'react';
import type { DaemonWorkspaceCapability } from '@hopcode/sdk/daemon';
import { type WebShellTheme } from '../../themeContext';
export type WebShellSidebarFooterItem = 'settings' | 'version' | 'theme' | 'scheduledTasks' | 'goals' | 'sessionsOverview' | 'splitView' | 'daemonStatus' | 'collapse';
export interface WebShellSidebarBranding {
    /** Replace the complete top branding row. */
    render?: () => ReactNode;
    /** Hide the branding row in the compact drawer. Defaults to true. */
    hideWhenCompact?: boolean;
}
export interface WebShellSidebarLockedWorkspace {
    /** Replace the locked workspace row content while preserving its built-in behavior. */
    render?: (workspace: DaemonWorkspaceCapability, state: {
        expanded: boolean;
    }) => ReactNode;
}
export interface WebShellSidebarFooterOptions {
    /** Built-in footer entries to expose. Entries use the canonical footer order. */
    items?: readonly WebShellSidebarFooterItem[];
}
interface WebShellSidebarProps {
    collapsed: boolean;
    onCollapsedChange: (collapsed: boolean) => void;
    onOpenSettings: () => void;
    onOpenPlugins: () => void;
    onOpenDaemonStatus: () => void;
    onOpenScheduledTasks: () => void;
    onOpenGoals: () => void;
    onOpenSessions: () => void;
    /**
     * Whether to offer the Session Overview entry point. Gated to large screens
     * by the app: below that there is no room to make managing several sessions
     * side by side worthwhile.
     */
    canOpenSessionsOverview?: boolean;
    onOpenSplitView: () => void;
    /** Whether to offer the in-window split view (large screens only). */
    canOpenSplitView?: boolean;
    onNewSession: (workspaceCwd?: string) => Promise<boolean> | boolean;
    onLoadSession: (sessionId: string, workspaceCwd?: string) => Promise<void> | void;
    onSelectCurrentSession?: () => void;
    onError: (error: unknown, fallback: string) => void;
    theme: WebShellTheme;
    onThemeChange: (theme: WebShellTheme) => void;
    mobileOpen?: boolean;
    sessionListReloadToken?: number;
    /**
     * Phase 4: workspace cwd picked for the next new session (undefined =
     * primary). Only meaningful on multi-workspace daemons.
     */
    selectedWorkspaceCwd?: string;
    onSelectWorkspace?: (workspaceCwd: string | undefined) => void;
    /**
     * Open the working-tree Changes dialog for a workspace. Forwarded to each
     * trusted workspace's folder header, where a live git chip fires it on click.
     */
    onOpenGitDiff?: (workspaceCwd: string) => void;
    workspaces?: DaemonWorkspaceCapability[];
    lockedWorkspaceCwd?: string;
    lockedWorkspace?: WebShellSidebarLockedWorkspace;
    branding?: false | WebShellSidebarBranding;
    footer?: false | WebShellSidebarFooterOptions;
}
export declare function WebShellSidebar({ collapsed, onCollapsedChange, onOpenSettings, onOpenPlugins, onOpenDaemonStatus, onOpenScheduledTasks, onOpenGoals, onOpenSessions, canOpenSessionsOverview, onOpenSplitView, canOpenSplitView, onNewSession, onLoadSession, onSelectCurrentSession, onError, theme, onThemeChange, mobileOpen, sessionListReloadToken, selectedWorkspaceCwd, onSelectWorkspace, onOpenGitDiff, workspaces: providedWorkspaces, lockedWorkspaceCwd, lockedWorkspace: lockedWorkspaceOptions, branding, footer, }: WebShellSidebarProps): import("react").JSX.Element;
export {};
