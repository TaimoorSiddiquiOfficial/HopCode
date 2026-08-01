export function mapOpenAIResponseFinishReason({ finishReason, hasFunctionCall, }) {
    switch (finishReason) {
        case undefined:
        case null:
            return hasFunctionCall ? 'tool-calls' : 'stop';
        case 'max_output_tokens':
            return 'length';
        case 'content_filter':
            return 'content-filter';
        default:
            return hasFunctionCall ? 'tool-calls' : 'unknown';
    }
}
//# sourceMappingURL=map-openai-responses-finish-reason.js.map