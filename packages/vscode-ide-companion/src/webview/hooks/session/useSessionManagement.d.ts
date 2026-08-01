/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { VSCodeAPI } from '../../hooks/useVSCode.js';
/**
 * Session management Hook
 * Manages session list, current session, session switching, and search
 */
export declare const useSessionManagement: (vscode: VSCodeAPI) => {
    hopcodeSessions: Record<string, unknown>[];
    currentSessionId: string | null;
    currentSessionTitle: string;
    showSessionSelector: boolean;
    sessionSearchQuery: string;
    filteredSessions: Record<string, unknown>[];
    nextCursor: number | undefined;
    hasMore: boolean;
    isLoading: boolean;
    isSwitchingSession: boolean;
    setHopCodeSessions: import("react").Dispatch<import("react").SetStateAction<Record<string, unknown>[]>>;
    setCurrentSessionId: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    setCurrentSessionTitle: import("react").Dispatch<import("react").SetStateAction<string>>;
    setShowSessionSelector: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setSessionSearchQuery: import("react").Dispatch<import("react").SetStateAction<string>>;
    setNextCursor: import("react").Dispatch<import("react").SetStateAction<number | undefined>>;
    setHasMore: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setIsLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setIsSwitchingSession: (value: boolean) => void;
    handleLoadHopCodeSessions: () => void;
    handleNewHopCodeSession: (modelId?: string | null) => void;
    handleSwitchSession: (sessionId: string) => void;
    handleLoadMoreSessions: () => void;
    handleDeleteSession: (sessionId: string) => void;
    handleRenameSession: (sessionId: string, title: string) => void;
};
