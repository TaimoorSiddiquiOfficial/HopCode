/**
 * Headless PlatformServices — runs under Bun without Electron.
 *
 * Uses sharp for image processing, console for logging.
 * GUI-only methods (openPath, openExternal, quit, etc.) are left undefined —
 * handlers guard them with optional chaining and capabilities handle client-side ops.
 */
import type { PlatformServices } from './platform';
/**
 * Create PlatformServices for headless (Bun) mode.
 *
 * Environment variables:
 * - CRAFT_APP_ROOT — override appRootPath (default: cwd)
 * - CRAFT_RESOURCES_PATH — override resourcesPath (default: cwd/resources)
 * - CRAFT_IS_PACKAGED — 'true' for production (default: false)
 * - CRAFT_VERSION — app version string (default: '0.0.0-dev')
 * - CRAFT_DEBUG — 'true' to enable debug logging
 */
export declare function createHeadlessPlatform(options?: {
    appVersion?: string;
}): PlatformServices;
