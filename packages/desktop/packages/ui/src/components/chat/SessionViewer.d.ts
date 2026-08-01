/**
 * SessionViewer - Read-only session transcript viewer
 *
 * Platform-agnostic component for viewing session transcripts.
 * Used by the web viewer app. For interactive chat, Electron uses ChatDisplay.
 *
 * Renders a session's messages as turn cards with gradient fade at top/bottom.
 */
import type { ReactNode } from 'react';
import type { StoredSession } from '@craft-agent/core';
import { type PlatformActions } from '../../context';
import { type ActivityItem } from './turn-utils';
export type SessionViewerMode = 'interactive' | 'readonly';
export interface SessionViewerProps {
    /** Session data to display */
    session: StoredSession;
    /** View mode - 'readonly' for web viewer, 'interactive' for Electron */
    mode?: SessionViewerMode;
    /** Platform-specific actions (file opening, URL handling, etc.) */
    platformActions?: PlatformActions;
    /** Additional className for the container */
    className?: string;
    /** Callback when a turn is clicked */
    onTurnClick?: (turnId: string) => void;
    /** Callback when an activity is clicked */
    onActivityClick?: (activity: ActivityItem) => void;
    /** Default expanded state for turns (true for readonly, false for interactive) */
    defaultExpanded?: boolean;
    /** Custom header content */
    header?: ReactNode;
    /** Custom footer content (input area for interactive mode) */
    footer?: ReactNode;
    /** Optional session folder path for stripping from file paths in tool display */
    sessionFolderPath?: string;
}
/**
 * SessionViewer - Read-only session transcript viewer component
 */
export declare function SessionViewer({ session, mode, platformActions, className, onTurnClick, onActivityClick, defaultExpanded, header, footer, sessionFolderPath, }: SessionViewerProps): import("react").JSX.Element;
