interface RenameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    value: string;
    onValueChange: (value: string) => void;
    onSubmit: () => void;
    placeholder?: string;
}
export declare function RenameDialog({ open, onOpenChange, title, value, onValueChange, onSubmit, placeholder, }: RenameDialogProps): import("react").JSX.Element;
export {};
