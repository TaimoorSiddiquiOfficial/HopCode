/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createDebugLogger } from '../utils/debugLogger.js';
const DUPLICATE_ID_SUFFIX = '__hopcode_dup_';
const GENERATED_ID_PREFIX = 'call_hopcode_';
const PROVIDER_TOOL_CALL_ID = Symbol('providerToolCallId');
const debugLogger = createDebugLogger('TOOL_CALL_IDS');
function addId(ids, id) {
    if (id) {
        ids.add(id);
    }
}
function nextAvailableDuplicateId(rawId, usedIds) {
    if (!usedIds.has(rawId)) {
        return rawId;
    }
    for (let suffix = 2;; suffix += 1) {
        const candidate = `${rawId}${DUPLICATE_ID_SUFFIX}${suffix}`;
        if (!usedIds.has(candidate)) {
            return candidate;
        }
    }
}
function nextGeneratedId(usedIds) {
    for (let suffix = 1;; suffix += 1) {
        const candidate = `${GENERATED_ID_PREFIX}${suffix}`;
        if (!usedIds.has(candidate)) {
            return candidate;
        }
    }
}
export function collectToolCallIdsFromHistory(history) {
    const ids = new Set();
    for (const content of history) {
        for (const part of content.parts ?? []) {
            addId(ids, part.functionCall?.id);
            addId(ids, part.functionResponse?.id);
        }
    }
    return ids;
}
export function normalizeModelToolCallIds(parts, usedIds, rawIdsInCurrentTurn, reservedIds) {
    const normalized = [];
    for (const part of parts) {
        const functionCall = part.functionCall;
        if (!functionCall) {
            normalized.push(part);
            continue;
        }
        const rawId = functionCall.id;
        if (rawId) {
            if (rawIdsInCurrentTurn.has(rawId)) {
                debugLogger.debug(`Dropping same-turn duplicate functionCall id=${rawId} name=${functionCall.name}`);
                continue;
            }
            rawIdsInCurrentTurn.add(rawId);
        }
        const id = rawId
            ? (reservedIds?.get(rawId) ?? nextAvailableDuplicateId(rawId, usedIds))
            : nextGeneratedId(usedIds);
        if (rawId && id !== rawId) {
            debugLogger.debug(`Suffixing cross-turn duplicate functionCall id=${rawId} normalizedId=${id} name=${functionCall.name}`);
        }
        usedIds.add(id);
        const normalizedFunctionCall = {
            ...functionCall,
            id,
        };
        if (rawId) {
            Object.defineProperty(normalizedFunctionCall, PROVIDER_TOOL_CALL_ID, {
                value: rawId,
                enumerable: false,
            });
        }
        normalized.push({
            ...part,
            functionCall: normalizedFunctionCall,
        });
    }
    return normalized;
}
export function reserveModelToolCallId(rawId, usedIds, reservedIds) {
    const existing = reservedIds.get(rawId);
    if (existing)
        return existing;
    const id = nextAvailableDuplicateId(rawId, usedIds);
    reservedIds.set(rawId, id);
    usedIds.add(id);
    return id;
}
export function getProviderToolCallId(functionCall) {
    return functionCall[PROVIDER_TOOL_CALL_ID];
}
export function dedupeToolCallsById(functionCalls) {
    const seenIds = new Set();
    const deduped = [];
    for (const functionCall of functionCalls) {
        const id = functionCall.id;
        if (id) {
            if (seenIds.has(id)) {
                debugLogger.debug(`Dropping duplicate functionCall id=${id}`);
                continue;
            }
            seenIds.add(id);
        }
        deduped.push(functionCall);
    }
    return deduped;
}
//# sourceMappingURL=toolCallIdUtils.js.map