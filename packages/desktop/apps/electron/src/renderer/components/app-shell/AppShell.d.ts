import * as React from 'react';
import { type AppShellContextType } from '@/context/AppShellContext';
/**
 * AppShellProps - Minimal props interface for AppShell component
 *
 * Data and callbacks come via contextValue (AppShellContextType).
 * Only UI-specific state is passed as separate props.
 *
 * Adding new features:
 * 1. Add to AppShellContextType in context/AppShellContext.tsx
 * 2. Update App.tsx to include in contextValue
 * 3. Use via useAppShellContext() hook in child components
 */
interface AppShellProps {
    /** All data and callbacks - passed directly to AppShellProvider */
    contextValue: AppShellContextType;
    /** UI-specific props */
    defaultLayout?: number[];
    defaultCollapsed?: boolean;
    menuNewChatTrigger?: number;
    /** Focused mode - hides sidebars, shows only the chat content */
    isFocusedMode?: boolean;
    /** True while the active workspace session list is refreshing. */
    isSessionListLoading?: boolean;
    /** Reports when the project tree's cross-workspace session snapshots are ready. */
    onProjectSessionSnapshotsReadyChange?: (ready: boolean) => void;
}
/**
 * AppShell - Main 3-panel layout container
 *
 * Layout: [LeftSidebar 20%] | [NavigatorPanel 32%] | [MainContentPanel 48%]
 *
 * Session Filters:
 * - 'allSessions': Shows all sessions
 * - 'flagged': Shows flagged sessions
 * - 'state': Shows sessions with a specific todo state
 */
export declare function AppShell(props: AppShellProps): React.JSX.Element;
export {};
