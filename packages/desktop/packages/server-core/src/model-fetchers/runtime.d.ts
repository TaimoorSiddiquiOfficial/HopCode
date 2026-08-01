/**
 * Module-level PlatformServices for model fetchers.
 * Avoids circular imports (index.ts → registry.ts → fetchers → index.ts).
 * Must be initialized via setFetcherPlatform() before any model fetching.
 */
import { type PlatformServices, type Logger } from '../runtime/platform';
export declare let handlerLog: Logger;
export declare function setFetcherPlatform(platform: PlatformServices): void;
export declare function getHostRuntime(): {
    appRootPath: any;
    resourcesPath: any;
    isPackaged: any;
};
