#!/usr/bin/env bun
/**
 * Build script for standalone HopCode server.
 *
 * Assembles a self-contained distribution directory with all runtime
 * dependencies, resources, and platform-specific binaries.
 *
 * Usage:
 *   bun run scripts/build-server.ts
 *   bun run scripts/build-server.ts --platform=linux --arch=x64
 *   bun run scripts/build-server.ts --platform=linux --arch=arm64 --compress
 *
 * Options:
 *   --platform       Target platform: darwin, linux (default: current)
 *   --arch           Target architecture: x64, arm64 (default: current)
 *   --output         Output directory (default: dist/server)
 *   --compress       Create .tar.gz archive after assembly
 *   --skip-download  Skip Bun/uv downloads (use existing if present)
 *   --help           Show help
 */
export {};
