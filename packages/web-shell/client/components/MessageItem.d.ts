import type { Message, PermissionRequest } from '../adapters/types';
import type { WebShellAssistantTurnFooterRenderInfo } from '../customization';
import { type SessionContentGenerator } from './messages/AssistantMessage';
interface MessageItemProps {
    message: Message;
    pendingApproval?: PermissionRequest | null;
    /** Run /context detail, exactly like typing it (context-usage panels). */
    onShowContextDetail?: () => void;
    workspaceCwd?: string;
    isLatest?: boolean;
    showRetryHint?: boolean;
    onRetryClick?: () => void;
    onBranchSession?: () => void;
    showAssistantActions?: boolean;
    showAssistantBranch?: boolean;
    isLocateFlashing?: boolean;
    assistantTurnFooterInfo?: WebShellAssistantTurnFooterRenderInfo;
    generateContent?: SessionContentGenerator;
}
export declare const MessageItem: import("react").MemoExoticComponent<({ message, pendingApproval, onShowContextDetail, workspaceCwd, isLatest, showRetryHint, onRetryClick, onBranchSession, showAssistantActions, showAssistantBranch, isLocateFlashing, assistantTurnFooterInfo, generateContent, }: MessageItemProps) => import("react").JSX.Element | null>;
export {};
