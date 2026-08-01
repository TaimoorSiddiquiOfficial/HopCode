/**
 * EmptyStateHint - Rotating workflow suggestions for empty chat state
 *
 * Displays inspirational hints showing what users can do with the agent.
 * Each hint contains inline entity badges (sources, files, folders, skills)
 * with generic Lucide icons.
 *
 * Entity token format in hints:
 * - {source:Gmail} → Globe icon + "Gmail" label
 * - {file:screenshot} → Paperclip icon + "screenshot" label
 * - {folder} → Folder icon + "folder" label
 * - {skill} → Zap icon + "skill" label
 */
import * as React from 'react';
export interface EmptyStateHintProps {
    /** Specific hint index to display (for playground testing) */
    hintIndex?: number;
    /** Custom class name */
    className?: string;
}
/**
 * EmptyStateHint - Displays a random workflow suggestion
 *
 * Shows what users can accomplish with the agent by displaying
 * example workflows with inline entity badges.
 */
export declare function EmptyStateHint({ hintIndex, className }: EmptyStateHintProps): React.JSX.Element;
/**
 * Get the total number of available hints (for playground variant generation)
 */
export declare function getHintCount(): number;
/**
 * Get hint template key by index (for debugging/testing)
 */
export declare function getHintTemplate(index: number): string;
