/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToolExecutionHandler } from '../core/toolExecutionHandler.js';
import { ToolErrorType } from '../tools/tool-error.js';
import { ApprovalMode } from '../config/approval-config.js';
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * A test invocation that returns a controlled ToolResult.
 */
class TestToolInvocation {
    result;
    constructor(result) {
        this.result = result;
    }
    getDescription() {
        return 'test tool';
    }
    toolLocations() {
        return [];
    }
    getDefaultPermission() {
        return Promise.resolve('allow');
    }
    getConfirmationDetails() {
        return Promise.resolve({
            type: 'info',
            title: 'test',
            prompt: 'test',
            onConfirm: async () => { },
        });
    }
    async execute() {
        return this.result;
    }
}
const successResult = {
    llmContent: 'task completed successfully',
    returnDisplay: 'task completed successfully',
};
const errorResult = {
    llmContent: 'error content',
    returnDisplay: 'error display',
    error: {
        message: 'something went wrong',
        type: ToolErrorType.EXECUTION_FAILED,
    },
};
function makeScheduledToolCall(overrides) {
    return {
        request: {
            callId: overrides?.callId ?? 'call-1',
            name: overrides?.name ?? 'test_tool',
            args: {},
        },
        invocation: new TestToolInvocation(successResult),
        status: 'validating',
        tool: { canUpdateOutput: false },
    };
}
function makeDeps(overrides) {
    return {
        iznGateHandler: {
            buildScopeReport: vi.fn().mockReturnValue(null),
        },
        toolRegistry: {
            getTool: vi.fn().mockReturnValue(undefined),
        },
        getMessageBus: () => undefined,
        getDisableAllHooks: () => false,
        getApprovalMode: () => ApprovalMode.DEFAULT,
        getShellExecutionConfig: () => ({ shell: '/bin/bash' }),
        getConditionalRulesRegistry: () => undefined,
        getSkillManager: () => null,
        onStatus: vi.fn(),
        onLiveOutput: undefined,
        updateToolCalls: vi.fn(),
        notifyUpdate: vi.fn(),
        ...overrides,
    };
}
// ---------------------------------------------------------------------------
describe('ToolExecutionHandler', () => {
    let deps;
    let handler;
    beforeEach(() => {
        deps = makeDeps();
        handler = new ToolExecutionHandler(deps);
    });
    // ── Successful execution ────────────────────────────────────────────
    it('executes a tool and reports success', async () => {
        const toolCall = makeScheduledToolCall();
        await handler.execute(toolCall, new AbortController().signal);
        // onStatus called with 'executing' then 'success'
        const calls = deps.onStatus.mock.calls;
        expect(calls).toHaveLength(2);
        expect(calls[0]).toEqual(['call-1', 'executing']);
        const successCall = calls.find((c) => c[1] === 'success');
        expect(successCall).toBeDefined();
        expect(successCall[2]).toEqual(expect.objectContaining({
            callId: 'call-1',
            error: undefined,
            errorType: undefined,
        }));
    });
    // ── Tool error reporting ────────────────────────────────────────────
    it('reports tool errors', async () => {
        const toolCall = {
            request: { callId: 'call-2', name: 'failing_tool', args: {} },
            invocation: new TestToolInvocation(errorResult),
            status: 'validating',
            tool: { canUpdateOutput: false },
        };
        await handler.execute(toolCall, new AbortController().signal);
        expect(deps.onStatus).toHaveBeenCalledWith('call-2', 'error', expect.objectContaining({
            errorType: ToolErrorType.EXECUTION_FAILED,
        }));
    });
    // ── Cancellation ────────────────────────────────────────────────────
    it('reports cancellation when signal is aborted', async () => {
        const controller = new AbortController();
        const toolCall = makeScheduledToolCall();
        const promise = handler.execute(toolCall, controller.signal);
        // Abort immediately — the TestToolInvocation resolves synchronously
        // so the abort check wouldn't catch it. We need a tool that awaits.
        // Instead, let's test the pre-emptive abort case.
        controller.abort();
        await promise;
        // With abort before execution, the handler should report cancelled
        expect(deps.onStatus).toHaveBeenCalledWith('call-1', 'cancelled', expect.any(String));
    });
    // ── Unhandled exceptions ────────────────────────────────────────────
    it('reports unhandled exceptions as UNHANDLED_EXCEPTION', async () => {
        const crashingInvocation = new TestToolInvocation(successResult);
        vi.spyOn(crashingInvocation, 'execute').mockRejectedValueOnce(new Error('unexpected crash'));
        const toolCall = {
            request: { callId: 'call-3', name: 'crashy', args: {} },
            invocation: crashingInvocation,
            status: 'validating',
            tool: { canUpdateOutput: false },
        };
        await handler.execute(toolCall, new AbortController().signal);
        const errorCall = deps.onStatus.mock.calls.find((c) => c[1] === 'error');
        expect(errorCall).toBeDefined();
        expect(errorCall[2]).toEqual(expect.objectContaining({
            errorType: ToolErrorType.UNHANDLED_EXCEPTION,
        }));
    });
    it('handles non-Error throws as UNHANDLED_EXCEPTION', async () => {
        const crashingInvocation = new TestToolInvocation(successResult);
        vi.spyOn(crashingInvocation, 'execute').mockRejectedValueOnce('string error');
        const toolCall = {
            request: { callId: 'call-4', name: 'crashy', args: {} },
            invocation: crashingInvocation,
            status: 'validating',
            tool: { canUpdateOutput: false },
        };
        await handler.execute(toolCall, new AbortController().signal);
        const errorCall = deps.onStatus.mock.calls.find((c) => c[1] === 'error');
        expect(errorCall).toBeDefined();
        expect(errorCall[2]).toEqual(expect.objectContaining({
            errorType: ToolErrorType.UNHANDLED_EXCEPTION,
        }));
    });
    // ── EXECUTION_DENIED error type ─────────────────────────────────────
    it('uses EXECUTION_DENIED error type for denied tools', () => {
        expect(ToolErrorType.EXECUTION_DENIED).toBe('execution_denied');
    });
    // ── Izn mode scope injection ────────────────────────────────────────
    it('injects Izn scope report when approval mode is IZN', async () => {
        const buildScopeReport = vi.fn().mockReturnValue('izn scope context');
        deps.getApprovalMode = () => ApprovalMode.IZN;
        deps.iznGateHandler = {
            buildScopeReport,
        };
        const toolCall = makeScheduledToolCall();
        await handler.execute(toolCall, new AbortController().signal);
        expect(buildScopeReport).toHaveBeenCalledWith({
            toolName: 'test_tool',
            toolArgs: {},
        });
    });
});
//# sourceMappingURL=toolExecutionHandler.test.js.map