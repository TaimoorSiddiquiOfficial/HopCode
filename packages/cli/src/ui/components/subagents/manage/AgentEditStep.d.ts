/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type SubagentConfig } from '@hoptrendy/hopcode-core';
interface EditOptionsStepProps {
    selectedAgent: SubagentConfig | null;
    onNavigateToStep: (step: string) => void;
}
/**
 * Edit options selection step - choose what to edit about the agent.
 */
export declare function EditOptionsStep({ selectedAgent, onNavigateToStep, }: EditOptionsStepProps): import("react").JSX.Element;
export {};
