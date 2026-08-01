/**
 * Session file watcher isolation tests.
 *
 * Verifies per-client watcher lifecycle: creation, cleanup, disconnect,
 * and that concurrent clients don't interfere with each other.
 *
 * Uses real temp directories + real fs.watch to avoid mocking fs
 * (which breaks transitive imports that need real fs exports).
 */
export {};
