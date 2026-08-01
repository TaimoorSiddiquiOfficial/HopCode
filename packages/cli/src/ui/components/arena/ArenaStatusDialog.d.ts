/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { type ArenaManager } from '@hoptrendy/hopcode-core';
interface ArenaStatusDialogProps {
    manager: ArenaManager;
    closeArenaDialog: () => void;
    width?: number;
}
export declare function ArenaStatusDialog({ manager, closeArenaDialog, width, }: ArenaStatusDialogProps): React.JSX.Element;
export {};
