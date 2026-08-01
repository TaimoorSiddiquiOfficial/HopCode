interface WelcomeStepProps {
    onContinue: () => void;
    /** Whether this is an existing user updating settings */
    isExistingUser?: boolean;
    /** Whether the app is loading (e.g., checking Git Bash on Windows) */
    isLoading?: boolean;
}
/**
 * WelcomeStep - Initial welcome screen for onboarding
 *
 * Shows different messaging for new vs existing users:
 * - New users: Welcome to the app
 * - Existing users: Update your API connection settings
 */
export declare function WelcomeStep({ onContinue, isExistingUser, isLoading }: WelcomeStepProps): import("react").JSX.Element;
export {};
