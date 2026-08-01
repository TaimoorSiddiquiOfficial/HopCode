export type BrowserLiveFxPlatform = 'darwin' | 'win32' | 'linux' | 'other';
export interface BrowserLiveFxCornerRadii {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
}
export declare const BROWSER_LIVE_FX_BORDER: {
    readonly width: "1.5px";
    readonly style: "solid";
    readonly color: "var(--accent)";
    readonly boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--accent) 45%, transparent), inset 0 0 20px color-mix(in oklab, var(--accent) 28%, transparent)";
};
/**
 * Return border color + boxShadow with a concrete accent color value.
 * Use this when injecting styles into a foreign DOM (e.g. CDP overlay)
 * where `var(--accent)` would resolve against the website's stylesheet.
 */
export declare function resolveBrowserLiveFxBorder(accentColor: string): {
    color: string;
    boxShadow: string;
};
export declare function getBrowserLiveFxCornerRadii(platform: BrowserLiveFxPlatform): BrowserLiveFxCornerRadii;
