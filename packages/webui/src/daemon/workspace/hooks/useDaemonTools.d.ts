/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonTools(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonWorkspaceToolsStatus | undefined;
    tools: import("@hoptrendy/sdk/daemon").DaemonWorkspaceToolStatus[];
    setEnabled: (toolName: string, enabled: boolean) => Promise<unknown>;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceToolsStatus | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonWorkspaceToolsStatus | undefined;
    loading: boolean;
    error: Error | undefined;
};
