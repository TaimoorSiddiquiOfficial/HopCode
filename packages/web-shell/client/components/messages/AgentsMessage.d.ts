export type AgentsInitialMode = 'menu' | 'create' | 'create-user' | 'create-project' | 'manage';
interface AgentsMessageProps {
    mode: AgentsInitialMode;
    embedded?: boolean;
    onMessage: (text: string) => void;
    onClose: () => void;
}
export declare function AgentsMessage({ mode, embedded, onMessage, onClose, }: AgentsMessageProps): import("react").JSX.Element;
export {};
