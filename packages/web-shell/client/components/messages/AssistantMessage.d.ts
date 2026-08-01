import { type WebShellAssistantTurnFooterRenderInfo } from '../../customization';
import type { DaemonSessionGenerationEvent } from '@hoptrendy/sdk/daemon';
interface AssistantMessageProps {
    content: string;
    isStreaming?: boolean;
    timestamp?: number;
    onBranchSession?: () => void;
    showFooterActions?: boolean;
    showBranchAction?: boolean;
    isLocateFlashing?: boolean;
    customFooterInfo?: WebShellAssistantTurnFooterRenderInfo;
}
export declare const AssistantMessage: import("react").MemoExoticComponent<({ content, isStreaming, timestamp, onBranchSession, showFooterActions, showBranchAction, isLocateFlashing, customFooterInfo, }: AssistantMessageProps) => import("react").JSX.Element>;
interface ThinkingMessageProps {
    messageId: string;
    content: string;
    isStreaming?: boolean;
    timestamp?: number;
    isLocateFlashing?: boolean;
    generateContent?: SessionContentGenerator;
}
export type SessionContentGenerator = (prompt: string, opts?: {
    signal?: AbortSignal;
}) => AsyncGenerator<DaemonSessionGenerationEvent>;
export declare const ThinkingMessage: import("react").MemoExoticComponent<({ messageId, content, isStreaming, timestamp, isLocateFlashing, generateContent, }: ThinkingMessageProps) => import("react").JSX.Element>;
export declare function getThinkingSummaryKey({ isStreaming, durationMs, }: {
    isStreaming?: boolean;
    durationMs?: number;
}): 'thinking.running' | 'thinking.done' | 'thinking.doneBriefly';
export declare function formatThinkingDuration(ms: number): string;
export {};
