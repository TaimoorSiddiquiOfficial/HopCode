/**
 * Info_StatusBadge
 *
 * Status badge for permission states using Info_Badge.
 */
import * as React from 'react';
type PermissionStatus = 'allowed' | 'blocked' | 'requires-permission';
export interface Info_StatusBadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
    /** Status type */
    status?: PermissionStatus | null;
    /** Override the default label */
    label?: string;
}
export declare function Info_StatusBadge({ status, label, ...props }: Info_StatusBadgeProps): React.JSX.Element;
export {};
