import { useMemo } from 'react';
import type { DaemonTranscriptBlock } from '@hoptrendy/sdk/daemon';
import { useTranscriptBlocks } from '@hoptrendy/webui/daemon-react-sdk';
import { transcriptBlocksToDaemonMessages } from '../adapters/transcriptToMessages';
import type { Message } from '../adapters/types';

type Translator = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

export function transcriptBlocksToLocalizedMessages(
  blocks: readonly DaemonTranscriptBlock[],
  t: Translator,
): Message[] {
  return transcriptBlocksToDaemonMessages(blocks, {
    labels: {
      promptCancelled: t('request.cancelled'),
      branchSuccess: (name) => t('branch.success', { name }),
      midTurnInserted: (message) => t('midTurn.inserted', { message }),
      modelStreamInterrupted: t('error.modelStreamInterrupted'),
    },
  });
}

export function useMessages(t: Translator): Message[] {
  const blocks = useTranscriptBlocks();
  return useMemo(
    () => transcriptBlocksToLocalizedMessages(blocks, t),
    [blocks, t],
  );
}
