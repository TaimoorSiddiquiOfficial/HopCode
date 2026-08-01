/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import { type IdeContext, type MCPServerConfig } from '@hoptrendy/hopcode-core';
interface ContextSummaryDisplayProps {
    contextMdFileCount: number;
    contextFileNames: string[];
    mcpServers?: Record<string, MCPServerConfig>;
    blockedMcpServers?: Array<{
        name: string;
        extensionName: string;
    }>;
    showToolDescriptions?: boolean;
    ideContext?: IdeContext;
}
export declare const ContextSummaryDisplay: React.FC<ContextSummaryDisplayProps>;
export {};
