export function getResponseMetadata({ id, model, created, }) {
    return {
        id: id ?? undefined,
        modelId: model ?? undefined,
        timestamp: created != null ? new Date(created * 1000) : undefined,
    };
}
//# sourceMappingURL=get-response-metadata.js.map