/**
 * OAuth callback page HTML generation.
 * This module is browser-safe (no Node.js dependencies) so it can be used
 * in both the callback server and the playground preview.
 */
export type AppType = 'terminal' | 'electron';
/**
 * Generate a minimal, clean callback page matching the app's design system.
 * Logo at top, status message in a card below.
 */
export declare function generateCallbackPage(options: {
    title: string;
    isSuccess: boolean;
    errorDetail?: string;
    appType?: AppType;
    deeplinkUrl?: string;
}): string;
