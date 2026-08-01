import { describe, expect, it } from 'vitest';
import { transcriptBlocksToLocalizedMessages } from './useMessages';
function baseBlock(block) {
    return {
        ...block,
        clientReceivedAt: 1,
        createdAt: 1,
        updatedAt: 1,
    };
}
describe('transcriptBlocksToLocalizedMessages', () => {
    it('uses the same localized labels for externally supplied blocks', () => {
        const t = (key, vars) => vars?.name ? `${key}:${vars.name}` : `localized:${key}`;
        const blocks = [
            baseBlock({ id: 'cancelled', kind: 'prompt_cancelled' }),
            baseBlock({
                id: 'branch',
                kind: 'status',
                text: 'legacy branch text',
                source: 'session_branched',
                data: { displayName: 'review' },
            }),
            baseBlock({
                id: 'interrupted',
                kind: 'error',
                text: 'terminated',
                errorKind: 'model_stream_interrupted',
            }),
        ];
        expect(transcriptBlocksToLocalizedMessages(blocks, t)).toMatchObject([
            { content: 'localized:request.cancelled' },
            { content: 'branch.success:review' },
            { content: 'localized:error.modelStreamInterrupted' },
        ]);
    });
});
//# sourceMappingURL=useMessages.test.js.map