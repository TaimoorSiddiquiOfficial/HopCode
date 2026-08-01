/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { type Config } from '@hoptrendy/hopcode-core';
import type { UseHistoryManagerReturn } from '../../hooks/useHistoryManager.js';
interface ArenaStopDialogProps {
    config: Config;
    addItem: UseHistoryManagerReturn['addItem'];
    closeArenaDialog: () => void;
}
export declare function ArenaStopDialog({ config, addItem, closeArenaDialog, }: ArenaStopDialogProps): React.JSX.Element;
export {};
