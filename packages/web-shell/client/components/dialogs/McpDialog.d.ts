import type { SerializedMcpStatusMessage } from '../messages/McpStatusMessage';
interface McpDialogProps {
    message: SerializedMcpStatusMessage;
    onClose: () => void;
}
export declare function McpDialog({ message }: McpDialogProps): import("react").JSX.Element;
export {};
