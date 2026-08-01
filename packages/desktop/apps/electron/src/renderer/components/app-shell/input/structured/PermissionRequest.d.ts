import type { PermissionRequest as PermissionRequestType } from '../../../../../shared/types';
import type { PermissionResponse } from './types';
interface PermissionRequestProps {
    request: PermissionRequestType;
    onResponse: (response: PermissionResponse) => void;
    /** When true, removes container styling (shadow, rounded) - used when wrapped by InputContainer */
    unstyled?: boolean;
}
/**
 * PermissionRequest - Self-contained structured input for permission approval
 *
 * Shows:
 * - Shield icon + "Permission Required" header
 * - Tool name badge
 * - Description of what the tool wants to do
 * - Command preview (scrollable)
 * - Action buttons: Allow, Always Allow, Deny
 */
export declare function PermissionRequest({ request, onResponse, unstyled }: PermissionRequestProps): import("react").JSX.Element;
export {};
