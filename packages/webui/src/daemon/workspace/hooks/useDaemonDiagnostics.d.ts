/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonResourceOptions } from '../types.js';
export declare function useDaemonDiagnostics(options?: DaemonResourceOptions): {
    env: import("../types.js").ResourceResult<import("@hoptrendy/sdk/daemon").DaemonWorkspaceEnvStatus>;
    preflight: import("../types.js").ResourceResult<import("@hoptrendy/sdk/daemon").DaemonWorkspacePreflightStatus>;
};
