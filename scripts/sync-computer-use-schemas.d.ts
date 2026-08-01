#!/usr/bin/env tsx
/**
 * Regenerate packages/core/src/tools/computer-use/schemas.ts from a live
 * cua-driver MCP server (`cua-driver mcp`).
 *
 * Usage:
 *   npx tsx scripts/sync-computer-use-schemas.ts [binaryPath]
 *
 * Defaults to the pinned cua-driver binary under `~/.hopcode/computer-use/`
 * (resolved from CUA_DRIVER_VERSION in constants.ts) — i.e. the binary that
 * gets installed the first time Computer Use runs. Pass an explicit path to
 * point at a different build.
 *
 * Bumping the pin is a procedure documented in constants.ts — read that
 * JSDoc first.
 */
export {};
