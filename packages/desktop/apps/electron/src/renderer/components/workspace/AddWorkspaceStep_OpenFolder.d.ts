interface AddWorkspaceStep_OpenFolderProps {
    onBack: () => void;
    onCreate: (folderPath: string, name: string) => Promise<void>;
    isCreating: boolean;
}
/**
 * AddWorkspaceStep_OpenFolder - Open an existing folder as workspace
 */
export declare function AddWorkspaceStep_OpenFolder({ onBack, onCreate, isCreating }: AddWorkspaceStep_OpenFolderProps): import("react").JSX.Element;
export {};
