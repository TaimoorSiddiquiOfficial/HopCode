/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { UpdateObject } from '../ui/utils/updateCheck.js';
import type { LoadedSettings } from '../config/settings.js';
import type { HistoryItemWithoutId } from '../ui/types.js';
import type { spawn } from 'node:child_process';
export declare function handleAutoUpdate(info: UpdateObject | null, settings: LoadedSettings, projectRoot: string, spawnFn?: typeof spawn): import("child_process").ChildProcessByStdio<import("stream").Writable, null, import("stream").Readable> | undefined;
export declare function setUpdateHandler(addItem: (item: HistoryItemWithoutId, timestamp: number) => void, setUpdateInfo: (info: UpdateObject | null) => void, isIdleRef?: {
    current: boolean;
}): {
    cleanup: () => void;
    flush: () => void;
};
