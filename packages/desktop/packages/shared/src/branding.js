/**
 * Centralized branding configuration.
 *
 * Supports multiple brand presets (e.g. "hopcode", "openwork").
 * Select at runtime via the CRAFT_BRAND environment variable.
 * Default: "hopcode" (backward-compatible).
 */
// ---------------------------------------------------------------------------
// Brand presets
// ---------------------------------------------------------------------------
const HOPCODE_CODE_BRAND = {
    id: 'hopcode',
    appName: 'HopCode Desktop',
    appId: 'com.alibaba.hopcode',
    productName: 'HopCode Desktop',
    artifactPrefix: 'hopcode-Desktop',
    copyright: 'Copyright © 2026 Alibaba Group.',
    coAuthorLine: 'Co-Authored-By: HopCode <agents-noreply@craft.do>',
    selfReferName: 'HopCode',
    viewerUrl: 'https://agents.craft.do',
    updates: {
        provider: 'generic',
        url: 'https://github.com/TaimoorSiddiquiOfficial/HopCode/releases/download/desktop-latest',
        releasePageUrl: 'https://github.com/TaimoorSiddiquiOfficial/HopCode/releases',
    },
    helpMenuLinks: [
        {
            labelKey: 'menu.homepage',
            url: 'https://taimoorsiddiquiofficial.github.io/HopCode-docs/',
            icon: 'House',
        },
    ],
    assets: {
        resourceDir: 'resources/brands/hopcode',
        rendererSymbol: 'resources/brands/hopcode/icon.svg',
        macIcon: 'resources/brands/hopcode/icon.icns',
        winIcon: 'resources/brands/hopcode/icon.ico',
        linuxIcon: 'resources/brands/hopcode/icon.png',
        devDockIcon: 'resources/brands/hopcode/dock.png',
        iconSvg: 'resources/brands/hopcode/icon.svg',
        liquidGlassAssetsCar: 'resources/brands/hopcode/Assets.car',
    },
    credits: '',
    creditsShort: '',
    creditsEntries: [],
};
const BRANDS = {
    'hopcode': HOPCODE_CODE_BRAND,
    openwork: {
        id: 'openwork',
        appName: 'OpenWork',
        appId: 'com.alibaba.openwork',
        productName: 'OpenWork',
        artifactPrefix: 'OpenWork',
        copyright: 'Copyright © 2026 Alibaba Group.',
        coAuthorLine: 'Co-Authored-By: OpenWork <noreply@alibaba.com>',
        selfReferName: 'OpenWork',
        viewerUrl: 'https://agents.craft.do',
        updates: {
            provider: 'github',
            owner: 'modelstudioai',
            repo: 'openwork',
            releasePageUrl: 'https://github.com/modelstudioai/openwork/releases',
        },
        helpMenuLinks: [
            {
                labelKey: 'menu.homepage',
                url: 'https://github.com/modelstudioai/openwork',
                icon: 'House',
            },
        ],
        assets: {
            resourceDir: 'resources/brands/openwork',
            rendererSymbol: 'resources/brands/openwork/symbol.png',
            macIcon: 'resources/brands/openwork/icon.icns',
            winIcon: 'resources/brands/openwork/icon.png',
            linuxIcon: 'resources/brands/openwork/icon.png',
            devDockIcon: 'resources/brands/openwork/dock.png',
            liquidGlassAssetsCar: 'resources/brands/openwork/Assets.car',
        },
        credits: 'Architecture: craft-agents-oss | Agent: HopCode',
        creditsShort: 'Based on craft-agents-oss & HopCode',
        creditsEntries: [
            {
                name: 'HopCode',
                role: 'AI Agent Engine',
                url: 'https://github.com/TaimoorSiddiquiOfficial/HopCode',
            },
            {
                name: 'Craft Agents OSS',
                role: 'Desktop Architecture',
                url: 'https://github.com/craft-ai-agents/craft-agents-oss',
            },
        ],
    },
};
/** Active brand, selected by CRAFT_BRAND env var (default: "hopcode"). */
export const BRAND = BRANDS[process.env.CRAFT_BRAND || 'hopcode'] ?? HOPCODE_CODE_BRAND;
// ---------------------------------------------------------------------------
// App version (renderer-safe — avoids the version barrel which pulls in Node deps)
// ---------------------------------------------------------------------------
import pkg from '../package.json';
/** Application version from package.json (safe for renderer/browser use). */
export const APP_VERSION = pkg.version;
// ---------------------------------------------------------------------------
// Legacy exports (unchanged, still used by OAuth callback pages etc.)
// ---------------------------------------------------------------------------
export const CRAFT_LOGO = [
    '  ████████ █████████    ██████   ██████████ ██████████',
    '██████████ ██████████ ██████████ █████████  ██████████',
    '██████     ██████████ ██████████ ████████   ██████████',
    '██████████ ████████   ██████████ ███████      ██████  ',
    '  ████████ ████  ████ ████  ████ █████        ██████  ',
];
/** Logo as a single string for HTML templates */
export const CRAFT_LOGO_HTML = CRAFT_LOGO.map((line) => line.trimEnd()).join('\n');
/** Session viewer base URL */
export const VIEWER_URL = BRAND.viewerUrl;
//# sourceMappingURL=branding.js.map