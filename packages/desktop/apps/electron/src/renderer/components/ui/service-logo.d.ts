/**
 * ServiceLogo - Displays a logo for an MCP server or API
 *
 * Uses CrossfadeAvatar to show a smooth transition from fallback to logo.
 * Logo URLs are Google Favicon URLs - browser handles caching.
 */
import * as React from 'react';
interface ServiceLogoProps {
    logo?: string | null;
    name: string;
    fallbackIcon: React.ReactNode;
    className?: string;
}
export declare function ServiceLogo({ logo, name, fallbackIcon, className }: ServiceLogoProps): React.JSX.Element;
export {};
