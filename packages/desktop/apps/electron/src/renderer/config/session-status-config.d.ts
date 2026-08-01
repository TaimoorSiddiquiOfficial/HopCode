import * as React from 'react';
import type { CSSProperties } from 'react';
import type { StatusConfig } from '@craft-agent/shared/statuses';
import type { EntityColor } from '@craft-agent/shared/colors';
export type SessionStatusId = string;
export interface SessionStatusConfig {
    id: string;
    label: string;
    color?: EntityColor;
}
export interface SessionStatus extends SessionStatusConfig {
    /**
     * Resolved CSS color string for inline style application.
     * System colors resolve to var(--name) or color-mix(...).
     * Custom colors resolve to the appropriate light/dark hex value.
     */
    resolvedColor: string;
    icon: React.ReactNode;
    /**
     * Whether the icon responds to color styling (uses currentColor).
     * - true: SVGs with currentColor - apply status color
     * - false: Emojis, images, SVGs with hardcoded colors - render at full opacity
     */
    iconColorable: boolean;
    category?: 'open' | 'closed';
    isFixed?: boolean;
    isDefault?: boolean;
}
type TranslationFn = (key: string, defaultValue: string) => string;
export declare function getSessionStatusDisplayLabel(state: SessionStatus, t?: TranslationFn): string;
/**
 * Convert StatusConfig to SessionStatus.
 * Resolves EntityColor to a CSS color string for inline style use.
 * System colors (e.g., "accent") resolve to CSS variable references that
 * auto-adapt to light/dark theme. Custom colors use isDark to pick the right value.
 *
 * Colorability is determined synchronously:
 * - Emoji icons → not colorable (they have their own colors)
 * - Everything else (SVGs, fallback) → colorable (uses currentColor)
 */
export declare function statusConfigToSessionStatus(config: StatusConfig, workspaceId: string, isDark: boolean): SessionStatus;
/**
 * Convert array of StatusConfig to SessionStatus[]
 */
export declare function statusConfigsToSessionStatuses(configs: StatusConfig[], workspaceId: string, isDark: boolean): SessionStatus[];
/**
 * Get the icon for a todo state
 */
export declare function getStateIcon(stateId: string, states: SessionStatus[]): React.ReactNode;
/**
 * Return inline style for a status icon only when the icon is colorable.
 *
 * Colorable icons (SVG/currentColor) receive the resolved status color.
 * Non-colorable icons (emoji/images) return undefined so they render at full native color/opacity.
 */
export declare function getStatusIconStyle(state?: SessionStatus): CSSProperties | undefined;
/**
 * Resolve a status by ID and return icon style only when color should be applied.
 */
export declare function getStateIconStyle(stateId: string, states: SessionStatus[]): CSSProperties | undefined;
/**
 * Get the resolved CSS color for a todo state (ready for inline style)
 */
export declare function getStateColor(stateId: string, states: SessionStatus[]): string | undefined;
/**
 * Get the label for a todo state
 */
export declare function getStateLabel(stateId: string, states: SessionStatus[]): string;
/**
 * Get a complete state object by ID
 */
export declare function getState(stateId: string, states: SessionStatus[]): SessionStatus | undefined;
/**
 * Clear status icon cache (useful when statuses are updated).
 * Clears status-prefixed entries from the unified icon cache.
 */
export declare function clearIconCache(): void;
export {};
