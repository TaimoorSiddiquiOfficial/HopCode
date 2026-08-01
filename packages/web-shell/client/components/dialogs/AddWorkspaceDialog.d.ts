export interface WorkspacePathSuggestion {
    name: string;
    path: string;
}
export interface WorkspacePathSuggestions {
    dir: string;
    sep: string;
    suggestions: WorkspacePathSuggestion[];
    truncated: boolean;
}
interface AddWorkspaceDialogProps {
    onClose: () => void;
    onAdd: (cwd: string, persist: boolean) => Promise<void>;
    /**
     * Directory autocomplete backend. When provided, typing an absolute path
     * surfaces matching subdirectories in a listbox under the input.
     */
    onSuggest?: (prefix: string) => Promise<WorkspacePathSuggestions>;
}
export declare function AddWorkspaceDialog({ onClose, onAdd, onSuggest, }: AddWorkspaceDialogProps): import("react").JSX.Element;
export {};
