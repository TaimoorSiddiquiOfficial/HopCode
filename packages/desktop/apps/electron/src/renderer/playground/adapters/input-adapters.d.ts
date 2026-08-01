/**
 * Playground Adapters for Input Components
 *
 * Provides mock data generators and wrapper components that allow
 * the main app's input components to work in the playground context.
 */
import type { PermissionRequest } from '../../../shared/types';
import type { AdminApprovalRequestData } from '@/components/app-shell/input/structured/AdminApprovalRequest';
/**
 * Generate mock PermissionRequest data for playground
 */
export declare function mockPermissionRequest(overrides?: Partial<PermissionRequest>): PermissionRequest;
/**
 * Generate mock AdminApprovalRequest data for playground
 */
export declare function mockAdminApprovalRequest(overrides?: Partial<AdminApprovalRequestData>): AdminApprovalRequestData;
/**
 * Props for PermissionRequest in playground context
 */
export interface PermissionRequestPlaygroundProps {
    toolName?: string;
    description?: string;
    command?: string;
    onAction?: () => void;
    unstyled?: boolean;
}
/**
 * Props for AdminApprovalRequest in playground context
 */
export interface AdminApprovalRequestPlaygroundProps {
    appName?: string;
    reason?: string;
    command?: string;
    impact?: string;
    requiresSystemPrompt?: boolean;
    rememberForMinutes?: number;
    onAction?: () => void;
    unstyled?: boolean;
}
/**
 * Convert playground props to PermissionRequest type
 */
export declare function toPermissionRequest(props: PermissionRequestPlaygroundProps): PermissionRequest;
/**
 * Create a no-op response handler that calls onAction
 */
export declare function createNoOpHandler<T>(onAction?: () => void): (response: T) => void;
