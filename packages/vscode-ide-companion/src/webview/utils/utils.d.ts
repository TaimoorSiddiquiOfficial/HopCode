/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared utility functions for tool call components
 * Now re-exports from @hoptrendy/webui for backward compatibility
 */
export { extractCommandOutput, formatValue, safeTitle, shouldShowToolCall, groupContent, hasToolCallOutput, mapToolStatusToContainerStatus, } from '@hoptrendy/webui';
export type { ToolCallContent, GroupedContent, ToolCallData, ToolCallStatus, } from '@hoptrendy/webui';
