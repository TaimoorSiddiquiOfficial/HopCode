interface ReauthScreenProps {
    onLogin: () => Promise<void>;
    onReset: () => void;
}
/**
 * ReauthScreen - Simple re-login screen for expired sessions
 *
 * Shown when the user has existing workspaces/config but the Craft token
 * is missing or expired. Much simpler than full onboarding - just re-authenticate.
 */
export declare function ReauthScreen({ onLogin, onReset }: ReauthScreenProps): import("react").JSX.Element;
export {};
