export type ProviderChoice = 'alibaba' | 'third-party' | 'custom';
interface ProviderSelectStepProps {
    /** Called when the user selects a provider */
    onSelect: (choice: ProviderChoice) => void;
    /** Called when the user chooses to skip setup */
    onSkip?: () => void;
}
/**
 * ProviderSelectStep — First screen after install.
 */
export declare function ProviderSelectStep({ onSelect, onSkip, }: ProviderSelectStepProps): import("react").JSX.Element;
export {};
