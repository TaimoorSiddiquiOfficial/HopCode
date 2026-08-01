/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { ToolConfirmationOutcome } from '@hoptrendy/hopcode-core';
import type React from 'react';
export interface ShellConfirmationRequest {
    commands: string[];
    onConfirm: (outcome: ToolConfirmationOutcome, approvedCommands?: string[]) => void;
}
export interface ShellConfirmationDialogProps {
    request: ShellConfirmationRequest;
    availableTerminalHeight?: number;
    contentWidth?: number;
}
export declare const ShellConfirmationDialog: React.FC<ShellConfirmationDialogProps>;
