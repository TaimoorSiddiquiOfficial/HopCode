/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonGlobOptions, DaemonWorkspaceActions } from '../types.js';
export declare function useDaemonFiles(): Pick<DaemonWorkspaceActions, 'globWorkspace' | 'readFileBytes' | 'writeFile' | 'editFile' | 'stat' | 'listDirectory'> & {
    glob: DaemonWorkspaceActions['globWorkspace'];
};
export type { DaemonGlobOptions };
