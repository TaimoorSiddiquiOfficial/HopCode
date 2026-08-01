/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
export interface ShellInputPromptProps {
    activeShellPtyId: number | null;
    focus?: boolean;
}
export declare const ShellInputPrompt: React.FC<ShellInputPromptProps>;
