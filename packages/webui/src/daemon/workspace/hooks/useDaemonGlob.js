/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useDaemonWorkspaceActions } from '../DaemonWorkspaceProvider.js';
export function useDaemonGlob() {
    const workspaceActions = useDaemonWorkspaceActions();
    return {
        globWorkspace: workspaceActions.globWorkspace,
    };
}
//# sourceMappingURL=useDaemonGlob.js.map