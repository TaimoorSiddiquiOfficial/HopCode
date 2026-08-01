/**
 * Centralized model registry.
 *
 * HopCode reports the live model list through ACP at session startup. The
 * static registry below provides a stable fallback for first-run UI, tests, and
 * utility calls before ACP metadata is available.
 */
export type ModelProvider = 'hopcode';
export interface ModelDefinition {
    id: string;
    name: string;
    shortName: string;
    description: string;
    descriptionKey?: string;
    provider: ModelProvider;
    contextWindow?: number;
    supportsThinking?: boolean;
}
export declare const DEFAULT_MODEL = "qwen3-coder";
export declare const MODEL_REGISTRY: ModelDefinition[];
export declare function getModelsByProvider(provider: ModelProvider): ModelDefinition[];
export declare const HOPCODE_MODELS: ModelDefinition[];
/** Compatibility export for older imports. */
export declare const MODELS: ModelDefinition[];
export declare function getDefaultSummarizationModel(): string;
export declare function getModelById(modelId: string): ModelDefinition | undefined;
export declare function getModelDisplayName(modelId: string): string;
export declare function getModelShortName(modelId: string): string;
export declare function getModelContextWindow(modelId: string): number | undefined;
export declare function isOpusModel(_modelId: string): boolean;
export declare function isQwenModel(modelId: string): boolean;
export declare function getModelProvider(modelId: string): ModelProvider | undefined;
