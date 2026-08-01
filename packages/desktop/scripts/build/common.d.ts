/**
 * Common build utilities shared across all platforms
 */
export type Platform = 'darwin' | 'win32' | 'linux';
export type Arch = 'x64' | 'arm64';
export interface BuildConfig {
    platform: Platform;
    arch: Arch;
    upload: boolean;
    uploadLatest: boolean;
    uploadScript: boolean;
    rootDir: string;
    electronDir: string;
}
/**
 * Bun version to bundle with the app.
 * Update this when upgrading Bun. Check latest at: https://github.com/oven-sh/bun/releases
 * This should match or be close to the version used in CI (setup-bun action).
 */
export declare const BUN_VERSION = "bun-v1.3.9";
/**
 * uv version to bundle with the app.
 * Update this when upgrading uv. Check latest at: https://github.com/astral-sh/uv/releases
 */
export declare const UV_VERSION = "0.10.6";
/**
 * Get platform key for resources/bin folder naming.
 */
export declare function getPlatformKey(platform: Platform, arch: Arch): string;
/**
 * Get the Bun download filename for a platform/arch combination
 */
export declare function getBunDownloadName(platform: Platform, arch: Arch): string;
/**
 * Get uv release artifact filename for a platform/arch combination.
 */
export declare function getUvDownloadName(platform: Platform, arch: Arch): string;
/**
 * Verify SHA256 checksum of a file
 */
export declare function verifySha256(filePath: string, expectedHash: string): Promise<boolean>;
/**
 * Download and verify Bun binary
 * Uses curl for downloads (more reliable in CI than fetch + Bun.write)
 */
export declare function downloadBun(config: BuildConfig): Promise<void>;
/**
 * Download and verify uv binary, then install it to resources/bin/<platform-arch>/uv(.exe).
 */
export declare function downloadUv(config: BuildConfig): Promise<void>;
/**
 * Clean previous build artifacts
 */
export declare function cleanBuildArtifacts(config: BuildConfig): void;
/**
 * Install dependencies
 * On Windows, uses hoisted linker to avoid .bun symlink directory
 */
export declare function installDependencies(config: BuildConfig): Promise<void>;
/**
 * Copy Session MCP Server to packaged app resources.
 * The session server provides session-scoped tools (SubmitPlan, config_validate, etc.) for agent sessions.
 */
export declare function copySessionServer(config: BuildConfig): void;
/**
 * Build MCP helper servers.
 * Shared across all platforms to avoid drift.
 */
export declare function buildMcpServers(config: BuildConfig): void;
/**
 * Build the WhatsApp worker subprocess (Baileys + Node runtime bundle).
 * Output ships as an extraResource at resources/messaging-whatsapp-worker/worker.cjs
 * and is spawned by WhatsAppAdapter. See electron-builder.yml `extraResources`.
 */
export declare function buildWhatsAppWorker(config: BuildConfig): void;
/**
 * Verify MCP helper server is present in packaged resources.
 */
export declare function verifyMcpServersExist(config: BuildConfig): void;
/**
 * Build the Electron app (main, preload, renderer)
 */
export declare function buildElectronApp(config: BuildConfig): Promise<void>;
/**
 * Create manifest.json for upload
 */
export declare function createManifest(config: BuildConfig): Promise<string>;
/**
 * Upload to S3
 */
export declare function uploadToS3(config: BuildConfig): Promise<void>;
/**
 * Load environment variables from .env file
 */
export declare function loadEnvFile(config: BuildConfig): Promise<void>;
/**
 * Get output artifact name for a platform/arch
 */
export declare function getArtifactName(platform: Platform, arch: Arch): string;
