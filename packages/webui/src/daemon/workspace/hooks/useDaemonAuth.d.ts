/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonAuth(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonAuthStatusSnapshot | undefined;
    providers: import("@hoptrendy/sdk/daemon").DaemonAuthProviderStatus[];
    pendingDeviceFlows: {
        deviceFlowId: string;
        providerId: import("@hoptrendy/sdk/daemon").DaemonAuthProviderId;
        expiresAt: number;
    }[];
    startDeviceFlow: (providerId: import("@hoptrendy/sdk/daemon").DaemonAuthProviderId) => Promise<import("@hoptrendy/sdk/daemon").DaemonDeviceFlowStartResult>;
    getDeviceFlow: (deviceFlowId: string, opts?: {
        signal?: AbortSignal;
    }) => Promise<import("@hoptrendy/sdk/daemon").DaemonDeviceFlowState>;
    cancelDeviceFlow: (deviceFlowId: string) => Promise<void>;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonAuthStatusSnapshot | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonAuthStatusSnapshot | undefined;
    loading: boolean;
    error: Error | undefined;
};
