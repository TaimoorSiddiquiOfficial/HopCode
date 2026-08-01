/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Usage } from '@agentclientprotocol/sdk';
import type { ApprovalModeValue } from './approvalModeValueTypes.js';
export declare const authMethod = "openai";
/**
 * Authenticate update notification (HopCode extension, not ACP spec).
 * Sent by agent during the OAuth flow.
 */
export interface AuthenticateUpdateNotification {
    _meta: {
        authUri: string;
    };
}
export interface SlashCommandNotification {
    sessionId: string;
    command: string;
    messageType: 'info' | 'error';
    message: string;
}
export interface SessionUpdateMeta {
    usage?: Usage | null;
    durationMs?: number | null;
    timestamp?: number | null;
    availableSkills?: string[] | null;
    availableSkillDetails?: Array<{
        name: string;
        description?: string;
        body?: string;
        filePath?: string;
        level?: string;
        modelInvocable?: boolean;
    }> | null;
    source?: string | null;
    hopcodeDiscreteMessage?: boolean | null;
    rewritten?: boolean | null;
    backgroundTask?: {
        taskId?: string;
        status?: string;
        kind?: string;
        toolUseId?: string;
    } | null;
}
export { ApprovalMode, APPROVAL_MODE_MAP, APPROVAL_MODE_INFO, getApprovalModeInfoFromString, } from './approvalModeTypes.js';
export declare const NEXT_APPROVAL_MODE: {
    [k in ApprovalModeValue]: ApprovalModeValue;
};
export interface QuestionOption {
    label: string;
    description: string;
}
export interface Question {
    question: string;
    header: string;
    options: QuestionOption[];
    multiSelect: boolean;
}
export interface AskUserQuestionRequest {
    sessionId: string;
    questions: Question[];
    metadata?: {
        source?: string;
    };
}
