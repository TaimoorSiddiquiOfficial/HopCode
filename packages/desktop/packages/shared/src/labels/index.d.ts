/**
 * Labels Module
 *
 * Configurable session labels for workspaces.
 * Labels are additive tags (many-per-session), unlike statuses which are exclusive.
 * Hierarchy is encoded as a nested JSON tree (children arrays).
 *
 * This barrel is browser-safe (no Node.js dependencies).
 * For filesystem operations, import from '@craft-agent/shared/labels/storage'.
 */
export * from './types.ts';
export * from './tree.ts';
export * from './values.ts';
export * from './resolve.ts';
