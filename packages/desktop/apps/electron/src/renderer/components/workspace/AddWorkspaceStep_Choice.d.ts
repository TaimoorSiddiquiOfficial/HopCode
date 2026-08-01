interface AddWorkspaceStep_ChoiceProps {
    onCreateNew: () => void;
    onOpenFolder: () => void;
}
/**
 * AddWorkspaceStep_Choice - Initial step to choose creation method
 *
 * Two options:
 * 1. Create new workspace - Creates a fresh workspace folder
 * 2. Open folder as workspace - Use an existing folder
 */
export declare function AddWorkspaceStep_Choice({ onCreateNew, onOpenFolder, }: AddWorkspaceStep_ChoiceProps): import("react").JSX.Element;
export {};
