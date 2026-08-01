import type { Message } from '../adapters/types';
import type { DaemonSessionActions } from '@hoptrendy/webui/daemon-react-sdk';
export interface NewSessionSuggestionState {
    isVisible: boolean;
    classifiedInput: string;
}
export interface UseNewSessionSuggestionOptions {
    enabled: boolean;
    inputText: string;
    messages: Message[];
    sessionId?: string;
    contextUsageRatio: number;
    isRunning: boolean;
    dialogOpen: boolean;
    generateContent?: DaemonSessionActions['generateSessionContent'];
}
export interface UseNewSessionSuggestionReturn {
    suggestion: NewSessionSuggestionState | null;
    dismiss: () => void;
    suppress: () => void;
}
export declare function useNewSessionSuggestion({ enabled, inputText, messages, sessionId, contextUsageRatio, isRunning, dialogOpen, generateContent, }: UseNewSessionSuggestionOptions): UseNewSessionSuggestionReturn;
