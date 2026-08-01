/**
 * Windows-specific build logic (Node.js only - no Bun dependencies)
 *
 * Note: This contains extensive workarounds for Windows Defender and file locking issues.
 * These are necessary for reliable CI builds on Windows.
 */
import type { BuildConfig } from './common';
/**
 * Build Electron app for Windows (with OAuth injection)
 */
export declare function buildElectronAppWindows(config: BuildConfig): Promise<void>;
/**
 * Package the Windows app with electron-builder (with retry logic)
 */
export declare function packageWindows(config: BuildConfig): Promise<string>;
