/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonMemory(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonWorkspaceMemoryStatus | undefined;
    files: import("@hoptrendy/sdk/daemon").DaemonWorkspaceMemoryFile[];
    readFile: (filePath: string) => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceFile>;
    writeMemory: (req: import("@hoptrendy/sdk/daemon").DaemonWriteMemoryRequest) => Promise<import("@hoptrendy/sdk/daemon").DaemonWriteMemoryResult>;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceMemoryStatus | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonWorkspaceMemoryStatus | undefined;
    loading: boolean;
    error: Error | undefined;
};
