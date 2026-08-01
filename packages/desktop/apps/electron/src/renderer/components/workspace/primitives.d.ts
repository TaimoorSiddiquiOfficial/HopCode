import { type ButtonProps } from "@/components/ui/button";
interface AddWorkspaceContainerProps {
    children: React.ReactNode;
    className?: string;
}
/**
 * AddWorkspaceContainer - Main container for workspace creation steps
 *
 * Provides:
 * - Fixed width (28rem)
 * - Background with rounded corners
 * - Strong shadow for elevation
 * - Consistent padding
 */
export declare function AddWorkspaceContainer({ children, className }: AddWorkspaceContainerProps): import("react").JSX.Element;
interface AddWorkspaceStepHeaderProps {
    /** The main title */
    title: string;
    /** Optional description below the title */
    description?: React.ReactNode;
    className?: string;
}
/**
 * AddWorkspaceStepHeader - Title and description for workspace steps
 *
 * Always center-aligned with tight spacing for visual consistency.
 */
export declare function AddWorkspaceStepHeader({ title, description, className }: AddWorkspaceStepHeaderProps): import("react").JSX.Element;
interface AddWorkspacePrimaryButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {
    children?: React.ReactNode;
    loading?: boolean;
    loadingText?: string;
}
/**
 * AddWorkspacePrimaryButton - Primary action button for workspace flow
 *
 * Used for main actions like "Create", "Open", etc.
 * Includes loading state with spinner.
 */
export declare function AddWorkspacePrimaryButton({ children, loading, loadingText, className, disabled, ...props }: AddWorkspacePrimaryButtonProps): import("react").JSX.Element;
interface AddWorkspaceSecondaryButtonProps extends Omit<ButtonProps, 'variant'> {
    children?: React.ReactNode;
}
/**
 * AddWorkspaceSecondaryButton - Secondary action button for workspace flow
 *
 * Used for actions like "Browse", or inline actions within forms.
 */
export declare function AddWorkspaceSecondaryButton({ children, className, ...props }: AddWorkspaceSecondaryButtonProps): import("react").JSX.Element;
export {};
