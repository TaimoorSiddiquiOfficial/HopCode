import type { OnboardingState, OnboardingStep, ApiSetupMethod } from '@/components/onboarding';
import type { ProviderChoice } from '@/components/onboarding/ProviderSelectStep';
import type { ApiKeySubmitData } from '@/components/apisetup';
import type { SetupNeeds, LlmConnectionSetup } from '../../shared/types';
interface UseOnboardingOptions {
    onComplete: () => void;
    initialSetupNeeds?: SetupNeeds;
    initialStep?: OnboardingStep;
    initialApiSetupMethod?: ApiSetupMethod;
    onDismiss?: () => void;
    onConfigSaved?: () => void;
    editingSlug?: string | null;
    existingSlugs?: Set<string>;
}
interface UseOnboardingReturn {
    state: OnboardingState;
    handleContinue: () => void;
    handleBack: () => void;
    handleSelectProvider: (choice: ProviderChoice) => void;
    handleSelectApiSetupMethod: (method: ApiSetupMethod) => void;
    handleSubmitCredential: (data: ApiKeySubmitData) => void;
    handleBrowseGitBash: () => Promise<string | null>;
    handleUseGitBashPath: (path: string) => void;
    handleRecheckGitBash: () => void;
    handleClearError: () => void;
    handleSkipSetup: () => void;
    handleFinish: () => void;
    handleCancel: () => void;
    jumpToCredentials: (method: ApiSetupMethod) => void;
    reset: () => void;
}
export declare const BASE_SLUG_FOR_METHOD: Record<ApiSetupMethod, string>;
export declare function resolveSlugForMethod(method: ApiSetupMethod, editingSlug: string | null, existingSlugs: Set<string>): string;
export declare function apiSetupMethodToConnectionSetup(method: ApiSetupMethod, _options: Record<string, unknown>, editingSlug: string | null, existingSlugs: Set<string>): LlmConnectionSetup;
export declare function useOnboarding({ onComplete, initialSetupNeeds, initialStep, initialApiSetupMethod, onDismiss, onConfigSaved, editingSlug, existingSlugs, }: UseOnboardingOptions): UseOnboardingReturn;
export {};
