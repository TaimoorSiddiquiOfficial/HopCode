interface AddWorkspaceStep_CreateNewProps {
    onBack: () => void;
    onCreate: (folderPath: string, name: string) => Promise<void>;
    isCreating: boolean;
}
/**
 * AddWorkspaceStep_CreateNew - Create a new workspace
 *
 * Fields:
 * - Workspace name (required)
 * - Location: Default (~/.craft-agent/workspaces/) or Custom
 */
export declare function AddWorkspaceStep_CreateNew({ onBack, onCreate, isCreating }: AddWorkspaceStep_CreateNewProps): import("react").JSX.Element;
export {};
