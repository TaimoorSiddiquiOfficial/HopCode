import { type PermissionMode } from '@craft-agent/shared/agent/mode-types';
export declare function getPermissionModeCycle(enabledModes?: readonly PermissionMode[]): PermissionMode[];
export declare function getNextPermissionMode(currentMode: PermissionMode, enabledModes?: readonly PermissionMode[]): PermissionMode;
