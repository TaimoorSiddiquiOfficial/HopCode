import type { SerializedMcpStatusMessage } from '../messages/McpStatusMessage';
import type { EmbeddedManagerPage } from '../plugins/manager-page';
interface McpManagerPageProps {
    message: SerializedMcpStatusMessage;
    onClose: () => void;
    embedded?: EmbeddedManagerPage;
}
export declare function McpManagerPage({ message, onClose, embedded, }: McpManagerPageProps): import("react").JSX.Element;
export {};
