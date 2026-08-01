interface CompletionStepProps {
    status: 'saving' | 'complete';
    spaceName?: string;
    onFinish: () => void;
}
/**
 * CompletionStep - Success screen after onboarding
 *
 * Shows:
 * - saving: Spinner while saving configuration
 * - complete: Success message with option to start
 */
export declare function CompletionStep({ status, spaceName, onFinish }: CompletionStepProps): import("react").JSX.Element;
export {};
