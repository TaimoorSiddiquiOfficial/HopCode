/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { AnsiOutput } from '@hoptrendy/hopcode-core';
interface AnsiOutputProps {
    data: AnsiOutput;
    availableTerminalHeight?: number;
    maxWidth: number;
}
export declare const AnsiOutputText: React.FC<AnsiOutputProps>;
export interface ShellStatsBarProps {
    totalLines?: number;
    totalBytes?: number;
    displayHeight?: number;
}
export declare const ShellStatsBar: React.FC<ShellStatsBarProps>;
export {};
