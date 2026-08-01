/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type DaemonTranscriptBlock } from '@hoptrendy/sdk/daemon';
import type { UnifiedMessage } from '../adapters/types.js';
export interface DaemonTranscriptAdapterOptions {
    /**
     * When true, user/assistant/thought block content is projected via the
     * SDK's `daemonBlockToMarkdown` helper instead of raw sanitized text.
     * This gives the WebUI's markdown renderer (markdown-it) richer
     * formatting — bold "You" labels, thought blockquotes, structured
     * permission lists.
     *
     * Default: `false` — preserves the legacy plain-text behavior.
     * Pass `true` to opt into the PR-D render contract.
     */
    useMarkdown?: boolean;
    /**
     * When true, tool block `details`/`rawOutput` is enriched with the
     * preview's markdown projection (file_diff fenced as diff, mcp_invocation
     * as server::tool, tabular as GFM table). Renderers that already have
     * structured renderers for each preview kind should leave this `false`.
     *
     * Default: `false`.
     */
    enrichToolDetailsWithPreview?: boolean;
}
export declare function daemonTranscriptToUnifiedMessages(blocks: readonly DaemonTranscriptBlock[], options?: DaemonTranscriptAdapterOptions): UnifiedMessage[];
