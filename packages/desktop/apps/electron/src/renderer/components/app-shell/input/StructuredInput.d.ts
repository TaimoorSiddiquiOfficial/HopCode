import type { StructuredInputState, StructuredResponse } from './structured/types';
interface StructuredInputProps {
    state: StructuredInputState;
    onResponse: (response: StructuredResponse) => void;
    /** When true, removes container styling (shadow, bg, rounded) - used when wrapped by InputContainer */
    unstyled?: boolean;
}
/**
 * StructuredInput - Router component for structured input UIs
 *
 * Routes to the appropriate component based on the input type:
 * - permission: PermissionRequest (bash command approval)
 * - credential: CredentialRequest (secure auth input)
 */
export declare function StructuredInput({ state, onResponse, unstyled }: StructuredInputProps): import("react").JSX.Element | null;
export {};
