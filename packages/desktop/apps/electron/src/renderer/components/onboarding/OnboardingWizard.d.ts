import type { ApiSetupMethod } from "./APISetupStep";
import { type ProviderChoice } from "./ProviderSelectStep";
import { type CredentialStatus } from "./CredentialsStep";
import { type GitBashStatus } from "./GitBashWarning";
import type { ApiKeySubmitData } from "../apisetup";
export type OnboardingStep = 'welcome' | 'git-bash' | 'provider-select' | 'credentials' | 'complete';
export type LoginStatus = 'idle' | 'waiting' | 'success' | 'error';
export interface OnboardingState {
    step: OnboardingStep;
    loginStatus: LoginStatus;
    credentialStatus: CredentialStatus;
    completionStatus: 'saving' | 'complete';
    apiSetupMethod: ApiSetupMethod | null;
    isExistingUser: boolean;
    errorMessage?: string;
    gitBashStatus?: GitBashStatus;
    isRecheckingGitBash?: boolean;
    isCheckingGitBash?: boolean;
}
interface OnboardingWizardProps {
    /** Current state of the wizard */
    state: OnboardingState;
    onContinue: () => void;
    onBack: () => void;
    onSelectApiSetupMethod: (method: ApiSetupMethod) => void;
    onSubmitCredential: (data: ApiKeySubmitData) => void;
    onFinish: () => void;
    onBrowseGitBash?: () => Promise<string | null>;
    onUseGitBashPath?: (path: string) => void;
    onRecheckGitBash?: () => void;
    onClearError?: () => void;
    onSelectProvider?: (choice: ProviderChoice) => void;
    /** Called when user chooses "Setup later" on provider select */
    onSkipSetup?: () => void;
    editInitialValues?: {
        apiKey?: string;
        baseUrl?: string;
        connectionDefaultModel?: string;
        activePreset?: string;
        models?: string[];
    };
    className?: string;
}
/**
 * OnboardingWizard - Full-screen onboarding flow container
 *
 * Manages the step-by-step flow for setting up the local ACP backend:
 * 1. Welcome
 * 2. Provider Select
 * 3. Connection check
 * 4. Completion
 */
export declare function OnboardingWizard({ state, onContinue, onBack, onSubmitCredential, onFinish, onBrowseGitBash, onUseGitBashPath, onRecheckGitBash, onClearError, onSelectProvider, onSkipSetup, editInitialValues, className }: OnboardingWizardProps): import("react").JSX.Element;
export {};
