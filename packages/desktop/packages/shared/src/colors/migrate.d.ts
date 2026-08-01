/**
 * Entity Color Migration
 *
 * One-time migration from old Tailwind class format to new EntityColor format.
 * Called during config loading — if old format detected, migrates in-memory
 * and signals that the config should be written back to disk.
 *
 * Old format: "text-accent", "text-foreground/50", "#EF4444"
 * New format: "accent", "foreground/50", { light: "#EF4444" }
 */
import type { EntityColor } from './types.ts';
/**
 * Migrate a single color value from old format to new EntityColor.
 * Returns the migrated value, or undefined if no migration needed (already new format or null).
 *
 * @param oldColor - The color value from config (may be old or new format)
 * @returns Migrated EntityColor, or null if the value is already valid/undefined
 */
export declare function migrateColorValue(oldColor: unknown): {
    migrated: EntityColor;
    changed: boolean;
} | null;
/**
 * Migrate all color values in a statuses config object.
 * Mutates the config in place and returns whether any changes were made.
 */
export declare function migrateStatusColors(config: {
    statuses: Array<{
        color?: unknown;
    }>;
}): boolean;
/**
 * Migrate all color values in a labels config object.
 * Mutates the config in place and returns whether any changes were made.
 */
export declare function migrateLabelColors(config: {
    labels: Array<{
        color?: unknown;
        children?: any[];
    }>;
}): boolean;
