import type { ApiSetupMethod } from './APISetupStep';
import type { ApiKeyStatus, ApiKeySubmitData } from '../apisetup';
export type CredentialStatus = ApiKeyStatus;
interface CredentialsStepProps {
    apiSetupMethod: ApiSetupMethod;
    status: CredentialStatus;
    errorMessage?: string;
    onSubmit: (data: ApiKeySubmitData) => void;
    onBack: () => void;
    editInitialValues?: {
        apiKey?: string;
        baseUrl?: string;
        connectionDefaultModel?: string;
        activePreset?: string;
        models?: string[];
    };
}
export declare function CredentialsStep({ status, errorMessage, onSubmit, onBack, }: CredentialsStepProps): import("react").JSX.Element;
export {};
