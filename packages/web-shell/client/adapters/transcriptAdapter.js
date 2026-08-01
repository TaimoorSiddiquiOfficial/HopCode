export function extractPendingPermission(blocks) {
    for (const block of blocks) {
        if (!isPermissionBlock(block))
            continue;
        const perm = block;
        if (perm.resolved)
            continue;
        const toolCallRecord = getRecord(perm.toolCall);
        const toolCallId = typeof toolCallRecord?.['toolCallId'] === 'string'
            ? toolCallRecord['toolCallId']
            : typeof toolCallRecord?.['id'] === 'string'
                ? toolCallRecord['id']
                : undefined;
        const toolKind = typeof toolCallRecord?.['kind'] === 'string'
            ? toolCallRecord['kind']
            : undefined;
        const metaRecord = getRecord(toolCallRecord?.['_meta']);
        const toolName = typeof metaRecord?.['toolName'] === 'string'
            ? metaRecord['toolName']
            : undefined;
        return {
            id: perm.requestId,
            sessionId: perm.sessionId,
            toolCallId,
            title: perm.title,
            toolKind,
            toolName,
            content: [
                {
                    type: 'text',
                    text: perm.title || 'Tool permission',
                },
            ],
            options: perm.options.map((opt) => ({
                id: opt.optionId,
                label: opt.label,
                kind: getPermissionOptionKind(opt.raw),
            })),
            rawInput: getPermissionRawInput(perm.toolCall),
        };
    }
    return null;
}
function isPermissionBlock(block) {
    return block.kind === 'permission';
}
function getPermissionRawInput(toolCall) {
    const record = getRecord(toolCall);
    if (!record) {
        return undefined;
    }
    const nested = getRecord(record['rawInput']) ??
        getRecord(record['input']) ??
        getRecord(record['args']);
    return nested ?? record;
}
function getRecord(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return undefined;
    }
    return value;
}
function getPermissionOptionKind(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return undefined;
    }
    const kind = raw.kind;
    return kind === 'allow_once' ||
        kind === 'allow_always' ||
        kind === 'reject_once' ||
        kind === 'reject_always'
        ? kind
        : undefined;
}
//# sourceMappingURL=transcriptAdapter.js.map