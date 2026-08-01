/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '@hoptrendy/hopcode-core';
interface AgentsManagerDialogProps {
    onClose: () => void;
    config: Config | null;
}
/**
 * Main orchestrator component for the agents management dialog.
 */
export declare function AgentsManagerDialog({ onClose, config, }: AgentsManagerDialogProps): import("react").JSX.Element;
export {};
