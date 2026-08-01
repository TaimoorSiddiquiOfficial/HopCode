/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */
import type { FileHistoryService } from '@hoptrendy/hopcode-core';
import type { HistoryItem } from '../types.js';
export interface DiffDialogProps {
    history: HistoryItem[];
    cwd: string | undefined;
    fileHistoryService: FileHistoryService | undefined;
    fileCheckpointingEnabled: boolean;
    onClose: () => void;
}
export declare function DiffDialog({ history, cwd, fileHistoryService, fileCheckpointingEnabled, onClose, }: DiffDialogProps): React.JSX.Element;
