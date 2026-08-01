/**
 * AvatarGroup - Display overlapping avatars with overflow indicator
 *
 * Shows up to `max` avatars with slight overlap, plus a "+N" badge for overflow.
 */
import * as React from 'react';
interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    className?: string;
}
export declare function AvatarGroup({ children, max, className }: AvatarGroupProps): React.JSX.Element;
export {};
