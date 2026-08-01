/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, expect, it } from 'vitest';
import { buildSessionTasksStatus } from './tasksSnapshot.js';
function agentTask(overrides = {}) {
    return {
        kind: 'agent',
        id: 'agent-1',
        agentId: 'agent-1',
        description: 'test agent',
        status: 'running',
        startTime: 1_000,
        outputFile: '/tmp/agent-1.jsonl',
        subagentType: 'general-purpose',
        isBackgrounded: false,
        pendingMessages: [],
        ...overrides,
    };
}
function configWith(agents) {
    return {
        getBackgroundTaskRegistry: () => ({ getAll: () => agents }),
        getBackgroundShellRegistry: () => ({ getAll: () => [] }),
        getMonitorRegistry: () => ({ getAll: () => [] }),
    };
}
function serializedAgents(agents) {
    const snapshot = buildSessionTasksStatus('session-1', configWith(agents), 2_000);
    return snapshot.tasks.filter((t) => t.kind === 'agent');
}
describe('buildSessionTasksStatus agent lineage', () => {
    it('carries parentAgentId, parentName and depth for a nested agent', () => {
        const [parent, child] = serializedAgents([
            agentTask({ id: 'parent-1', agentId: 'parent-1' }),
            agentTask({
                id: 'child-1',
                agentId: 'child-1',
                parentAgentId: 'parent-1',
                parentName: 'general-purpose',
                depth: 1,
                startTime: 1_500,
            }),
        ]);
        expect(parent.parentAgentId).toBeUndefined();
        expect(child.parentAgentId).toBe('parent-1');
        expect(child.parentName).toBe('general-purpose');
        expect(child.depth).toBe(1);
    });
    it('normalizes a null parentAgentId (top-level launch) to absent', () => {
        const [task] = serializedAgents([agentTask({ parentAgentId: null })]);
        expect('parentAgentId' in task).toBe(false);
    });
    it('omits all lineage keys for legacy entries without them', () => {
        const [task] = serializedAgents([agentTask()]);
        expect('parentAgentId' in task).toBe(false);
        expect('parentName' in task).toBe(false);
        expect('depth' in task).toBe(false);
    });
    it('serializes depth 0 explicitly rather than dropping it', () => {
        const [task] = serializedAgents([
            agentTask({ parentAgentId: null, depth: 0 }),
        ]);
        expect(task.depth).toBe(0);
    });
});
//# sourceMappingURL=tasksSnapshot.test.js.map