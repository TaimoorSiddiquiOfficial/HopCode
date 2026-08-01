/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type DaemonTranscriptBlock, type DaemonTranscriptState, type DaemonTranscriptStore } from '@hoptrendy/sdk/daemon';
import type { DaemonConnectionState, DaemonPromptStatus, DaemonSessionActions, DaemonSessionContextValue, DaemonSessionNotice, DaemonSessionProviderProps, DaemonWorkspaceEventSignals } from './types.js';
export type { DaemonCommandInfo, DaemonConnectionState, DaemonConnectionStatus, DaemonModelInfo, DaemonNoticeCategory, DaemonNoticeOperation, DaemonNoticeSeverity, DaemonPromptImage, DaemonPromptStatus, DaemonSessionActions, DaemonSessionContextValue, DaemonSessionNotice, DaemonSessionProviderProps, DaemonTodoItem, DaemonTodoList, DaemonTodoPriority, DaemonTodoStatus, DaemonWorkspaceEventSignals, SendPromptOptions, } from './types.js';
export interface DaemonTranscriptHistory {
    hasMore: boolean;
    loading: boolean;
    capacityReached: boolean;
    loadMore(): Promise<void>;
}
export declare function DaemonSessionProvider(props: DaemonSessionProviderProps): import("react").JSX.Element;
export declare function useDaemonSession(): DaemonSessionContextValue;
export declare function useDaemonTranscriptStore(): DaemonTranscriptStore;
export declare function useDaemonTranscriptHistory(): DaemonTranscriptHistory;
export declare function useDaemonTranscriptState(): DaemonTranscriptState;
export declare function useDaemonTranscriptBlocks(): readonly DaemonTranscriptBlock[];
export declare function useDaemonPendingPermissions(): readonly import("@hoptrendy/sdk/daemon").DaemonPermissionTranscriptBlock[];
export declare function useDaemonActiveTodoList(): import("./types.js").DaemonTodoList | undefined;
export declare function useDaemonStreamingState(): import("./selectors.js").DaemonStreamingState;
export declare function useDaemonActions(): DaemonSessionActions;
export declare function useOptionalDaemonActions(): DaemonSessionActions | undefined;
export declare function useDaemonWorkspaceEventSignals(): DaemonWorkspaceEventSignals | undefined;
export declare function useDaemonPromptStatus(): DaemonPromptStatus;
export declare function useDaemonConnection(): DaemonConnectionState;
export declare function useDaemonSessionNotices(): {
    notices: readonly DaemonSessionNotice[];
    dismissNotice(id: string): void;
    clearNotices(): void;
};
