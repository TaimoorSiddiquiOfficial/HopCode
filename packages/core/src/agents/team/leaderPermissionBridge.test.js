/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { registerLeader, getLeader, unregisterLeader, forwardApproval, wrapConfirmWithBadge, } from './leaderPermissionBridge.js';
import { ToolConfirmationOutcome } from '../../tools/tools.js';
function makeDetails(title = 'Confirm Edit') {
    return {
        type: 'info',
        title,
        prompt: 'Edit file.ts',
        onConfirm: async () => { },
    };
}
describe('leaderPermissionBridge', () => {
    beforeEach(() => {
        unregisterLeader();
    });
    it('returns null when no leader is registered', () => {
        expect(getLeader()).toBeNull();
    });
    it('registers and returns leader callbacks', () => {
        const cb = {
            enqueueApproval: () => { },
        };
        registerLeader(cb);
        expect(getLeader()).toBe(cb);
    });
    it('unregisters leader', () => {
        registerLeader({ enqueueApproval: () => { } });
        unregisterLeader();
        expect(getLeader()).toBeNull();
    });
    it('forwards approval when leader is registered', () => {
        const received = [];
        registerLeader({
            enqueueApproval: (a) => received.push(a),
        });
        const details = makeDetails();
        const ok = forwardApproval('worker-1', '#ff0000', details);
        expect(ok).toBe(true);
        expect(received).toHaveLength(1);
        expect(received[0].teammateName).toBe('worker-1');
        expect(received[0].teammateColor).toBe('#ff0000');
        expect(received[0].details).toBe(details);
    });
    it('returns false when no leader is registered', () => {
        const ok = forwardApproval('worker-1', undefined, makeDetails());
        expect(ok).toBe(false);
    });
});
describe('wrapConfirmWithBadge', () => {
    it('prefixes title with teammate name', () => {
        const original = makeDetails('Confirm Edit');
        const wrapped = wrapConfirmWithBadge(original, 'alice', async () => { }, '#00ff00');
        expect(wrapped.title).toBe('[alice] Confirm Edit');
    });
    it('routes onConfirm through the supplied respond callback', async () => {
        let respondedWith;
        const original = {
            type: 'info',
            title: 'Test',
            prompt: 'test',
        };
        const wrapped = wrapConfirmWithBadge(original, 'bob', async (outcome) => {
            respondedWith = outcome;
        });
        await wrapped.onConfirm(ToolConfirmationOutcome.ProceedOnce);
        expect(respondedWith).toBe(ToolConfirmationOutcome.ProceedOnce);
    });
});
//# sourceMappingURL=leaderPermissionBridge.test.js.map