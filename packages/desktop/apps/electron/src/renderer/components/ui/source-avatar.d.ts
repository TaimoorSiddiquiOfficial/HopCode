/**
 * SourceAvatar - Thin wrapper around EntityIcon for sources.
 *
 * Sets fallbackIcon based on source type (McpIcon, Globe, HardDrive, etc.)
 * and adds source-specific extras:
 * - Favicon resolution as secondary fallback when no local icon found
 * - Connection status indicator dot (only when showStatus=true)
 *
 * Use `fluid` prop for fill-parent sizing (e.g., hero panels).
 */
import * as React from 'react';
import { type IconComponent } from '@/components/ui/entity-icon';
import type { LoadedSource } from '@craft-agent/shared/sources/types';
import type { IconSize } from '@craft-agent/shared/icons';
export type SourceType = 'mcp' | 'api' | 'gmail' | 'local';
interface SourceAvatarProps {
    /** LoadedSource object */
    source: LoadedSource;
    /** Size variant (default: 'md') */
    size?: IconSize;
    /** Fill parent container (h-full w-full). Overrides size. */
    fluid?: boolean;
    /** Show connection status indicator (auto-derived from source) */
    showStatus?: boolean;
    /** Additional className overrides */
    className?: string;
}
/**
 * Get the fallback icon for a source type
 */
export declare function getSourceFallbackIcon(type: SourceType): IconComponent;
export declare function SourceAvatar({ source, size, fluid, showStatus, className }: SourceAvatarProps): React.JSX.Element;
export {};
