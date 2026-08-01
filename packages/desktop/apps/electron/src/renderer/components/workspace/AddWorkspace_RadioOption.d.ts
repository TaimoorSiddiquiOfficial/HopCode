import type { ReactNode } from "react";
interface AddWorkspace_RadioOptionProps {
    name: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    title: string;
    subtitle: string | ReactNode;
    action?: ReactNode;
}
/**
 * AddWorkspace_RadioOption - Shared radio button component for workspace creation flows
 *
 * Used in:
 * - AddWorkspaceStep_OpenFolder: Browse/Create folder options + Location selection
 * - AddWorkspaceStep_CreateNew: Location selection
 */
export declare function AddWorkspace_RadioOption({ name, checked, onChange, disabled, title, subtitle, action }: AddWorkspace_RadioOptionProps): import("react").JSX.Element;
export {};
