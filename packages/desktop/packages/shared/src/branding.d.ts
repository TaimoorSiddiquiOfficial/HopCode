/**
 * Centralized branding configuration.
 *
 * Supports multiple brand presets (e.g. "hopcode", "openwork").
 * Select at runtime via the CRAFT_BRAND environment variable.
 * Default: "hopcode" (backward-compatible).
 */
type GitHubUpdateSource = {
    provider: 'github';
    owner: string;
    repo: string;
    releasePageUrl: string;
};
type GenericUpdateSource = {
    provider: 'generic';
    url: string;
    releasePageUrl: string;
};
type UpdateSource = GitHubUpdateSource | GenericUpdateSource;
export interface BrandConfig {
    /** Internal identifier */
    id: string;
    /** User-visible application name */
    appName: string;
    /** macOS/Windows/Linux bundle identifier */
    appId: string;
    /** electron-builder productName */
    productName: string;
    /** Artifact file-name prefix (no spaces) */
    artifactPrefix: string;
    /** Copyright line */
    copyright: string;
    /** Git co-author line inserted into commits */
    coAuthorLine: string;
    /** Name the assistant uses to refer to itself in prompts */
    selfReferName: string;
    /** Session viewer base URL */
    viewerUrl: string;
    /** Stable desktop auto-update source for packaged app builds. */
    updates?: UpdateSource;
    /** Brand-owned external links shown in the Help menu */
    helpMenuLinks: Array<{
        labelKey: string;
        url: string;
        icon: string;
    }>;
    /** Brand-specific Electron resource paths, relative to apps/electron/ */
    assets: {
        /** Folder containing app icons and other brand-owned assets */
        resourceDir: string;
        /** Renderer logo/symbol asset */
        rendererSymbol: string;
        /** macOS app and DMG icon */
        macIcon: string;
        /** Windows installer/app icon */
        winIcon: string;
        /** Linux AppImage icon */
        linuxIcon: string;
        /** Optional macOS development Dock icon PNG */
        devDockIcon?: string;
        /** Optional SVG source icon for regeneration workflows */
        iconSvg?: string;
        /** Optional macOS 26+ Liquid Glass compiled icon asset */
        liquidGlassAssetsCar?: string;
    };
    /** Multi-line credits text shown in the About panel */
    credits: string;
    /** One-line credits summary */
    creditsShort: string;
    /** Structured credits for custom About dialog */
    creditsEntries: Array<{
        name: string;
        role: string;
        url: string;
    }>;
}
/** Active brand, selected by CRAFT_BRAND env var (default: "hopcode"). */
export declare const BRAND: BrandConfig;
/** Application version from package.json (safe for renderer/browser use). */
export declare const APP_VERSION: string;
export declare const CRAFT_LOGO: readonly ["  ████████ █████████    ██████   ██████████ ██████████", "██████████ ██████████ ██████████ █████████  ██████████", "██████     ██████████ ██████████ ████████   ██████████", "██████████ ████████   ██████████ ███████      ██████  ", "  ████████ ████  ████ ████  ████ █████        ██████  "];
/** Logo as a single string for HTML templates */
export declare const CRAFT_LOGO_HTML: string;
/** Session viewer base URL */
export declare const VIEWER_URL: string;
export {};
