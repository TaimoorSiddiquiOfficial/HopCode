export type ApiKeyStatus = 'idle' | 'validating' | 'success' | 'error';
export type CustomEndpointApi = never;
export interface ApiKeySubmitData {
    apiKey: string;
}
export interface ApiKeyInputProps {
    status: ApiKeyStatus;
    errorMessage?: string;
    onSubmit: (data: ApiKeySubmitData) => void;
    formId?: string;
    disabled?: boolean;
    providerType?: 'hopcode';
    initialValues?: {
        apiKey?: string;
    };
}
export declare function ApiKeyInput({ status, errorMessage, onSubmit, formId, disabled, }: ApiKeyInputProps): import("react").JSX.Element;
