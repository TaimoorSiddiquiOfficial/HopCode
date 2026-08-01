/**
 * WorkspacePicker — shown when a thin client connects without a workspace ID.
 * Lists remote server workspaces and allows selection or creation.
 */
interface WorkspacePickerProps {
    onSelectWorkspace: (workspaceId: string) => void;
}
export declare function WorkspacePicker({ onSelectWorkspace }: WorkspacePickerProps): import("react").JSX.Element;
export {};
