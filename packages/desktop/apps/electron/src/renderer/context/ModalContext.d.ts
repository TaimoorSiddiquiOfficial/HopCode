import React from 'react';
interface ModalContextValue {
    /** Register a modal when it opens. Returns unregister function. */
    registerModal: (id: string, close: () => void, priority?: number) => () => void;
    /** Check if any modals are open */
    hasOpenModals: () => boolean;
    /** Close the topmost modal (highest priority). Returns true if a modal was closed. */
    closeTopModal: () => boolean;
}
/**
 * Provider for modal registry. Wrap your app with this to enable close interception.
 */
export declare function ModalProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
/**
 * Hook to access modal registry functions.
 */
export declare function useModalRegistry(): ModalContextValue;
/**
 * Hook to register a modal. Call this in your modal component.
 * The modal will be automatically unregistered when the component unmounts.
 *
 * @param isOpen - Whether the modal is currently open
 * @param onClose - Function to close the modal
 * @param priority - Higher priority modals are closed first (default: 0)
 *
 * @example
 * ```tsx
 * function MyDialog({ open, onClose }) {
 *   useRegisterModal(open, onClose)
 *   return <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>...</Dialog>
 * }
 * ```
 */
export declare function useRegisterModal(isOpen: boolean, onClose: () => void, priority?: number): void;
export {};
