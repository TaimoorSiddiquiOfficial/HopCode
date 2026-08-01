/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type SubagentConfig } from '@hoptrendy/hopcode-core';
interface AgentSelectionStepProps {
    availableAgents: SubagentConfig[];
    onAgentSelect: (agentIndex: number) => void;
}
export declare const AgentSelectionStep: ({ availableAgents, onAgentSelect, }: AgentSelectionStepProps) => import("react").JSX.Element;
export {};
