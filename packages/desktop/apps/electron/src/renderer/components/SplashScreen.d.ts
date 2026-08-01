interface SplashScreenProps {
    isExiting: boolean;
    onExitComplete?: () => void;
}
/**
 * SplashScreen - Shows Craft symbol during app initialization
 *
 * Displays centered symbol on app background, fades out when app is fully ready.
 * On exit, the symbol scales up and fades out quickly while the background fades slower.
 */
export declare function SplashScreen({ isExiting, onExitComplete }: SplashScreenProps): import("react").JSX.Element;
export {};
