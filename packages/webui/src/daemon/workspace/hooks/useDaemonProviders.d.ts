/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
/**
 * Loads the configured model providers (`GET /workspace/providers`) and reloads
 * whenever a settings change is broadcast — installing or deleting a model both
 * bump the settings version, so the model list stays in sync.
 */
export declare function useDaemonProviders(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonWorkspaceProvidersStatus | undefined;
    providers: import("@hoptrendy/sdk/daemon").DaemonWorkspaceProviderStatus[];
    current: import("@hoptrendy/sdk/daemon").DaemonWorkspaceProviderCurrent | undefined;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceProvidersStatus | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonWorkspaceProvidersStatus | undefined;
    loading: boolean;
    error: Error | undefined;
};
