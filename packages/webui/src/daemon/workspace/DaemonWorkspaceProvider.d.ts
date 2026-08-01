/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonWorkspaceContextValue, DaemonWorkspaceProviderProps, DaemonWorkspaceActions } from './types.js';
export type { DaemonWorkspaceActions, DaemonWorkspaceContextValue, DaemonWorkspaceProviderProps, } from './types.js';
export declare function DaemonWorkspaceProvider({ baseUrl, token, workspaceCwd, autoConnect, transport, children, }: DaemonWorkspaceProviderProps): import("react").JSX.Element;
export declare function useDaemonWorkspace(): DaemonWorkspaceContextValue;
export declare function useDaemonWorkspaceActions(): DaemonWorkspaceActions;
/**
 * Returns the workspace context if available, or undefined if no ancestor
 * `DaemonWorkspaceProvider` exists. Useful for optional integration.
 */
export declare function useOptionalDaemonWorkspace(): DaemonWorkspaceContextValue | undefined;
