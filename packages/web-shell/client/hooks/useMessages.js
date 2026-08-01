import { useMemo } from 'react';
import { useTranscriptBlocks } from '@hoptrendy/webui/daemon-react-sdk';
import { transcriptBlocksToDaemonMessages } from '../adapters/transcriptToMessages';
export function transcriptBlocksToLocalizedMessages(blocks, t) {
    return transcriptBlocksToDaemonMessages(blocks, {
        labels: {
            promptCancelled: t('request.cancelled'),
            branchSuccess: (name) => t('branch.success', { name }),
            midTurnInserted: (message) => t('midTurn.inserted', { message }),
            modelStreamInterrupted: t('error.modelStreamInterrupted'),
        },
    });
}
export function useMessages(t) {
    const blocks = useTranscriptBlocks();
    return useMemo(() => transcriptBlocksToLocalizedMessages(blocks, t), [blocks, t]);
}
//# sourceMappingURL=useMessages.js.map