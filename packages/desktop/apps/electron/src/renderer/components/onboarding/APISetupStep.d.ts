import type { LlmAuthType, LlmProviderType } from "@craft-agent/shared/config/llm-connections";
export type ProviderSegment = 'hopcode';
export type ApiSetupMethod = 'HOPCODE_code';
export declare function apiSetupMethodToConnectionTypes(_method: ApiSetupMethod): {
    providerType: LlmProviderType;
    authType: LlmAuthType;
};
interface APISetupStepProps {
    selectedMethod: ApiSetupMethod | null;
    onSelect: (method: ApiSetupMethod) => void;
    onContinue: () => void;
    onBack: () => void;
    initialSegment?: ProviderSegment;
}
export declare function APISetupStep({ selectedMethod, onSelect, onContinue, onBack, }: APISetupStepProps): import("react").JSX.Element;
export {};
