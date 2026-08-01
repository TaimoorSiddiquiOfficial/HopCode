/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type DaemonWorkspaceActions } from '@hoptrendy/webui/daemon-react-sdk';
import type { DaemonSessionArtifact } from '@hoptrendy/sdk/daemon';
import type { TurnOutputKind, TurnOutputOpenRequest } from './artifacts/TurnOutputs';
export interface ChatPaneProps {
    /** Header label; falls back to the session's own display name / id. */
    title?: string;
    /**
     * The workspace this pane's session lives in. Passed explicitly by the split
     * view (which knows it per session) and shown as a composer-toolbar chip on a
     * multi-workspace daemon; falls back to the connection's own workspace.
     */
    workspaceCwd?: string;
    onClose?: () => void;
    /**
     * Toggle this pane between maximized (solo, filling the whole split) and the
     * tiled layout. Omitted when only one pane is open — there's nothing to
     * maximize against.
     */
    onToggleMaximize?: () => void;
    /** Whether this pane is currently the maximized (solo) one. */
    isMaximized?: boolean;
    onError?: (error: unknown, fallback: string) => void;
    onRightPanelOpen?: (request: TurnOutputOpenRequest) => void;
    onPaneArtifactsChange?: (sessionId: string, artifacts: readonly DaemonSessionArtifact[], workspaceActions: DaemonWorkspaceActions) => void;
    messageTurnOutputs?: readonly TurnOutputKind[];
    /** Allow prompt admission to recover a disconnected SSE stream. */
    restartSseOnPrompt?: boolean;
}
/**
 * A self-contained interactive chat, scoped to whichever `DaemonSessionProvider`
 * it is nested under. Rendering N of these (each under its own provider) inside
 * one window is the split view: every pane has its own transcript, streaming
 * state, approvals, and composer, and the browser scopes keyboard focus to the
 * pane the user clicks into — so there is no cross-pane approval arbitration.
 */
export declare function ChatPane({ title, workspaceCwd, onClose, onToggleMaximize, isMaximized, onError, onRightPanelOpen, onPaneArtifactsChange, messageTurnOutputs, restartSseOnPrompt, }: ChatPaneProps): import("react").JSX.Element;
