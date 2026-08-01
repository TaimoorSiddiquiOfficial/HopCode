/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { DaemonWorkspaceGitStatus } from '@hoptrendy/sdk/daemon';
/**
 * The chip's inner content (icon + branch + status indicators), shared by the
 * interactive {@link GitBranchIndicator} and the toolbar's hidden measurement
 * replica. The replica must render the same indicators or it under-measures the
 * expanded chip, which makes the responsive compact/expanded toggle oscillate.
 */
export declare function GitBranchChipContent({ branch, status, compact, }: {
    branch: string;
    status?: DaemonWorkspaceGitStatus;
    compact: boolean;
}): import("react").JSX.Element;
export declare function GitBranchIndicator({ branch, status, compact, onOpenDiff, }: {
    branch: string;
    status?: DaemonWorkspaceGitStatus;
    compact?: boolean;
    onOpenDiff?: () => void;
}): import("react").JSX.Element;
