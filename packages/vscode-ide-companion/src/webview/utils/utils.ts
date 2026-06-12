/**
 * @license
 * Copyright 2026 HopCode Team Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared utility functions for tool call components
 * Now re-exports from @hopcode/webui for backward compatibility
 */

export {
  extractCommandOutput,
  formatValue,
  safeTitle,
  shouldShowToolCall,
  groupContent,
  hasToolCallOutput,
  mapToolStatusToContainerStatus,
} from '@hopcode/webui';

// Re-export types for backward compatibility
export type {
  ToolCallContent,
  GroupedContent,
  ToolCallData,
  ToolCallStatus,
} from '@hopcode/webui';
