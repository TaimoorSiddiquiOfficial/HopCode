/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ToolResultDisplay } from '../tools/tools.js';
import type { ToolRegistry } from '../tools/tool-registry.js';
import type { ShellExecutionConfig } from '../services/shellExecutionService.js';
import { ApprovalMode } from '../config/approval-config.js';
import type { MessageBus } from '../confirmation-bus/message-bus.js';
import type { ConditionalRulesRegistry } from '../utils/rulesDiscovery.js';
import type { SkillManager } from '../skills/skill-manager.js';
import type { IznGateHandler } from '../confirmation-bus/iznGateHandler.js';
import type { ToolCall, ScheduledToolCall } from './coreToolScheduler.js';
export interface ToolExecutionHandlerDeps {
    iznGateHandler: IznGateHandler;
    toolRegistry: ToolRegistry;
    getMessageBus: () => MessageBus | undefined;
    getDisableAllHooks: () => boolean;
    getApprovalMode: () => ApprovalMode;
    getShellExecutionConfig: () => ShellExecutionConfig;
    getConditionalRulesRegistry: () => ConditionalRulesRegistry | undefined;
    getSkillManager: () => SkillManager | null;
    onStatus: (callId: string, status: 'executing' | 'success' | 'error' | 'cancelled', data?: unknown) => void;
    onLiveOutput?: (callId: string, output: ToolResultDisplay) => void;
    updateToolCalls: (fn: (calls: readonly ToolCall[]) => ToolCall[]) => void;
    notifyUpdate: () => void;
}
export declare class ToolExecutionHandler {
    private readonly deps;
    constructor(deps: ToolExecutionHandlerDeps);
    execute(toolCall: ScheduledToolCall, signal: AbortSignal): Promise<void>;
}
