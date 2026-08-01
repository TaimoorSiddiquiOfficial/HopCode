/**
 * Unified Icon Cache
 *
 * Single cache for source, skill, and status icons.
 * Used by EntityIcon, SourceAvatar, SkillAvatar, StatusIcon, and RichTextInput.
 *
 * Icons are stored as data URLs for consistent usage across:
 * - React components (img src)
 * - HTML string generation (inline badges)
 *
 * Cache key format uses type prefixes to avoid collisions:
 * - source:{workspaceId}:{slug}
 * - skill:{workspaceId}:{slug}
 * - status:{workspaceId}:{relativePath}
 *
 * Note: Labels do NOT use icons — they are color-only (colored circles).
 *
 * The useEntityIcon() hook is the single entry point for loading any entity's icon.
 * It handles cache lookup, IPC file loading, SVG theming, and emoji detection.
 */
import type { ResolvedEntityIcon } from '@craft-agent/shared/icons';
interface SourceConfig {
    slug: string;
    name: string;
    type: string;
    icon?: string;
    provider?: string;
    mcp?: {
        url?: string;
    };
    api?: {
        baseUrl?: string;
    };
}
interface SkillConfig {
    slug: string;
    iconPath?: string;
    metadata?: {
        icon?: string;
    };
}
/**
 * Single unified cache for all icon types.
 * Key format: `{type}:{workspaceId}:{identifier}`
 * - source:wsId:slug
 * - skill:wsId:slug
 * - status:wsId:relativePath
 */
export declare const iconCache: Map<string, string>;
/**
 * Cache for resolved logo URLs (from service URL resolution).
 * Kept separate because it caches URL resolution, not icon data,
 * and uses a different key format: `{serviceUrl}:{provider}`
 */
export declare const logoUrlCache: Map<string, string | null>;
/** @deprecated Use iconCache directly with 'source:' prefix */
export declare const sourceIconCache: {
    get: (key: string) => string | undefined;
    set: (key: string, value: string) => Map<string, string>;
    has: (key: string) => boolean;
    delete: (key: string) => boolean;
    clear: () => void;
};
/** @deprecated Use iconCache directly with 'skill:' prefix */
export declare const skillIconCache: {
    get: (key: string) => string | undefined;
    set: (key: string, value: string) => Map<string, string>;
    has: (key: string) => boolean;
    delete: (key: string) => boolean;
    clear: () => void;
};
/**
 * Clear all icon caches (all entity types)
 */
export declare function clearIconCaches(): void;
/**
 * Clear source icon caches only.
 * @deprecated Will be removed once rich-text-input.tsx is migrated to useEntityIcon.
 */
export declare function clearSourceIconCaches(): void;
/**
 * Clear skill icon caches only.
 * @deprecated Will be removed once rich-text-input.tsx is migrated to useEntityIcon.
 */
export declare function clearSkillIconCaches(): void;
export declare const EMOJI_ICON_PREFIX = "emoji:";
/**
 * Load a source icon into the cache.
 *
 * Resolution priority (config.icon is the source of truth):
 * 1. Emoji in config.icon → Return emoji marker for caller to render as text
 * 2. Local path in config.icon (./icon.svg) → Load from sources/{slug}/icon.svg
 * 3. URL in config.icon → Return URL directly for browser to load
 * 4. config.icon undefined → Auto-discover sources/{slug}/icon.{svg,png}
 * 5. Fallback → Resolve favicon from service URL
 *
 * Config takes precedence over auto-discovered local files. If config.icon is set
 * (emoji, local path, or URL), auto-discovery is skipped.
 *
 * @returns Promise resolving to icon URL, emoji marker (emoji:{emoji}), or null
 */
export declare function loadSourceIcon(source: {
    config: SourceConfig;
    workspaceId: string;
}): Promise<string | null>;
/**
 * Get a source icon synchronously from cache.
 * Returns null if not cached (use loadSourceIcon to populate).
 */
export declare function getSourceIconSync(workspaceId: string, slug: string): string | null;
/**
 * Load a skill icon into the cache.
 *
 * Resolution priority (mirrors loadSourceIcon):
 * 1. Emoji in metadata.icon → Return emoji marker
 * 2. URL in metadata.icon → Return URL directly
 * 3. Known iconPath → Load from file
 * 4. Auto-discover skills/{slug}/icon.{svg,png} → Load from file
 *
 * @returns Promise resolving to icon URL, emoji marker, or null
 */
export declare function loadSkillIcon(skill: SkillConfig, workspaceId: string): Promise<string | null>;
/**
 * Get a skill icon synchronously from cache.
 * Returns null if not cached (use loadSkillIcon to populate).
 */
export declare function getSkillIconSync(workspaceId: string, slug: string): string | null;
/**
 * Get the current foreground color from CSS custom properties.
 * Returns the computed value of --foreground or a fallback.
 */
export declare function getForegroundColor(): string;
/**
 * Process SVG content to inject theme foreground color.
 *
 * This fixes SVGs that use currentColor or have no fill specified,
 * which would otherwise render as black when used as background-image
 * (since CSS color inheritance doesn't work for background images).
 *
 * @param svgContent - Raw SVG string content
 * @param foregroundColor - Color to inject (defaults to current theme foreground)
 * @returns Processed SVG string with colors injected
 */
export declare function themeSvgContent(svgContent: string, foregroundColor?: string): string;
/**
 * Convert SVG content to a themed data URL.
 * Injects foreground color and encodes as base64.
 */
export declare function svgToThemedDataUrl(svgContent: string, foregroundColor?: string): string;
/**
 * Options for the useEntityIcon hook.
 */
export interface UseEntityIconOptions {
    /** Workspace context for IPC calls */
    workspaceId: string;
    /** Cache namespace (e.g. 'source', 'skill', 'status', 'label') */
    entityType: string;
    /** Unique identifier within the entity type (slug, statusId, etc.) */
    identifier: string;
    /**
     * Known relative path to icon file (for entities with pre-resolved paths).
     * e.g. 'skills/my-skill/icon.svg'
     * If provided, only this exact path is attempted (no auto-discovery).
     */
    iconPath?: string;
    /**
     * Directory to auto-discover icon files in (relative to workspace).
     * e.g. 'sources/linear' → tries sources/linear/icon.svg, icon.png, etc.
     * Ignored if iconPath is provided.
     */
    iconDir?: string;
    /**
     * Icon value from entity config. Can be:
     * - Emoji string (e.g. "🔧") → resolved as emoji
     * - URL (ignored here, assumed already downloaded to local file)
     * - undefined → auto-discover from iconDir
     */
    iconValue?: string;
    /**
     * Override the filename used for auto-discovery (default: 'icon').
     * e.g. for statuses, set to the statusId so it discovers '{statusId}.svg'
     * instead of 'icon.svg'.
     */
    iconFileName?: string;
}
/**
 * Unified icon loading hook - single entry point for all entity types.
 *
 * Handles cache lookup, IPC file loading, SVG theming, colorability detection,
 * and emoji detection. Returns a ResolvedEntityIcon ready for EntityIcon rendering.
 *
 * Resolution priority (config iconValue is the source of truth):
 * 1. Emoji in iconValue → { kind: 'emoji', value: emoji, colorable: false }
 * 2. URL in iconValue → { kind: 'file', value: url, colorable: false }
 * 3. Local file (iconPath) → { kind: 'file', value: dataUrl, colorable }
 * 4. Auto-discover in iconDir (only when iconValue is undefined) → { kind: 'file', value: dataUrl, colorable }
 * 5. Fallback → { kind: 'fallback', colorable: false }
 *
 * Config takes precedence over auto-discovered local files.
 *
 * Usage:
 *   const icon = useEntityIcon({ workspaceId, entityType: 'skill', identifier: slug, iconPath })
 *   return <EntityIcon icon={icon} fallbackIcon={Zap} />
 */
export declare function useEntityIcon(opts: UseEntityIconOptions): ResolvedEntityIcon;
export {};
