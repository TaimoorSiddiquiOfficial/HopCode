/**
 * macOS-specific build logic
 */
import type { BuildConfig } from './common';
/**
 * Package the macOS app with electron-builder
 */
export declare function packageDarwin(config: BuildConfig): Promise<string>;
