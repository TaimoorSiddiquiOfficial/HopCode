/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Test cases for orphaned tool calls cleanup
 */
export declare const createTestMessages: () => ({
    role: "system";
    content: string;
    readonly tool_calls?: undefined;
    tool_call_id?: undefined;
} | {
    role: "user";
    content: string;
    readonly tool_calls?: undefined;
    tool_call_id?: undefined;
} | {
    role: "assistant";
    content: string;
    tool_calls: {
        id: string;
        type: "function";
        function: {
            name: string;
            arguments: string;
        };
    }[];
    tool_call_id?: undefined;
} | {
    role: "tool";
    tool_call_id: string;
    content: string;
    readonly tool_calls?: undefined;
})[];
export declare const expectedCleanedMessages: () => ({
    role: "system";
    content: string;
    readonly tool_calls?: undefined;
    tool_call_id?: undefined;
} | {
    role: "user";
    content: string;
    readonly tool_calls?: undefined;
    tool_call_id?: undefined;
} | {
    role: "assistant";
    content: string;
    tool_calls: {
        id: string;
        type: "function";
        function: {
            name: string;
            arguments: string;
        };
    }[];
    tool_call_id?: undefined;
} | {
    role: "tool";
    tool_call_id: string;
    content: string;
    readonly tool_calls?: undefined;
})[];
