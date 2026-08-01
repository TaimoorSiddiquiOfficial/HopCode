import type { DaemonTranscriptBlock } from '@hoptrendy/sdk/daemon';
import type { Message } from '../adapters/types';
type Translator = (key: string, vars?: Record<string, string | number>) => string;
export declare function transcriptBlocksToLocalizedMessages(blocks: readonly DaemonTranscriptBlock[], t: Translator): Message[];
export declare function useMessages(t: Translator): Message[];
export {};
