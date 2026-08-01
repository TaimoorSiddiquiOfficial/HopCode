/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type DaemonWorkspaceActions } from '@hoptrendy/webui/daemon-react-sdk';
import type { DaemonSessionArtifact } from '@hoptrendy/sdk/daemon';
import type { TurnOutputKind, TurnOutputOpenRequest } from './artifacts/TurnOutputs';
export interface SplitViewProps {
    /** Sessions to show in the split view. */
    sessionIds?: string[];
    /**
     * Report the live pane set (after every add / remove) up to the parent so it
     * survives this view unmounting. Switching away from the split and back must
     * restore exactly the panes the user had, not reseed from a stale selection.
     * Must be referentially stable (e.g. a `useState` setter) — a fresh callback
     * each render would re-fire the reporting effect and loop.
     */
    onPanesChange?: (sessionIds: string[]) => void;
    /** Leave the split view (back to the single-session chat). */
    onExit: () => void;
    onError?: (error: unknown, fallback: string) => void;
    onRightPanelOpen?: (request: TurnOutputOpenRequest) => void;
    onPaneArtifactsChange?: (sessionId: string, artifacts: readonly DaemonSessionArtifact[], workspaceActions: DaemonWorkspaceActions) => void;
    messageTurnOutputs?: readonly TurnOutputKind[];
    /**
     * Bumped by the parent whenever the session list changes elsewhere (create /
     * delete / rename). The "add pane" picker reloads on a change so it never
     * offers a session that has since been removed or misses one just created.
     */
    sessionListReloadToken?: number;
    includeOtherWorkspaces?: boolean;
    /** Limit session discovery and pane attachment to this workspace. */
    workspaceCwd?: string;
    /** Restart each pane's SSE event stream after an accepted prompt. */
    restartSseOnPrompt?: boolean;
}
/**
 * Shows 2+ independent interactive chats side by side in one window. Each pane
 * is its own `DaemonSessionProvider` (own session, SSE, transcript, approvals),
 * all sharing the one `DaemonWorkspaceProvider` above the app. Browser focus
 * naturally scopes the keyboard to the pane the user clicks into, so panes never
 * fight over which session an approval or Enter belongs to.
 */
export declare function SplitView({ sessionIds, onPanesChange, onExit, onError, onRightPanelOpen, onPaneArtifactsChange, messageTurnOutputs, sessionListReloadToken, includeOtherWorkspaces, workspaceCwd, restartSseOnPrompt, }: SplitViewProps): import("react").JSX.Element;
