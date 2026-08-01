import type { CredentialRequest as CredentialRequestType, CredentialResponse } from '../../../../../shared/types';
interface CredentialRequestProps {
    request: CredentialRequestType;
    onResponse: (response: CredentialResponse) => void;
    /** When true, removes container styling (shadow, rounded) - used when wrapped by InputContainer */
    unstyled?: boolean;
}
/**
 * CredentialRequest - Secure input UI for authentication credentials
 *
 * Supports multiple auth modes:
 * - bearer: Single token field (Bearer Token, API Key)
 * - basic: Username + Password fields
 * - header: API Key with custom header name shown
 * - query: API Key for query parameter auth
 */
export declare function CredentialRequest({ request, onResponse, unstyled }: CredentialRequestProps): import("react").JSX.Element;
export {};
