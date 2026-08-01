/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export const MISSING_TRANSCRIPT_TOOL_RESULT_MESSAGE = 'Tool result missing from saved history; the previous run likely ended ' +
    'before this tool completed.';
const TRANSCRIPT_GOAL_STATUS_KINDS = new Set([
    'set',
    'achieved',
    'cleared',
    'failed',
    'aborted',
    'checking',
]);
function isObjectRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function toTranscriptEpochMs(timestamp) {
    if (typeof timestamp === 'number') {
        return Number.isFinite(timestamp) ? timestamp : undefined;
    }
    if (typeof timestamp !== 'string')
        return undefined;
    const epochMs = new Date(timestamp).getTime();
    return Number.isFinite(epochMs) ? epochMs : undefined;
}
function buildUpdateMeta(options) {
    const timestamp = toTranscriptEpochMs(options.timestamp);
    const sourceRecordIds = dedupeStrings(options.sourceRecordIds ?? []);
    const hopcodetranscript = {
        ...(sourceRecordIds.length > 0 ? { sourceRecordIds } : {}),
        ...(options.planToolCallId
            ? { planToolCallId: options.planToolCallId }
            : {}),
    };
    const meta = {
        ...(options.extra ?? {}),
        ...(timestamp !== undefined ? { timestamp } : {}),
        ...(Object.keys(hopcodetranscript).length > 0 ? { hopcodetranscript } : {}),
    };
    return Object.keys(meta).length > 0 ? meta : undefined;
}
export function createTranscriptMessageUpdate(options) {
    const meta = buildUpdateMeta(options);
    return {
        sessionUpdate: options.role === 'user'
            ? 'user_message_chunk'
            : options.thought
                ? 'agent_thought_chunk'
                : 'agent_message_chunk',
        content: { type: 'text', text: options.text },
        ...(meta ? { _meta: meta } : {}),
    };
}
export function createTranscriptImageUpdate(options) {
    const meta = buildUpdateMeta(options);
    return {
        sessionUpdate: 'user_message_chunk',
        content: { type: 'image', data: options.data, mimeType: options.mimeType },
        ...(meta ? { _meta: meta } : {}),
    };
}
export function createTranscriptUsageUpdate(usageMetadata, options = {}) {
    const usage = {
        inputTokens: finiteNumber(usageMetadata.promptTokenCount) ?? 0,
        outputTokens: finiteNumber(usageMetadata.candidatesTokenCount) ?? 0,
        totalTokens: finiteNumber(usageMetadata.totalTokenCount) ?? 0,
        ...(finiteNumber(usageMetadata.thoughtsTokenCount) !== undefined
            ? { thoughtTokens: finiteNumber(usageMetadata.thoughtsTokenCount) }
            : {}),
        ...(finiteNumber(usageMetadata.cachedContentTokenCount) !== undefined
            ? {
                cachedReadTokens: finiteNumber(usageMetadata.cachedContentTokenCount),
            }
            : {}),
    };
    const meta = buildUpdateMeta({
        ...options,
        extra: { usage, ...(options.extra ?? {}) },
    });
    return {
        sessionUpdate: 'agent_message_chunk',
        content: { type: 'text', text: options.text ?? '' },
        _meta: meta,
    };
}
export function createTranscriptToolCallStartUpdate(options) {
    const provenance = resolveToolProvenance(options.toolName);
    return {
        sessionUpdate: options.asUpdate ? 'tool_call_update' : 'tool_call',
        toolCallId: options.callId,
        status: options.status ?? 'pending',
        title: options.metadata.title,
        content: [],
        locations: [...options.metadata.locations],
        kind: options.metadata.kind,
        rawInput: options.args ?? {},
        _meta: buildUpdateMeta({
            ...options,
            extra: {
                toolName: options.toolName,
                provenance: provenance.provenance,
                ...(provenance.serverId ? { serverId: provenance.serverId } : {}),
                ...(options.extra ?? {}),
            },
        }),
    };
}
export function createTranscriptToolCallResultUpdate(options) {
    const provenance = resolveToolProvenance(options.toolName);
    const content = buildToolResultContent(options);
    const update = {
        sessionUpdate: 'tool_call_update',
        toolCallId: options.callId,
        status: options.success ? 'completed' : 'failed',
        content,
        _meta: buildUpdateMeta({
            ...options,
            extra: {
                toolName: options.toolName,
                provenance: provenance.provenance,
                ...(provenance.serverId ? { serverId: provenance.serverId } : {}),
                ...(options.artifacts && options.artifacts.length > 0
                    ? { artifacts: options.artifacts }
                    : {}),
                ...(options.extra ?? {}),
            },
        }),
    };
    if (options.resultDisplay !== undefined &&
        !isTruncatedSessionDiffDisplay(options.resultDisplay)) {
        update['rawOutput'] = options.resultDisplay;
    }
    return update;
}
export function createTranscriptPlanUpdate(todos, cumulativeUsage, options = {}) {
    const meta = buildUpdateMeta({
        ...options,
        extra: {
            ...(cumulativeUsage ? { stats: { ...cumulativeUsage } } : {}),
            ...(options.extra ?? {}),
        },
    });
    return {
        sessionUpdate: 'plan',
        entries: todos.map((todo) => ({
            content: todo.content,
            priority: 'medium',
            status: todo.status,
        })),
        ...(meta ? { _meta: meta } : {}),
    };
}
export function extractTranscriptTodos(resultDisplay, args) {
    const fromDisplay = extractTodosFromDisplay(resultDisplay);
    if (fromDisplay)
        return fromDisplay;
    return args && Array.isArray(args['todos'])
        ? normalizeTodos(args['todos'])
        : null;
}
export function createTranscriptReplayMachine(options = {}) {
    return new DefaultTranscriptReplayMachine(options);
}
class DefaultTranscriptReplayMachine {
    options;
    pendingToolCalls = new Map();
    usedToolCallIds = new Set();
    gapByChild = new Map();
    usage;
    finalized = false;
    constructor(options) {
        this.options = options;
        const initialState = parseInitialState(options.initialState, options.onDiagnostic);
        this.usage = { ...initialState.cumulativeUsage };
        for (const pending of initialState.pendingToolCalls) {
            this.pendingToolCalls.set(pending.callId, pending);
            this.usedToolCallIds.add(pending.callId);
        }
        for (const gap of options.gaps ?? []) {
            if (!this.gapByChild.has(gap.childUuid)) {
                this.gapByChild.set(gap.childUuid, gap);
            }
        }
    }
    *project(record) {
        if (this.finalized) {
            throw new Error('Cannot project records after transcript replay finalize.');
        }
        let ordinal = 0;
        const emit = (update) => ({
            sourceRecordId: record.uuid,
            ...(record.timestamp ? { sourceTimestamp: record.timestamp } : {}),
            emissionOrdinal: ordinal++,
            update,
        });
        const meta = {
            timestamp: record.timestamp,
            sourceRecordIds: [record.uuid],
        };
        const gap = this.gapByChild.get(record.uuid);
        if (gap) {
            yield emit(createTranscriptMessageUpdate({
                role: 'assistant',
                text: this.formatGap(gap),
                ...meta,
                extra: { qwenDiscreteMessage: true },
            }));
        }
        switch (record.type) {
            case 'user':
                yield* this.projectUserRecord(record, emit, meta);
                break;
            case 'assistant':
                yield* this.projectAssistantRecord(record, emit, meta);
                break;
            case 'tool_result':
                yield* this.projectToolResult(record, emit, meta);
                break;
            case 'system':
                yield* this.projectSystemRecord(record, emit, meta);
                break;
            default:
                this.report('unknown_record_or_part', 'Skipped an unknown transcript record type.', record.uuid);
        }
    }
    *finalize() {
        if (this.finalized)
            return;
        this.finalized = true;
        let ordinal = 0;
        for (const pending of [...this.pendingToolCalls.values()]) {
            this.pendingToolCalls.delete(pending.callId);
            yield {
                sourceRecordId: pending.sourceRecordId,
                ...(pending.sourceTimestamp
                    ? { sourceTimestamp: pending.sourceTimestamp }
                    : {}),
                emissionOrdinal: ordinal++,
                update: createTranscriptToolCallResultUpdate({
                    toolName: pending.toolName,
                    callId: pending.callId,
                    success: false,
                    errorMessage: MISSING_TRANSCRIPT_TOOL_RESULT_MESSAGE,
                    timestamp: pending.sourceTimestamp,
                    sourceRecordIds: [pending.sourceRecordId],
                }),
            };
        }
    }
    snapshot() {
        return {
            v: 1,
            pendingToolCalls: [...this.pendingToolCalls.values()].map((pending) => ({
                ...pending,
            })),
            cumulativeUsage: { ...this.usage },
        };
    }
    *projectUserRecord(record, emit, meta) {
        if (record.subtype === 'notification' ||
            record.subtype === 'cron' ||
            record.subtype === 'mid_turn_user_message') {
            const payload = isObjectRecord(record.systemPayload)
                ? record.systemPayload
                : undefined;
            const displayText = payload && typeof payload['displayText'] === 'string'
                ? payload['displayText']
                : undefined;
            if (displayText) {
                yield emit(createTranscriptMessageUpdate({
                    role: 'user',
                    text: displayText,
                    ...meta,
                    ...(record.subtype === 'cron' ? { extra: { source: 'cron' } } : {}),
                }));
                return;
            }
            if (record.subtype !== 'mid_turn_user_message')
                return;
        }
        yield* this.projectMessageParts(record, 'user', emit, meta);
    }
    *projectAssistantRecord(record, emit, meta) {
        const usageMetadata = isObjectRecord(record.usageMetadata)
            ? record.usageMetadata
            : undefined;
        let usageEmitted = false;
        const takeUsageUpdate = () => {
            if (!usageMetadata || usageEmitted)
                return undefined;
            usageEmitted = true;
            this.addUsage(usageMetadata);
            return createTranscriptUsageUpdate(usageMetadata, meta);
        };
        yield* this.projectMessageParts(record, 'assistant', emit, meta, takeUsageUpdate);
        const trailingUsage = takeUsageUpdate();
        if (trailingUsage)
            yield emit(trailingUsage);
    }
    *projectMessageParts(record, role, emit, meta, beforeToolCall) {
        const parts = record.message?.parts;
        if (!parts)
            return;
        for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
            const part = parts[partIndex];
            if (!isObjectRecord(part)) {
                this.report('malformed_part', 'Skipped a malformed transcript message part.', record.uuid, `message.parts[${partIndex}]`);
                continue;
            }
            let recognized = false;
            if (typeof part['text'] === 'string' && part['text'].length > 0) {
                recognized = true;
                yield emit(createTranscriptMessageUpdate({
                    role,
                    text: part['text'],
                    thought: role === 'assistant' && part['thought'] === true,
                    ...meta,
                }));
            }
            const inlineData = isObjectRecord(part['inlineData'])
                ? part['inlineData']
                : undefined;
            if (inlineData) {
                recognized = true;
                const data = inlineData['data'];
                const mimeType = inlineData['mimeType'];
                if (role === 'user' &&
                    typeof data === 'string' &&
                    typeof mimeType === 'string' &&
                    mimeType.startsWith('image/')) {
                    yield emit(createTranscriptImageUpdate({ data, mimeType, ...meta }));
                }
                else {
                    this.report('malformed_part', 'Skipped an unsupported or malformed inline transcript part.', record.uuid, `message.parts[${partIndex}].inlineData`);
                }
            }
            const functionCall = isObjectRecord(part['functionCall'])
                ? part['functionCall']
                : undefined;
            if (functionCall) {
                recognized = true;
                const toolName = typeof functionCall['name'] === 'string' ? functionCall['name'] : '';
                const args = isObjectRecord(functionCall['args'])
                    ? functionCall['args']
                    : {};
                if (!toolName) {
                    this.report('malformed_part', 'Skipped a tool call without a tool name.', record.uuid, `message.parts[${partIndex}].functionCall`);
                    continue;
                }
                const preToolUpdate = beforeToolCall?.();
                if (preToolUpdate)
                    yield emit(preToolUpdate);
                if (toolName === 'todo_write')
                    continue;
                const explicitId = typeof functionCall['id'] === 'string' &&
                    functionCall['id'].length > 0
                    ? functionCall['id']
                    : undefined;
                const callId = this.allocateToolCallId(explicitId ?? `hopcode-replay-tool:${record.uuid}:${partIndex}`);
                const update = createTranscriptToolCallStartUpdate({
                    toolName,
                    callId,
                    args,
                    status: 'in_progress',
                    metadata: this.resolveToolMetadata(toolName, args, record.uuid),
                    ...meta,
                });
                yield emit(update);
                if (role === 'assistant') {
                    this.pendingToolCalls.set(callId, {
                        callId,
                        toolName,
                        sourceRecordId: record.uuid,
                        ...(record.timestamp ? { sourceTimestamp: record.timestamp } : {}),
                    });
                }
            }
            if (!recognized && !('functionResponse' in part)) {
                this.report('unknown_record_or_part', 'Skipped an unknown transcript message part.', record.uuid, `message.parts[${partIndex}]`);
            }
        }
    }
    *projectToolResult(record, emit, meta) {
        const result = isObjectRecord(record.toolCallResult)
            ? record.toolCallResult
            : undefined;
        const toolName = extractToolName(record);
        if (!toolName) {
            this.report('malformed_part', 'A transcript tool result has no tool name.', record.uuid, 'message.parts');
        }
        const explicitCallId = extractToolResultCallId(record, result);
        const callId = explicitCallId
            ? this.allocateToolCallId(explicitCallId, true)
            : this.correlateResultCallId(toolName, record.uuid);
        this.pendingToolCalls.delete(callId);
        const resultDisplay = result?.['resultDisplay'];
        if (toolName === 'todo_write') {
            const todos = extractTranscriptTodos(resultDisplay);
            if (todos) {
                yield emit(createTranscriptPlanUpdate(todos, this.usage, {
                    ...meta,
                    planToolCallId: callId,
                }));
            }
            return;
        }
        yield emit(createTranscriptToolCallResultUpdate({
            toolName,
            callId,
            success: result?.['status'] === undefined
                ? !result?.['error']
                : result['status'] === 'success' && !result['error'],
            errorMessage: extractErrorMessage(result?.['error']),
            message: record.message?.parts,
            resultDisplay,
            artifacts: Array.isArray(result?.['artifacts'])
                ? result['artifacts']
                : undefined,
            contentPrefix: this.buildToolResultContentPrefix(resultDisplay, record.uuid),
            ...meta,
        }));
        if (isTaskExecutionDisplay(resultDisplay)) {
            const usage = usageFromTaskExecution(resultDisplay);
            if (Object.keys(usage).length > 0) {
                this.addUsage(usage);
                yield emit(createTranscriptUsageUpdate(usage, meta));
            }
        }
    }
    *projectSystemRecord(record, emit, meta) {
        if (record.subtype !== 'slash_command')
            return;
        const payload = isObjectRecord(record.systemPayload)
            ? record.systemPayload
            : undefined;
        if (payload?.['phase'] !== 'result')
            return;
        const items = Array.isArray(payload['outputHistoryItems'])
            ? payload['outputHistoryItems']
            : [];
        for (const item of items) {
            const goalStatus = parseTranscriptGoalStatus(item);
            if (goalStatus) {
                if (goalStatus.condition.length === 0) {
                    this.report('malformed_part', 'Skipped replay of a goal card whose condition is empty.', record.uuid, 'systemPayload.outputHistoryItems.goalStatus.condition');
                }
                else if (goalStatus.kind !== 'checking') {
                    yield emit(createTranscriptMessageUpdate({
                        role: 'assistant',
                        text: '',
                        ...meta,
                        extra: { goalStatus },
                    }));
                }
                continue;
            }
            if (!isObjectRecord(item) || typeof item['text'] !== 'string')
                continue;
            yield emit(createTranscriptMessageUpdate({
                role: 'assistant',
                text: item['text'].replace(/\n/g, '  \n'),
                ...meta,
                extra: { source: 'slash_command' },
            }));
        }
    }
    addUsage(metadata) {
        this.usage.promptTokens += finiteNumber(metadata['promptTokenCount']) ?? 0;
        this.usage.candidateTokens +=
            finiteNumber(metadata['candidatesTokenCount']) ?? 0;
        this.usage.cachedTokens +=
            finiteNumber(metadata['cachedContentTokenCount']) ?? 0;
    }
    correlateResultCallId(toolName, recordId) {
        const candidates = [...this.pendingToolCalls.values()].filter((pending) => pending.toolName === toolName);
        if (candidates.length === 1)
            return candidates[0].callId;
        this.report('ambiguous_tool_call_correlation', 'A tool result could not be matched to exactly one pending tool call.', recordId);
        return this.allocateToolCallId(`hopcode-replay-tool:${recordId}:result`);
    }
    allocateToolCallId(candidate, reuse = false) {
        if (reuse && this.pendingToolCalls.has(candidate)) {
            this.usedToolCallIds.add(candidate);
            return candidate;
        }
        if (!this.usedToolCallIds.has(candidate)) {
            this.usedToolCallIds.add(candidate);
            return candidate;
        }
        let occurrence = 2;
        while (this.usedToolCallIds.has(`${candidate}:${occurrence}`)) {
            occurrence += 1;
        }
        const id = `${candidate}:${occurrence}`;
        this.usedToolCallIds.add(id);
        return id;
    }
    resolveToolMetadata(toolName, args, recordId) {
        try {
            return (this.options.presentation?.resolveToolMetadata(toolName, args) ??
                fallbackToolMetadata(toolName, args));
        }
        catch {
            this.report('presentation_fallback', 'Tool presentation metadata fell back to deterministic defaults.', recordId, undefined, false);
            return fallbackToolMetadata(toolName, args);
        }
    }
    formatGap(gap) {
        try {
            return (this.options.presentation?.formatHistoryGap(gap) ??
                'Some earlier messages are unavailable because the saved history is incomplete.');
        }
        catch {
            this.report('presentation_fallback', 'History gap presentation fell back to deterministic defaults.', gap.childUuid, undefined, false);
            return 'Some earlier messages are unavailable because the saved history is incomplete.';
        }
    }
    buildToolResultContentPrefix(resultDisplay, recordId) {
        try {
            return (this.options.presentation?.buildToolResultContentPrefix?.(resultDisplay) ?? defaultToolResultContentPrefix(resultDisplay));
        }
        catch {
            this.report('presentation_fallback', 'Tool result content presentation fell back to deterministic defaults.', recordId, undefined, false);
            return defaultToolResultContentPrefix(resultDisplay);
        }
    }
    report(code, message, recordId, path, affectsCompleteness = true) {
        this.options.onDiagnostic?.({
            code,
            severity: affectsCompleteness ? 'warning' : 'info',
            message,
            affectsCompleteness,
            ...(recordId ? { recordId } : {}),
            ...(path ? { path } : {}),
        });
    }
}
function parseTranscriptGoalStatus(value) {
    if (!isObjectRecord(value) || value['type'] !== 'goal_status') {
        return undefined;
    }
    const kind = value['kind'];
    const condition = value['condition'];
    if (typeof kind !== 'string' ||
        !TRANSCRIPT_GOAL_STATUS_KINDS.has(kind) ||
        typeof condition !== 'string') {
        return undefined;
    }
    const iterations = finiteNumber(value['iterations']);
    const setAt = finiteNumber(value['setAt']);
    const durationMs = finiteNumber(value['durationMs']);
    const lastReason = typeof value['lastReason'] === 'string' ? value['lastReason'] : undefined;
    return {
        kind,
        condition,
        ...(iterations !== undefined ? { iterations } : {}),
        ...(setAt !== undefined ? { setAt } : {}),
        ...(durationMs !== undefined ? { durationMs } : {}),
        ...(lastReason !== undefined ? { lastReason } : {}),
    };
}
function defaultToolResultContentPrefix(resultDisplay) {
    if (!isObjectRecord(resultDisplay) ||
        resultDisplay['type'] !== 'vision_bridge_notice' ||
        typeof resultDisplay['summary'] !== 'string' ||
        typeof resultDisplay['notice'] !== 'string') {
        return [];
    }
    return [
        {
            type: 'content',
            content: {
                type: 'text',
                text: `${resultDisplay['summary']}\n${resultDisplay['notice']}`,
            },
        },
    ];
}
function parseInitialState(value, onDiagnostic) {
    const empty = {
        v: 1,
        pendingToolCalls: [],
        cumulativeUsage: emptyUsage(),
    };
    if (value === undefined)
        return empty;
    if (!isObjectRecord(value)) {
        throw new TypeError('Invalid transcript replay state.');
    }
    if ('v' in value && value['v'] !== 1) {
        throw new TypeError('Unsupported transcript replay state version.');
    }
    const rawPending = Array.isArray(value['pendingToolCalls'])
        ? value['pendingToolCalls']
        : [];
    const pendingToolCalls = rawPending.flatMap((pending) => {
        if (!isObjectRecord(pending) ||
            typeof pending['callId'] !== 'string' ||
            typeof pending['toolName'] !== 'string' ||
            typeof pending['sourceRecordId'] !== 'string') {
            onDiagnostic?.({
                code: 'invalid_replay_state',
                severity: 'warning',
                message: 'Dropped a malformed pending tool call from replay state.',
                affectsCompleteness: true,
            });
            return [];
        }
        return [
            {
                callId: pending['callId'],
                toolName: pending['toolName'],
                sourceRecordId: pending['sourceRecordId'],
                ...(typeof pending['sourceTimestamp'] === 'string'
                    ? { sourceTimestamp: pending['sourceTimestamp'] }
                    : {}),
            },
        ];
    });
    const rawUsage = value.cumulativeUsage;
    const usage = isObjectRecord(rawUsage)
        ? rawUsage
        : {};
    const validUsage = finiteNumber(usage['promptTokens']) !== undefined &&
        finiteNumber(usage['cachedTokens']) !== undefined &&
        finiteNumber(usage['candidateTokens']) !== undefined &&
        finiteNumber(usage['apiTimeMs']) !== undefined;
    if (!validUsage) {
        onDiagnostic?.({
            code: 'invalid_replay_state',
            severity: 'warning',
            message: 'Reset invalid cumulative usage in transcript replay state.',
            affectsCompleteness: true,
        });
    }
    return {
        v: 1,
        pendingToolCalls,
        cumulativeUsage: validUsage
            ? {
                promptTokens: usage['promptTokens'],
                cachedTokens: usage['cachedTokens'],
                candidateTokens: usage['candidateTokens'],
                apiTimeMs: usage['apiTimeMs'],
            }
            : emptyUsage(),
    };
}
function emptyUsage() {
    return {
        promptTokens: 0,
        cachedTokens: 0,
        candidateTokens: 0,
        apiTimeMs: 0,
    };
}
function fallbackToolMetadata(toolName, args) {
    const description = typeof args['description'] === 'string' ? args['description'].trim() : '';
    return {
        title: description ? `${toolName}: ${description}` : toolName,
        locations: [],
        kind: 'other',
    };
}
function resolveToolProvenance(toolName) {
    if (toolName.startsWith('mcp__')) {
        const parts = toolName.split('__');
        if (parts.length >= 3 && parts[1]) {
            return { provenance: 'mcp', serverId: parts[1] };
        }
    }
    return { provenance: 'builtin' };
}
function buildToolResultContent(options) {
    const prefix = [...(options.contentPrefix ?? [])];
    const diff = extractDiffContent(options.resultDisplay);
    if (diff)
        return [...prefix, diff];
    if (options.errorMessage) {
        return [
            ...prefix,
            {
                type: 'content',
                content: { type: 'text', text: options.errorMessage },
            },
        ];
    }
    const content = [...prefix];
    for (const part of options.message ?? []) {
        if (!isObjectRecord(part))
            continue;
        if (typeof part['text'] === 'string' && part['text']) {
            content.push({
                type: 'content',
                content: { type: 'text', text: part['text'] },
            });
        }
        const response = isObjectRecord(part['functionResponse'])
            ? part['functionResponse']
            : undefined;
        const payload = response && isObjectRecord(response['response'])
            ? response['response']
            : undefined;
        if (!payload)
            continue;
        try {
            const output = payload['output'];
            const error = payload['error'];
            const text = typeof output === 'string'
                ? output
                : typeof error === 'string'
                    ? error
                    : JSON.stringify(payload);
            content.push({
                type: 'content',
                content: { type: 'text', text },
            });
        }
        catch {
            // A non-serializable result has no safe text representation.
        }
    }
    return content;
}
function extractDiffContent(resultDisplay) {
    if (!isObjectRecord(resultDisplay))
        return null;
    if (!('fileName' in resultDisplay) || !('newContent' in resultDisplay)) {
        return null;
    }
    if (isTruncatedSessionDiffDisplay(resultDisplay)) {
        return {
            type: 'content',
            content: {
                type: 'text',
                text: buildTruncatedDiffPreviewText(resultDisplay),
            },
        };
    }
    return {
        type: 'diff',
        path: typeof resultDisplay['fileName'] === 'string'
            ? resultDisplay['fileName']
            : '',
        oldText: typeof resultDisplay['originalContent'] === 'string'
            ? resultDisplay['originalContent']
            : '',
        newText: typeof resultDisplay['newContent'] === 'string'
            ? resultDisplay['newContent']
            : '',
    };
}
function isTruncatedSessionDiffDisplay(value) {
    return (isObjectRecord(value) &&
        value['truncatedForSession'] === true &&
        'fileName' in value &&
        'newContent' in value);
}
function buildTruncatedDiffPreviewText(display) {
    const fileName = typeof display['fileName'] === 'string'
        ? display['fileName']
        : 'the edited file';
    const fileDiffLength = typeof display['fileDiffLength'] === 'number'
        ? ` Original fileDiff length: ${display['fileDiffLength']} chars.`
        : '';
    return display['fileDiffTruncated'] === true
        ? `Full diff omitted from saved session history for ${fileName}.${fileDiffLength}`
        : `Saved session preview only for ${fileName}; full original and new file contents are unavailable.`;
}
function extractToolName(record) {
    for (const part of record.message?.parts ?? []) {
        if (!isObjectRecord(part) || !isObjectRecord(part['functionResponse'])) {
            continue;
        }
        const name = part['functionResponse']['name'];
        if (typeof name === 'string')
            return name;
    }
    return '';
}
function extractToolResultCallId(record, result) {
    if (typeof result?.['callId'] === 'string' && result['callId'].length > 0) {
        return result['callId'];
    }
    for (const part of record.message?.parts ?? []) {
        if (!isObjectRecord(part) || !isObjectRecord(part['functionResponse'])) {
            continue;
        }
        const id = part['functionResponse']['id'];
        if (typeof id === 'string' && id.length > 0)
            return id;
    }
    return undefined;
}
function extractTodosFromDisplay(value) {
    if (isObjectRecord(value) && value['type'] === 'todo_list') {
        return Array.isArray(value['todos'])
            ? normalizeTodos(value['todos'])
            : null;
    }
    if (typeof value !== 'string')
        return null;
    try {
        const parsed = JSON.parse(value);
        return isObjectRecord(parsed) &&
            parsed['type'] === 'todo_list' &&
            Array.isArray(parsed['todos'])
            ? normalizeTodos(parsed['todos'])
            : null;
    }
    catch {
        return null;
    }
}
function normalizeTodos(values) {
    return values.flatMap((value) => {
        if (!isObjectRecord(value) || typeof value['content'] !== 'string')
            return [];
        const status = value['status'];
        if (status !== 'pending' &&
            status !== 'in_progress' &&
            status !== 'completed') {
            return [];
        }
        return [
            {
                ...(typeof value['id'] === 'string' ? { id: value['id'] } : {}),
                content: value['content'],
                status,
            },
        ];
    });
}
function isTaskExecutionDisplay(value) {
    return isObjectRecord(value) && value['type'] === 'task_execution';
}
function usageFromTaskExecution(display) {
    const summary = isObjectRecord(display['executionSummary'])
        ? display['executionSummary']
        : undefined;
    if (!summary)
        return {};
    return {
        ...(finiteNumber(summary['inputTokens']) !== undefined
            ? { promptTokenCount: summary['inputTokens'] }
            : {}),
        ...(finiteNumber(summary['outputTokens']) !== undefined
            ? { candidatesTokenCount: summary['outputTokens'] }
            : {}),
        ...(finiteNumber(summary['thoughtTokens']) !== undefined
            ? { thoughtsTokenCount: summary['thoughtTokens'] }
            : {}),
        ...(finiteNumber(summary['cachedTokens']) !== undefined
            ? { cachedContentTokenCount: summary['cachedTokens'] }
            : {}),
        ...(finiteNumber(summary['totalTokens']) !== undefined
            ? { totalTokenCount: summary['totalTokens'] }
            : {}),
    };
}
function finiteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value)
        ? value
        : undefined;
}
function extractErrorMessage(value) {
    if (value instanceof Error)
        return value.message;
    if (!isObjectRecord(value))
        return undefined;
    return typeof value['message'] === 'string' ? value['message'] : undefined;
}
function dedupeStrings(values) {
    return [...new Set(values.filter((value) => value.length > 0))];
}
//# sourceMappingURL=transcript-replay.js.map