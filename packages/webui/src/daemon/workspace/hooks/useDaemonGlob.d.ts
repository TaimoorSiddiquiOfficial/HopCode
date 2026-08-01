/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare function useDaemonGlob(): {
    globWorkspace: (pattern: string, opts?: import("./useDaemonFiles.js").DaemonGlobOptions) => Promise<import("../types.js").DaemonGlobResult>;
};
