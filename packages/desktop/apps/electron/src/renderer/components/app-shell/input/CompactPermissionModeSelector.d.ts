import * as React from 'react';
import { type PermissionMode } from '@craft-agent/shared/agent/modes';
interface CompactPermissionModeSelectorProps {
    permissionMode: PermissionMode;
    onPermissionModeChange?: (mode: PermissionMode) => void;
}
export declare function CompactPermissionModeSelector({ permissionMode, onPermissionModeChange, }: CompactPermissionModeSelectorProps): React.JSX.Element;
export {};
