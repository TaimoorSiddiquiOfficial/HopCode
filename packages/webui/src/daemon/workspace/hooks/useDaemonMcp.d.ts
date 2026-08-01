/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonMcp(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonWorkspaceMcpStatus | undefined;
    initialize: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceMcpInitializeResult>;
    reloadConfig: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceMcpInitializeResult>;
    loadTools: (serverName: string) => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceMcpToolsStatus>;
    loadResources: (serverName: string) => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceMcpResourcesStatus>;
    restartServer: (serverName: string) => Promise<import("@hoptrendy/sdk/daemon").DaemonMcpRestartResult>;
    manageServer: (serverName: string, action: import("@hoptrendy/sdk/daemon").DaemonMcpManageAction) => Promise<import("@hoptrendy/sdk/daemon").DaemonMcpManageResult>;
    addServer: (request: import("@hoptrendy/sdk/daemon").DaemonRuntimeMcpAddRequest) => Promise<import("@hoptrendy/sdk/daemon").DaemonRuntimeMcpAddResult>;
    removeServer: (name: string) => Promise<import("@hoptrendy/sdk/daemon").DaemonRuntimeMcpRemoveResult>;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceMcpStatus | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonWorkspaceMcpStatus | undefined;
    loading: boolean;
    error: Error | undefined;
};
