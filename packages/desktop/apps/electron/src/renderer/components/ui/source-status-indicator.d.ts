/**
 * SourceStatusIndicator - Shows connection status for sources
 *
 * A small colored dot that indicates the source's connection status:
 * - Green: Connected/tested successfully
 * - Yellow: Requires authentication
 * - Red: Failed to connect
 * - Gray: Untested
 *
 * Hovering shows a tooltip with the status description.
 */
import * as React from 'react';
import type { SourceConnectionStatus } from '../../../shared/types';
export interface SourceStatusIndicatorProps {
    /** Connection status */
    status?: SourceConnectionStatus;
    /** Error message (shown in tooltip if status is 'failed') */
    errorMessage?: string;
    /** Size variant */
    size?: 'xs' | 'sm' | 'md';
    /** Additional className */
    className?: string;
}
export declare function SourceStatusIndicator({ status, errorMessage, size, className, }: SourceStatusIndicatorProps): React.JSX.Element;
/**
 * Derive connection status from source config
 * This is a convenience function to determine status from existing fields
 *
 * @param source - The source config
 * @param localMcpEnabled - Whether local MCP servers are enabled (default: true)
 */
export declare function deriveConnectionStatus(source: {
    config: {
        isAuthenticated?: boolean;
        connectionStatus?: SourceConnectionStatus;
        type?: string;
        mcp?: {
            authType?: string;
            transport?: string;
        };
        api?: {
            authType?: string;
        };
    };
}, localMcpEnabled?: boolean): SourceConnectionStatus;
