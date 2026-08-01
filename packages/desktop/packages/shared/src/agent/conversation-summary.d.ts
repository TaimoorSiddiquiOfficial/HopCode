import type { RecoveryMessage } from './core/index.ts';
export interface ConversationSummaryOptions {
    maxMessageChars?: number;
    maxTranscriptChars?: number;
}
export declare function buildConversationSummaryTranscript(messages: RecoveryMessage[], options?: ConversationSummaryOptions): string;
export declare function buildConversationSummaryPrompt(messages: RecoveryMessage[]): string | null;
export declare function generateConversationSummary(messages: RecoveryMessage[], runMiniCompletion: (prompt: string) => Promise<string | null>): Promise<string | null>;
export declare function buildTransferredSessionContext(summary: string): string;
