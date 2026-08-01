/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '@hoptrendy/hopcode-core';
interface AgentCreationWizardProps {
    onClose: () => void;
    config: Config | null;
}
/**
 * Main orchestrator component for the subagent creation wizard.
 */
export declare function AgentCreationWizard({ onClose, config, }: AgentCreationWizardProps): import("react").JSX.Element;
export {};
