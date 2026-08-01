/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type SubagentConfig } from '@hoptrendy/hopcode-core';
import type { StepNavigationProps } from '../types.js';
interface AgentDeleteStepProps extends StepNavigationProps {
    selectedAgent: SubagentConfig | null;
    onDelete: (agent: SubagentConfig) => Promise<void>;
}
export declare function AgentDeleteStep({ selectedAgent, onDelete, onNavigateBack, }: AgentDeleteStepProps): import("react").JSX.Element;
export {};
