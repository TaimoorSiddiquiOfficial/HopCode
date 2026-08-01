/**
 * Linux-specific build logic
 */
import type { BuildConfig } from './common';
/**
 * Package the Linux app with electron-builder
 */
export declare function packageLinux(config: BuildConfig): Promise<string>;
