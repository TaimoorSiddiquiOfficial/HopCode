/**
 * Electron platform factory — creates PlatformServices from Electron APIs.
 *
 * Extracted from main/index.ts so it can be injected into bootstrapServer()
 * without duplicating construction logic.
 */
import type { PlatformServices } from '../runtime/platform';
export interface ElectronPlatformOptions {
    app: Electron.App;
    nativeImage: typeof import('electron').nativeImage;
    shell: typeof import('electron').shell;
    nativeTheme: typeof import('electron').nativeTheme;
    logger: PlatformServices['logger'];
    isDebugMode: boolean;
    getLogFilePath?: () => string | undefined;
    captureError?: (error: Error) => void;
}
export declare function createElectronPlatform(opts: ElectronPlatformOptions): PlatformServices;
