/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Reconcile injected mid-turn messages against the local pending queue: remove
 * the first text-only entry matching each injected message for `sessionId`,
 * across ALL `batches` (a multi-batch turn drains once per tool batch, so the
 * consumer must process every accumulated batch, not just the latest).
 *
 * Matching is count-based — one removal per injected message — so a queue that
 * holds the same text twice loses one entry per matching injection. Entries
 * carrying images are never matched: image messages aren't pushed mid-turn (the
 * drain channel carries plain strings), so they stay queued for the next turn.
 *
 * Skips a batch whose `originatorClientId` is some OTHER client: the daemon
 * broadcasts the injection frame to every client on the session, but only the
 * client that queued the message should drop it — a peer with a coincidentally
 * equal text must keep its own entry. Batches with no originator (anonymous
 * push) are reconciled regardless.
 *
 * Returns a NEW array when something was removed, or `null` when nothing matched
 * (so the caller can skip a redundant state update).
 */
export function removeInjectedFromQueue(prompts, batches, sessionId, clientId) {
    const remaining = [...prompts];
    let changed = false;
    for (const batch of batches) {
        if (batch.sessionId !== sessionId)
            continue;
        if (batch.originatorClientId !== undefined &&
            batch.originatorClientId !== clientId) {
            continue;
        }
        for (const message of batch.messages) {
            const index = remaining.findIndex((prompt) => prompt.text === message &&
                (!prompt.images || prompt.images.length === 0));
            if (index >= 0) {
                remaining.splice(index, 1);
                changed = true;
            }
        }
    }
    return changed ? remaining : null;
}
//# sourceMappingURL=midTurnDedup.js.map