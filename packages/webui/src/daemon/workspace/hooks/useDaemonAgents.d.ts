/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonAgents(options?: DaemonResourceOptions): {
    status: import("@hoptrendy/sdk/daemon").DaemonWorkspaceAgentsStatus | undefined;
    agents: import("@hoptrendy/sdk/daemon").DaemonWorkspaceAgentSummary[];
    getAgent: (agentType: string) => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceAgentDetail>;
    createAgent: (req: import("@hoptrendy/sdk/daemon").DaemonCreateAgentRequest) => Promise<import("@hoptrendy/sdk/daemon").DaemonAgentMutationResult>;
    generateAgent: (description: string) => Promise<import("@hoptrendy/sdk/daemon").DaemonGeneratedAgentContent>;
    deleteAgent: (agentType: string, scope?: "workspace" | "global") => Promise<void>;
    updateAgent: (agentType: string, req: import("@hoptrendy/sdk/daemon").DaemonUpdateAgentRequest, scope?: "workspace" | "global") => Promise<import("@hoptrendy/sdk/daemon").DaemonAgentMutationResult>;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonWorkspaceAgentsStatus | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonWorkspaceAgentsStatus | undefined;
    loading: boolean;
    error: Error | undefined;
};
