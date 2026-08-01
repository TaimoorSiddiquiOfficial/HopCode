interface ResetConfirmationDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
/**
 * ResetConfirmationDialog - Destructive action confirmation with math problem
 *
 * Shows a warning about data loss and requires the user to solve a random
 * math problem to confirm the reset action.
 */
export declare function ResetConfirmationDialog({ open, onConfirm, onCancel, }: ResetConfirmationDialogProps): import("react").JSX.Element;
export {};
