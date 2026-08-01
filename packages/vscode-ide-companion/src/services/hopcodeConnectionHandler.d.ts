/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { AcpConnection } from './acpConnection.js';
import type { ModelInfo } from '@agentclientprotocol/sdk';
import type { ApprovalModeValue } from '../types/approvalModeValueTypes.js';
export interface HopCodeConnectionResult {
    sessionCreated: boolean;
    requiresAuth: boolean;
    modelInfo?: ModelInfo;
    availableModels?: ModelInfo[];
    currentModeId?: ApprovalModeValue;
    availableModes?: Array<{
        id: ApprovalModeValue;
        name: string;
        description: string;
    }>;
}
/**
 * HopCode Connection Handler class
 * Handles connection, authentication, and session initialization
 */
export declare class HopCodeConnectionHandler {
    /**
     * Connect to HopCode service and establish session
     *
     * @param connection - ACP connection instance
     * @param workingDir - Working directory
     * @param cliPath - CLI path (optional, if provided will override the path in configuration)
     */
    connect(connection: AcpConnection, workingDir: string, cliEntryPath: string, options?: {
        autoAuthenticate?: boolean;
    }): Promise<HopCodeConnectionResult>;
    /**
     * Create new session (with retry)
     *
     * @param connection - ACP connection instance
     * @param workingDir - Working directory
     * @param maxRetries - Maximum number of retries
     */
    private newSessionWithRetry;
}
