/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { type ArenaManager, type Config } from '@hoptrendy/hopcode-core';
import type { UseHistoryManagerReturn } from '../../hooks/useHistoryManager.js';
interface ArenaSelectDialogProps {
    manager: ArenaManager;
    config: Config;
    addItem: UseHistoryManagerReturn['addItem'];
    closeArenaDialog: () => void;
}
export declare function ArenaSelectDialog({ manager, config, addItem, closeArenaDialog, }: ArenaSelectDialogProps): React.JSX.Element;
export {};
