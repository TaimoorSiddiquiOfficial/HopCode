/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SessionNotification } from '@agentclientprotocol/sdk';
import type { HopCodeAgentCallbacks } from '../types/chatTypes.js';
/**
 * HopCode Session Update Handler class
 * Processes various session update events and calls appropriate callbacks
 */
export declare class HopCodeSessionUpdateHandler {
    private callbacks;
    constructor(callbacks: HopCodeAgentCallbacks);
    /**
     * Update callbacks
     *
     * @param callbacks - New callback collection
     */
    updateCallbacks(callbacks: HopCodeAgentCallbacks): void;
    /**
     * Handle session update
     *
     * @param data - ACP session update data
     */
    handleSessionUpdate(data: SessionNotification): void;
    private getTextContent;
    private emitUsageMeta;
}
