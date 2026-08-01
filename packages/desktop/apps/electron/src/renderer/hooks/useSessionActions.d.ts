interface UseSessionActionsOptions {
    onFlag?: (sessionId: string) => void;
    onUnflag?: (sessionId: string) => void;
    onArchive?: (sessionId: string) => void;
    onUnarchive?: (sessionId: string) => void;
    onDelete: (sessionId: string, skipConfirmation?: boolean, displayTitle?: string) => Promise<boolean>;
}
export declare function useSessionActions({ onFlag, onUnflag, onArchive, onUnarchive, onDelete, }: UseSessionActionsOptions): {
    handleFlagWithToast: (sessionId: string) => void;
    handleUnflagWithToast: (sessionId: string) => void;
    handleArchiveWithToast: (sessionId: string) => void;
    handleUnarchiveWithToast: (sessionId: string) => void;
    handleDeleteWithToast: (sessionId: string, skipConfirmation?: boolean, displayTitle?: string) => Promise<boolean>;
};
export {};
