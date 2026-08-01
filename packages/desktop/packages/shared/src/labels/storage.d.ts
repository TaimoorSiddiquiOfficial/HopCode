/**
 * Label Storage
 *
 * Filesystem-based storage for workspace label configurations.
 * Labels are stored at {workspaceRootPath}/labels/config.json
 *
 * Hierarchy: Labels form a nested JSON tree. IDs are simple slugs.
 * New workspaces are seeded with default labels (Development + Content groups).
 * Labels are visual by color only (colored circles in the UI).
 */
import type { WorkspaceLabelConfig, LabelConfig } from './types.ts';
/**
 * Get default label configuration.
 * Provides a starter set of labels organized into two complementary color families:
 * - Development (blue family): Code, Bug, Automation
 * - Content (purple family): Writing, Research, Design
 * Plus flat valued labels: Priority (number), Project (string)
 *
 * Children use hue-shifted shades of their parent color to show visual hierarchy.
 */
export declare function getDefaultLabelConfig(): WorkspaceLabelConfig;
/**
 * Load workspace label configuration.
 * Returns empty config if no file exists or parsing fails.
 * Auto-migrates old Tailwind color format to EntityColor on first load.
 */
export declare function loadLabelConfig(workspaceRootPath: string): WorkspaceLabelConfig;
/**
 * Save workspace label configuration to disk.
 * Creates the labels directory if missing.
 */
export declare function saveLabelConfig(workspaceRootPath: string, config: WorkspaceLabelConfig): void;
/**
 * Get the label tree (root-level labels with nested children).
 * Primary accessor for the UI — returns the tree structure as-is from config.
 */
export declare function listLabels(workspaceRootPath: string): LabelConfig[];
/**
 * Get all labels as a flat list (tree flattened depth-first).
 * Useful for lookups, session label validation, and non-hierarchical display.
 */
export declare function listLabelsFlat(workspaceRootPath: string): LabelConfig[];
/**
 * Get a single label by ID (searches the entire tree).
 * Returns null if not found.
 */
export declare function getLabel(workspaceRootPath: string, labelId: string): LabelConfig | null;
/**
 * Check if a label ID exists in this workspace (searches entire tree)
 */
export declare function isValidLabelId(workspaceRootPath: string, labelId: string): boolean;
/**
 * Validate label ID format.
 * Simple slug: lowercase alphanumeric + hyphens, no leading/trailing hyphens.
 * Examples: "bug", "frontend", "my-label"
 */
export declare function isValidLabelIdFormat(labelId: string): boolean;
