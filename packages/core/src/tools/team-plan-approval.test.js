/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApprovalMode } from '../config/config.js';
import { runWithAgentContext } from '../agents/runtime/agent-context.js';
import { runWithTeammateIdentity } from '../agents/team/identity.js';
import { TeamPlanApprovalTool, } from './team-plan-approval.js';
describe('TeamPlanApprovalTool', () => {
    let approvalMode;
    let resolvePlanApprovalRequest;
    let config;
    let tool;
    beforeEach(() => {
        approvalMode = ApprovalMode.DEFAULT;
        resolvePlanApprovalRequest = vi.fn();
        config = {
            getApprovalMode: vi.fn(() => approvalMode),
            isTrustedFolder: vi.fn(() => true),
            getTeamManager: vi.fn(() => ({ resolvePlanApprovalRequest })),
        };
        tool = new TeamPlanApprovalTool(config);
    });
    it('approves a pending teammate plan using the leader current mode', async () => {
        approvalMode = ApprovalMode.AUTO_EDIT;
        const result = await tool
            .build({
            request_id: 'req-1',
            action: 'approve',
            message: 'Proceed.',
        })
            .execute(new AbortController().signal);
        expect(resolvePlanApprovalRequest).toHaveBeenCalledWith('req-1', {
            action: 'approve',
            targetMode: ApprovalMode.AUTO_EDIT,
            message: 'Proceed.',
        });
        expect(result.llmContent).toContain('approved');
    });
    it('downgrades approval target mode to default in untrusted workspaces', async () => {
        approvalMode = ApprovalMode.YOLO;
        vi.mocked(config.isTrustedFolder).mockReturnValue(false);
        await tool
            .build({ request_id: 'req-1', action: 'approve' })
            .execute(new AbortController().signal);
        expect(resolvePlanApprovalRequest).toHaveBeenCalledWith('req-1', {
            action: 'approve',
            targetMode: ApprovalMode.DEFAULT,
            message: undefined,
        });
    });
    it('downgrades auto approval target mode even in trusted workspaces', async () => {
        approvalMode = ApprovalMode.AUTO;
        await tool
            .build({ request_id: 'req-1', action: 'approve' })
            .execute(new AbortController().signal);
        expect(resolvePlanApprovalRequest).toHaveBeenCalledWith('req-1', {
            action: 'approve',
            targetMode: ApprovalMode.DEFAULT,
            message: undefined,
        });
    });
    it('does not settle the request when the leader is still in plan mode', async () => {
        approvalMode = ApprovalMode.PLAN;
        const result = await tool
            .build({ request_id: 'req-1', action: 'approve' })
            .execute(new AbortController().signal);
        expect(resolvePlanApprovalRequest).not.toHaveBeenCalled();
        expect(result.error?.message).toContain('leader is still in plan mode');
    });
    it('rejects a pending teammate plan without a target mode', async () => {
        const result = await tool
            .build({
            request_id: 'req-1',
            action: 'reject',
            message: 'Add rollback details.',
        })
            .execute(new AbortController().signal);
        expect(resolvePlanApprovalRequest).toHaveBeenCalledWith('req-1', {
            action: 'reject',
            message: 'Add rollback details.',
        });
        expect(result.llmContent).toContain('rejected');
    });
    it('is unavailable to teammates at runtime', async () => {
        const result = await runWithTeammateIdentity({
            agentId: 'planner@test',
            agentName: 'planner',
            teamName: 'test',
            isTeamLead: false,
        }, () => tool
            .build({ request_id: 'req-1', action: 'approve' })
            .execute(new AbortController().signal));
        expect(resolvePlanApprovalRequest).not.toHaveBeenCalled();
        expect(result.error?.message).toContain('Only the team leader');
    });
    it('is unavailable to subagents at runtime', async () => {
        const result = await runWithAgentContext('child-agent', () => tool
            .build({ request_id: 'req-1', action: 'approve' })
            .execute(new AbortController().signal));
        expect(resolvePlanApprovalRequest).not.toHaveBeenCalled();
        expect(result.error?.message).toContain('Only the team leader');
    });
    it('uses the standard message when there is no active team', async () => {
        vi.mocked(config.getTeamManager).mockReturnValue(null);
        const result = await tool
            .build({ request_id: 'req-1', action: 'approve' })
            .execute(new AbortController().signal);
        expect(result.error?.message).toBe('No active team. Create a team first.');
    });
    it('validates request parameters', () => {
        expect(tool.validateToolParams({ request_id: '', action: 'approve' })).toContain('request_id');
        expect(tool.validateToolParams({
            request_id: 'req-1',
            action: 'maybe',
        })).toContain('action');
        expect(tool.validateToolParams({
            request_id: 'req-1',
            action: 'approve',
            message: 42,
        })).toContain('message');
        expect(tool.validateToolParams({ request_id: 'req-1', action: 'approve' })).toBeNull();
    });
});
//# sourceMappingURL=team-plan-approval.test.js.map