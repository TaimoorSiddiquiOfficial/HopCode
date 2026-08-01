/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonStatusReportDetail } from '@hoptrendy/sdk/daemon';
import type { DaemonResourceOptions } from '../types.js';
export interface DaemonStatusReportOptions extends DaemonResourceOptions {
    /** Detail level to request; defaults to the cheap `summary` view. */
    detail?: DaemonStatusReportDetail;
}
export declare function useDaemonStatusReport(options?: DaemonStatusReportOptions): {
    report: import("@hoptrendy/sdk/daemon").DaemonStatusReport | undefined;
    reload: () => Promise<import("@hoptrendy/sdk/daemon").DaemonStatusReport | undefined>;
    data: import("@hoptrendy/sdk/daemon").DaemonStatusReport | undefined;
    loading: boolean;
    error: Error | undefined;
};
