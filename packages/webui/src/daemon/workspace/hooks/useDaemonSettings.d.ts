/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonSettings(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonWorkspaceSettingsStatus | undefined;
    settings: import("@hoptrendy/sdk/daemon").DaemonSettingDescriptor[];
    setValue: (scope: "workspace" | "user", key: string, value: unknown, options?: {
        mcpServerMutation?: {
            operation: "set" | "remove";
            name: string;
        };
    }) => Promise<import("@hoptrendy/sdk/daemon").DaemonSettingUpdateResult>;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceSettingsStatus | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonWorkspaceSettingsStatus | undefined;
    loading: boolean;
    error: Error | undefined;
};
